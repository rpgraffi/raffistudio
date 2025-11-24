"use client";

import Link from "next/link";
import { lightSourceVars } from "../../app/styles/shadows";

interface MailProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  url: string;
}

export function Mail({ width, height, className = "", url }: MailProps) {
  // We use drop-shadow instead of box-shadow to respect the image transparency.
  // To simulate the inset highlight from lightShadows.surface, we use a white drop-shadow
  // on the opposite side (rim light).
  const shadowFilter = `
    drop-shadow(calc(${lightSourceVars.x} * -5px) 4px 10px rgba(0,0,0,0.05))
    drop-shadow(calc(${lightSourceVars.x} * -3px) 3px 5px rgba(0,0,0,0.04))
    drop-shadow(calc(${lightSourceVars.x} * -1px) 1px 1px rgba(0,0,0,0.08))
    drop-shadow(calc(${lightSourceVars.x} * 2px) -1px 0px rgba(255,255,255,0.4))
    drop-shadow(calc(${lightSourceVars.x} * 5px) -2px 2px rgba(255,255,255,0.2))
  `;

  return (
    <Link
      href={url}
      className={`group relative inline-block [perspective:1000px] ${className}`}
      style={{
        width: width,
        height: height,
      }}
    >
      {/* Background Layer - Acts as the relative anchor for size */}
      <img
        src="/images/mail/Background.webp"
        alt=""
        className="relative z-0 block w-full h-full object-contain select-none pointer-events-none"
      />

      {/* Bottom Layer - The pocket */}
      <img
        src="/images/mail/Bottom.webp"
        alt=""
        className="absolute inset-0 z-10 block w-full h-full object-contain select-none pointer-events-none"
        style={{ filter: shadowFilter }}
      />

      {/* Top Layer - The flap */}
      <img
        src="/images/mail/Top.webp"
        alt=""
        className="absolute inset-0 z-20 block w-full h-full object-contain select-none pointer-events-none origin-top transition-transform duration-500 ease-out group-hover:[transform:rotateX(-45deg)]"
        style={{ filter: shadowFilter }}
      />
    </Link>
  );
}
