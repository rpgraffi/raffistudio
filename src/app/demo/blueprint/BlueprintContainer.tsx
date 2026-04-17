"use client";

import React, { useEffect, useRef, useState } from "react";

interface BlueprintContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const BlueprintContainer: React.FC<BlueprintContainerProps> = ({
  children,
  className = "",
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Grid state
  const [gridState, setGridState] = useState({
    majorSize: 100,
    minorSize: 25,
    cols: 1,
    width: 0,
    height: 0,
    isReady: false,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateGrid = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();

      if (width === 0 || height === 0) return;

      // Target major grid size approx 100px
      // We want an integer number of columns to fit the width exactly
      const targetMajorSize = 100;
      const rawCols = width / targetMajorSize;
      // Snap columns to nearest integer (min 1)
      const cols = Math.max(1, Math.round(rawCols));

      // Calculate exact grid sizes to fill width
      const majorSize = width / cols;
      const minorSize = majorSize / 4;

      setGridState({
        majorSize,
        minorSize,
        cols,
        width,
        height,
        isReady: true,
      });
    };

    // Initial calc
    updateGrid();

    const observer = new ResizeObserver(updateGrid);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Colors
  const bgColor = "#0077be";
  const gridColor = "rgba(255,255,255,0.15)";
  const tickColor = "rgba(255,255,255,0.5)";
  const crossColor = "rgba(255,255,255,0.8)";
  const borderColor = "rgba(255,255,255,0.4)";

  const { majorSize, minorSize, width, height, isReady } = gridState;

  // Frame Calculation
  // We want the frame to snap to grid lines.
  // Since grid fits width exactly:
  // 0, minorSize, 2*minorSize ... width are all grid lines.
  // So any padding that is a multiple of minorSize will align the vertical borders.

  // Vertical alignment:
  // Grid starts at top (0).
  // Top border at k * minorSize will align.
  // Bottom border: height is arbitrary.
  // We should snap the frame height to be a multiple of minorSize?
  // Or just let the bottom float?
  // User wants "fluid border".
  // If we stick to grid alignment, the bottom border must be on a grid line.
  // So we calculate a snapped height for the frame.

  const paddingCols = 1; // How many grid cells to inset
  const inset = minorSize * paddingCols; // standard inset

  // If width is very small, reduce inset?
  // But we are scaling grid, so relative inset stays proportional.

  // Snapped Frame Dimensions
  // Width is easy: Container Width - 2 * Inset
  const frameWidth = Math.max(0, width - inset * 2);

  // Height:
  // Available height: height - 2 * inset.
  // Snap to nearest multiple of minorSize
  const rawFrameHeight = Math.max(0, height - inset * 2);
  const heightSteps = Math.floor(rawFrameHeight / minorSize);
  const frameHeight = heightSteps * minorSize;

  // Center vertically within the container?
  // Or fix top inset?
  // If we center, top = (height - frameHeight) / 2.
  // This top might not be on a grid line.
  // We must force top to be on a grid line.
  // Let's use the calculated inset for top, and just let the bottom gap vary?
  // Or center and snap top to nearest grid line?

  // Let's just use fixed top inset = minorSize.
  // Then the frame height determines where the bottom lands (on a grid line).
  // The bottom margin will be whatever is left (>= minorSize).
  const frameTop = minorSize; // First major/minor line
  const frameLeft = minorSize;

  // If frameHeight is 0 or negative, hide?
  const showFrame = isReady && frameWidth > 0 && frameHeight > 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] overflow-hidden flex flex-col ${className}`}
      style={{
        backgroundColor: bgColor,
        color: "white",
        fontFamily: "monospace",
        ...style,
      }}
      {...props}
    >
      {/* Background Grid */}
      {isReady && (
        <>
          {/* Fine Grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, ${gridColor} 1px, transparent 1px),
                linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
              `,
              backgroundSize: `${minorSize}px ${minorSize}px`,
            }}
          />

          {/* Major Grid Crosshairs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='${majorSize}' height='${majorSize}' viewBox='0 0 ${majorSize} ${majorSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='${encodeURIComponent(
                crossColor
              )}' stroke-width='1'%3E%3Cpath d='M${majorSize / 2 - 5} ${
                majorSize / 2
              } H${majorSize / 2 + 5}' /%3E%3Cpath d='M${majorSize / 2} ${
                majorSize / 2 - 5
              } V${majorSize / 2 + 5}' /%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: `${majorSize}px ${majorSize}px`,
              backgroundPosition: "0 0",
            }}
          />
        </>
      )}

      {/* Snapped Frame Container */}
      {showFrame && (
        <div
          className="absolute"
          style={{
            top: frameTop,
            left: frameLeft,
            width: frameWidth,
            height: frameHeight,
            // We use a container div instead of applying border directly
            // to avoid box-sizing issues with absolute children alignment
          }}
        >
          {/* The Border Line */}
          <div
            className="absolute inset-0 border pointer-events-none"
            style={{
              borderColor,
              left: "0",
              top: "0",
              right: "-1px",
              bottom: "-1px",
            }}
          />

          {/* Ticks - Now aligned relative to this container */}

          {/* Top Ticks */}
          <div
            className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, ${tickColor} 1px, transparent 1px)`,
              backgroundSize: `${minorSize}px 100%`,
            }}
          />

          {/* Bottom Ticks */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, ${tickColor} 1px, transparent 1px)`,
              backgroundSize: `${minorSize}px 100%`,
            }}
          />

          {/* Left Ticks */}
          <div
            className="absolute top-0 left-0 bottom-0 w-2 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${tickColor} 1px, transparent 1px)`,
              backgroundSize: `100% ${minorSize}px`,
            }}
          />

          {/* Right Ticks */}
          <div
            className="absolute top-0 right-0 bottom-0 w-2 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${tickColor} 1px, transparent 1px)`,
              backgroundSize: `100% ${minorSize}px`,
            }}
          />

          {/* Corner Decor (Optional - adds to blueprint feel and hides corner overlap) */}
          <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-white" />
          <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-white" />
          <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white" />
          <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-white" />

          {/* Content Area - Inside the frame */}
          <div className="relative w-full h-full overflow-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {children}
          </div>
        </div>
      )}

      {/* Loading / Initial State */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50">
          INITIALIZING...
        </div>
      )}
    </div>
  );
};
