"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export interface FolderProps {
  href: string;
  logo?: React.ReactNode;
  title: string;
  loc_and_time: string;
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

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

function getPatchLayout(index: number, total: number) {
  const maxPerRow = Math.min(total, 4);
  const row = Math.floor(index / maxPerRow);
  const col = index % maxPerRow;

  const availableWidth = 50;
  const spacing = availableWidth / Math.min(total, maxPerRow);
  const rand = seededRandom(index + total * 7);

  const left = 4 + col * spacing + rand * spacing * 0.25;
  const top = 2 + row * 7 + seededRandom(index * 5 + 3) * 3;
  const restRotation = (seededRandom(index * 3 + 13) - 0.5) * 14;

  return { left, top, restRotation };
}

export function Folder({
  href,
  logo,
  title,
  loc_and_time,
  tags,
  patches = [],
  card,
  sheet,
  className,
}: FolderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const isInView = useInView(containerRef, { amount: 0.4 });

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / 600, 1));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isOpen = isTouchDevice ? isInView : isHovered;

  return (
    <Link
      href={href}
      className={cn(
        "relative block w-[90vh] md:w-full max-w-[600px] cursor-pointer",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        className="relative aspect-848/578"
        style={{ perspective: 1200 }}
      >
        {/* Folder Back */}
        <motion.div
          className="absolute inset-0 rounded-3xl sm:rounded-[36px] md:rounded-[48px] bg-white"
          style={{
            boxShadow:
              "0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.1)",
            transformOrigin: "bottom center",
          }}
          animate={{
            rotateX: isOpen ? 3 : 0,
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
            y: isOpen ? "-28%" : "0%",
          }}
          transition={spring}
        >
          {sheet}
        </motion.div>

        {/* Patches — tool icons floating above, staggered */}
        {patches.map((patch, i) => {
          const { left, top, restRotation } = getPatchLayout(i, patches.length);
          return (
            <motion.div
              key={i}
              className="absolute z-20"
              style={{ left: `${left}%`, top: `${top}%` }}
              animate={{
                y: isOpen ? -(50 + i * 18) * scale : 0,
                x: isOpen ? (i % 2 === 0 ? -8 : 8) * scale : 0,
                rotate: isOpen
                  ? (i % 2 === 0 ? -12 : 7)
                  : restRotation,
              }}
              transition={{ ...spring, delay: isOpen ? i * 0.04 : 0 }}
            >
              {patch}
            </motion.div>
          );
        })}

        {/* Card — role card, rotates outward on hover */}
        {card && (
          <motion.div
            className="absolute w-[33%] aspect-7/9 right-[4%] top-[5%] z-20"
            animate={{
              y: isOpen ? -150 * scale : 0,
              x: isOpen ? 12 * scale : 0,
              rotate: isOpen ? 13 : 0,
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
            "rounded-3xl sm:rounded-[36px] md:rounded-[48px] border-t-2 border-white/50",
            "bg-white/80 backdrop-blur-lg",
          )}
          style={{
            transformOrigin: "bottom center",
          }}
          animate={{
            rotateX: isOpen ? -15 : 0,
            boxShadow: isOpen
              ? [
                  "0 -18px 40px rgba(0,0,0,0.12)",
                  "0 -4px 10px rgba(0,0,0,0.08)",
                  "inset 0 8px 8px rgba(255,255,255,0.5)",
                  "inset 0 -4px 4px rgba(0,0,0,0.06)",
                  "inset 0 -12px 12px rgba(0,0,0,0.06)",
                ].join(", ")
              : [
                  "0 -4px 12px rgba(0,0,0,0.06)",
                  "0 -1px 3px rgba(0,0,0,0.08)",
                  "inset 0 8px 8px rgba(255,255,255,0.5)",
                  "inset 0 -4px 4px rgba(0,0,0,0.06)",
                  "inset 0 -12px 12px rgba(0,0,0,0.06)",
                ].join(", "),
          }}
          transition={spring}
        >
          {/* Time & Location */}
          <div className="flex justify-between px-[7%] pt-[7%]">
            <span className="font-mono text-[10px] sm:text-xs md:text-sm uppercase text-foreground/70 tracking-wide">
              {title}
            </span>
            <span className="font-mono text-[10px] sm:text-xs md:text-sm uppercase text-foreground/70 tracking-wide">
              {loc_and_time}
            </span>
          </div>

          {/* Separator */}
          <div className="mx-[7%] my-[4%] h-px bg-foreground/10" />

          {/* Tags */}
          <div className="px-[7%]">
            <p className="font-mono text-[10px] sm:text-xs md:text-sm uppercase text-foreground/70 tracking-wide">
              {tags.join("  ")}
            </p>
          </div>

          {/* Project Logo */}
          {logo && (
            <div
              className="absolute bottom-[10%] left-[7%]"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "bottom left",
              }}
            >
              {logo}
            </div>
          )}
        </motion.div>
      </div>
    </Link>
  );
}
