"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// ─── Config ──────────────────────────────────────────────────────────────────

export type DebugMode =
  | "none"
  | "channel_r"
  | "channel_g"
  | "channel_b"
  | "channel_a"
  | "rgb_raw"
  | "motion"
  | "final_greyscale";

export const DEBUG_MODE_VALUES: Record<DebugMode, number> = {
  none:             0,
  channel_r:        1,
  channel_g:        2,
  channel_b:        3,
  channel_a:        4,
  rgb_raw:          5,
  motion:           6,
  final_greyscale:  7,
};

export interface ShadowV2Config {
  speed: number;            // time multiplier for the sine waves
  strength: number;         // amplitude multiplier applied to G and A
  shadowOpacity: number;    // 0–1
  goboBlur: number;         // blur radius when sampling the gobo FBO (softens B edges)
  debugMode: DebugMode;
}

export const DEFAULT_CONFIG: ShadowV2Config = {
  speed:         1.9,
  strength:      0.64,
  shadowOpacity: 0.15,
  goboBlur:      0.5,
  debugMode:     "none",
};

const GOBO_RT_SIZE = 512;

// ─── Pass 1: Gobo shader → renders to 512×512 FBO (opaque greyscale) ────────

const GOBO_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GOBO_FRAG = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float     uTime;
  uniform float     uStrength;
  uniform int       uDebugMode;

  varying vec2 vUv;

  void main() {
    vec4 params = texture2D(uTexture, vUv);

    float s      = params.r;
    float amp1   = params.g * uStrength;
    float phase1 = (params.b - 0.5) * 6.283185;
    float amp23  = params.a * uStrength;

    vec3  waves  = sin(uTime * vec3(1.0, 2.0, 3.0) + phase1 * vec3(1.0, 2.0, 0.5));
    float motion = (amp1 * waves.x) + (amp23 * 0.5 * waves.y) + (amp23 * 0.3 * waves.z);
    float gobo   = clamp(s + motion, 0.0, 1.0);

    // Debug: channel views render directly without FBO blur
    if (uDebugMode == 1) { gl_FragColor = vec4(vec3(params.r), 1.0); return; }
    if (uDebugMode == 2) { gl_FragColor = vec4(vec3(params.g), 1.0); return; }
    if (uDebugMode == 3) { gl_FragColor = vec4(vec3(params.b), 1.0); return; }
    if (uDebugMode == 4) { gl_FragColor = vec4(vec3(params.a), 1.0); return; }
    if (uDebugMode == 5) { gl_FragColor = vec4(params.rgb, 1.0); return; }
    if (uDebugMode == 6) {
      float m = motion * 0.5 + 0.5;
      gl_FragColor = vec4(vec3(m), 1.0); return;
    }

    // Opaque greyscale gobo → written to FBO
    gl_FragColor = vec4(vec3(gobo), 1.0);
  }
`;

// ─── Pass 2: Composite — reads blurred FBO, outputs coloured shadow ─────────

const COMP_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const COMP_FRAG = /* glsl */ `
  uniform sampler2D uGobo;
  uniform float     uOpacity;
  uniform vec3      uShadowColor;
  uniform float     uBlurRadius;
  uniform vec2      uTexelSize;    // 1.0 / FBO size
  uniform int       uDebugMode;

  varying vec2 vUv;

  float sampleBlurred(vec2 uv) {
    if (uBlurRadius < 0.01) {
      return texture2D(uGobo, uv).r;
    }
    // 9-tap Gaussian (matching the original's blur9 approach)
    float sum = 0.0;
    sum += texture2D(uGobo, uv).r                                      * 0.1633;
    sum += texture2D(uGobo, uv - uTexelSize * uBlurRadius).r           * 0.1531;
    sum += texture2D(uGobo, uv + uTexelSize * uBlurRadius).r           * 0.1531;
    sum += texture2D(uGobo, uv - uTexelSize * uBlurRadius * 2.0).r    * 0.12245;
    sum += texture2D(uGobo, uv + uTexelSize * uBlurRadius * 2.0).r    * 0.12245;
    sum += texture2D(uGobo, uv - uTexelSize * uBlurRadius * 3.0).r    * 0.0918;
    sum += texture2D(uGobo, uv + uTexelSize * uBlurRadius * 3.0).r    * 0.0918;
    sum += texture2D(uGobo, uv - uTexelSize * uBlurRadius * 4.0).r    * 0.051;
    sum += texture2D(uGobo, uv + uTexelSize * uBlurRadius * 4.0).r    * 0.051;
    return sum;
  }

  void main() {
    // Debug: greyscale gobo preview (post-blur)
    if (uDebugMode == 7) {
      float g = sampleBlurred(vUv);
      gl_FragColor = vec4(vec3(g), 1.0); return;
    }

    float gobo  = sampleBlurred(vUv);
    float alpha = (1.0 - gobo) * uOpacity;
    gl_FragColor = vec4(uShadowColor, alpha);
  }
`;

// ─── GoboScene — two-pass: renders gobo to FBO, then composites ─────────────

interface GoboSceneProps {
  src: string;
  config: ShadowV2Config;
  shadowColor: THREE.Color;
  offsetX: number;
  offsetY: number;
  shadowScale: number;
  onReady?: () => void;
}

function GoboScene({
  src,
  config,
  shadowColor,
  offsetX,
  offsetY,
  shadowScale,
  onReady,
}: GoboSceneProps) {
  const { viewport, gl, size } = useThree();
  const goboMeshRef = useRef<THREE.Mesh>(null);
  const compMeshRef = useRef<THREE.Mesh>(null);
  const readyFiredRef = useRef(false);

  const texture = useTexture(src, (tex) => {
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  });

  // FBO: 512×512 render target for the gobo pass (matches original)
  const renderTarget = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(GOBO_RT_SIZE, GOBO_RT_SIZE, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });
    return rt;
  }, []);

  useEffect(() => () => renderTarget.dispose(), [renderTarget]);

  // Gobo material (pass 1 — renders to FBO)
  const goboMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture:   { value: texture },
          uTime:      { value: 0 },
          uStrength:  { value: config.strength },
          uDebugMode: { value: DEBUG_MODE_VALUES[config.debugMode] },
        },
        vertexShader:   GOBO_VERT,
        fragmentShader: GOBO_FRAG,
        depthWrite: false,
        depthTest:  false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texture]
  );

  // Composite material (pass 2 — reads FBO, outputs to screen)
  const compMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uGobo:       { value: renderTarget.texture },
          uOpacity:    { value: config.shadowOpacity },
          uShadowColor:{ value: shadowColor },
          uBlurRadius: { value: config.goboBlur },
          uTexelSize:  { value: new THREE.Vector2(1 / GOBO_RT_SIZE, 1 / GOBO_RT_SIZE) },
          uDebugMode:  { value: DEBUG_MODE_VALUES[config.debugMode] },
        },
        vertexShader:   COMP_VERT,
        fragmentShader: COMP_FRAG,
        blending:    THREE.NormalBlending,
        transparent: true,
        depthWrite:  false,
        depthTest:   false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderTarget, shadowColor]
  );

  useEffect(() => {
    return () => {
      goboMaterial.dispose();
      compMaterial.dispose();
    };
  }, [goboMaterial, compMaterial]);

  // Separate camera for rendering the gobo fullscreen into the FBO
  const goboCamera = useMemo(
    () => new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10),
    []
  );
  goboCamera.position.z = 1;

  useFrame(({ clock }) => {
    const goboMesh = goboMeshRef.current;
    const compMesh = compMeshRef.current;
    if (!goboMesh || !compMesh) return;

    // ── Pass 1: render gobo to FBO ──────────────────────────────────────
    const gu = (goboMesh.material as THREE.ShaderMaterial).uniforms;
    gu.uTime.value      = clock.getElapsedTime() * config.speed;
    gu.uStrength.value  = config.strength;
    gu.uDebugMode.value = DEBUG_MODE_VALUES[config.debugMode];

    goboMesh.visible = true;
    compMesh.visible = false;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(goboMesh.parent!, goboCamera);
    gl.setRenderTarget(null);

    goboMesh.visible = false;

    // ── Pass 2: composite (reads FBO, renders to screen) ────────────────
    // Anchor the shadow to the viewport's left edge instead of shifting the canvas container.
    // `offsetX` stays in pixels and is converted to world units each frame, so it updates on resize.
    const unitsPerPixelX = size.width > 0 ? viewport.width / size.width : 0;
    const anchoredOffsetX = -viewport.width * 0.5 + offsetX * unitsPerPixelX;

    compMesh.visible = true;
    compMesh.position.x = anchoredOffsetX;
    compMesh.position.y = -offsetY;

    const cover = Math.max(viewport.width, viewport.height) * 1.15 * shadowScale;
    compMesh.scale.setScalar(cover);

    const cu = (compMesh.material as THREE.ShaderMaterial).uniforms;
    cu.uOpacity.value     = config.shadowOpacity;
    cu.uShadowColor.value = shadowColor;
    cu.uBlurRadius.value  = config.goboBlur;
    cu.uDebugMode.value   = DEBUG_MODE_VALUES[config.debugMode];

    // Debug modes 1-6 bypass the FBO: render gobo directly to screen
    if (config.debugMode !== "none" && config.debugMode !== "final_greyscale") {
      goboMesh.visible = true;
      compMesh.visible = false;
      goboMesh.position.x = anchoredOffsetX;
      goboMesh.position.y = -offsetY;
      goboMesh.scale.setScalar(cover);
    }

    // Fire readiness once after the first rendered frame.
    if (!readyFiredRef.current) {
      readyFiredRef.current = true;
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <>
      {/* Pass 1 mesh — rendered to FBO (fullscreen in gobo camera space) */}
      <mesh ref={goboMeshRef} material={goboMaterial} visible={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Pass 2 mesh — composited to screen */}
      <mesh ref={compMeshRef} material={compMaterial}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}

// ─── ShadowBackgroundV2 ──────────────────────────────────────────────────────

export interface ShadowBackgroundV2Props {
  src?: string;
  config?: ShadowV2Config;
  shadowColor?: string;
  bgColor?: string;
  offsetX?: number;
  offsetY?: number;
  shadowScale?: number;
  className?: string;
}

export function ShadowBackgroundV2({
  src = "/images/shadow_rgb/palm_shadow.avif",
  config = DEFAULT_CONFIG,
  shadowColor = "#3d4459",
  bgColor = "transparent",
  offsetX = 0,
  offsetY = 0,
  shadowScale = 1.0,
  className,
}: ShadowBackgroundV2Props) {
  const colorObj = useMemo(() => new THREE.Color(shadowColor), [shadowColor]);
  const hasOpaqueBackground = bgColor !== "transparent";
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div
      className={className}
      style={{
        opacity: ready ? 1 : 0,
        transition:
          "opacity 2.1s cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity",
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ display: "block", background: "transparent" }}
      >
        {hasOpaqueBackground ? <color attach="background" args={[bgColor]} /> : null}
        <Suspense fallback={null}>
          <GoboScene
            src={src}
            config={config}
            shadowColor={colorObj}
            offsetX={offsetX}
            offsetY={offsetY}
            shadowScale={shadowScale}
            onReady={handleReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
