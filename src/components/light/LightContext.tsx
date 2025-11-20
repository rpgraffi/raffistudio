"use client";

import React, { createContext, useContext, useEffect } from "react";

interface LightContextType {
  mouseX: number;
  mouseY: number;
  lightAngle: number; // in degrees
  lightSourceX: number; // Normalized -1 to 1 (Mouse X relative to center)
}

const LightContext = createContext<LightContextType>({
  mouseX: 0,
  mouseY: 0,
  lightAngle: 0,
  lightSourceX: 0,
});

export function useLight() {
  return useContext(LightContext);
}

export function LightProvider({ children }: { children: React.ReactNode }) {
  // We remove state updates for mouse movement to prevent re-renders
  // State is initialized with 0 and we only update CSS variables

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const xOffset = e.clientX - centerX;
      const xNorm = xOffset / centerX; // -1 to 1

      // Angle: Ray goes from TopCenter to MouseX.
      // simple approximation: max angle 25deg.
      const angle = xNorm * 25;

      // Update Global CSS variables for performant updates without React render loop
      document.documentElement.style.setProperty(
        "--light-angle",
        `${angle}deg`
      );
      document.documentElement.style.setProperty(
        "--light-source-x",
        `${xNorm}`
      );
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <LightContext.Provider
      value={{ mouseX: 0, mouseY: 0, lightAngle: 0, lightSourceX: 0 }}
    >
      {children}
    </LightContext.Provider>
  );
}
