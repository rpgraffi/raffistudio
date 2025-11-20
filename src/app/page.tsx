import { LightProvider } from "@/components/light/LightContext";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8 flex flex-col gap-8 items-center justify-center">
      <LightProvider>
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl font-bold font-sentient">I'm Raffi</h1>
        <p className="text-lg">and love to design and develop digital products.</p>
        <div className="flex gap-4">
          <PencilUnderline href="https://www.linkedin.com/in/raphael-wennmacher/">LinkedIn</PencilUnderline>
          <PencilUnderline href="https://github.com/rpgraffi">GitHub</PencilUnderline>
          <PencilUnderline href="https://www.instagram.com/raffis.insta/">Instagram</PencilUnderline>
        </div>
      </div>
      </LightProvider>
    </main>
  );
}
