"use client";

import React from "react";
import { lightShadows } from "../../app/styles/shadows";
import Image from "next/image";

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
  // For stack interactions
  onDragStart?: (e: React.PointerEvent) => void;
}

export function Polaroid({
  src,
  alt,
  caption,
  className = "",
  style,
  onDragStart,
}: PolaroidProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updatePosition = () => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--card-x", `${rect.left}px`);
      card.style.setProperty("--card-y", `${rect.top}px`);
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
      onPointerDown={onDragStart}
      className={`group relative bg-zinc-100 p-3 pb-8 border border-white/40 select-none ${className}`}
      style={{
        ...style,
        // Default polaroid dimensions or flexible
        aspectRatio: "3.5/4.2",
        // Dynamic Shadow from LightCard
        boxShadow: lightShadows.surface,
      }}
    >
      {/* 1. Global Light Shine (Top Surface) - from LightCard */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
        style={{
          background: `
            linear-gradient(
              calc(180deg + var(--light-angle, 0deg)), 
              rgba(255,255,255,0.6) 0%, 
              transparent 40%
            )
          `,
          mixBlendMode: "soft-light",
        }}
      />

      {/* 2. Mouse Reveal Effect - from LightCard */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `
            radial-gradient(
              600px circle at calc(var(--mouse-x) - var(--card-x)) calc(var(--mouse-y) - var(--card-y)),
              rgba(255,255,255,0.4),
              transparent 40%
            )
          `,
          opacity: 0.5,
        }}
      />

      {/* Inner Image Frame - Adaptation of InsetFrame */}
      <div
        className="relative w-full aspect-square bg-zinc-200 overflow-hidden"
        style={{
          boxShadow: lightShadows.insetDeep,
        }}
      >
        {/* Inner Highlight */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            boxShadow: lightShadows.insetHighlight,
          }}
        />
        
        {/* Image */}
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            draggable={false}
          />
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="mt-4 text-center font-handwriting text-zinc-800/80 font-medium rotate-[-1deg]">
          {caption}
        </div>
      )}
    </div>
  );
}

