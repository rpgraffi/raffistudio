"use client";

import React, { useEffect, useRef } from "react";
// PatchFilters is now expected to be rendered in the parent/layout

interface PatchProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function Patch({ children, className = "", intensity = 1 }: PatchProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Track position for local coordinates
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updatePosition = () => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--patch-x", `${rect.left}px`);
      card.style.setProperty("--patch-y", `${rect.top}px`);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group ${className}`}
      style={
        {
          "--patch-x": "0px",
          "--patch-y": "0px",
        } as React.CSSProperties
      }
    >
      {/* Main Content Wrapper - Filter applies to THIS */}
      <div
        className="relative p-6 transition-transform duration-200 ease-out"
        style={{ filter: "url(#patch-generation)" }}
      >
        {children}
      </div>
    </div>
  );
}
