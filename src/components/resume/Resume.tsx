"use client";

interface ResumeProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  url: string;
  filename?: string;
}

export function Resume({ width, height, className = "", url, filename }: ResumeProps) {
  return (
    <a
      href={url}
      download={filename}
      className={`group relative inline-block perspective-[1000px] ${className}`}
      style={{
        width: width,
        height: height,
      }}
    >
      {/* Background Layer - Acts as the relative anchor for size */}
      <img
        src="/images/resume/Resume.avif"
        alt=""
        className="relative z-0 block w-full h-full object-contain select-none pointer-events-none"
      />
    </a>
  );
}
