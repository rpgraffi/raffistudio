"use client";

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
      <Image src={src} alt={alt} fill className="object-contain" />
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
  return (
    <div
      className={`flex items-center gap-4 md:gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide ${className}`}
    >
      {patches.map((patch, index) => (
        <Patch
          key={index}
          src={patch.src}
          alt={patch.alt}
          rotation={((index * 137) % 15) - 7} // Random-ish rotation
          className="w-24 h-24 md:w-[140px] md:h-[140px]"
        />
      ))}
    </div>
  );
};
