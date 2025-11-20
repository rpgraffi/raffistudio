"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function LightRays() {
  const containerRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate angle based on mouse X relative to center
      const centerX = window.innerWidth / 2;
      const xOffset = e.clientX - centerX;
      
      // Max rotation angle (e.g., +/- 30 degrees)
      const maxAngle = 25;
      const progress = xOffset / centerX; // -1 to 1
      const angle = progress * maxAngle;

      // Animate the rotation smoothly
      if (raysRef.current) {
        gsap.to(raysRef.current, {
          rotation: angle,
          duration: 1.5,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div 
        ref={raysRef}
        className="absolute left-[-50%] right-[-50%] top-[-50%] bottom-[-50%] origin-[50%_0%]"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              transparent 0%,
              transparent 3%,
              rgba(255, 255, 255, 0.03) 3.5%,
              rgba(255, 255, 255, 0.06) 4%,
              rgba(255, 255, 255, 0.03) 4.5%,
              transparent 5%,
              transparent 8%,
              rgba(255, 255, 255, 0.02) 8.5%,
              transparent 9%
            )
          `,
          maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
        }}
      />
    </div>
  );
}

