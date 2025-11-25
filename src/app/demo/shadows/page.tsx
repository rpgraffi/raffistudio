"use client";

import ShadowBackground from "@/components/shadows/ShadowBackground";

export default function ShadowsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Example - Random Shadow */}
      <ShadowBackground className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-neutral-800 mix-blend-multiply">
          Random Shadow
        </h1>
        <p className="mt-4 text-neutral-600 mix-blend-multiply text-lg max-w-md text-center">
          Each page load picks a random shadow image. Refresh to see a different
          one.
        </p>
      </ShadowBackground>

      {/* Warm Tone Example */}
      <ShadowBackground
        image="/images/shadows/tree_shadow-01.jpg"
        backgroundColor="#f5f0e8"
        shadowColor="#4a3728"
        className="h-screen flex flex-col items-center justify-center"
      >
        <h1 className="text-6xl font-bold text-amber-900">Warm & Cozy</h1>
        <p className="mt-4 text-amber-800 text-lg max-w-md text-center">
          Custom warm palette with tree shadows. Lower intensity for subtlety.
        </p>
      </ShadowBackground>

      {/* Cool Tone Example */}
      <ShadowBackground
        image="/images/shadows/plant_shadow-05.jpg"
        backgroundColor="#e8f0f5"
        shadowColor="#1a365d"
        windSpeed={0.2}
        className="h-screen flex flex-col items-center justify-center"
      >
        <h1 className="text-6xl font-bold text-blue-900">Cool Breeze</h1>
        <p className="mt-4 text-blue-700 text-lg max-w-md text-center">
          Blue tones with slower wind speed for a calm atmosphere.
        </p>
      </ShadowBackground>

      {/* High Contrast Example */}
      <ShadowBackground
        image="/images/shadows/plant_shadow-03.jpg"
        backgroundColor="#ffffff"
        shadowColor="#000000"
        windSpeed={1}
        windDirection={{ x: 1, y: 0 }}
        className="h-screen flex flex-col items-center justify-center"
      >
        <h1 className="text-6xl font-bold text-black">High Contrast</h1>
        <p className="mt-4 text-neutral-700 text-lg max-w-md text-center">
          Maximum contrast with faster horizontal wind.
        </p>
      </ShadowBackground>
    </main>
  );
}
