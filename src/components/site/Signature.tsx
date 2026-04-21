"use client";

import React, { useEffect, useRef, useState } from "react";

interface SignatureProps {
  className?: string;
  strokeWidth?: number;
  /** Drawing speed in viewBox units per second. */
  speed?: number;
  /**
   * Pause between strokes in seconds. Can be negative to make strokes
   * overlap — e.g. -0.3 means the next stroke starts 0.3s before the
   * current one finishes. Only used in sequential mode (when `stagger`
   * is not set).
   */
  gap?: number;
  /**
   * Fixed per-stroke offset in seconds. When set, stroke i starts at
   * `delay + i × stagger` regardless of path lengths — useful for a
   * predictable, length-independent stagger. When omitted, the
   * gap-based sequential mode is used instead.
   */
  stagger?: number;
  /**
   * Absolute start time (in seconds) for each stroke, overriding all
   * other timing calculations. Length must match the number of paths.
   * Takes priority over `stagger` and `gap`.
   */
  strokeDelays?: number[];
  /**
   * Fixed draw duration (in seconds) per stroke, overriding the
   * `length / speed` calculation. Useful when you want each stroke to
   * take a specific amount of time regardless of its path length.
   */
  strokeDurations?: number[];
  /** Initial delay before the first stroke starts, in seconds. */
  delay?: number;
  /** CSS easing applied to every stroke. Defaults to a smooth ink curve. */
  easing?: string;
  /** Force animate regardless of viewport. */
  animate?: boolean;
  /** Start only when the signature enters the viewport. */
  triggerOnView?: boolean;
  viewThreshold?: number;
  title?: string;
}

export const PATHS = [
  "M13.4458 12.9492C1.9458 13.4492 19.9458 59.4492 6.9458 63.9492",
  "M1.007 24.2001C0.445801 -6.55078 33.7854 -0.751221 33.6672 25.4339C33.631 33.4483 19.9658 40.9155 20.0407 40.6552C20.4554 39.2144 33.626 49.609 34.9149 50.6079C40.7966 55.1664 49.9016 61.611 57.7606 58.3723C64.8522 55.4499 67.1152 42.0349 64.7746 35.6499C62.9817 30.7589 51.4464 29.2485 47.4464 36.4492C42.21 45.8756 45.9464 53.4492 52.1548 57.0161C60.4464 61.7799 67.2692 49.7677 65.4464 38.4084C64.245 30.9216 68.7229 55.1547 69.1112 56.5177C76.9272 83.9492 87.9464 59.4492 91.1562 49.7315C93.2138 43.5023 99.4107 0.999998 91.4132 1C81.9464 1 88.4464 58.373 98.4464 58.3723C108.446 58.3717 113.946 45.2407 115.446 19.9485C115.527 18.5875 117.4 1.94847 111.29 1.94847C103.946 1.94847 106.622 43.5259 111.29 53.4382C116.617 64.7513 140.446 37.6924 129.63 33.7448C122.683 31.2093 121.765 61.775 133.446 53.4382",
  "M82.9458 21.9237C94.0975 21.9237 122.647 35.9999 131.101 25.6718C132.155 24.3854 131.186 18.8871 128.847 19.4961C126.629 20.0733 128.053 26.6638 129.386 27.9362C134.08 32.4169 151.77 31.6548 156.037 26.0047",
  "M91.7544 62.6667C95.8473 65.2197 109.036 69.5334 111.446 63.4492",
];

const DEFAULT_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

export const Signature: React.FC<SignatureProps> = ({
  className = "",
  strokeWidth = 2,
  speed = 380,
  gap = 0.08,
  stagger,
  strokeDelays,
  strokeDurations,
  delay = 0,
  easing = DEFAULT_EASING,
  animate: manualAnimate,
  triggerOnView = true,
  viewThreshold = 0.3,
  title = "Raffi",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [lengths, setLengths] = useState<number[] | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [isInView, setIsInView] = useState(!triggerOnView);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const ls = pathRefs.current.map((p) => p?.getTotalLength() ?? 0);
    setLengths(ls);
  }, []);

  useEffect(() => {
    if (!triggerOnView || !svgRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsInView(true);
        });
      },
      { threshold: viewThreshold }
    );
    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, [triggerOnView, viewThreshold]);

  const shouldAnimate = manualAnimate ?? isInView;
  const ready = lengths !== null;

  // CSS transitions only fire when a property *changes*. So we first paint
  // an "undrawn" frame (dashoffset = length), then flip to drawn on the next
  // frame so the browser interpolates between them.
  useEffect(() => {
    if (!ready || !shouldAnimate || prefersReducedMotion) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setDrawing(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [ready, shouldAnimate, prefersReducedMotion]);

  // Build per-stroke start times.
  const delays: number[] = [];
  if (lengths) {
    if (strokeDelays !== undefined) {
      // Manual mode: absolute start time per stroke, no clamping so the
      // caller has full control (negative values start mid-transition).
      lengths.forEach((_, i) => {
        delays.push(strokeDelays[i] ?? 0);
      });
    } else if (stagger !== undefined) {
      // Stagger mode: each stroke starts at a fixed offset from the previous,
      // independent of path lengths.
      lengths.forEach((_, i) => {
        delays.push(Math.max(0, delay + i * stagger));
      });
    } else {
      // Sequential mode: next stroke starts after the previous ends + gap.
      // gap can be negative to create overlap between strokes.
      let cursor = delay;
      for (const len of lengths) {
        delays.push(Math.max(0, cursor));
        cursor += len / speed + gap;
      }
    }
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 158 71"
      fill="none"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {PATHS.map((d, i) => {
        const len = lengths?.[i] ?? 0;
        const duration = strokeDurations?.[i] ?? len / speed;
        const pathDelay = delays[i] ?? 0;

        const isDrawn = prefersReducedMotion || drawing;

        return (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              !ready
                ? { opacity: 0 }
                : {
                    strokeDasharray: len,
                    strokeDashoffset: isDrawn ? 0 : len,
                    transition:
                      !drawing || prefersReducedMotion
                        ? "none"
                        : `stroke-dashoffset ${duration}s ${easing} ${pathDelay}s`,
                  }
            }
          />
        );
      })}
    </svg>
  );
};
