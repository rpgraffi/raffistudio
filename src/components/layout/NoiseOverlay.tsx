export default function NoiseOverlay() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.02] mix-blend-lighten"
        style={{
          backgroundImage: "url('/images/textures/Noise_256px.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.05]"
        style={{
          backgroundImage: "url('/images/textures/Noise_256px.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      />
    </>
  );
}
