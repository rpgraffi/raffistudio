"use client";

import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export interface BezierDebugLineProps {
  /** Multiplier of viewport half-width for the bezier control point X. */
  arcOuter: number;
  /** Vertical offset of the bezier control point apex (world units). */
  arcLift: number;
  /** Convergence point as a fraction of viewport height from the bottom. */
  convergeFromBottom: number;
  /** Off-screen spawn margin in X (world units). */
  margin: number;
  /** World Y of the spawn point (P0.y). */
  spawnY: number;
  /** World Y where spaghettification starts (downward). */
  stretchY?: number;
  /** World Y range for the spaghetti ramp (lower bound = stretchY - stretchRange). */
  stretchRange?: number;
  /** Number of samples per side. */
  samples?: number;
  /** Color for the bezier curve. */
  color?: string;
  /** Color for the spaghetti threshold line. */
  thresholdColor?: string;
  /** Color for the spawn line. */
  spawnColor?: string;
}

function quadBezier(
  p0: THREE.Vector2,
  p1: THREE.Vector2,
  p2: THREE.Vector2,
  t: number,
  out: THREE.Vector2
) {
  const u = 1 - t;
  const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
  const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
  return out.set(x, y);
}

export function BezierDebugLine({
  arcOuter,
  arcLift,
  convergeFromBottom,
  margin,
  spawnY,
  stretchY,
  stretchRange,
  samples = 64,
  color = "#ff3366",
  thresholdColor = "#33ccff",
  spawnColor = "#ffd23f",
}: BezierDebugLineProps) {
  const { viewport } = useThree();

  const { leftGeo, rightGeo, controlGeo, thresholdGeo, rangeGeo, spawnGeo } =
    useMemo(() => {
      const halfW = viewport.width * 0.5;
      const halfH = viewport.height * 0.5;
      const bottomY = -halfH + viewport.height * convergeFromBottom;

      const tmp = new THREE.Vector2();

      const buildSide = (side: number) => {
        const p0 = new THREE.Vector2(side * (halfW + margin), spawnY);
        const p1 = new THREE.Vector2(side * halfW * arcOuter, arcLift);
        const p2 = new THREE.Vector2(0, bottomY);

        const positions = new Float32Array(samples * 3);
        for (let i = 0; i < samples; i++) {
          const t = i / (samples - 1);
          quadBezier(p0, p1, p2, t, tmp);
          positions[i * 3 + 0] = tmp.x;
          positions[i * 3 + 1] = tmp.y;
          positions[i * 3 + 2] = 0;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return { geo: g, p0, p1, p2 };
      };

      const left = buildSide(-1);
      const right = buildSide(1);

      // Tiny crosses at P0/P1/P2.
      const cross = (p: THREE.Vector2, s: number) => [
        p.x - s, p.y, 0, p.x + s, p.y, 0,
        p.x, p.y - s, 0, p.x, p.y + s, 0,
      ];
      const s = 0.15;
      const ctrl = new Float32Array([
        ...cross(left.p0, s),
        ...cross(left.p1, s),
        ...cross(right.p0, s),
        ...cross(right.p1, s),
        ...cross(left.p2, s),
      ]);
      const ctrlGeo = new THREE.BufferGeometry();
      ctrlGeo.setAttribute("position", new THREE.BufferAttribute(ctrl, 3));

      // Horizontal line at the spawn Y so it can be aligned with the off-screen spawn.
      const spawnArr = new Float32Array([
        -halfW - margin, spawnY, 0,
        halfW + margin, spawnY, 0,
      ]);
      const spawnG = new THREE.BufferGeometry();
      spawnG.setAttribute("position", new THREE.BufferAttribute(spawnArr, 3));

      // Threshold + range band for the spaghetti ramp.
      let thrG: THREE.BufferGeometry | null = null;
      let rngG: THREE.BufferGeometry | null = null;
      if (stretchY !== undefined) {
        const thr = new Float32Array([
          -halfW - margin, stretchY, 0,
          halfW + margin, stretchY, 0,
        ]);
        thrG = new THREE.BufferGeometry();
        thrG.setAttribute("position", new THREE.BufferAttribute(thr, 3));

        if (stretchRange !== undefined && stretchRange > 0) {
          const lower = stretchY - stretchRange;
          const rng = new Float32Array([
            -halfW - margin, lower, 0,
            halfW + margin, lower, 0,
          ]);
          rngG = new THREE.BufferGeometry();
          rngG.setAttribute("position", new THREE.BufferAttribute(rng, 3));
        }
      }

      return {
        leftGeo: left.geo,
        rightGeo: right.geo,
        controlGeo: ctrlGeo,
        thresholdGeo: thrG,
        rangeGeo: rngG,
        spawnGeo: spawnG,
      };
    }, [
      viewport.width,
      viewport.height,
      convergeFromBottom,
      margin,
      spawnY,
      arcOuter,
      arcLift,
      stretchY,
      stretchRange,
      samples,
    ]);

  return (
    <group>
      <line>
        <primitive object={leftGeo} attach="geometry" />
        <lineBasicMaterial color={color} transparent opacity={0.9} />
      </line>
      <line>
        <primitive object={rightGeo} attach="geometry" />
        <lineBasicMaterial color={color} transparent opacity={0.9} />
      </line>
      <lineSegments>
        <primitive object={controlGeo} attach="geometry" />
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </lineSegments>
      <line>
        <primitive object={spawnGeo} attach="geometry" />
        <lineBasicMaterial color={spawnColor} transparent opacity={0.8} />
      </line>
      {thresholdGeo ? (
        <line>
          <primitive object={thresholdGeo} attach="geometry" />
          <lineBasicMaterial color={thresholdColor} transparent opacity={0.8} />
        </line>
      ) : null}
      {rangeGeo ? (
        <line>
          <primitive object={rangeGeo} attach="geometry" />
          <lineBasicMaterial
            color={thresholdColor}
            transparent
            opacity={0.35}
          />
        </line>
      ) : null}
    </group>
  );
}
