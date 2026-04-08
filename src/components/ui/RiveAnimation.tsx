"use client";

import { useRive } from "@rive-app/react-canvas";
import { cn } from "@/lib/utils";

interface RiveAnimationProps {
  src: string;
  stateMachine?: string;
  artboard?: string;
  className?: string;
  description?: string;
}

export function RiveAnimation({
  src,
  stateMachine,
  artboard,
  className,
  description,
}: RiveAnimationProps) {
  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    artboard,
    autoplay: true,
  });

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div className="w-full aspect-square">
        <RiveComponent className="w-full h-full" />
      </div>
      {description && (
        <figcaption className="text-center text-sm text-zinc-500 font-sans">
          {description}
        </figcaption>
      )}
    </figure>
  );
}
