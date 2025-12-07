"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// All available shadow images
const SHADOW_IMAGES = [
  "/images/shadows/plant_shadow-01.jpg",
  "/images/shadows/plant_shadow-02.jpg",
  "/images/shadows/plant_shadow-03.jpg",
  "/images/shadows/plant_shadow-04.jpg",
  "/images/shadows/plant_shadow-05.jpg",
  "/images/shadows/plant_shadow-06.jpg",
  "/images/shadows/plant_shadow-07.jpg",
  "/images/shadows/plant_shadow-08.jpg",
  "/images/shadows/plant_shadow-09.jpg",
  "/images/shadows/plant_shadow-10.jpg",
] as const;

export type ShadowImage = (typeof SHADOW_IMAGES)[number];

export interface ShadowBackgroundProps {
  /** Specific shadow image to use. If not provided, a random one is selected */
  image?: ShadowImage;
  /** Background color (where light hits) */
  backgroundColor?: string;
  /** Shadow color (where shadows fall) */
  shadowColor?: string;
  /** Shadow intensity (0-1). Higher = darker shadows */
  intensity?: number;
  /** Texture contrast adjustment (0.5-3) */
  contrast?: number;
  /** Texture brightness adjustment (-0.5 to 0.5) */
  brightness?: number;
  /** Zoom/scale level (0.5-5). Higher = more zoomed in */
  scale?: number;
  /** Wind animation speed (0-2). Set to 0 to disable animation */
  windSpeed?: number;
  /** Wind direction as {x, y} normalized vector */
  windDirection?: { x: number; y: number };
  /** Additional className for the container */
  className?: string;
  /** Children to render on top of the background */
  children?: React.ReactNode;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uShadowColor;
uniform float uIntensity;
uniform float uScale;
uniform vec2 uWindDir;
uniform float uWindSpeed;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform bool uRotate;
uniform float uContrast;
uniform float uBrightness;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // 1. Handle Rotation (if orientations mismatch)
  vec2 baseUv = vUv;
  vec2 texSize = uTextureSize;
  
  if (uRotate) {
     baseUv = vec2(vUv.y, 1.0 - vUv.x);
     texSize = vec2(uTextureSize.y, uTextureSize.x);
  }

  // 2. Aspect Ratio Correction (Cover Mode)
  float screenAspect = uResolution.x / uResolution.y;
  float textureAspect = texSize.x / texSize.y; 
  
  vec2 ratio = vec2(
    min((screenAspect / textureAspect), 1.0),
    min((textureAspect / screenAspect), 1.0)
  );

  vec2 uv = vec2(
    baseUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    baseUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // 3. Wind distortion
  vec2 windOffset = uWindDir * uTime * uWindSpeed;
  float n = snoise(baseUv * 1.5 + windOffset * 0.5);
  
  vec2 distortedUv = uv + vec2(n * 0.03 * uWindSpeed);

  // 4. Scale from Center
  vec2 center = vec2(0.5);
  distortedUv = (distortedUv - center) * uScale + center;

  // Sample texture
  vec4 texColor = texture2D(uTexture, distortedUv);
  
  float rawValue = texColor.r;
  float contrastValue = (rawValue - 0.5) * uContrast + 0.5 + uBrightness;
  
  float shadowMask = contrastValue;
  
  float finalMix = clamp(shadowMask + (1.0 - uIntensity), 0.0, 1.0);
  
  vec3 finalColor = mix(uShadowColor, uColor, finalMix);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface TextureMeshProps {
  url: string;
  backgroundColor: string;
  shadowColor: string;
  intensity: number;
  contrast: number;
  brightness: number;
  scale: number;
  windSpeed: number;
  windDirection: { x: number; y: number };
}

const TextureMesh = ({
  url,
  backgroundColor,
  shadowColor,
  intensity,
  contrast,
  brightness,
  scale,
  windSpeed,
  windDirection,
}: TextureMeshProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const texture = useTexture(url);

  // Calculate rotation need
  const textureAspect = texture.image
    ? (texture.image as HTMLImageElement).width /
      (texture.image as HTMLImageElement).height
    : 1;
  const screenAspect = size.width / size.height;

  const isTexturePortrait = textureAspect < 1;
  const isScreenPortrait = screenAspect < 1;
  const shouldRotate = isTexturePortrait !== isScreenPortrait;

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(backgroundColor) },
      uShadowColor: { value: new THREE.Color(shadowColor) },
      uIntensity: { value: intensity },
      uContrast: { value: contrast },
      uBrightness: { value: brightness },
      uScale: { value: scale },
      uWindDir: { value: new THREE.Vector2(windDirection.x, windDirection.y) },
      uWindSpeed: { value: windSpeed },
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTextureSize: { value: new THREE.Vector2(1, 1) },
      uRotate: { value: shouldRotate },
    }),
    [texture, size, shouldRotate]
  );

  useEffect(() => {
    if (texture.image && mesh.current) {
      const img = texture.image as HTMLImageElement;
      (
        mesh.current.material as THREE.ShaderMaterial
      ).uniforms.uTextureSize.value.set(img.width, img.height);
    }
  }, [texture]);

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uColor.value.set(backgroundColor);
      material.uniforms.uShadowColor.value.set(shadowColor);
      material.uniforms.uIntensity.value = intensity;
      material.uniforms.uContrast.value = contrast;
      material.uniforms.uBrightness.value = brightness;
      material.uniforms.uScale.value = scale;
      material.uniforms.uWindDir.value.set(windDirection.x, windDirection.y);
      material.uniforms.uWindSpeed.value = windSpeed;
      material.uniforms.uResolution.value.set(size.width, size.height);
      material.uniforms.uTexture.value = texture;

      // Update rotation in real-time if window is resized
      const currentScreenAspect = size.width / size.height;
      const isCurrentScreenPortrait = currentScreenAspect < 1;
      const needsRotation = isTexturePortrait !== isCurrentScreenPortrait;
      material.uniforms.uRotate.value = needsRotation;
    }
  });

  return (
    <mesh ref={mesh} scale={[size.width, size.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const ShadowPlane = ({
  image,
  backgroundColor,
  shadowColor,
  intensity,
  contrast,
  brightness,
  scale,
  windSpeed,
  windDirection,
}: Omit<Required<ShadowBackgroundProps>, "className" | "children">) => {
  return (
    <Suspense fallback={null}>
      <TextureMesh
        key={image}
        url={image}
        backgroundColor={backgroundColor}
        shadowColor={shadowColor}
        intensity={intensity}
        contrast={contrast}
        brightness={brightness}
        scale={scale}
        windSpeed={windSpeed}
        windDirection={windDirection}
      />
    </Suspense>
  );
};

/** Get a random shadow image */
export const getRandomShadowImage = (): ShadowImage => {
  return SHADOW_IMAGES[Math.floor(Math.random() * SHADOW_IMAGES.length)];
};

/**
 * ShadowBackground - A decorative background component with animated organic shadows
 *
 * Uses WebGL shaders to create a realistic, gently moving shadow effect
 * that simulates sunlight through foliage. Perfect for hero sections.
 *
 * @example
 * ```tsx
 * // Basic usage with random shadow
 * <ShadowBackground>
 *   <h1>Welcome</h1>
 * </ShadowBackground>
 *
 * // Custom colors and specific image
 * <ShadowBackground
 *   image="/images/shadows/tree_shadow-01.jpg"
 *   backgroundColor="#f5f0e8"
 *   shadowColor="#2d3748"
 *   intensity={0.8}
 * >
 *   <YourContent />
 * </ShadowBackground>
 * ```
 */
export default function ShadowBackground({
  image,
  backgroundColor = "#F8F8F8",
  shadowColor = "#000000",
  intensity = 1.0,
  contrast = 1.0,
  brightness = 0.0,
  scale = 0.9,
  windSpeed = 0.5,
  windDirection = { x: 0.5, y: 0.5 },
  className = "",
  children,
}: ShadowBackgroundProps) {
  // Select random image on mount if not specified
  const [selectedImage] = useState<ShadowImage>(
    () => image ?? getRandomShadowImage()
  );

  // Use prop image if it changes, otherwise keep the randomly selected one
  const finalImage = image ?? selectedImage;

  return (
    <div className={`relative ${className}`}>
      {/* Canvas background - force GPU layer to reduce scroll throttling */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <Canvas
          orthographic
          camera={{ zoom: 1, position: [0, 0, 1] }}
          frameloop="always"
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <ShadowPlane
            image={finalImage}
            backgroundColor={backgroundColor}
            shadowColor={shadowColor}
            intensity={intensity}
            contrast={contrast}
            brightness={brightness}
            scale={scale}
            windSpeed={windSpeed}
            windDirection={windDirection}
          />
        </Canvas>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

/** Export the list of available shadow images for external use */
export { SHADOW_IMAGES };
