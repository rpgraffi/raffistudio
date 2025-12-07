"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React from "react";

interface PatchProps {
  src: string;
  alt: string;
  className?: string;
  rotation?: number;
}

export function Patch({ src, alt, className = "", rotation = 0 }: PatchProps) {
  return (
    <div
      className={`shrink-0 relative ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 96px, 140px"
      />
    </div>
  );
}

interface PatchesRowProps {
  patches: { src: string; alt: string }[];
  className?: string;
}

export const PatchesRow: React.FC<PatchesRowProps> = ({
  patches,
  className = "",
}) => {
  const [emblaRef] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      dragFree: true,
    },
    [Autoplay({ delay: 2000, stopOnMouseEnter: true })]
  );

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden cursor-grab" ref={emblaRef}>
        <div className="flex items-center gap-4 md:gap-8 max-w-site mx-auto justify-center">
          {patches.map((patch, index) => (
            <Patch
              key={index}
              src={patch.src}
              alt={patch.alt}
              rotation={((index * 137) % 15) - 7}
              className="w-24 h-24 md:w-[140px] md:h-[140px] shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
