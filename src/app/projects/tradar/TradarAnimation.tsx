"use client";

import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { cn } from "@/lib/utils";
import { useState } from "react";

const STATE_MACHINE = "State Machine";

interface PencilButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
  className?: string;
}

function PencilButton({ onClick, children, color, className }: PencilButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none active:scale-95 transition-transform duration-150",
        className
      )}
    >
      <PencilUnderline color={color} className="text-sm text-zinc-700 hover:text-zinc-900">
        {children}
      </PencilUnderline>
    </button>
  );
}

function TradarRiveInstance({ className }: { className?: string }) {
  const { rive, RiveComponent } = useRive({
    src: "/projects/tradar/rive/tradar.riv",
    stateMachines: STATE_MACHINE,
    autoplay: true,
  });

  const successInput = useStateMachineInput(rive, STATE_MACHINE, "Success");
  const errorInput = useStateMachineInput(rive, STATE_MACHINE, "Error");

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="w-full aspect-square">
        <RiveComponent className="w-full h-full" />
      </div>
      <div className="flex items-center gap-8">
        <PencilButton onClick={() => successInput?.fire()} color="#16a34a">
          Success
        </PencilButton>
        <PencilButton onClick={() => errorInput?.fire()} color="#dc2626">
          Error
        </PencilButton>
      </div>
    </div>
  );
}

interface TradarAnimationProps {
  className?: string;
}

export function TradarAnimation({ className }: TradarAnimationProps) {
  const [instanceKey, setInstanceKey] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <TradarRiveInstance key={instanceKey} className="w-full" />
      <PencilButton onClick={() => setInstanceKey((k) => k + 1)} color="#71717a">
        Reset
      </PencilButton>
    </div>
  );
}
