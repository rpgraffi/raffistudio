"use client";

import {
  ProjectContent,
  ProjectHeading,
  ProjectSection,
  ProjectSectionContent,
  ProjectSubHeading,
  ProjectText,
  ProjectTextBlock,
} from "@/app/projects/components/ProjectContent";
import { ProjectStats } from "@/app/projects/components/ProjectStats";
import Header from "@/components/Header";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { RuledText } from "@/components/natural-ui/RuledText";
import { TextMarker } from "@/components/natural-ui/TextMarker";
import ShadowBackground from "@/components/shadows/ShadowBackground";
import { GridSection } from "@/components/ui/GridSection";
import { StarRating } from "@/components/ui/StarRating";
import { TextureSection } from "@/components/ui/TextureSection";
import { VideoFrame } from "@/components/ui/VideoFrame";
import Image from "next/image";
import Link from "next/link";

export default function ConvertCompressPage() {
  return (
    <main className="min-h-screen font-sans relative">
      <ShadowBackground className="min-h-screen flex flex-col">
        <Header />

        {/* Hero Content */}
        <div className="flex-1 w-full max-w-site min-h-screen mx-auto flex flex-col gap-8 px-8 md:px-12 pb-20 pt-32 md:pt-32">
          {/* Top Content Area */}
          <div className="flex-1 min-h-[200px] flex justify-center items-center z-10">
            <Image
              src="/images/projects/convert-compress/hero.webp"
              alt="Convert & Compress"
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Bottom Split View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 z-10">
            {/* Left: Title & Links */}
            <div className="md:col-span-5 flex flex-col justify-between gap-8">
              <h1 className="text-5xl md:text-7xl text-zinc-900 leading-[1.1] font-sentient">
                Convert &
                <br />
                Compress
              </h1>

              <div className="flex gap-6">
                <PencilUnderline
                  href="https://apps.apple.com/us/app/convert-compress/id6752861983"
                  className="text-lg text-zinc-800"
                >
                  App Store
                </PencilUnderline>
                <PencilUnderline
                  href="https://convert-compress.com"
                  className="text-lg text-zinc-800"
                >
                  Website
                </PencilUnderline>
                <PencilUnderline
                  href="https://github.com/rpgraffi/convert-compress"
                  className="text-lg text-zinc-800"
                >
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
      </ShadowBackground>
      <TextureSection>
        <div className="py-20 md:py-32">
          <ProjectStats
            stats={[
              { value: "2.000", label: "Downloads" },
              { value: "4,9", label: "Stars" },
              { value: "22", label: "Reviews" },
              { value: "100", label: "GitHub Stars" },
            ]}
            tools={[
              { src: "/images/texture-icons/swift.webp", alt: "Swift" },
              { src: "/images/texture-icons/xcode.webp", alt: "Xcode" },
              { src: "/images/texture-icons/figma.webp", alt: "Figma" },
              { src: "/images/texture-icons/git.webp", alt: "Git" },
            ]}
          />
          <div className="w-full max-w-site mx-auto p-8 md:p-12 flex flex-wrap gap-8 items-center justify-between">
            <StarRating rating={4.9} className="w-full max-w-[400px]" />
            <Link
              href="https://apps.apple.com/us/app/convert-compress/id6752861983"
              target="_blank"
              className="block h-[80px] md:h-[80px] w-auto hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/images/texture-icons/download_mac_app_store.webp"
                alt="Download from App Store"
                width={800}
                height={200}
                className="w-full md:w-auto md:h-full object-contain"
              />
            </Link>
          </div>
        </div>
      </TextureSection>

      {/* Video Demo Section */}
      <GridSection
        className="py-16 md:py-28"
        gridSize={32}
        gridColor="rgba(0,0,0,0.06)"
      >
        <div className="w-full max-w-site mx-auto px-8 md:px-12">
          <VideoFrame
            src="https://media.raffi.studio/videos/projects/convert-compress/Convert_Compress_Hero_v2.mp4"
            description="Product Demo"
            className="w-full mx-auto"
          />
        </div>
      </GridSection>

      {/* Content Section */}
      <ProjectContent>
        {/* Motivation Block 1 */}
        <ProjectSection>
          <ProjectHeading>Motivation</ProjectHeading>
          <ProjectSectionContent>
            <ProjectTextBlock>
              <ProjectSubHeading>Sub heading</ProjectSubHeading>
              <ProjectText>
                A small, native tool for macOS that does exactly one thing:
                converting, compressing,{" "}
                <PencilUnderline>and resizing</PencilUnderline> images. With a
                live preview. All in one pipeline. Native, local & private.
                Written in swift for macOS.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectText>
                A small, native tool for macOS that does exactly one thing:
                converting, compressing, and resizing images.{" "}
                <TextMarker>With a live</TextMarker> preview. With a live
                preview. All in one pipeline. Native, local & private. Written
                in swift for macOS.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Sub heading</ProjectSubHeading>
              <ProjectText>
                A small, native tool for macOS that does exactly one thing:
                converting, compressing, and resizing images. With a live
                preview. All in one pipeline. Native, local & private. Written
                in swift for macOS.
              </ProjectText>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Motivation Block 2 */}
        <ProjectSection>
          <ProjectHeading>Motivation</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              A small, native tool for macOS that does exactly one thing:
              converting, compressing, and resizing images. With a live preview.
              All in one pipeline. Native, local & private. Written in swift for
              macOS.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContent>
    </main>
  );
}
