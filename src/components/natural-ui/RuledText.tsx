"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { PencilStroke } from "./PencilStroke";

interface RuledTextProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  deviation?: number;
  seed?: number;
}

export const RuledText: React.FC<RuledTextProps> = ({
  children,
  className = "",
  color = "rgba(0,0,0,0.1)",
  strokeWidth = 1.5,
  opacity = 1,
  deviation = 1,
  seed,
}) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<{ top: number; width: number }[]>([]);

  const measure = () => {
    if (!containerRef.current || !textRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const textRects = textRef.current.getClientRects();

    const newLines: { top: number; width: number }[] = [];
    const seenY = new Set<number>();

    // Sort rects by Y position to process in order
    const sortedRects = Array.from(textRects).sort((a, b) => a.top - b.top);

    sortedRects.forEach((rect) => {
      if (rect.height === 0) return;

      // Filter out rects that are on the same visual line (within 5px)
      const roundedY = Math.round(rect.top);
      const isDuplicate = Array.from(seenY).some(
        (y) => Math.abs(y - roundedY) < 5
      );

      if (isDuplicate) return;

      seenY.add(roundedY);

      // Calculate top position relative to the container
      const top = rect.top - containerRect.top + rect.height - 14;

      newLines.push({
        top,
        width: containerRect.width,
      });
    });

    setLines(newLines);
  };

  useEffect(() => {
    measure();

    // Debounce resize observer
    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measure, 100);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(timeoutId);
    };
  }, [children]);

  return (
    <div ref={containerRef} className={`relative block w-full ${className}`}>
      <span ref={textRef} className="relative z-10">
        {children}
      </span>
      <div className="absolute inset-0 pointer-events-none z-0">
        {lines.map((line, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: line.top,
              width: line.width,
              height: 10,
            }}
          >
            <PencilStroke
              width={line.width}
              height={10}
              color={color}
              strokeWidth={strokeWidth}
              deviation={deviation}
              opacity={opacity}
              seed={seed ? seed + i : undefined}
            />
          </span>
        ))}
      </div>
    </div>
  );
};
