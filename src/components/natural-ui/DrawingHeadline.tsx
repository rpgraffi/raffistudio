"use client";

import React, {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

interface DrawingHeadlineProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
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
  lineDelay?: number; // Delay between lines for multiline
  // Trigger options
  triggerOnView?: boolean;
  viewThreshold?: number;
  // Manual trigger
  animate?: boolean;
}

interface LineMetrics {
  text: string;
  width: number;
  height: number;
  top: number;
  left: number;
  baseline: number;
  xHeight: number;
  capHeight: number;
}

interface Metrics {
  lines: LineMetrics[];
  totalWidth: number;
  totalHeight: number;
  fontSize: number;
}

// Extract plain text and explicit breaks from children
function extractTextAndBreaks(children: React.ReactNode): {
  text: string;
  hasExplicitBreaks: boolean;
  explicitLines: string[];
} {
  const segments: string[] = [];
  let currentSegment = "";
  let hasExplicitBreaks = false;

  const processNode = (node: React.ReactNode) => {
    if (typeof node === "string" || typeof node === "number") {
      currentSegment += String(node);
    } else if (isValidElement(node)) {
      if (node.type === "br") {
        hasExplicitBreaks = true;
        if (currentSegment.trim()) {
          segments.push(currentSegment.trim());
        }
        currentSegment = "";
      } else {
        const props = node.props as { children?: React.ReactNode };
        if (props.children) {
          Children.forEach(props.children, processNode);
        }
      }
    } else if (Array.isArray(node)) {
      node.forEach(processNode);
    }
  };

  Children.forEach(children, processNode);

  if (currentSegment.trim()) {
    segments.push(currentSegment.trim());
  }

  return {
    text: segments.join(" "),
    hasExplicitBreaks,
    explicitLines: hasExplicitBreaks ? segments : [],
  };
}

export const DrawingHeadline: React.FC<DrawingHeadlineProps> = ({
  children,
  className = "",
  as: Tag = "span",
  strokeColor = "currentColor",
  fillColor = "currentColor",
  gridColor = "rgba(0,0,0,0.15)",
  strokeWidth = 1.2,
  showGrid = true,
  gridStrokeWidth = 1,
  gridDuration = 0.5,
  strokeDuration = 0.6,
  fillDuration = 0.4,
  gridFadeOutDuration = 0.5,
  gridDelay = 0,
  lineDelay = 0.1,
  triggerOnView = true,
  viewThreshold = 0.3,
  animate: manualAnimate,
}) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [computedLines, setComputedLines] = useState<string[]>([]);
  const [isInView, setIsInView] = useState(!triggerOnView);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extract text content from children
  const { text, hasExplicitBreaks, explicitLines } =
    extractTextAndBreaks(children);

  // Measure and compute line breaks
  const measureAndSplit = useCallback(() => {
    const container = containerRef.current;
    const measureSpan = measureRef.current;
    if (!container || !measureSpan) return;

    const containerWidth = container.offsetWidth;
    const style = window.getComputedStyle(container);
    const fontSize = parseFloat(style.fontSize);

    // If explicit breaks, use those
    if (hasExplicitBreaks && explicitLines.length > 0) {
      setComputedLines(explicitLines);
      return;
    }

    // Word-based splitting
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    // Measure word widths using a temp span
    const tempSpan = document.createElement("span");
    tempSpan.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      font: ${style.font};
      font-size: ${style.fontSize};
      font-family: ${style.fontFamily};
      font-weight: ${style.fontWeight};
      letter-spacing: ${style.letterSpacing};
    `;
    container.appendChild(tempSpan);

    // Measure space width
    tempSpan.textContent = "\u00A0"; // non-breaking space
    const spaceWidth = tempSpan.offsetWidth;

    // Build lines by measuring cumulative width
    const lines: string[] = [];
    let currentLine: string[] = [];
    let currentWidth = 0;

    for (const word of words) {
      tempSpan.textContent = word;
      const wordWidth = tempSpan.offsetWidth;

      const totalWidth =
        currentWidth + (currentLine.length > 0 ? spaceWidth : 0) + wordWidth;

      if (totalWidth > containerWidth && currentLine.length > 0) {
        // Start new line
        lines.push(currentLine.join(" "));
        currentLine = [word];
        currentWidth = wordWidth;
      } else {
        currentLine.push(word);
        currentWidth = totalWidth;
      }
    }

    // Push remaining words
    if (currentLine.length > 0) {
      lines.push(currentLine.join(" "));
    }

    container.removeChild(tempSpan);
    setComputedLines(lines);
  }, [text, hasExplicitBreaks, explicitLines]);

  // Measure line metrics after lines are computed
  useEffect(() => {
    if (!containerRef.current || computedLines.length === 0) return;

    const measureLines = () => {
      const container = containerRef.current;
      if (!container) return;

      const style = window.getComputedStyle(container);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;

      // Typography metrics (approximations)
      const xHeightRatio = 0.73;
      const capHeightRatio = 0.91;
      const baselineRatio = 0.78;

      // Create temp span for measuring each line
      const tempSpan = document.createElement("span");
      tempSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        font: ${style.font};
        font-size: ${style.fontSize};
        font-family: ${style.fontFamily};
        font-weight: ${style.fontWeight};
        letter-spacing: ${style.letterSpacing};
      `;
      container.appendChild(tempSpan);

      const lines: LineMetrics[] = computedLines.map((lineText, i) => {
        tempSpan.textContent = lineText;
        const width = tempSpan.offsetWidth;
        const height = lineHeight;
        const top = i * lineHeight;

        return {
          text: lineText,
          width,
          height,
          top,
          left: 0,
          baseline: height * baselineRatio,
          xHeight: height * (1 - xHeightRatio * (fontSize / height)),
          capHeight: height * (1 - capHeightRatio * (fontSize / height)),
        };
      });

      container.removeChild(tempSpan);

      const totalWidth = Math.max(...lines.map((l) => l.width), 0);
      const totalHeight = lines.length * lineHeight;

      setMetrics({
        lines,
        totalWidth,
        totalHeight,
        fontSize,
      });
    };

    requestAnimationFrame(measureLines);
  }, [computedLines]);

  // Initial measurement and resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    measureAndSplit();

    const observer = new ResizeObserver(() => {
      measureAndSplit();
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [measureAndSplit]);

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
  const svgId = `drawing-headline-${id.replace(/:/g, "")}`;

  // Padding for stroke overflow
  const paddingX = strokeWidth * 2;
  const paddingTop = strokeWidth * 2;
  const descenderHeight = metrics ? metrics.fontSize * 0.25 : 0;
  const paddingBottom = strokeWidth * 2 + descenderHeight;

  if (!metrics || metrics.lines.length === 0) {
    return (
      <Tag ref={containerRef as any} className={`${className} relative`}>
        {/* Invisible text for initial measurement */}
        <span ref={measureRef} className="invisible block">
          {children}
        </span>
      </Tag>
    );
  }

  const svgWidth = metrics.totalWidth + paddingX * 2;
  const svgHeight = metrics.totalHeight + paddingTop + paddingBottom;

  return (
    <Tag
      ref={containerRef as any}
      className={`${className} relative`}
      style={{ lineHeight: 1.2 }}
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
          {/* Masks and clipPaths for each line */}
          {metrics.lines.map((line, i) => {
            const y = paddingTop + line.top + line.baseline;
            const x = paddingX + line.left;

            return (
              <React.Fragment key={i}>
                {/* ClipPath for inner stroke - clips stroke to text shape */}
                <clipPath id={`${svgId}-text-clip-${i}`}>
                  <text x={x} y={y} style={{ font: "inherit" }}>
                    {line.text}
                  </text>
                </clipPath>

                {/* Reveal mask for stroke animation */}
                <mask id={`${svgId}-reveal-mask-${i}`}>
                  <rect
                    x={paddingX + line.left}
                    y={paddingTop + line.top}
                    width={line.width}
                    height={line.height + descenderHeight}
                    fill="white"
                    className={`${svgId}-mask-rect-${i} ${
                      shouldAnimate ? "animate" : ""
                    }`}
                  />
                </mask>

                {/* Grid wipe mask */}
                <mask id={`${svgId}-grid-wipe-mask-${i}`}>
                  <rect
                    x={paddingX + line.left}
                    y={paddingTop + line.top}
                    width={line.width}
                    height={line.height + descenderHeight}
                    fill="white"
                    className={`${svgId}-grid-mask-rect-${i} ${
                      shouldAnimate ? "animate" : ""
                    }`}
                  />
                </mask>
              </React.Fragment>
            );
          })}

          <style>
            {metrics.lines
              .map((line, i) => {
                const lineGridDelay = gridDelay + i * lineDelay;
                const lineStrokeDelay =
                  lineGridDelay + (showGrid ? gridDuration : 0);
                const lineFillDelay = lineStrokeDelay + strokeDuration;
                const lineGridFadeOutDelay = lineFillDelay + fillDuration + 0.2;

                return `
              /* Line ${i} animations */
              @keyframes ${svgId}-draw-grid-${i} {
                from { stroke-dashoffset: ${line.width}; }
                to { stroke-dashoffset: 0; }
              }
              
              .${svgId}-grid-line-${i} {
                stroke-dasharray: ${line.width};
                stroke-dashoffset: ${line.width};
                will-change: stroke-dashoffset;
              }
              
              .${svgId}-grid-line-${i}.animate {
                animation: ${svgId}-draw-grid-${i} ${gridDuration}s ease-out forwards;
                animation-delay: ${lineGridDelay}s;
              }
              
              @keyframes ${svgId}-grid-wipe-out-${i} {
                from { transform: translateX(0); }
                to { transform: translateX(100%); }
              }
              
              .${svgId}-grid-mask-rect-${i} {
                will-change: transform;
              }
              
              .${svgId}-grid-mask-rect-${i}.animate {
                animation: ${svgId}-grid-wipe-out-${i} ${gridFadeOutDuration}s ease-in-out ${lineGridFadeOutDelay}s forwards;
              }
              
              @keyframes ${svgId}-reveal-mask-${i} {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
              }
              
              .${svgId}-mask-rect-${i} {
                transform-origin: left center;
                transform: scaleX(0);
              }
              
              .${svgId}-mask-rect-${i}.animate {
                animation: ${svgId}-reveal-mask-${i} ${strokeDuration}s cubic-bezier(0.22, 1, 0.36, 1) ${lineStrokeDelay}s forwards;
              }
              
              @keyframes ${svgId}-fill-in-${i} {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              .${svgId}-text-fill-${i} {
                opacity: 0;
                will-change: opacity;
              }
              
              .${svgId}-text-fill-${i}.animate {
                animation: ${svgId}-fill-in-${i} ${fillDuration}s ease-out ${lineFillDelay}s forwards;
              }
            `;
              })
              .join("\n")}
          </style>
        </defs>

        {/* Render each line */}
        {metrics.lines.map((line, i) => {
          const y = paddingTop + line.top + line.baseline;
          const x = paddingX + line.left;

          return (
            <g key={i}>
              {/* Grid lines for this line */}
              {showGrid && (
                <g mask={`url(#${svgId}-grid-wipe-mask-${i})`}>
                  {/* Baseline */}
                  <line
                    x1={x}
                    y1={paddingTop + line.top + line.baseline}
                    x2={x + line.width}
                    y2={paddingTop + line.top + line.baseline}
                    stroke={gridColor}
                    strokeWidth={gridStrokeWidth}
                    className={`${svgId}-grid-line-${i} ${
                      shouldAnimate ? "animate" : ""
                    }`}
                  />
                  {/* x-height line */}
                  <line
                    x1={x}
                    y1={paddingTop + line.top + line.xHeight}
                    x2={x + line.width}
                    y2={paddingTop + line.top + line.xHeight}
                    stroke={gridColor}
                    strokeWidth={gridStrokeWidth}
                    className={`${svgId}-grid-line-${i} ${
                      shouldAnimate ? "animate" : ""
                    }`}
                    style={{
                      animationDelay: `${gridDelay + i * lineDelay + 0.1}s`,
                    }}
                  />
                  {/* Cap-height line */}
                  <line
                    x1={x}
                    y1={paddingTop + line.top + line.capHeight}
                    x2={x + line.width}
                    y2={paddingTop + line.top + line.capHeight}
                    stroke={gridColor}
                    strokeWidth={gridStrokeWidth}
                    className={`${svgId}-grid-line-${i} ${
                      shouldAnimate ? "animate" : ""
                    }`}
                    style={{
                      animationDelay: `${gridDelay + i * lineDelay + 0.2}s`,
                    }}
                  />
                  {/* Top line (ascender) */}
                  <line
                    x1={x}
                    y1={paddingTop + line.top + 2}
                    x2={x + line.width}
                    y2={paddingTop + line.top + 2}
                    stroke={gridColor}
                    strokeWidth={gridStrokeWidth}
                    className={`${svgId}-grid-line-${i} ${
                      shouldAnimate ? "animate" : ""
                    }`}
                    style={{
                      animationDelay: `${gridDelay + i * lineDelay + 0.3}s`,
                    }}
                  />
                </g>
              )}

              {/* Stroke layer with inner stroke (clipped to text shape) */}
              <g
                clipPath={`url(#${svgId}-text-clip-${i})`}
                mask={`url(#${svgId}-reveal-mask-${i})`}
              >
                <text
                  x={x}
                  y={y}
                  style={{ font: "inherit" }}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth * 2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {line.text}
                </text>
              </g>

              {/* Fill layer that fades in after stroke */}
              <text
                x={x}
                y={y}
                className={`${svgId}-text-fill-${i} ${
                  shouldAnimate ? "animate" : ""
                }`}
                style={{ font: "inherit" }}
                fill={fillColor}
              >
                {line.text}
              </text>
            </g>
          );
        })}
      </svg>
    </Tag>
  );
};

export default DrawingHeadline;
