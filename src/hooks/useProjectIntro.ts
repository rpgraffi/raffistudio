"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Animation timing constants
const DRAWING_ANIMATION_DURATION = 3000; // Time for DrawingHeadline to complete (ms)
const HEADLINE_MOVE_DELAY = 500; // Extra delay before moving headline (ms)
const BACKGROUND_REVEAL_DELAY = 500; // Time before background fades in (ms)

export interface UseProjectIntroOptions {
  /** Duration for the drawing animation in ms (default: 3000) */
  drawingDuration?: number;
  /** Delay before headline moves after drawing (default: 500) */
  moveDelay?: number;
  /** Delay before background reveals in ms (default: 500) */
  backgroundDelay?: number;
  /** Spring stiffness (default: 50) */
  stiffness?: number;
  /** Spring damping (default: 16) */
  damping?: number;
}

export interface UseProjectIntroReturn {
  /** Current phase of the intro animation */
  introPhase: "drawing" | "moving" | "complete";
  /** Whether the drawing animation should start */
  startDrawing: boolean;
  /** Whether the background should be visible */
  showBackground: boolean;
  /** Offset to center the headline in viewport */
  headlineOffset: { x: number; y: number } | null;
  /** Whether initial positioning is complete (for instant vs spring transition) */
  hasInitialPosition: boolean;
  /** Whether the entire intro is complete */
  isIntroComplete: boolean;
  /** Whether the headline should be centered */
  isHeadlineCentered: boolean;
  /** Ref to attach to the headline container */
  headlineRef: React.RefObject<HTMLDivElement | null>;
  /** Spring animation config for framer-motion */
  springConfig: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
  };
}

/**
 * Hook that manages the project page intro animation.
 * Handles headline centering, drawing animation, and spring movement to final position.
 */
export function useProjectIntro(
  options: UseProjectIntroOptions = {}
): UseProjectIntroReturn {
  const {
    drawingDuration = DRAWING_ANIMATION_DURATION,
    moveDelay = HEADLINE_MOVE_DELAY,
    backgroundDelay = BACKGROUND_REVEAL_DELAY,
    stiffness = 50,
    damping = 16,
  } = options;

  const [introPhase, setIntroPhase] = useState<
    "drawing" | "moving" | "complete"
  >("drawing");
  const [startDrawing, setStartDrawing] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [headlineOffset, setHeadlineOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hasInitialPosition, setHasInitialPosition] = useState(false);
  const headlineRef = useRef<HTMLDivElement>(null);

  // Calculate offset to center the headline in viewport
  useLayoutEffect(() => {
    const calculateOffset = () => {
      if (headlineRef.current) {
        const rect = headlineRef.current.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        setHeadlineOffset({
          x: viewportCenterX - elementCenterX,
          y: viewportCenterY - elementCenterY,
        });
      }
    };

    // Calculate immediately
    calculateOffset();

    // Recalculate on resize
    window.addEventListener("resize", calculateOffset);
    return () => window.removeEventListener("resize", calculateOffset);
  }, []);

  // Mark initial position as set after first offset calculation
  useEffect(() => {
    if (headlineOffset && !hasInitialPosition) {
      // Use requestAnimationFrame to ensure the instant positioning happens first
      requestAnimationFrame(() => {
        setHasInitialPosition(true);
      });
    }
  }, [headlineOffset, hasInitialPosition]);

  // Reveal the shadow background after a short delay (allows WebGL to initialize)
  useEffect(() => {
    const bgTimer = setTimeout(() => {
      setShowBackground(true);
    }, backgroundDelay);

    return () => clearTimeout(bgTimer);
  }, [backgroundDelay]);

  // Start drawing animation after offset is calculated
  useEffect(() => {
    if (!headlineOffset) return;

    const startTimer = setTimeout(() => {
      setStartDrawing(true);
    }, 100);

    return () => clearTimeout(startTimer);
  }, [headlineOffset]);

  // Transition to moving phase after drawing completes
  useEffect(() => {
    if (!startDrawing) return;

    const moveTimer = setTimeout(() => {
      setIntroPhase("moving");
    }, drawingDuration + moveDelay);

    return () => clearTimeout(moveTimer);
  }, [startDrawing, drawingDuration, moveDelay]);

  // Transition to complete phase after move animation
  useEffect(() => {
    if (introPhase !== "moving") return;

    const completeTimer = setTimeout(() => {
      setIntroPhase("complete");
    }, 800); // Spring animation duration

    return () => clearTimeout(completeTimer);
  }, [introPhase]);

  const isIntroComplete = introPhase === "complete";
  const isHeadlineCentered = introPhase === "drawing";

  // Spring animation config for natural movement
  const springConfig = {
    type: "spring" as const,
    stiffness,
    damping,
    mass: 1,
  };

  return {
    introPhase,
    startDrawing,
    showBackground,
    headlineOffset,
    hasInitialPosition,
    isIntroComplete,
    isHeadlineCentered,
    headlineRef,
    springConfig,
  };
}
