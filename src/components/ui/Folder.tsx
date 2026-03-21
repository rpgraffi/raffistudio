"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

export interface FolderProps {
  href: string;
  logo?: React.ReactNode;
  timeframe: string;
  location: string;
  tags: string[];
  patches?: React.ReactNode[];
  card?: React.ReactNode;
  sheet?: React.ReactNode;
  className?: string;
}

const spring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 26,
};

export function Folder({
  href,
  logo,
  timeframe,
  location,
  tags,
  patches = [],
  card,
  sheet,
  className,
}: FolderProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={cn("relative block w-full cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-848/578" style={{ perspective: 1200 }}>
        {/* Folder Back */}
        <motion.div
          className="absolute inset-0 rounded-[48px] bg-white"
          style={{
            boxShadow:
              "0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.1)",
            transformOrigin: "bottom center",
          }}
          animate={{
            rotateX: isHovered ? 3 : 0,
          }}
          transition={spring}
        ></motion.div>

        {/* Sheet — white paper inside, rises on hover */}
        <motion.div
          className="absolute inset-[9%_7%_10%_6%] bg-white"
          style={{
            boxShadow: "0 0 2px rgba(0,0,0,0.2)",
          }}
          animate={{
            y: isHovered ? "-28%" : "0%",
          }}
          transition={spring}
        >
          {sheet}
        </motion.div>

        {/* Patches — tool icons floating above, staggered */}
        {patches.map((patch, i) => (
          <motion.div
            key={i}
            className="absolute z-20"
            style={{ left: `${5 + i * 24}%`, top: "4%" }}
            animate={{
              y: isHovered ? -(50 + i * 20) : 0,
              x: isHovered ? (i % 2 === 0 ? -6 : 6) : 0,
              rotate: isHovered ? (i % 2 === 0 ? -10 : 5) : 0,
            }}
            transition={{ ...spring, delay: isHovered ? i * 0.04 : 0 }}
          >
            {patch}
          </motion.div>
        ))}

        {/* Card — role card, rotates outward on hover */}
          {card && (
            <motion.div
              className="absolute w-56 h-72 right-[4%] top-[5%] z-20"
              animate={{
                y: isHovered ? -150 : 0,
                x: isHovered ? 12 : 0,
                rotate: isHovered ? 13 : 0,
              }}
              transition={spring}
            >
              {card}
            </motion.div>
          )}

        {/* Folder Front — frosted glass panel, opens on hover */}
        <motion.div
          className={cn(
            "absolute inset-x-0 bottom-0 top-[15%] z-50",
            "rounded-[48px] border-t-2 border-white/50",
            "bg-white/80 backdrop-blur-lg",
          )}
          style={{
            transformOrigin: "bottom center",
            boxShadow: [
              "0 -4px 12px rgba(0,0,0,0.06)",
              "0 -1px 3px rgba(0,0,0,0.08)",
              "inset 0 8px 8px rgba(255,255,255,0.5)",
              "inset 0 -4px 4px rgba(0,0,0,0.06)",
              "inset 0 -12px 12px rgba(0,0,0,0.06)",
            ].join(", "),
          }}
          animate={{
            rotateX: isHovered ? -15 : 0,
          }}
          transition={spring}
        >
          {/* Time & Location */}
          <div className="flex justify-between px-[7%] pt-[7%]">
            <span className="font-mono text-sm uppercase text-foreground/70 tracking-wide">
              {timeframe}
            </span>
            <span className="font-mono text-sm uppercase text-foreground/70 tracking-wide">
              {location}
            </span>
          </div>

          {/* Separator */}
          <div className="mx-[7%] my-[4%] h-px bg-foreground/10" />

          {/* Tags */}
          <div className="px-[7%]">
            <p className="font-mono text-sm uppercase text-foreground/70 tracking-wide">
              {tags.join("  ")}
            </p>
          </div>

          {/* Project Logo */}
          {logo && (
            <div className="absolute bottom-[10%] left-[7%]">{logo}</div>
          )}
        </motion.div>
      </div>
    </Link>
  );
}
