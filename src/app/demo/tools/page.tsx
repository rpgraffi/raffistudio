"use client";

import {
  ARC,
  SCATTER,
  SECTION_HEIGHT_VH,
  SIZE,
  STREAM,
  STRETCH,
  TOOL_ICONS,
} from "@/components/site/tools/config";
import { FolderBack, FolderFront } from "@/components/site/tools/ToolsFolder";
import { ToolsScene } from "@/components/site/tools/ToolsScene";
import { folder, useControls } from "leva";
import { useRef } from "react";

export default function ToolsDemoPage() {
  const triggerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const stream = useControls("Stream", {
    instanceCount: { value: STREAM.instanceCount, min: 4, max: 400, step: 1 },
    cycle: { value: STREAM.cycle, min: 0.1, max: 4, step: 0.1 },
    scrollSpan: { value: STREAM.scrollSpan, min: 0, max: 2, step: 0.01 },
    idleDrift: { value: STREAM.idleDrift, min: 0, max: 1, step: 0.01 },
  });

  const arc = useControls("Arc", {
    arcOuter: { value: ARC.arcOuter, min: 0, max: 2.5, step: 0.01 },
    arcLift: { value: ARC.arcLift, min: -3, max: 5, step: 0.01 },
    convergeFromBottom: {
      value: ARC.convergeFromBottom,
      min: 0,
      max: 1,
      step: 0.01,
    },
    margin: { value: ARC.margin, min: 0, max: 10, step: 0.1 },
    spawnY: { value: ARC.spawnY, min: -2, max: 8, step: 0.05 },
  });

  const scatter = useControls("Scatter", {
    p0: folder({
      p0JitterX: { value: SCATTER.p0JitterX, min: 0, max: 4, step: 0.05 },
      p0JitterY: { value: SCATTER.p0JitterY, min: 0, max: 4, step: 0.05 },
    }),
    p1: folder({
      p1JitterX: { value: SCATTER.p1JitterX, min: 0, max: 4, step: 0.05 },
      p1JitterY: { value: SCATTER.p1JitterY, min: 0, max: 4, step: 0.05 },
    }),
  });

  const size = useControls("Size", {
    patchSize: { value: SIZE.patchSize, min: 0.05, max: 3, step: 0.01 },
    sizeMin: { value: SIZE.sizeMin, min: 0.1, max: 2, step: 0.05 },
    sizeMax: { value: SIZE.sizeMax, min: 0.1, max: 3, step: 0.05 },
    growth: folder({
      sizeStart: { value: SIZE.sizeStart, min: 0.2, max: 2, step: 0.01 },
      sizeEnd: { value: SIZE.sizeEnd, min: 0.2, max: 2, step: 0.01 },
    }),
  });

  const stretch = useControls("Spaghettification", {
    stretch: { value: STRETCH.stretch, min: 0, max: 0.8, step: 0.005 },
    stretchY: { value: STRETCH.stretchY, min: -5, max: 5, step: 0.05 },
    stretchRange: {
      value: STRETCH.stretchRange,
      min: 0.05,
      max: 6,
      step: 0.05,
    },
    squash: { value: STRETCH.squash, min: 0.05, max: 1, step: 0.01 },
    ySegments: { value: STRETCH.ySegments, min: 1, max: 64, step: 1 },
  });

  const debug = useControls("Debug", {
    showBezier: false,
  });

  return (
    <main className="w-full bg-neutral-50 text-neutral-900">
      <section className="h-[60vh] flex items-end justify-center px-8 pb-12">
        <p className="max-w-xl text-sm text-neutral-500">
          Scroll down to enter the tools section.
        </p>
      </section>

      <section
        ref={triggerRef}
        className="relative w-full"
        style={{ height: `${SECTION_HEIGHT_VH}vh` }}
      >
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <FolderBack />
          </div>

          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            <ToolsScene
              iconNames={TOOL_ICONS}
              triggerTarget={triggerRef}
              pinTarget={pinRef}
              scrollSpan={stream.scrollSpan}
              idleDrift={stream.idleDrift}
              instanceCount={stream.instanceCount}
              cycle={stream.cycle}
              arcOuter={arc.arcOuter}
              arcLift={arc.arcLift}
              convergeFromBottom={arc.convergeFromBottom}
              margin={arc.margin}
              spawnY={arc.spawnY}
              p0JitterX={scatter.p0JitterX}
              p0JitterY={scatter.p0JitterY}
              p1JitterX={scatter.p1JitterX}
              p1JitterY={scatter.p1JitterY}
              patchSize={size.patchSize}
              sizeMin={size.sizeMin}
              sizeMax={size.sizeMax}
              sizeStart={size.sizeStart}
              sizeEnd={size.sizeEnd}
              stretch={stretch.stretch}
              stretchY={stretch.stretchY}
              stretchRange={stretch.stretchRange}
              squash={stretch.squash}
              ySegments={stretch.ySegments}
              showBezier={debug.showBezier}
            />
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 20 }}
          >
            <FolderFront />
          </div>

          <div
            className="pointer-events-none relative flex h-full flex-col items-center justify-start px-8 pt-[12vh] text-center"
            style={{ zIndex: 30 }}
          >
            <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              The tools I work with
            </h2>
            <p className="mt-4 max-w-xl text-base text-neutral-600 md:text-lg">
              Every project pulls from the same toolbox. Figma to ship,
              Blender to render, code to glue it together.
            </p>
          </div>
        </div>
      </section>

      <section className="h-[60vh] flex items-start justify-center px-8 pt-12">
        <p className="max-w-xl text-sm text-neutral-500">
          Section after the pin to verify scroll release.
        </p>
      </section>
    </main>
  );
}
