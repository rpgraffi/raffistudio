"use client";

import { useLoading } from "@/context/LoadingContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Signature } from "@/components/site/Signature";

const STROKE_DELAYS    = [0.00, 0.25, 1.75, 2.60];
const STROKE_DURATIONS = [0.50, 2.05, 1.10, 0.40];
const HOLD_AFTER       = 0.3;

// The animation ends when the last stroke finishes.
const TOTAL_DURATION = Math.max(
  ...STROKE_DELAYS.map((d, i) => d + STROKE_DURATIONS[i]),
);

export function LoadingScreen() {
  const { isLoading, markLoadingDone } = useLoading();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoading) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      markLoadingDone();
      return;
    }

    timerRef.current = setTimeout(
      markLoadingDone,
      (TOTAL_DURATION + HOLD_AFTER) * 1000,
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoading, markLoadingDone]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-9999 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Signature
            className="w-48 text-zinc-800"
            strokeDelays={STROKE_DELAYS}
            strokeDurations={STROKE_DURATIONS}
            strokeWidth={2}
            easing="cubic-bezier(0.4, 0, 0.2, 1)"
            animate
            triggerOnView={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
