"use client";

import Image from "next/image";
import React from "react";

interface PatchProps {
  src: string;
  alt: string;
  className?: string;
  size?: number;
  rotation?: number;
}

export function Patch({
  src,
  alt,
  className = "",
  size = 64,
  rotation = 0,
}: PatchProps) {
  return (
    <div
      className={`shrink-0 relative ${className}`}
      style={{
        width: size,
        height: size,
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
      className={`flex items-center gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide ${className}`}
    >
      {patches.map((patch, index) => (
        <Patch
          key={index}
          src={patch.src}
          alt={patch.alt}
          rotation={((index * 137) % 15) - 7} // Random-ish rotation
          size={140}
        />
      ))}
    </div>
  );
};
