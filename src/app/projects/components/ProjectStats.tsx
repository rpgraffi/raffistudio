"use client";

import { Patch, PatchesRow } from "@/app/projects/components/Patches";
import { PencilStroke } from "@/components/natural-ui/PencilStroke";
import { StatsRow } from "@/app/projects/components/Stats";
import Image from "next/image";
import React from "react";

interface RatingRowProps {
  stars: number;
  className?: string;
  downloadUrl?: string;
  downloadImage?: string;
}


export interface ProjectStatsProps {
  stats: { value: string; label: string }[];
  tools: { src: string; alt: string }[];
  rating?: number;
  downloadUrl?: string;
  downloadImage?: string;
  className?: string;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({
  stats,
  tools,
  className = "",
}) => {
  return (
    <section
      className={`w-full max-w-site mx-auto px-8 md:px-12 py-12 flex flex-col gap-12 ${className}`}
    >
      {/* Row 1: Stats */}
      <div className="w-full">
        <StatsRow stats={stats} />
      </div>

      {/* Divider */}
      <div className="w-full overflow-hidden">
        <PencilStroke className="w-full" opacity={0.1} strokeWidth={3} />
      </div>

      {/* Row 2: Tech Stack Patches */}
      <div className="w-full">
        <PatchesRow patches={tools} />
      </div>

      {/* Divider */}
      <div className="w-full overflow-hidden">
        <PencilStroke className="w-full" opacity={0.1} strokeWidth={3} />
      </div>

    </section>
  );
};
