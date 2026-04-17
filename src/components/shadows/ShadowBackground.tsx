"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useMemo, useState } from "react";
import * as THREE from "three";

import { DEFAULT_CONFIG, ShadowConfig } from "./config";
import { GoboScene } from "./GoboScene";

export interface ShadowBackgroundProps {
  src?: string;
  config?: ShadowConfig;
  shadowColor?: string;
  bgColor?: string;
  offsetX?: number;
  offsetY?: number;
  shadowScale?: number;
  className?: string;
}

export function ShadowBackground({
  src = "/images/shadow_rgb/palm_shadow.avif",
  config = DEFAULT_CONFIG,
  shadowColor = "#3d4459",
  bgColor = "transparent",
  offsetX = 0,
  offsetY = 0,
  shadowScale = 1.0,
  className,
}: ShadowBackgroundProps) {
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
