import ShadowBackground from "@/components/shadows/ShadowBackground";

export default function LMUAppPage() {
  return (
    <main className="min-h-screen">
      <ShadowBackground className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-zinc-800 z-10 relative">
          LMU App
        </h1>
      </ShadowBackground>
    </main>
  );
}