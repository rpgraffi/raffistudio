"use client";

import React, { useEffect, useRef } from "react";

import { lightShadows } from "../../app/styles/shadows";

interface LightCardProps {
  title: string;
  description: string;
  className?: string;
}

export function LightCard({
  title,
  description,
  className = "",
}: LightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      className={`group relative bg-zinc-100 rounded-xl p-6 border border-white/40 overflow-hidden ${className}`}
      style={
        {
          "--card-x": "0px",
          "--card-y": "0px",
          // Dynamic Shadow
          boxShadow: lightShadows.surface,
        } as React.CSSProperties
      }
    >
      {/* 1. Global Light Shine (Top Surface) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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

      {/* 2. Mouse Reveal Effect (Windows 10 style) */}
      <div
        className="absolute inset-0 pointer-events-none"
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

      {/* 3. Border Reveal */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none border border-transparent"
        style={{
          maskImage: `
                linear-gradient(#fff, #fff) padding-box,
                linear-gradient(#fff, #fff)
            `,
          WebkitMaskImage: `
                linear-gradient(#fff, #fff) padding-box,
                linear-gradient(#fff, #fff)
            `,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          background: `
                radial-gradient(
                  300px circle at calc(var(--mouse-x) - var(--card-x)) calc(var(--mouse-y) - var(--card-y)),
                  rgba(255,255,255,0.8),
                  transparent 40%
                )
            `,
        }}
      />

      <h3 className="text-xl font-semibold mb-2 text-zinc-800 relative z-10">
        {title}
      </h3>
      <p className="text-zinc-600 relative z-10">{description}</p>
    </div>
  );
}
