"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import toolsPatchFrag from "@/shaders/toolsPatch/fragment.glsl";
import toolsPatchVert from "@/shaders/toolsPatch/vertex.glsl";

import { buildAtlas, type AtlasResult } from "./buildAtlas";

export interface ToolsParticlesProps {
  iconNames: string[];
  /** Total instances; >= iconNames.length so every icon appears multiple times. */
  instanceCount?: number;
  /** Duration of one full traversal of the bezier in seconds. */
  cycle?: number;
  /** Base patch size in world units. */
  patchSize?: number;
  /** Per-instance size jitter range (size = lerp(min, max, rand)). */
  sizeMin?: number;
  sizeMax?: number;
  /** Random offset of the off-screen start point (world units). */
  p0JitterX?: number;
  p0JitterY?: number;
  /** Random offset of the bezier control point (world units). */
  p1JitterX?: number;
  p1JitterY?: number;
  /** How far out the arc bulges (multiplier of viewport half-width). */
  arcOuter?: number;
  /** Vertical offset of the arc apex (world units). */
  arcLift?: number;
  /** Maximum trailing length along the path when fully spaghettified (in cycle-units, 0..1). */
  stretch?: number;
  /** Perpendicular thinning when fully spaghettified. */
  squash?: number;
  /** Vertical position of the convergence point as a fraction of viewport height from the bottom. */
  convergeFromBottom?: number;
  /** Off-screen spawn margin in X (world units). */
  margin?: number;
  /** World Y of the spawn point (P0.y). Should sit above the viewport top. */
  spawnY?: number;
  /** Number of Y subdivisions on the plane (more = smoother noodle curvature). */
  ySegments?: number;
  /** World-Y threshold where the spaghettification ramp starts (downward). */
  stretchY?: number;
  /** World-Y distance over which the ramp completes (downward from `stretchY`). */
  stretchRange?: number;
  /** Multiplier applied to a patch's size at spawn (t=0). */
  sizeStart?: number;
  /** Multiplier applied to a patch's size at convergence (t=1). */
  sizeEnd?: number;
  /** External ref whose `.current` is the global stream clock (driven by scroll). */
  timeRef: React.MutableRefObject<number>;
}

export function ToolsParticles({
  iconNames,
  instanceCount = 80,
  cycle = 6,
  patchSize = 0.6,
  sizeMin = 0.7,
  sizeMax = 1.3,
  p0JitterX = 0.6,
  p0JitterY = 1.4,
  p1JitterX = 0.4,
  p1JitterY = 0.8,
  arcOuter = 0.5,
  arcLift = 1.88,
  stretch = 0.25,
  squash = 0.45,
  convergeFromBottom = 0.22,
  margin = 2.7,
  spawnY = 3,
  ySegments = 24,
  stretchY = -0.5,
  stretchRange = 1.5,
  sizeStart = 0.75,
  sizeEnd = 1.0,
  timeRef,
}: ToolsParticlesProps) {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const atlasRef = useRef<AtlasResult | null>(null);

  // Geometry: a unit plane with per-instance attributes.
  // Rebuilt whenever instance count or scatter / size jitter changes so the
  // randomized attributes actually reflect the new ranges.
  const geometry = useMemo(() => {
    const N = instanceCount;
    const base = new THREE.PlaneGeometry(1, 1, 1, ySegments);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.setAttribute("position", base.getAttribute("position"));
    geo.setAttribute("uv", base.getAttribute("uv"));
    geo.setAttribute("normal", base.getAttribute("normal"));
    geo.instanceCount = N;

    const aSide = new Float32Array(N);
    const aAtlasIndex = new Float32Array(N);
    const aPhase = new Float32Array(N);
    const aSize = new Float32Array(N);
    const aP0Jitter = new Float32Array(N * 2);
    const aP1Jitter = new Float32Array(N * 2);

    for (let i = 0; i < N; i++) {
      aSide[i] = i % 2 === 0 ? -1 : 1;
      aAtlasIndex[i] = i % iconNames.length;
      // Even phase distribution + small jitter so the stream is dense but irregular.
      aPhase[i] = (i / N + (Math.random() - 0.5) * (0.4 / N)) % 1;
      aSize[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
      aP0Jitter[i * 2 + 0] = (Math.random() - 0.5) * 2 * p0JitterX;
      aP0Jitter[i * 2 + 1] = (Math.random() - 0.5) * 2 * p0JitterY;
      aP1Jitter[i * 2 + 0] = (Math.random() - 0.5) * 2 * p1JitterX;
      aP1Jitter[i * 2 + 1] = (Math.random() - 0.5) * 2 * p1JitterY;
    }

    geo.setAttribute("aSide", new THREE.InstancedBufferAttribute(aSide, 1));
    geo.setAttribute(
      "aAtlasIndex",
      new THREE.InstancedBufferAttribute(aAtlasIndex, 1),
    );
    geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(aPhase, 1));
    geo.setAttribute("aSize", new THREE.InstancedBufferAttribute(aSize, 1));
    geo.setAttribute(
      "aP0Jitter",
      new THREE.InstancedBufferAttribute(aP0Jitter, 2),
    );
    geo.setAttribute(
      "aP1Jitter",
      new THREE.InstancedBufferAttribute(aP1Jitter, 2),
    );

    base.dispose();
    return geo;
  }, [
    instanceCount,
    iconNames.length,
    sizeMin,
    sizeMax,
    p0JitterX,
    p0JitterY,
    p1JitterX,
    p1JitterY,
    ySegments,
  ]);

  // Material with shader.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: toolsPatchVert,
        fragmentShader: toolsPatchFrag,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uCycle: { value: cycle },
          uHalfW: { value: 1 },
          uSpawnY: { value: spawnY },
          uBottomY: { value: -1 },
          uMargin: { value: margin },
          uPatchSize: { value: patchSize },
          uArcOuter: { value: arcOuter },
          uArcLift: { value: arcLift },
          uStretch: { value: stretch },
          uStretchY: { value: stretchY },
          uStretchRange: { value: stretchRange },
          uSquash: { value: squash },
          uSizeStart: { value: sizeStart },
          uSizeEnd: { value: sizeEnd },
          uAtlas: { value: null as THREE.Texture | null },
          uAtlasCols: { value: 1 },
          uAtlasRows: { value: 1 },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Async-load the atlas once.
  useEffect(() => {
    let cancelled = false;
    buildAtlas(iconNames).then((atlas) => {
      if (cancelled) {
        atlas.texture.dispose();
        return;
      }
      atlasRef.current = atlas;
      material.uniforms.uAtlas.value = atlas.texture;
      material.uniforms.uAtlasCols.value = atlas.cols;
      material.uniforms.uAtlasRows.value = atlas.rows;
      material.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [iconNames, material]);

  // Cleanup.
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    return () => {
      material.dispose();
      atlasRef.current?.texture.dispose();
    };
  }, [material]);

  // Push live (non-attribute) uniforms when their controlling props change.
  useEffect(() => {
    const u = material.uniforms;
    u.uCycle.value = cycle;
    u.uMargin.value = margin;
    u.uSpawnY.value = spawnY;
    u.uPatchSize.value = patchSize;
    u.uArcOuter.value = arcOuter;
    u.uArcLift.value = arcLift;
    u.uStretch.value = stretch;
    u.uStretchY.value = stretchY;
    u.uStretchRange.value = stretchRange;
    u.uSquash.value = squash;
    u.uSizeStart.value = sizeStart;
    u.uSizeEnd.value = sizeEnd;
  }, [
    material,
    cycle,
    margin,
    spawnY,
    patchSize,
    arcOuter,
    arcLift,
    stretch,
    stretchY,
    stretchRange,
    squash,
    sizeStart,
    sizeEnd,
  ]);

  // Update viewport-derived uniforms.
  useEffect(() => {
    const halfW = viewport.width * 0.5;
    const halfH = viewport.height * 0.5;
    material.uniforms.uHalfW.value = halfW;
    material.uniforms.uBottomY.value =
      -halfH + viewport.height * convergeFromBottom;
  }, [viewport.width, viewport.height, convergeFromBottom, material]);

  // Push live time each frame.
  useFrame(() => {
    material.uniforms.uTime.value = timeRef.current;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}
