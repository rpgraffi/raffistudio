import { LightProvider } from "@/components/light/LightContext";
import { Analytics } from "@vercel/analytics/next"
import { Mail } from "@/components/mail/Mail";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { GridSection } from "@/components/ui/GridSection";
import { TextureSection } from "@/components/ui/TextureSection";
import Image from "next/image";

const polaroidItems = [
  {
    id: 1,
    src: "/images/mail/Background.webp",
    alt: "Background",
    caption: "Summer 2023",
  },
  {
    id: 2,
    src: "/images/mail/Top.webp",
    alt: "Top",
    caption: "Adventures",
  },
  {
    id: 3,
    src: "/images/mail/Bottom.webp",
    alt: "Bottom",
    caption: "Chill Vibes",
  },
];

const textureIcons = [
  "figma",
  "blender",
  "openai",
  "flutter",
  "dart",
  "swift",
  "directus",
  "docker",
  "fastapi",
  "firebase",
  "git",
  "github",
  "graphql",
  "nginx",
  "postgres",
  "python",
  "react",
  "tailwind",
  "typescript",
  "unity",
  "unreal",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col gap-12 items-center justify-center">
      <Analytics />
      <LightProvider>
        <div className="min-h-screen flex flex-col py-12 gap-4 items-center justify-center">
          <h1 className="text-4xl font-bold font-sentient">I'm Raffi</h1>
          <p className="text-lg text-center">
            and love to design and develop digital products.
          </p>
          <div className="flex gap-4">
            <PencilUnderline href="https://www.linkedin.com/in/raphael-wennmacher/">
              LinkedIn
            </PencilUnderline>
            <PencilUnderline href="https://github.com/rpgraffi">
              {" "}
              GitHub
            </PencilUnderline>
            <PencilUnderline href="https://www.instagram.com/raffis.insta/">
              Instagram
            </PencilUnderline>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-center mt-8">
            <Mail width={100} url="mailto:hello@raphaelwennmacher.com" />
          </div>
          <div className="flex gap-4">
            <PencilUnderline href="/projects/convert-compress">
              Convert & Compress
            </PencilUnderline>
            <PencilUnderline href="/projects/lmu-app">
              LMU Students
            </PencilUnderline>
          </div>
        </div>

        <TextureSection className="py-12 my-12 flex flex-col items-center justify-center text-center gap-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 p-4 max-w-5xl w-full">
            {textureIcons.map((icon, index) => (
              <div
                key={icon}
                className="relative w-24 h-24 md:w-32 md:h-32 mx-auto"
                style={{
                  transform: `rotate(${((index * 137) % 15) - 7}deg)`,
                }}
              >
                <Image
                  src={`/images/texture-icons/${icon}.webp`}
                  alt={icon}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </TextureSection>
      </LightProvider>
    </main>
  );
}
