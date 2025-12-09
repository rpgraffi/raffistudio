"use client";

import { createSeededRandom } from "@/lib/utils";
import React, { useMemo } from "react";

// Internal size for SVG calculations (scales via CSS)
const CIRCLE_SIZE = 100;

interface PencilCircleProps {
  color?: string;
  seed: number;
  opacity?: number;
  /** How much the circle wobbles (0-1, default 0.15) */
  wobble?: number;
  /** How much to overdraw past the start (0-1 of full circle, default 0.1-0.3 random) */
  overdraw?: number;
}

export const PencilCircle: React.FC<PencilCircleProps> = ({
  color = "currentColor",
  seed,
  opacity = 0.85,
  wobble = 0.15,
  overdraw,
}) => {
  const filterId = `pencil-circle-${seed}`;
  const size = CIRCLE_SIZE;

  const pathD = useMemo(() => {
    // Round to avoid tiny cross-engine float diffs that break hydration
    const round = (value: number) => Math.round(value * 1e4) / 1e4;

    const random = createSeededRandom(seed);
    const strokeWidth = size * 0.1;

    const cx = size / 2;
    const cy = size / 2;
    const radius = (size - strokeWidth * 2) / 2;

    const numPoints = 12;
    const effectiveOverdraw = overdraw ?? 0.1 + random() * 0.25;
    const points: [number, number][] = [];
    const startAngle = random() * Math.PI * 2;
    const tilt = (random() - 0.5) * 0.2;

    for (
      let i = 0;
      i <= numPoints + Math.ceil(effectiveOverdraw * numPoints);
      i++
    ) {
      const t = i / numPoints;
      const angle = startAngle + t * Math.PI * 2;
      const wobbleAmount = wobble * radius;
      const radiusVariation = radius + (random() - 0.5) * wobbleAmount * 2;
      const angleVariation = angle + (random() - 0.5) * 0.15;
      const x = round(cx + radiusVariation * Math.cos(angleVariation + tilt));
      const y = round(cy + radiusVariation * Math.sin(angleVariation + tilt));
      points.push([x, y]);
    }

    if (points.length < 2) return "";

    let d = `M ${points[0][0]} ${points[0][1]}`;

    for (let i = 1; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const endX = round((curr[0] + next[0]) / 2);
      const endY = round((curr[1] + next[1]) / 2);
      d += ` Q ${curr[0]} ${curr[1]}, ${endX} ${endY}`;
    }

    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    d += ` Q ${secondLast[0]} ${secondLast[1]}, ${last[0]} ${last[1]}`;

    return d;
  }, [seed, wobble, overdraw]);

  const padding = size * 0.4;
  const viewSize = size + padding * 2;

  return (
    <svg
      viewBox={`${-padding} ${-padding} ${viewSize} ${viewSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        display: "block",
      }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <path
        d={pathD}
        stroke={color}
        strokeWidth={size * 0.15}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
        opacity={opacity}
      />
    </svg>
  );
};

// ============================================================================
// List Components
// ============================================================================

// Default seed for consistent rendering
const DEFAULT_SEED = 12345;

interface PencilListItemProps {
  children: React.ReactNode;
  className?: string;
  bulletColor?: string;
  index?: number;
}

const PencilListItem: React.FC<PencilListItemProps> = ({
  children,
  className = "",
  bulletColor,
  index = 0,
}) => {
  // Deterministic seed based on index
  const circleSeed = DEFAULT_SEED + index * 7919; // Prime number for good distribution

  return (
    <li
      className={`flex items-start gap-[0.4em] ${className}`}
      style={{ listStyle: "none" }}
    >
      {/* Bullet size is 1em = same as text size */}
      <span
        className="shrink-0 mt-[0.35em]"
        style={{ width: "1em", height: "1em" }}
      >
        <PencilCircle color={bulletColor} seed={circleSeed} />
      </span>
      <span className="flex-1">{children}</span>
    </li>
  );
};

// ============================================================================
// Main List Component
// ============================================================================

interface PencilUnorderedListProps {
  children: React.ReactNode;
  className?: string;
  bulletColor?: string;
}

export const PencilUnorderedList: React.FC<PencilUnorderedListProps> = ({
  children,
  className = "",
  bulletColor,
}) => {
  return (
    <ul
      className={`space-y-[0.25em] ${className}`}
      style={{ listStyle: "none", paddingLeft: 0 }}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        // If child is already a PencilListItem, pass through with index
        if (child.type === PencilListItem) {
          return React.cloneElement(
            child as React.ReactElement<PencilListItemProps>,
            { index, bulletColor }
          );
        }

        // If child is a regular li element, wrap it
        if (child.type === "li") {
          const liChild = child as React.ReactElement<{
            children?: React.ReactNode;
          }>;
          return (
            <PencilListItem key={index} index={index} bulletColor={bulletColor}>
              {liChild.props.children}
            </PencilListItem>
          );
        }

        // For any other children (like plain text or spans), wrap them
        return (
          <PencilListItem key={index} index={index} bulletColor={bulletColor}>
            {child}
          </PencilListItem>
        );
      })}
    </ul>
  );
};

// Export the list item for direct use if needed
export { PencilListItem };
