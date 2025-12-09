"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useId, useState } from "react";

export type DoodleShape =
  | "heart"
  | "star"
  | "circle"
  | "sparkle"
  | "swirl"
  | "bulb";

interface AnimatedDoodleProps extends React.SVGProps<SVGSVGElement> {
  shape?: DoodleShape;
  color?: string;
  strokeWidth?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  animate?: boolean;
  animationSpeed?: number; // ms per frame
  drawOnly?: boolean; // if true, does not fill
}

const SHAPES: Record<DoodleShape, string> = {
  heart:
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  circle: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z",
  sparkle:
    "M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z",
  swirl:
    "M20.2 17.6c-1.3 2.1-3.6 3.4-6.2 3.4-4.4 0-8-3.6-8-8s3.6-8 8-8c3.1 0 5.8 1.8 7.1 4.5", // Open path
  bulb: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",
};

export const AnimatedDoodle = ({
  shape = "heart",
  color = "currentColor",
  strokeWidth = 2,
  width = 24,
  height = 24,
  className,
  animate = true,
  animationSpeed = 500,
  style,
  drawOnly = true,
  ...props
}: AnimatedDoodleProps) => {
  const id = useId();
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setSeed((s) => (s + 1) % 100);
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [animate, animationSpeed]);

  const pathD = SHAPES[shape];

  // Base frequency for turbulence.
  // Higher value = more jittery/rougher.
  const baseFrequency = 0.9;
  const numOctaves = 5;
  const scale = 3;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      style={{ overflow: "visible", ...style }}
      {...props}
    >
      <defs>
        <filter
          id={`${id}-doodle`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* Main stroke */}
      <path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-doodle)`}
        opacity={0.9}
        fill={drawOnly ? "none" : "currentColor"}
      />

      {/* Secondary stroke for pencil texture */}
      <path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth * 0.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-doodle)`}
        opacity={0.6}
        fill="none"
        style={{ transform: "translate(0.5px, 0.5px)" }}
      />
    </svg>
  );
};
