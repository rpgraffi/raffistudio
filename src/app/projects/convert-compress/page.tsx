"use client";

import Header from "@/components/Header";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { RuledText } from "@/components/natural-ui/RuledText";
import { ProjectStats } from "@/app/projects/components/ProjectStats";
import ShadowBackground from "@/components/shadows/ShadowBackground";
import { TextureSection } from "@/components/ui/TextureSection";

export default function ConvertCompressPage() {
  return (
    <main className="min-h-screen font-sans relative">
      <ShadowBackground className="min-h-screen flex flex-col">
        <Header />

        {/* Hero Content */}
        <div className="flex-1 w-full max-w-site min-h-screen mx-auto flex flex-col gap-8 px-8 md:px-12 pb-20 pt-32 md:pt-32">
          {/* Top Content Area */}
          <div className="flex-1 flex justify-center items-center min-h-[400px] z-10">
            <div className="font-serif text-3xl md:text-4xl text-zinc-800">
              content slot
            </div>
          </div>

          {/* Bottom Split View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end z-10">
            {/* Left: Title & Links */}
            <div className="md:col-span-5 flex flex-col gap-8">
              <h1 className="text-5xl md:text-7xl text-zinc-900 leading-[1.1] font-sentient">
                Convert 
                <br />
                & Compress
              </h1>

              <div className="flex gap-6">
                <PencilUnderline href="https://apps.apple.com/us/app/convert-compress/id6752861983" className="text-lg text-zinc-800">
                  App Store
                </PencilUnderline>
                <PencilUnderline href="https://convert-compress.com" className="text-lg text-zinc-800">
                  Website
                </PencilUnderline>
                <PencilUnderline href="https://github.com/rpgraffi/convert-compress" className="text-lg text-zinc-800">
                  GitHub
                </PencilUnderline>
              </div>
            </div>

            {/* Spacer */}
            <div className="md:col-span-2 hidden md:block"></div>

            {/* Right: Description */}
            <div className="md:col-span-5">
              <div className="text-xl md:text-2xl text-zinc-800 leading-10 font-normal">
                <RuledText className="leading-10">
                  An open source, small, and native tool for macOS that
                  converts, compresses, and resizes images in batches.
                  <br />
                  All in one pipeline. With a live preview. Native, local &
                  private. Written in swift for macOS.
                </RuledText>
              </div>
            </div>
          </div>
        </div>

        <TextureSection>
          <ProjectStats
            stats={[
              { value: "12.000", label: "Downloads" },
              { value: "4,9", label: "Stars" },
              { value: "122", label: "Reviews" },
              { value: "14", label: "GitHub Stars" },
            ]}
            tools={[
              { src: "/images/texture-icons/figma.webp", alt: "Figma" },
              { src: "/images/texture-icons/dart.webp", alt: "Dart" },
              { src: "/images/texture-icons/flutter.webp", alt: "Flutter" },
              { src: "/images/texture-icons/git.webp", alt: "Git" },
              { src: "/images/texture-icons/github.webp", alt: "GitHub" },
              { src: "/images/texture-icons/docker.webp", alt: "Docker" },
              { src: "/images/texture-icons/python.webp", alt: "Python" },
              { src: "/images/texture-icons/fastapi.webp", alt: "FastAPI" },
              { src: "/images/texture-icons/graphql.webp", alt: "GraphQL" },
              { src: "/images/texture-icons/nginx.webp", alt: "Nginx" },
              { src: "/images/texture-icons/postgres.webp", alt: "PostgreSQL" },
            ]}
          />
        </TextureSection>
      </ShadowBackground>
    </main>
  );
}
