"use client";

import { BlueprintContainer } from "@/components/BlueprintContainer";

export default function BlueprintDemoPage() {
  return (
    <div className="w-full min-h-screen bg-background p-8 flex flex-col gap-8 items-center justify-center">
      <div className="w-full max-w-4xl h-[600px]">
        <BlueprintContainer>
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <h1 className="text-4xl font-bold tracking-wider uppercase">
              System Online
            </h1>
            <div className="w-32 h-32 border-2 border-white/50 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 bg-white/20 rounded-full" />
            </div>
            <p className="text-blue-200 max-w-md">
              INITIALIZING CORE SYSTEMS... <br />
              GRID ALIGNMENT: STABLE <br />
              CONTAINER INTEGRITY: 100%
            </p>
          </div>
        </BlueprintContainer>
      </div>

      <div className="w-full max-w-2xl h-[300px]">
        <BlueprintContainer className="rounded-xl shadow-2xl border border-white/10">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="border border-white/20 p-4 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <span className="text-sm font-mono">MODULE A</span>
            </div>
            <div className="border border-white/20 p-4 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <span className="text-sm font-mono">MODULE B</span>
            </div>
            <div className="col-span-2 border border-white/20 p-4 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <span className="text-sm font-mono">DATA STREAM</span>
            </div>
          </div>
        </BlueprintContainer>
      </div>
    </div>
  );
}
