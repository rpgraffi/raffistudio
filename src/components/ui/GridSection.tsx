import { cn } from "@/lib/utils";
import React from "react";

interface GridSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  gridSize?: number;
  gridColor?: string;
}

export function GridSection({
  children,
  className,
  style,
  gridSize = 32,
  gridColor = "rgba(0,0,0,0.08)",
  ...props
}: GridSectionProps) {
  return (
    <section
      className={cn("relative w-full overflow-hidden bg-background", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${gridSize - 0.5}px ${gridSize - 0.5}px`,
        ...style,
      }}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
