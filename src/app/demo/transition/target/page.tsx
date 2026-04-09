"use client";

import {
  PageTransitionWrapper,
  TransitionLink,
} from "@/components/PageTransition";

export default function TransitionTarget() {
  return (
    <PageTransitionWrapper>
      <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-12">
        <h1 className="text-5xl font-bold">Target Page</h1>
        <p className="text-lg opacity-60 max-w-md text-center">
          You navigated here using the real page transition. Check if the bloom
          effect played correctly on exit.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="rounded-xl p-6 text-center"
              style={{
                background: `hsl(${i * 90 + 200}, 45%, 88%)`,
                color: `hsl(${i * 90 + 200}, 35%, 25%)`,
              }}
            >
              <div className="text-2xl font-bold mb-1">{(i + 1) * 42}</div>
              <div className="text-sm opacity-60">Metric {i + 1}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <TransitionLink
            href="/demo/transition"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            &larr; Back to demo
          </TransitionLink>
          <TransitionLink
            href="/"
            className="px-6 py-3 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
          >
            Homepage
          </TransitionLink>
        </div>
      </main>
    </PageTransitionWrapper>
  );
}
