"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface TextMarkerProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  seed?: number;
  opacity?: number;
  // Adjustments
  paddingX?: number; // Horizontal padding for the marker
  paddingY?: number; // Vertical padding (negative to shrink height)
  rotations?: number; // Max rotation angle for the whole stroke
}

// Simple Linear Congruential Generator for stable random numbers
const createLCG = (seed: number) => {
  const m = 2147483648;
  const a = 1103515245;
  const c = 12345;
  let state = seed;

  return () => {
    state = (a * state + c) % m;
    return state / m;
  };
};

const stringToSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

interface MarkerSVGRendererProps {
  width: number;
  height: number;
  color: string;
  id: string;
  seed?: number;
  opacity?: number;
}

const MarkerSVGRenderer: React.FC<MarkerSVGRendererProps> = ({
  width,
  height,
  color,
  id,
  seed,
  opacity = 0.6,
}) => {
  const effectiveSeed = useMemo(() => {
    return seed ?? stringToSeed(id);
  }, [seed, id]);

  const { pathD, transform } = useMemo(() => {
    const random = createLCG(effectiveSeed);

    // Chisel tip logic:
    // We want a shape that is roughly a rectangle but with angled ends.
    // The angle should be somewhat consistent (like holding a pen), but slightly varying.

    // Base slant offset (how angled the tip is)
    const slant = height * 0.3;
    const jitter = height * 0.1;

    // Randomize corners slightly for organic feel
    const tl = {
      x: slant + (random() - 0.5) * jitter,
      y: (random() - 0.5) * jitter,
    };
    const tr = {
      x: width - (random() - 0.5) * jitter,
      y: (random() - 0.5) * jitter,
    };
    const br = {
      x: width - slant + (random() - 0.5) * jitter,
      y: height + (random() - 0.5) * jitter,
    };
    const bl = {
      x: (random() - 0.5) * jitter,
      y: height + (random() - 0.5) * jitter,
    };

    // Create wiggly lines between corners
    // We don't need many segments for a marker, just a slight bow/curve

    // Top edge control points
    const topCp1 = { x: width * 0.3, y: (random() - 0.5) * jitter };
    const topCp2 = { x: width * 0.7, y: (random() - 0.5) * jitter };

    // Bottom edge control points
    const botCp1 = { x: width * 0.7, y: height + (random() - 0.5) * jitter };
    const botCp2 = { x: width * 0.3, y: height + (random() - 0.5) * jitter };

    const d = `
      M ${tl.x} ${tl.y}
      C ${topCp1.x} ${topCp1.y}, ${topCp2.x} ${topCp2.y}, ${tr.x} ${tr.y}
      L ${br.x} ${br.y}
      C ${botCp1.x} ${botCp1.y}, ${botCp2.x} ${botCp2.y}, ${bl.x} ${bl.y}
      Z
    `;

    // Slight overall rotation for the "imperfect placement" feel
    const rotation = (random() - 0.5) * 2; // +/- 1 degree
    const transform = `rotate(${rotation}, ${width / 2}, ${height / 2})`;

    return { pathD: d, transform };
  }, [width, height, effectiveSeed]);

  if (width <= 0 || height <= 0) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        {/* Subtle paper bleed effect */}
        <filter id={`${id}-bleed`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          {/* Optional: Blur slightly for ink spread */}
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
      </defs>
      <path
        d={pathD}
        fill={color}
        transform={transform}
        filter={`url(#${id}-bleed)`}
        opacity={opacity}
      />
    </svg>
  );
};

export const TextMarker: React.FC<TextMarkerProps> = ({
  children,
  color = "#facc15", // Default yellow marker
  className = "",
  seed,
  opacity = 0.6,
  paddingX = 2,
  paddingY = -2, // Slightly smaller than full line height looks better
  rotations = 0,
}) => {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [rects, setRects] = useState<
    { width: number; height: number; left: number; top: number }[]
  >([]);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  const measure = () => {
    if (!ref.current) return;

    const clientRects = ref.current.getClientRects();

    const rectArray = Array.from(clientRects).filter(
      (r) => r.width > 0 && r.height > 0
    );

    if (rectArray.length === 0) return;

    // Use the first rect as the origin reference, since absolute positioning
    // inside a relative inline element usually anchors to the first line box.
    const firstRect = rectArray[0];

    const calculatedRects = rectArray.map((r) => ({
      width: r.width + paddingX * 2,
      height: r.height + paddingY * 2,
      left: r.left - firstRect.left - paddingX,
      top: r.top - firstRect.top - paddingY,
    }));

    setRects(calculatedRects);
  };

  useIsomorphicLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children, paddingX, paddingY]);

  return (
    <span ref={ref} className={`relative inline ${className}`}>
      {/* Render children normally on top */}
      <span className="relative z-10">{children}</span>

      {/* Render markers behind */}
      <span
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      >
        {rects.map((r, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translate(${r.left}px, ${r.top}px)`,
              width: r.width,
              height: r.height,
              // Mix blend mode multiply often looks best for markers on light backgrounds
              mixBlendMode: "multiply",
            }}
          >
            <MarkerSVGRenderer
              id={`${id}-${i}`}
              width={r.width}
              height={r.height}
              color={color}
              seed={seed ? seed + i : undefined}
              opacity={opacity}
            />
          </span>
        ))}
      </span>
    </span>
  );
};
