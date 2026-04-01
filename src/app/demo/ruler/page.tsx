"use client";

import { GlassRuler } from "@/components/ui/GlassRuler";

const GRADIENTS = [
  "from-rose-400 to-orange-300",
  "from-amber-400 to-yellow-300",
  "from-emerald-400 to-teal-300",
  "from-sky-400 to-blue-300",
  "from-violet-400 to-purple-300",
  "from-pink-400 to-fuchsia-300",
  "from-lime-400 to-green-300",
  "from-cyan-400 to-sky-300",
];

export default function RulerDemoPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-linear-to-br from-amber-50 via-rose-50 to-violet-100">
      <GlassRuler />

      <div className="absolute inset-0 flex flex-col items-center gap-6 p-8 overflow-hidden">
        <div className="mt-6 text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Liquid Glass Ruler
          </h1>
          <p className="text-gray-500 text-sm">
            Drag to move · Scroll to rotate · Grab right edge to pivot
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 max-w-2xl w-full">
          {GRADIENTS.map((g, i) => (
            <div
              key={i}
              className={`h-24 rounded-2xl bg-linear-to-br ${g} flex items-end p-3`}
            >
              <span className="text-white/80 text-xs font-medium">
                Card {i + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="max-w-2xl w-full mt-4 space-y-3">
          <div className="flex gap-4">
            <div className="flex-1 h-16 rounded-xl bg-gray-800 flex items-center justify-center">
              <span className="text-white/70 text-sm">Dark Element</span>
            </div>
            <div className="flex-1 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Light Element</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed px-1">
            Move the ruler over these elements to see the liquid glass effect
            distort the content beneath it. Uses an SVG displacement filter in
            Chrome, with a frosted glass fallback in other browsers.
          </p>
        </div>

        <p className="mt-auto mb-4 text-gray-400 text-xs">
          SVG backdrop-filter with blur fallback
        </p>
      </div>
    </div>
  );
}
