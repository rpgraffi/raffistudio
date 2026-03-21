"use client";

import { Patch } from "@/app/projects/components/Patches";
import { LightProvider } from "@/components/light/LightContext";
import { Mail } from "@/components/mail/Mail";
import DrawingHeadline from "@/components/natural-ui/DrawingHeadline";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { PageTransitionWrapper } from "@/components/PageTransition";
import { Folder } from "@/components/ui/Folder";
import { TextureSection } from "@/components/ui/TextureSection";
import { Analytics } from "@vercel/analytics/next";
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
    <PageTransitionWrapper>
      <main className="min-h-screen relative flex flex-col gap-12 items-center justify-center">
        <Analytics />
        <LightProvider>
          <div className="min-h-screen flex flex-col py-12 gap-8 items-center justify-center">
            <DrawingHeadline
              className="text-6xl md:text-8xl text-zinc-800 font-sentient"
              triggerOnView={false}
              animate={true}
              as="h1"
            >
              Hey, I'm Raffi!
            </DrawingHeadline>
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
          </div>

          {/* Projects Section */}
          <section className="w-full max-w-site mx-auto px-8 py-24">
            <div className="flex flex-wrap gap-48 justify-center">
              <Folder
                className="w-full max-w-[600px]"
                href="/projects/convert-compress"
                timeframe="Fall 2025"
                location="Munich"
                tags={["UX Design", "Web Design", "Flows", "Rive", "Animation"]}
                patches={[
                  <Patch
                    key="swift"
                    src="/images/texture-icons/swift.webp"
                    alt="Swift"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="xcode"
                    src="/images/texture-icons/xcode.webp"
                    alt="Xcode"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="github"
                    src="/images/texture-icons/github.webp"
                    alt="GitHub"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                ]}
                card={
                  <Image
                    src="/images/project/work-cards/studio-raffi.webp"
                    alt="Studio Raffi"
                    fill
                    className="object-contain"
                  />
                }
                logo={
                  <div className="h-20 w-60">
                    <Image
                      src="/images/project/logos/convert-compress-logo.svg"
                      alt="Convert & Compress"
                      fill
                      className="object-contain"
                    />
                  </div>
                }
              />
              <Folder
                className="w-full max-w-[600px]"
                href="/projects/lmu-app"
                timeframe="Fall 2025"
                location="Munich"
                tags={["UX Design", "Web Design", "Flows", "Rive", "Animation"]}
                patches={[
                  <Patch
                    key="flutter"
                    src="/images/texture-icons/flutter.webp"
                    alt="Flutter"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="dart"
                    src="/images/texture-icons/dart.webp"
                    alt="Dart"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="github"
                    src="/images/texture-icons/github.webp"
                    alt="GitHub"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="python"
                    src="/images/texture-icons/python.webp"
                    alt="Python"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="docker"
                    src="/images/texture-icons/docker.webp"
                    alt="Docker"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                ]}
                card={
                  <Image
                    src="/images/project/work-cards/lmu.webp"
                    alt="LMU App"
                    fill
                    className="object-contain"
                  />
                }
                logo={
                  <div className="h-20 w-60">
                    <Image
                      src="/images/project/logos/lmu-logo.svg"
                      alt="LMU App"
                      fill
                      className="object-contain"
                    />
                  </div>
                }
              />
              <Folder
                className="w-full max-w-[600px]"
                href="/projects/tradar"
                timeframe="Fall 2025"
                location="Munich"
                tags={["UX Design", "Web Design", "Flows", "Rive", "Animation"]}
                patches={[
                  <Patch
                    key="figma"
                    src="/images/texture-icons/figma.webp"
                    alt="Figma"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="react"
                    src="/images/texture-icons/react.webp"
                    alt="React"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                  <Patch
                    key="github"
                    src="/images/texture-icons/github.webp"
                    alt="GitHub"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />,
                ]}
                card={
                    <Image
                      src="/images/project/work-cards/tradar.webp"
                      alt="TRADAR"
                      fill
                      className="object-contain"
                    />
                }
                logo={
                  <div className="h-20 w-60">
                    <Image
                      src="/images/project/logos/tradar-logo.svg"
                      alt="TRADAR"
                      fill
                      className="object-contain"
                    />
                  </div>
                }
              />
            </div>
          </section>

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
    </PageTransitionWrapper>
  );
}
