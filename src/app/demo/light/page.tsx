"use client";

import { InsetFrame } from "../../../components/light/InsetFrame";
import { LightButton } from "../../../components/light/LightButton";
import { LightCard } from "../../../components/light/LightCard";
import { LightProvider } from "../../../components/light/LightContext";
import { LightRays } from "../../../components/light/LightRays";

export default function LightPOCPage() {
  return (
    <LightProvider>
      <div className="min-h-screen bg-zinc-200 relative overflow-hidden flex flex-col items-center justify-center p-10 gap-10">
        {/* Ambient Light Rays */}
        <LightRays />

        {/* Title */}
        <h1 className="text-4xl font-bold text-zinc-800 z-10 relative">
          Natural Light UI
        </h1>

        {/* Buttons Row */}
        <div className="flex gap-6 z-10">
          <LightButton variant="dark">Dark Button</LightButton>
          <LightButton variant="light">Light Button</LightButton>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 w-full max-w-5xl">
          <LightCard
            title="Project Alpha"
            description="A subtle exploration of light and shadow."
          />
          <LightCard
            title="Project Beta"
            description="Interactive lighting responding to cursor movement."
          />
          <LightCard
            title="Project Gamma"
            description="Depth perception through dynamic shading."
          />
        </div>

        {/* Inset Frame Example */}
        <div className="w-full max-w-2xl z-10 mt-10">
          <InsetFrame>
            <div className="h-64 flex items-center justify-center text-zinc-400">
              Inset Content (Image or Data)
            </div>
          </InsetFrame>
        </div>
      </div>
    </LightProvider>
  );
}
