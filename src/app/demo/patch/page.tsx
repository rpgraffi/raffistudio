"use client";

import { LightProvider } from "@/components/light/LightContext";
import { Patch } from "@/components/patch/Patch";
import { PatchFilters } from "@/components/patch/PatchFilters";

export default function PatchDemoPage() {
  return (
    <LightProvider>
      <PatchFilters />
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-12 gap-12">
        <div className="max-w-2xl text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold font-sentient">
            Digital Embroidery
          </h1>
          <p className="text-foreground">
            Procedural patch generation from SVGs/PNGs with real-time light
            interaction.
          </p>
        </div>

        <div className="flex flex-wrap gap-12 items-center justify-center">
          {/* Example 1: Figma Logo Patch */}
          <Patch className="w-64 h-64 rounded-3xl">
            <svg
              viewBox="0 0 38 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 h-32 drop-shadow-lg"
            >
              <path
                d="M19 28.5C19 28.5 19 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38L19 38V28.5Z"
                fill="#1ABCFE"
              />
              <path
                d="M0 47.5C0 42.2533 4.2533 38 9.5 38L19 38L19 47.5C19 52.7467 14.7467 57 9.5 57C4.2533 57 0 52.7467 0 47.5Z"
                fill="#0ACF83"
              />
              <path
                d="M19 0V19L9.5 19C4.2533 19 0 14.7467 0 9.5C0 4.2533 4.2533 0 9.5 0L19 0Z"
                fill="#F24E1E"
              />
              <path
                d="M0 28.5C0 23.2533 4.2533 19 9.5 19L19 19V28.5L19 38L9.5 38C4.2533 38 0 33.7467 0 28.5Z"
                fill="#A259FF"
              />
              <path
                d="M19 0L28.5 0C33.7467 0 38 4.2533 38 9.5C38 14.7467 33.7467 19 28.5 19L19 19V0Z"
                fill="#FF7262"
              />
            </svg>
          </Patch>

          {/* Example 2: Next.js Logo (Black on Dark Fabric) */}
          <Patch className="w-48 h-48 rounded-full">
            <svg
              fill="none"
              height="80"
              viewBox="0 0 394 80"
              width="394"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 text-zinc-100"
            >
              <path
                clipRule="evenodd"
                d="M262 0V68.5227H243.966L198.318 12.3411L198.272 12.4253V68.5227H183V0H201.455L246.727 55.7616V0H262ZM128.818 43.6364V43.2955H144.182V29.1477H113.818V68.5227H128.818V43.6364ZM113.818 0V13.9773H128.818V0H113.818ZM326 25.0568L311.341 43.4659L296.682 25.0568H277.455L302.205 55.5909L277.455 86.125H296.682L311.341 67.7159L326 86.125H345.227L320.477 55.5909L345.227 25.0568H326ZM86 53.2672V68.5227H71V53.2672L32.5022 0H11.6804L65.5707 68.5227H50.9091L0 3.92045V0H18.4091L60.0909 52.892V0H75V53.2672H86ZM363 0H393V13.9773H378V27.2727H393V41.25H378V54.5455H393V68.5227H363V0Z"
                fill="white"
              />
            </svg>
          </Patch>

          {/* Example 3: Simple Shape */}
          <Patch className="w-40 h-56 rounded-md">
            <svg
              viewBox="0 0 24 24"
              className="w-20 h-20 text-yellow-400 fill-current"
            >
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </Patch>
        </div>
      </main>
    </LightProvider>
  );
}
