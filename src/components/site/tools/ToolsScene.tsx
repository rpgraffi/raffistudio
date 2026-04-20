"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { BezierDebugLine } from "./BezierDebugLine";
import { ToolsParticles, type ToolsParticlesProps } from "./ToolsParticles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParticleVisualProps = Omit<ToolsParticlesProps, "timeRef" | "iconNames">;

export interface ToolsSceneProps extends ParticleVisualProps {
  iconNames: string[];
  /**
   * Tall outer element whose CSS height defines the total scroll length.
   * The trigger fires from `top top` to `bottom bottom` of this element.
   */
  triggerTarget: React.RefObject<HTMLElement | null>;
  /** Inner viewport-sized element that gets pinned (typically `h-screen`). */
  pinTarget: React.RefObject<HTMLElement | null>;
  /** Total stream span in seconds that the full scroll progress maps to. */
  scrollSpan?: number;
  /** Idle drift added each frame even when not scrolling (seconds/frame). */
  idleDrift?: number;
  /** Render the canonical bezier curve overlay for debugging. */
  showBezier?: boolean;
}

interface InnerProps extends ParticleVisualProps {
  iconNames: string[];
  idleDrift: number;
  showBezier: boolean;
  timeRef: React.MutableRefObject<number>;
}

function SceneInner({
  iconNames,
  idleDrift,
  showBezier,
  timeRef,
  ...particleProps
}: InnerProps) {
  const lastNow = useRef(performance.now());

  useFrame(() => {
    const now = performance.now();
    const dt = Math.min(0.1, (now - lastNow.current) / 1000);
    lastNow.current = now;
    timeRef.current += dt * idleDrift;
  });

  return (
    <>
      <ToolsParticles
        iconNames={iconNames}
        timeRef={timeRef}
        {...particleProps}
      />
      {showBezier ? (
        <BezierDebugLine
          arcOuter={particleProps.arcOuter ?? 0.5}
          arcLift={particleProps.arcLift ?? 1.88}
          convergeFromBottom={particleProps.convergeFromBottom ?? 0.22}
          margin={particleProps.margin ?? 2.7}
          spawnY={particleProps.spawnY ?? 3}
          stretchY={particleProps.stretchY}
          stretchRange={particleProps.stretchRange}
        />
      ) : null}
    </>
  );
}

export function ToolsScene({
  iconNames,
  triggerTarget,
  pinTarget,
  scrollSpan = 1,
  idleDrift = 0.01,
  showBezier = false,
  ...particleProps
}: ToolsSceneProps) {
  const timeRef = useRef(0);

  // Tracks the scroll progress on the previous onUpdate call so we can drive
  // timeRef by delta rather than absolute position. This means the time value
  // that idleDrift accumulated before the user reaches the section is never
  // overwritten — the scroll simply adds on top of it, producing a seamless
  // entry instead of a backward jump.
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const triggerEl = triggerTarget.current;
    const pinEl = pinTarget.current;
    if (!triggerEl || !pinEl) return;

    // Same pattern as <ReviewStack />: the outer element provides the scroll
    // length via its CSS height, the inner element is what gets pinned.
    const trigger = ScrollTrigger.create({
      trigger: triggerEl,
      start: "top top",
      end: "bottom bottom",
      pin: pinEl,
      scrub: 1,
      // Reset the delta baseline whenever scrolling (re-)enters so that the
      // first delta after entry is ~0, not some stale value.
      onEnter: () => {
        prevProgressRef.current = 0;
      },
      onEnterBack: () => {
        prevProgressRef.current = 1;
      },
      onUpdate: (self) => {
        const delta = self.progress - prevProgressRef.current;
        prevProgressRef.current = self.progress;
        timeRef.current += delta * scrollSpan;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [triggerTarget, pinTarget, scrollSpan]);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        outputColorSpace: "srgb-linear",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <SceneInner
        iconNames={iconNames}
        idleDrift={idleDrift}
        showBezier={showBezier}
        timeRef={timeRef}
        {...particleProps}
      />
    </Canvas>
  );
}
