"use client";

import React, { useEffect, useId, useRef, useState } from "react";

interface DrawingHeadlineProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  strokeColor?: string;
  fillColor?: string;
  gridColor?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  gridStrokeWidth?: number;
  // Animation timing (in seconds)
  gridDuration?: number;
  strokeDuration?: number;
  fillDuration?: number;
  gridFadeOutDuration?: number;
  gridDelay?: number;
  // Trigger options
  triggerOnView?: boolean;
  viewThreshold?: number;
  // Manual trigger
  animate?: boolean;
}

interface TextMetrics {
  width: number;
  height: number;
  baseline: number;
  xHeight: number;
  capHeight: number;
  fontSize: number;
}

export const DrawingHeadline: React.FC<DrawingHeadlineProps> = ({
  children,
  className = "",
  as: Tag = "h1",
  strokeColor = "currentColor",
  fillColor = "currentColor",
  gridColor = "rgba(0,0,0,0.15)",
  strokeWidth = 1.5,
  showGrid = true,
  gridStrokeWidth = 1,
  gridDuration = 0.6,
  strokeDuration = 1.2,
  fillDuration = 0.4,
  gridFadeOutDuration = 0.5,
  gridDelay = 0,
  triggerOnView = true,
  viewThreshold = 0.3,
  animate: manualAnimate,
}) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<TextMetrics | null>(null);
  const [isInView, setIsInView] = useState(!triggerOnView);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Measure text metrics
  useEffect(() => {
    if (!containerRef.current) return;

    const measureText = () => {
      const container = containerRef.current;
      if (!container) return;

      // Create a temporary element to measure
      const temp = document.createElement("span");
      temp.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        font: inherit;
      `;
      temp.textContent = children;
      container.appendChild(temp);

      const style = window.getComputedStyle(temp);
      const fontSize = parseFloat(style.fontSize);
      const rect = temp.getBoundingClientRect();

      // Typography metrics (approximations based on typical font ratios)
      // These work well for most serif/display fonts like Sentient
      const xHeightRatio = 0.73;
      const capHeightRatio = 0.91;
      const baselineRatio = 0.78;

      container.removeChild(temp);

      setMetrics({
        width: rect.width,
        height: rect.height,
        fontSize,
        baseline: rect.height * baselineRatio,
        xHeight: rect.height * (1 - xHeightRatio * (fontSize / rect.height)),
        capHeight:
          rect.height * (1 - capHeightRatio * (fontSize / rect.height)),
      });
    };

    measureText();

    const observer = new ResizeObserver(measureText);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [children]);

  // Intersection observer for triggering animation
  useEffect(() => {
    if (!triggerOnView || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsInView(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: viewThreshold }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [triggerOnView, viewThreshold, hasAnimated]);

  const shouldAnimate = manualAnimate ?? isInView;

  // Calculate animation delays
  const strokeDelay = gridDelay + (showGrid ? gridDuration : 0);
  const fillDelay = strokeDelay + strokeDuration;
  // Grid fades out after fill animation completes
  const gridFadeOutDelay = fillDelay + fillDuration + 0.2;

  const svgId = `drawing-headline-${id.replace(/:/g, "")}`;

  if (!metrics) {
    // Render invisible placeholder for measurement
    return (
      <Tag ref={containerRef as any} className={`${className} relative`}>
        <span className="invisible">{children}</span>
      </Tag>
    );
  }

  // Padding for stroke overflow
  // Extra bottom padding for descenders (y, p, g, q, j go below baseline)
  const paddingX = strokeWidth * 2;
  const paddingTop = strokeWidth * 2;
  // Descenders typically extend ~25% of font size below baseline
  const descenderHeight = metrics.fontSize * 0.25;
  const paddingBottom = strokeWidth * 2 + descenderHeight;

  const svgWidth = metrics.width + paddingX * 2;
  const svgHeight = metrics.height + paddingTop + paddingBottom;

  return (
    <Tag
      ref={containerRef as any}
      className={`${className} relative`}
      style={{ lineHeight: 1 }}
    >
      {/* Hidden text for accessibility and SEO */}
      <span className="sr-only">{children}</span>

      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
        style={{
          marginLeft: -paddingX,
          marginTop: -paddingTop,
          marginBottom: -paddingBottom,
          display: "block",
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Mask for text stroke reveal animation */}
          <mask id={`${svgId}-reveal-mask`}>
            <rect
              x={paddingX}
              y={0}
              width={metrics.width}
              height={svgHeight}
              fill="white"
              className={`${svgId}-mask-rect ${shouldAnimate ? "animate" : ""}`}
            />
          </mask>

          {/* Mask for grid wipe-out animation */}
          <mask id={`${svgId}-grid-wipe-mask`}>
            <rect
              x={paddingX}
              y={0}
              width={metrics.width}
              height={svgHeight}
              fill="white"
              className={`${svgId}-grid-mask-rect ${
                shouldAnimate ? "animate" : ""
              }`}
            />
          </mask>

          <style>
            {`
              /* Grid line draw-in animation (left to right) */
              @keyframes ${svgId}-draw-grid {
                from { stroke-dashoffset: var(--grid-length); }
                to { stroke-dashoffset: 0; }
              }
              
              .${svgId}-grid-line {
                stroke-dasharray: var(--grid-length);
                stroke-dashoffset: var(--grid-length);
                will-change: stroke-dashoffset;
              }
              
              .${svgId}-grid-line.animate {
                animation: ${svgId}-draw-grid ${gridDuration}s ease-out forwards;
              }
              
              /* Grid mask wipe-out animation (left to right) */
              @keyframes ${svgId}-grid-wipe-out {
                from { transform: translateX(0); }
                to { transform: translateX(100%); }
              }
              
              .${svgId}-grid-mask-rect {
                will-change: transform;
              }
              
              .${svgId}-grid-mask-rect.animate {
                animation: ${svgId}-grid-wipe-out ${gridFadeOutDuration}s ease-in-out ${gridFadeOutDelay}s forwards;
              }
              
              /* Text stroke reveal mask animation */
              @keyframes ${svgId}-reveal-mask {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
              }
              
              /* Fill fade-in animation */
              @keyframes ${svgId}-fill-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              .${svgId}-mask-rect {
                transform-origin: left center;
                transform: scaleX(0);
              }
              
              .${svgId}-mask-rect.animate {
                animation: ${svgId}-reveal-mask ${strokeDuration}s cubic-bezier(0.22, 1, 0.36, 1) ${strokeDelay}s forwards;
              }
              
              .${svgId}-text-stroke {
                fill-opacity: 0;
                will-change: fill-opacity;
              }
              
              .${svgId}-text-fill {
                opacity: 0;
                will-change: opacity;
              }
              
              .${svgId}-text-fill.animate {
                animation: ${svgId}-fill-in ${fillDuration}s ease-out ${fillDelay}s forwards;
              }
            `}
          </style>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="grid-lines" mask={`url(#${svgId}-grid-wipe-mask)`}>
            {/* Baseline */}
            <line
              x1={paddingX}
              y1={paddingTop + metrics.baseline}
              x2={paddingX + metrics.width}
              y2={paddingTop + metrics.baseline}
              stroke={gridColor}
              strokeWidth={gridStrokeWidth}
              className={`${svgId}-grid-line ${shouldAnimate ? "animate" : ""}`}
              style={
                {
                  "--grid-length": metrics.width,
                  animationDelay: `${gridDelay}s`,
                } as React.CSSProperties
              }
            />

            {/* x-height line */}
            <line
              x1={paddingX}
              y1={paddingTop + metrics.xHeight}
              x2={paddingX + metrics.width}
              y2={paddingTop + metrics.xHeight}
              stroke={gridColor}
              strokeWidth={gridStrokeWidth}
              className={`${svgId}-grid-line ${shouldAnimate ? "animate" : ""}`}
              style={
                {
                  "--grid-length": metrics.width,
                  animationDelay: `${gridDelay + 0.1}s`,
                } as React.CSSProperties
              }
            />

            {/* Cap-height line */}
            <line
              x1={paddingX}
              y1={paddingTop + metrics.capHeight}
              x2={paddingX + metrics.width}
              y2={paddingTop + metrics.capHeight}
              stroke={gridColor}
              strokeWidth={gridStrokeWidth}
              className={`${svgId}-grid-line ${shouldAnimate ? "animate" : ""}`}
              style={
                {
                  "--grid-length": metrics.width,
                  animationDelay: `${gridDelay + 0.2}s`,
                } as React.CSSProperties
              }
            />

            {/* Top line (ascender) */}
            <line
              x1={paddingX}
              y1={paddingTop + 2}
              x2={paddingX + metrics.width}
              y2={paddingTop + 2}
              stroke={gridColor}
              strokeWidth={gridStrokeWidth}
              className={`${svgId}-grid-line ${shouldAnimate ? "animate" : ""}`}
              style={
                {
                  "--grid-length": metrics.width,
                  animationDelay: `${gridDelay + 0.3}s`,
                } as React.CSSProperties
              }
            />
          </g>
        )}

        {/* Stroke layer with reveal mask */}
        <text
          x={paddingX}
          y={paddingTop + metrics.baseline}
          className={`${svgId}-text-stroke`}
          style={{ font: "inherit" }}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask={`url(#${svgId}-reveal-mask)`}
        >
          {children}
        </text>

        {/* Fill layer that fades in after stroke */}
        <text
          x={paddingX}
          y={paddingTop + metrics.baseline}
          className={`${svgId}-text-fill ${shouldAnimate ? "animate" : ""}`}
          style={{ font: "inherit" }}
          fill={fillColor}
        >
          {children}
        </text>
      </svg>
    </Tag>
  );
};

// Variant for multi-line headlines
interface DrawingHeadlineMultilineProps
  extends Omit<DrawingHeadlineProps, "children"> {
  lines: string[];
  lineDelay?: number; // Delay between each line
}

export const DrawingHeadlineMultiline: React.FC<
  DrawingHeadlineMultilineProps
> = ({ lines, lineDelay = 0.3, gridDelay = 0, ...props }) => {
  return (
    <div className="flex flex-col">
      {lines.map((line, index) => (
        <DrawingHeadline
          key={index}
          {...props}
          gridDelay={gridDelay + index * lineDelay}
        >
          {line}
        </DrawingHeadline>
      ))}
    </div>
  );
};

export default DrawingHeadline;
