"use client";

import {
  DrawingHeadline,
  DrawingHeadlineMultiline,
} from "@/components/natural-ui/DrawingHeadline";
import { useState } from "react";

export default function DrawingDemoPage() {
  const [key, setKey] = useState(0);

  const replay = () => setKey((k) => k + 1);

  return (
    <main className="min-h-screen bg-zinc-100 py-20">
      <div className="max-w-site mx-auto px-8">
        {/* Controls */}
        <div className="mb-12 flex gap-4">
          <button
            onClick={replay}
            className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium"
          >
            Replay Animation
          </button>
        </div>

        {/* Demo 1: Basic headline */}
        <section className="mb-24" key={`basic-${key}`}>
          <p className="text-sm text-zinc-500 mb-4 font-mono">
            Grid draws → stroke reveals → fill fades in → grid fades out
          </p>
          <DrawingHeadline
            className="text-6xl md:text-8xl text-zinc-900 font-sentient"
            triggerOnView={false}
            animate={true}
          >
            Typography
          </DrawingHeadline>
        </section>

        {/* Demo 2: Multi-line headline */}
        <section className="mb-24" key={`multi-${key}`}>
          <p className="text-sm text-zinc-500 mb-4 font-mono">
            Multi-line headline with staggered animation
          </p>
          <DrawingHeadlineMultiline
            lines={["Convert &", "Compress"]}
            className="text-5xl md:text-7xl text-zinc-900 font-sentient"
            triggerOnView={false}
            animate={true}
            lineDelay={0.8}
          />
        </section>

        {/* Demo 3: Without grid */}
        <section className="mb-24" key={`nogrid-${key}`}>
          <p className="text-sm text-zinc-500 mb-4 font-mono">
            Without grid lines
          </p>
          <DrawingHeadline
            className="text-6xl md:text-8xl text-zinc-900 font-sentient"
            showGrid={false}
            triggerOnView={false}
            animate={true}
            strokeDuration={1.5}
          >
            Clean
          </DrawingHeadline>
        </section>

        {/* Demo 4: Custom colors */}
        <section className="mb-24" key={`custom-${key}`}>
          <p className="text-sm text-zinc-500 mb-4 font-mono">
            Custom stroke and grid colors
          </p>
          <DrawingHeadline
            className="text-6xl md:text-8xl font-sentient"
            strokeColor="#3b82f6"
            fillColor="#1e3a5f"
            gridColor="rgba(59, 130, 246, 0.2)"
            strokeWidth={2}
            triggerOnView={false}
            animate={true}
          >
            Colorful
          </DrawingHeadline>
        </section>

        {/* Demo 5: Slower animation */}
        <section className="mb-24" key={`slow-${key}`}>
          <p className="text-sm text-zinc-500 mb-4 font-mono">
            Slow & dramatic
          </p>
          <DrawingHeadline
            className="text-6xl md:text-8xl text-zinc-900 font-sentient"
            gridDuration={1}
            strokeDuration={2.5}
            fillDuration={0.8}
            gridFadeOutDuration={0.8}
            strokeWidth={1}
            gridStrokeWidth={0.5}
            gridColor="rgba(0,0,0,0.08)"
            triggerOnView={false}
            animate={true}
          >
            Dramatic
          </DrawingHeadline>
        </section>

        {/* Demo 6: Scroll trigger demo */}
        <section className="mb-24">
          <p className="text-sm text-zinc-500 mb-4 font-mono">
            Scroll down to trigger animation ↓
          </p>
          <div className="h-[50vh]" />
          <DrawingHeadline
            key={`scroll-${key}`}
            className="text-6xl md:text-8xl text-zinc-900 font-sentient"
            triggerOnView={true}
            viewThreshold={0.5}
          >
            Revealed
          </DrawingHeadline>
          <div className="h-[30vh]" />
        </section>

        {/* Technical notes */}
        <section className="mt-24 p-8 bg-zinc-200/50 rounded-2xl">
          <h2 className="text-2xl font-sentient mb-4">Implementation Notes</h2>
          <ul className="space-y-3 text-zinc-600">
            <li>
              <strong>Animation sequence:</strong>
              <ol className="ml-4 mt-1 space-y-1 text-sm list-decimal list-inside">
                <li>Grid lines draw in (staggered)</li>
                <li>Stroke reveals left-to-right via SVG mask</li>
                <li>Fill fades in</li>
                <li>Grid lines fade out (staggered)</li>
              </ol>
            </li>
            <li>
              <strong>Performance:</strong> GPU-accelerated CSS animations with{" "}
              <code className="bg-zinc-300/50 px-1.5 py-0.5 rounded text-sm">
                will-change
              </code>{" "}
              hints
            </li>
            <li>
              <strong>Accessibility:</strong> Original text preserved in{" "}
              <code className="bg-zinc-300/50 px-1.5 py-0.5 rounded text-sm">
                sr-only
              </code>{" "}
              for screen readers
            </li>
            <li>
              <strong>Font support:</strong> Works with any font including
              Sentient variable font
            </li>
            <li>
              <strong>Grid lines:</strong> Draws baseline, x-height, cap-height,
              and ascender lines
            </li>
            <li>
              <strong>Trigger options:</strong> IntersectionObserver for scroll
              trigger or manual control
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
