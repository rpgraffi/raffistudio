"use client";

import { Patch } from "@/app/projects/components/Patches";
import { Mail } from "@/components/mail/Mail";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { RuledText } from "@/components/natural-ui/RuledText";
import { PageTransitionWrapper } from "@/components/PageTransition";
import { Folder } from "@/components/ui/Folder";
import { GlassRuler } from "@/components/ui/GlassRuler";
import { TextureSection } from "@/components/ui/TextureSection";
import { Analytics } from "@vercel/analytics/next";
import Image from "next/image";

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
  "webflow",
  "rive",
];

export default function Home() {
  return (
    <PageTransitionWrapper>
      <main className="min-h-screen relative flex flex-col gap-12 items-center">
        <Analytics />
        <GlassRuler />
        <section className="min-h-screen w-full max-w-site mx-auto px-8 py-12 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
            <div className="order-2 lg:order-1 flex flex-col gap-10 items-start">
              <h1 className="text-3xl md:text-5xl font-medium text-zinc-800">
                I love to design and develop digital products.
              </h1>
              <RuledText className="text-lg max-w-xl leading-8">
                Curious, always up to date, and obsessed with the details. I
                understand products holistically, from the user all the way to
                the customer's door, and I build things people actually want to
                buy. Freelancing for 5+ years while studying at LMU Munich.
              </RuledText>
              <div className="flex gap-4">
                <PencilUnderline href="https://github.com/rpgraffi">
                  GitHub
                </PencilUnderline>
                <PencilUnderline href="https://www.linkedin.com/in/raphael-wennmacher/">
                  LinkedIn
                </PencilUnderline>
                <PencilUnderline href="https://www.instagram.com/raffis.insta/">
                  Instagram
                </PencilUnderline>
              </div>
              <div className="flex flex-col md:flex-row gap-12 items-center mt-8">
                <Mail width={100} url="mailto:me@raffi.studio" />
              </div>
            </div>

            <div className="order-1 lg:order-2 w-full h-[45vh] sm:h-[55vh] lg:h-[70vh] relative rounded-2xl overflow-hidden">
              <Image
                src="/images/Profile.webp"
                alt="Portrait of Raffi"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="w-full max-w-site mx-auto px-8 md:py-24">
          <div className="grid grid-cols-1 auto-rows-[90vh] place-items-center md:flex md:flex-wrap md:auto-rows-auto md:justify-center md:gap-48">
            <Folder
              className="w-full"
              href="/projects/convert-compress"
              title="Convert & Compress"
              loc_and_time="Munich • Winter 2025"
              tags={["Development", "UX Design", "Marketing", "macOS"]}
              patches={[
                <Patch
                  key="swift"
                  src="/images/texture-icons/swift.webp"
                  alt="Swift"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="xcode"
                  src="/images/texture-icons/xcode.webp"
                  alt="Xcode"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="github"
                  src="/images/texture-icons/github.webp"
                  alt="GitHub"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="figma"
                  src="/images/texture-icons/figma.webp"
                  alt="Figma"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
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
                <div className="h-20 w-20">
                  <Image
                    src="/images/project/logos/convert_compress-logo.webp"
                    alt="Convert & Compress"
                    fill
                    className="object-contain"
                  />
                </div>
              }
            />
            <Folder
              className="w-full"
              href="/projects/lmu-app"
              title="LMU Students"
              loc_and_time="Munich • Fall 2024"
              tags={["UX Design", "Backend", "Mobile App"]}
              patches={[
                <Patch
                  key="figma"
                  src="/images/texture-icons/figma.webp"
                  alt="Figma"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="flutter"
                  src="/images/texture-icons/flutter.webp"
                  alt="Flutter"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="dart"
                  src="/images/texture-icons/dart.webp"
                  alt="Dart"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="github"
                  src="/images/texture-icons/github.webp"
                  alt="GitHub"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="python"
                  src="/images/texture-icons/python.webp"
                  alt="Python"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="docker"
                  src="/images/texture-icons/docker.webp"
                  alt="Docker"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="postgres"
                  src="/images/texture-icons/postgres.webp"
                  alt="PostgreSQL"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="graphql"
                  src="/images/texture-icons/graphql.webp"
                  alt="GraphQL"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="nginx"
                  src="/images/texture-icons/nginx.webp"
                  alt="Nginx"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
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
                <div className="h-20 w-20">
                  <Image
                    src="/images/project/logos/lmu_app-logo.webp"
                    alt="LMU App"
                    fill
                    className="object-contain"
                  />
                </div>
              }
            />
            <Folder
              className="w-full"
              href="/projects/tradar"
              title="WIP TRADAR"
              loc_and_time="Munich • 2023"
              tags={["UX Design", "Web Design", "Flows", "Animations"]}
              patches={[
                <Patch
                  key="figma"
                  src="/images/texture-icons/figma.webp"
                  alt="Figma"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="react"
                  src="/images/texture-icons/react.webp"
                  alt="React"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />,
                <Patch
                  key="rive"
                  src="/images/texture-icons/rive.webp"
                  alt="Rive"
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
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
      </main>
    </PageTransitionWrapper>
  );
}
