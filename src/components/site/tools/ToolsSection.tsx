"use client";

import { useRef } from "react";

import {
  ARC,
  SCATTER,
  SECTION_HEIGHT_VH,
  SIZE,
  STREAM,
  STRETCH,
  TOOL_ICONS,
} from "./config";
import { FolderBack, FolderFront } from "./ToolsFolder";
import { ToolsScene } from "./ToolsScene";

export function ToolsSection() {
  const triggerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  return (
    // Outer section provides the scroll length; ScrollTrigger pins the inner
    // stage. Same pattern as <ReviewStack /> — works inside flex/gap parents.
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
            scrollSpan={STREAM.scrollSpan}
            idleDrift={STREAM.idleDrift}
            instanceCount={STREAM.instanceCount}
            cycle={STREAM.cycle}
            arcOuter={ARC.arcOuter}
            arcLift={ARC.arcLift}
            convergeFromBottom={ARC.convergeFromBottom}
            margin={ARC.margin}
            spawnY={ARC.spawnY}
            p0JitterX={SCATTER.p0JitterX}
            p0JitterY={SCATTER.p0JitterY}
            p1JitterX={SCATTER.p1JitterX}
            p1JitterY={SCATTER.p1JitterY}
            patchSize={SIZE.patchSize}
            sizeMin={SIZE.sizeMin}
            sizeMax={SIZE.sizeMax}
            sizeStart={SIZE.sizeStart}
            sizeEnd={SIZE.sizeEnd}
            stretch={STRETCH.stretch}
            stretchY={STRETCH.stretchY}
            stretchRange={STRETCH.stretchRange}
            squash={STRETCH.squash}
            ySegments={STRETCH.ySegments}
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
            Pixels & Code
          </h2>
          <p className="mt-4 max-w-xl text-base text-neutral-600 md:text-lg">
          A great product isn't defined by its tech stack, but as a designer and developer, knowing exactly which tool bridges the gap faster and better is my superpower.
          </p>
        </div>
      </div>
    </section>
  );
}
