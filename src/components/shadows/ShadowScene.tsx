import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

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
uniform bool uRotate; // New uniform for auto-rotation

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
     // Rotate UVs 90 degrees
     baseUv = vec2(vUv.y, 1.0 - vUv.x);
     // Swap texture dimensions for aspect calculation
     texSize = vec2(uTextureSize.y, uTextureSize.x);
  }

  // 2. Aspect Ratio Correction (Cover Mode)
  float screenAspect = uResolution.x / uResolution.y;
  float textureAspect = texSize.x / texSize.y; 
  
  // Adjust UVs to maintain aspect ratio and cover
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
  float n = snoise(baseUv * 1.5 + windOffset * 0.5); // Use baseUv for noise consistency
  
  // Distort UVs
  vec2 distortedUv = uv + vec2(n * 0.03 * uWindSpeed);

  // 4. Scale from Center
  vec2 center = vec2(0.5);
  distortedUv = (distortedUv - center) * uScale + center;

  // Sample texture
  vec4 texColor = texture2D(uTexture, distortedUv);
  
  float rawValue = texColor.r;
  float contrastValue = (rawValue - 0.5) * uContrast + 0.5 + uBrightness;
  
  // User requested raw contrast value without smoothstep
  float shadowMask = contrastValue;
  
  float finalMix = clamp(shadowMask + (1.0 - uIntensity), 0.0, 1.0);
  
  vec3 finalColor = mix(uShadowColor, uColor, finalMix);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const TextureMesh = ({ url, controls }: { url: string; controls: any }) => {
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

  // Rotate if orientations differ
  const shouldRotate = isTexturePortrait !== isScreenPortrait;

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(controls.bgColor) },
      uShadowColor: { value: new THREE.Color(controls.shadowColor) },
      uIntensity: { value: controls.intensity },
      uContrast: { value: controls.contrast },
      uBrightness: { value: controls.brightness },
      uScale: { value: controls.scale },
      uWindDir: {
        value: new THREE.Vector2(
          controls.windDirection.x,
          controls.windDirection.y
        ),
      },
      uWindSpeed: { value: controls.windSpeed },
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
      material.uniforms.uColor.value.set(controls.bgColor);
      material.uniforms.uShadowColor.value.set(controls.shadowColor);
      material.uniforms.uIntensity.value = controls.intensity;
      material.uniforms.uContrast.value = controls.contrast;
      material.uniforms.uBrightness.value = controls.brightness;
      material.uniforms.uScale.value = controls.scale;
      material.uniforms.uWindDir.value.set(
        controls.windDirection.x,
        controls.windDirection.y
      );
      material.uniforms.uWindSpeed.value = controls.windSpeed;
      material.uniforms.uResolution.value.set(size.width, size.height);
      material.uniforms.uTexture.value = texture;

      // Update rotation in real-time if window is resized
      const currentScreenAspect = size.width / size.height;
      const isCurrentScreenPortrait = currentScreenAspect < 1;
      // Assuming texture aspect doesn't change dynamically
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

const ShadowPlane = () => {
  const controls = useControls({
    textureImage: {
      options: {
        "Plant Shadow 1": "/images/shadows/plant_shadow-01.jpg",
        "Plant Shadow 2": "/images/shadows/plant_shadow-02.jpg",
        "Plant Shadow 3": "/images/shadows/plant_shadow-03.jpg",
        "Plant Shadow 4": "/images/shadows/plant_shadow-04.jpg",
        "Plant Shadow 5": "/images/shadows/plant_shadow-05.jpg",
        "Plant Shadow 6": "/images/shadows/plant_shadow-06.jpg",
        "Plant Shadow 7": "/images/shadows/plant_shadow-07.jpg",
        "Plant Shadow 8": "/images/shadows/plant_shadow-08.jpg",
        "Plant Shadow 9": "/images/shadows/plant_shadow-09.jpg",
        "Plant Shadow 10": "/images/shadows/plant_shadow-10.jpg",
      },
      label: "Texture",
    },
    bgColor: { value: "#e0e0e0", label: "Bg Color" },
    shadowColor: { value: "#000000", label: "Shadow Color" },
    intensity: { value: 1.0, min: 0, max: 1, label: "Intensity" },
    contrast: { value: 1.0, min: 0.5, max: 3.0, label: "Texture Contrast" },
    brightness: {
      value: 0.0,
      min: -0.5,
      max: 0.5,
      label: "Texture Brightness",
    },
    scale: { value: 1.0, min: 0.5, max: 5, label: "Scale" },
    windSpeed: { value: 0.4, min: 0, max: 2, label: "Wind Speed" },
    windDirection: {
      value: { x: 0.5, y: 0.5 },
      joystick: true,
      label: "Wind Dir",
    },
  });

  return (
    <Suspense fallback={null}>
      <TextureMesh
        key={controls.textureImage}
        url={controls.textureImage}
        controls={controls}
      />
    </Suspense>
  );
};

export default function ShadowScene() {
  return (
    <div className="w-full h-full absolute top-0 left-0 -z-10">
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 1] }}>
        <ShadowPlane />
      </Canvas>
    </div>
  );
}
