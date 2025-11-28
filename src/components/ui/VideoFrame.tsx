"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Available tesa stripe images
const TESA_STRIPES = [
  "/images/tesa_stripes/tesa_stripe-01.webp",
  "/images/tesa_stripes/tesa_stripe-02.webp",
  "/images/tesa_stripes/tesa_stripe-03.webp",
  "/images/tesa_stripes/tesa_stripe-04.webp",
  "/images/tesa_stripes/tesa_stripe-05.webp",
  "/images/tesa_stripes/tesa_stripe-06.webp",
];

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

// Predefined corner combinations (2-3 corners each)
const CORNER_COMBOS: Corner[][] = [
  ["top-left", "bottom-right"],
  ["top-right", "bottom-left"],
  ["top-left", "top-right"],
  ["top-left", "top-right", "bottom-right"],
  ["top-left", "top-right", "bottom-left"],
];

const CORNER_STYLES: Record<Corner, string> = {
  "top-left": "-top-16 -left-10 -rotate-[35deg] opacity-95",
  "top-right": "-top-16 -right-10 rotate-[35deg] opacity-95",
  "bottom-left": "-bottom-6 -left-10 rotate-[35deg] opacity-95",
  "bottom-right": "-bottom-6 -right-10 -rotate-[35deg] opacity-95",
};

// Simple hash from string
function hash(str: string): number {
  return str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

interface TesaStripeProps {
  position: Corner;
  stripeIndex: number;
}

function TesaStripe({ position, stripeIndex }: TesaStripeProps) {
  return (
    <div
      className={cn(
        "absolute z-20 w-32 h-40 pointer-events-none select-none",
        CORNER_STYLES[position]
      )}
    >
      <Image
        src={TESA_STRIPES[stripeIndex]}
        alt=""
        fill
        className="object-contain drop-shadow-md"
        aria-hidden="true"
      />
    </div>
  );
}

interface VideoFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  description?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  poster?: string;
}

export function VideoFrame({
  src,
  description,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  poster,
  className,
  ...props
}: VideoFrameProps) {
  // Initialize with deterministic hash for server-side rendering
  const [seed, setSeed] = useState(hash(src));

  // Randomize on client mount
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 100000));
  }, []);

  const corners = CORNER_COMBOS[seed % CORNER_COMBOS.length];

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {/* Tesa stripes at selected corners */}
      {corners.map((corner, i) => (
        <TesaStripe
          key={corner}
          position={corner}
          stripeIndex={(seed + i) % TESA_STRIPES.length}
        />
      ))}

      {/* Video container with white border/frame effect */}
      <div className="relative  md:p-4">
        <video
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          poster={poster}
          className="w-full h-auto block"
        />
      </div>

      {/* Optional description */}
      {description && (
        <p className="mt-4 text-sm text-zinc-500 italic text-center font-serif">
          {description}
        </p>
      )}
    </div>
  );
}
