"use client";

import React, { useState, useRef, useEffect } from "react";
import { Polaroid } from "./Polaroid";
import { gsap } from "gsap";

interface PolaroidItem {
  id: string | number;
  src: string;
  alt: string;
  caption?: string;
}

interface PolaroidStackProps {
  items: PolaroidItem[];
  className?: string;
}

export function PolaroidStack({ items, className = "" }: PolaroidStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const topCardRef = useRef<HTMLDivElement>(null);
  const middleCardRef = useRef<HTMLDivElement>(null);
  const bottomCardRef = useRef<HTMLDivElement>(null);

  // Cycle through items
  const activeItem = items[currentIndex % items.length];
  const nextItem = items[(currentIndex + 1) % items.length];
  const nextNextItem = items[(currentIndex + 2) % items.length];

  // Handle Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!dragStart) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!topCardRef.current) return;
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const rotation = deltaX * 0.05; // Rotate while dragging

      gsap.set(topCardRef.current, {
        x: deltaX,
        y: deltaY,
        rotation: rotation,
      });
      
      // Slight parallax/anticipation for the card behind
      if (middleCardRef.current) {
        const progress = Math.min(Math.abs(deltaX) / 300, 1);
        gsap.set(middleCardRef.current, {
          scale: 0.95 + (0.05 * progress),
          y: 8 - (8 * progress), // 8px is 0.5rem (translate-y-2)
          opacity: 0.8 + (0.2 * progress),
        });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!topCardRef.current) return;
      const deltaX = e.clientX - dragStart.x;
      const threshold = 150; // Swipe threshold

      if (Math.abs(deltaX) > threshold) {
        // Swipe away
        const direction = deltaX > 0 ? 1 : -1;
        const endX = direction * window.innerWidth;
        
        const tl = gsap.timeline({
          onComplete: () => {
            // Reset styles completely before state update to avoid conflicts
            if (topCardRef.current) gsap.set(topCardRef.current, { clearProps: "all" });
            if (middleCardRef.current) gsap.set(middleCardRef.current, { clearProps: "all" });
            if (bottomCardRef.current) gsap.set(bottomCardRef.current, { clearProps: "all" });
            
            setCurrentIndex((prev) => (prev + 1) % items.length);
          }
        });

        tl.to(topCardRef.current, {
          x: endX,
          rotation: direction * 45,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        }, 0);

        if (middleCardRef.current) {
          tl.to(middleCardRef.current, {
            scale: 1,
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.3
          }, 0);
        }

        if (bottomCardRef.current) {
          tl.to(bottomCardRef.current, {
            scale: 0.95,
            y: 8, // translate-y-2
            rotation: -2,
            opacity: 0.8,
            duration: 0.3
          }, 0);
        }

      } else {
        // Reset
        gsap.to(topCardRef.current, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        });
        
        // Reset middle card too
        if (middleCardRef.current) {
           gsap.to(middleCardRef.current, {
             scale: 0.95,
             y: 8,
             opacity: 0.8,
             duration: 0.4
           });
        }
      }

      setDragStart(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragStart, items.length]);

  const handleNext = () => {
    if (!topCardRef.current) return;
    
    const tl = gsap.timeline({
        onComplete: () => {
          if (topCardRef.current) gsap.set(topCardRef.current, { clearProps: "all" });
          if (middleCardRef.current) gsap.set(middleCardRef.current, { clearProps: "all" });
          if (bottomCardRef.current) gsap.set(bottomCardRef.current, { clearProps: "all" });
          setCurrentIndex((prev) => (prev + 1) % items.length);
        }
    });

    tl.to(topCardRef.current, {
      x: 400,
      rotation: 45,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    }, 0);

    if (middleCardRef.current) {
        tl.to(middleCardRef.current, {
            scale: 1,
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.3
        }, 0);
    }
    
    if (bottomCardRef.current) {
        tl.to(bottomCardRef.current, {
            scale: 0.95,
            y: 8,
            rotation: -2,
            opacity: 0.8,
            duration: 0.3
        }, 0);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className={`relative group/stack ${className}`} ref={containerRef}>
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -left-12 -translate-y-1/2 opacity-0 group-hover/stack:opacity-100 transition-opacity duration-300 z-30">
        <button
          onClick={handlePrev}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all cursor-pointer"
        >
          <svg className="w-6 h-6 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-0 group-hover/stack:opacity-100 transition-opacity duration-300 z-30">
        <button
          onClick={handleNext}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all cursor-pointer"
        >
          <svg className="w-6 h-6 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* The Stack */}
      <div className="relative w-72 h-96 mx-auto perspective-1000">
        {/* Background Card (Next Next) */}
        {items.length > 2 && (
          <div
            ref={bottomCardRef}
            className="absolute inset-0 z-0 transform scale-90 translate-y-4 rotate-3 opacity-60 transition-transform duration-0"
          >
             <Polaroid
              src={nextNextItem.src}
              alt={nextNextItem.alt}
              caption={nextNextItem.caption}
            />
          </div>
        )}

        {/* Middle Card (Next) */}
        {items.length > 1 && (
          <div
            ref={middleCardRef}
            className="absolute inset-0 z-10 transform scale-95 translate-y-2 -rotate-2 opacity-80 transition-transform duration-0"
          >
            <Polaroid
              src={nextItem.src}
              alt={nextItem.alt}
              caption={nextItem.caption}
            />
          </div>
        )}

        {/* Top Card (Active) */}
        <div
          ref={topCardRef}
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          <Polaroid
            src={activeItem.src}
            alt={activeItem.alt}
            caption={activeItem.caption}
            onDragStart={handlePointerDown}
          />
        </div>
      </div>
    </div>
  );
}
