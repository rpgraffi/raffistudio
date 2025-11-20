"use client";

import React, { useEffect, useRef } from "react";
import { lightShadows } from "../../app/styles/shadows";

interface LightButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "light" | "dark";
}

export function LightButton({
  children,
  variant = "light",
  className = "",
  ...props
}: LightButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const updatePosition = () => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty("--btn-x", `${rect.left}px`);
      button.style.setProperty("--btn-y", `${rect.top}px`);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  const isDark = variant === "dark";

  return (
    <button
      ref={buttonRef}
      className={`
        relative px-6 py-3 rounded-lg font-medium transition-transform active:scale-95
        ${isDark ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-800"}
        ${className}
      `}
      style={
        {
          "--btn-x": "0px",
          "--btn-y": "0px",
          boxShadow: isDark ? lightShadows.surfaceDark : lightShadows.surface,
          transition: "background-color 0.3s ease, transform 0.1s ease",
        } as React.CSSProperties
      }
      {...props}
    >
      {/* 1. Global Light Shine (Top Surface) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"
        style={{
          background: `
            linear-gradient(
              calc(180deg + var(--light-angle, 0deg)), 
              rgba(255,255,255,${isDark ? "0.1" : "0.4"}) 0%, 
              transparent 60%
            )
          `,
          mixBlendMode: "soft-light",
        }}
      />

      {/* 2. Mouse Reveal Effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
        style={{
          background: `
            radial-gradient(
              200px circle at calc(var(--mouse-x) - var(--btn-x)) calc(var(--mouse-y) - var(--btn-y)),
              rgba(255,255,255,${isDark ? "0.1" : "0.4"}),
              transparent 40%
            )
          `,
          opacity: 0.5,
        }}
      />

      <span className="relative z-10">{children}</span>
    </button>
  );
}
