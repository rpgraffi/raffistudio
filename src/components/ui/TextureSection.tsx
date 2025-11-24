import { cn } from "@/lib/utils";
import React from "react";

interface TextureSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function TextureSection({
  children,
  className,
  style,
  ...props
}: TextureSectionProps) {
  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        backgroundImage: "url(/images/textures/plain-natural-texture-02.avif)",
        backgroundRepeat: "repeat",
        backgroundSize: "600px",
        boxShadow:
          "inset 0 1px 1px 0 rgba(255,255,255,0.5), inset 0 2px 2px 0 rgba(255,255,255,0.5), inset 0 -1px 1px 0 rgba(0,0,0,0.05), 0 2px 2px 0px rgba(0,0,0,0.05), 0 1px 1px 0px rgba(0,0,0,0.1)",
        ...style,
      }}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
