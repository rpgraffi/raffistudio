"use client";

import { createSeededRandom, stringToSeed } from "@/lib/utils";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

interface PencilStrokeProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  deviation?: number;
  frequency?: number;
  opacity?: number;
  seed?: number;
  as?: React.ElementType;
}

// Dumb SVG component that just renders the stroke for a given width
const PencilStrokeRenderer: React.FC<PencilStrokeProps & { id: string }> = ({
  width = 200,
  height = 10,
  color = "currentColor",
  strokeWidth = 2,
  deviation = 1,
  frequency = 0.05,
  opacity = 0.8,
  seed,
  id,
  className,
  as: Component = "span",
  ...props
}) => {
  const effectiveSeed = useMemo(() => {
    return seed ?? stringToSeed(id);
  }, [seed, id]);

  const pathD = useMemo(() => {
    if (width <= 0) return "";
    const segments = Math.max(2, Math.floor(width * frequency));
    const points: [number, number][] = [];

    const random = createSeededRandom(effectiveSeed);

    const centerY = height / 2;

    points.push([0, centerY]);

    for (let i = 1; i < segments; i++) {
      const x = (i / segments) * width;
      const yOffset = (random() - 0.5) * 2 * deviation;
      points.push([x, centerY + yOffset]);
    }

    points.push([width, centerY]);

    let d = `M ${points[0][0]} ${points[0][1]}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const cp1x = prev[0] + (curr[0] - prev[0]) / 3;
      const cp1y = prev[1];
      const cp2x = prev[0] + (2 * (curr[0] - prev[0])) / 3;
      const cp2y = curr[1];

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr[0]} ${curr[1]}`;
    }

    return d;
  }, [width, height, deviation, frequency, effectiveSeed]);

  if (width <= 0) return null;

  const Tag = Component as any;

  return (
    <Tag
      className={className}
      style={{
        width,
        height,
        display: "inline-flex",
        alignItems: "center",
        overflow: "visible",
        verticalAlign: "top",
        lineHeight: 0, // Reset inherited line-height
        ...(props as any).style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <filter
            id={`${id}-pencil`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <path
          d={pathD}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}-pencil)`}
          opacity={opacity}
        />

        <path
          d={pathD}
          stroke={color}
          strokeWidth={strokeWidth * 0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${id}-pencil)`}
          opacity={opacity * 0.6}
          style={{ transform: "translateY(0.5px)" }}
        />
      </svg>
    </Tag>
  );
};

// Smart wrapper that handles responsive width if width prop is missing
export const PencilStroke: React.FC<PencilStrokeProps> = (props) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(props.width ?? 0);

  useEffect(() => {
    if (props.width !== undefined) return;

    const element = ref.current;
    if (!element) return;

    // Initial measure
    setMeasuredWidth(element.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setMeasuredWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [props.width]);

  // If fixed width provided, render directly
  if (props.width !== undefined) {
    return <PencilStrokeRenderer id={id} {...props} />;
  }

  // If dynamic, render wrapper to measure, then render SVG
  const Tag = (props.as || "div") as any; // Default to div for responsive containers usually

  return (
    <Tag ref={ref} className={`w-full ${props.className || ""}`}>
      {measuredWidth > 0 && (
        <PencilStrokeRenderer
          id={id}
          {...props}
          width={measuredWidth}
          // Avoid passing "as" to renderer so it doesn't create nested blocks unnecessarily
          // or let renderer simply be a span/div inside
          as="span"
        />
      )}
    </Tag>
  );
};

interface PencilUnderlineProps {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  className?: string;
  href?: string;
  as?: any;
  hover?: boolean;
  deviation?: number;
  frequency?: number;
  seed?: number;
  opacity?: number;
  hoverMode?: "animate" | "appear";
}

export const PencilUnderline: React.FC<PencilUnderlineProps> = ({
  children,
  color,
  thickness = 1.5,
  className = "",
  href,
  as: Component = "span",
  deviation = 1,
  hoverMode = "animate",
  opacity,
  ...props
}) => {
  const id = useId();
  const ref = useRef<HTMLElement>(null);
  const [rects, setRects] = useState<DOMRect[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [isHovered, setIsHovered] = useState(false);

  const measure = () => {
    if (!ref.current) return;

    // Measure font size
    const style = window.getComputedStyle(ref.current);
    const fs = parseFloat(style.fontSize);
    if (!isNaN(fs)) {
      setFontSize(fs);
    }

    // Get all line boxes
    const clientRects = ref.current.getClientRects();
    // Convert to array and filter empty rects
    const rectArray = Array.from(clientRects).filter(
      (r) => r.width > 0 && r.height > 0
    );

    if (rectArray.length === 0) return;
    setRects(rectArray);
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

  const strokes = rects.length > 0 && (
    <span
      className="absolute top-0 left-0 pointer-events-none w-full h-full block"
      aria-hidden="true"
    >
      {rects.map((r, i) => {
        // Better:
        // Just use `transform` to place strokes.
        // If the wrapper is `relative`, and we have a child `absolute left-0 top-0`,
        // that child is at the start of the first line box.
        // So we calculate offset from the first rect.

        const firstRect = rects[0];
        const leftOffset = r.left - firstRect.left;
        const topOffset = r.top - firstRect.top;

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translate(${leftOffset}px, ${
                topOffset + fontSize * 1.25 - 2
              }px)`,
              width: r.width,
              height: 10,
              lineHeight: 0, // Reset inherited line-height to prevent layout shifts
            }}
          >
            <PencilStrokeRenderer
              id={`${id}-${i}`}
              width={r.width}
              height={10}
              color={color}
              strokeWidth={thickness}
              deviation={
                hoverMode === "animate" && isHovered ? deviation * 3 : deviation
              }
              opacity={
                hoverMode === "appear"
                  ? isHovered
                    ? opacity ?? 0.8
                    : 0
                  : opacity ?? 0.8
              }
              {...props}
              // Use a unique seed based on index if not provided, to vary lines
              seed={props.seed ? props.seed + i : undefined}
            />
          </span>
        );
      })}
    </span>
  );

  const content = (
    <>
      {children}
      {strokes}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        ref={ref as any}
        className={`relative inline group no-underline ${className}`}
        style={{ textDecoration: "none" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </a>
    );
  }

  const Tag = Component as any;

  return (
    <Tag
      ref={ref}
      className={`relative inline ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </Tag>
  );
};
