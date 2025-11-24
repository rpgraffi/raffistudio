"use client";

import ShadowScene from "@/components/shadows/ShadowScene";

export default function ShadowsPage() {
  return (
    <main className="w-full h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none flex items-center justify-center">
        <h1 className="text-4xl font-bold text-neutral-800 mix-blend-multiply opacity-50">
          GPU Plant Shadows
        </h1>
      </div>
      <ShadowScene />
    </main>
  );
}
