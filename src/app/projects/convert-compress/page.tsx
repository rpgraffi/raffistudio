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
import DrawingHeadline from "@/components/natural-ui/DrawingHeadline";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { RuledText } from "@/components/natural-ui/RuledText";
import { TextMarker } from "@/components/natural-ui/TextMarker";
import ShadowBackground from "@/components/shadows/ShadowBackground";
import { GridSection } from "@/components/ui/GridSection";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { StarRating } from "@/components/ui/StarRating";
import { TextureIcon } from "@/components/ui/TextureIcon";
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
              src="/projects/convert-compress/images/hero.webp"
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
              <DrawingHeadline
                className="text-5xl md:text-7xl text-zinc-900 font-sentient"
                triggerOnView={false}
                animate={true}
                lineDelay={0.5}
                as="h1"
              >
                Convert &<br />
                Compress
              </DrawingHeadline>

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
              { value: "2.200", label: "Downloads" },
              { value: "4,9", label: "Stars" },
              { value: "22", label: "Reviews" },
              { value: "110", label: "GitHub Stars" },
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
            description="Convert & Compress in action"
            className="w-full mx-auto"
            showTesaStripes={false}
          />
        </div>
      </GridSection>

      {/* Content Section */}
      <ProjectContent>
        {/* Motivation */}
        <ProjectSection>
          <ProjectHeading>Motivation</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Anyone working in web design, app development, or marketing knows
              the struggle. Some formats are better for the web, others compress
              better, some support transparency, and others are simply mandatory
              requirements. Often, you have multiple assets that need adjustment
              simultaneously. While existing tools can handle these tasks, I
              couldn&apos;t find one that handled{" "}
              <TextMarker>everything in a single pipeline</TextMarker>. I found
              myself using one tool to convert, another to compress, and a third
              to resize. This disrupted my workflow, so I started designing
              Convert &amp; Compress.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Concept */}
        <ProjectSection>
          <ProjectHeading>Concept</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              The goal was a <TextMarker>single pipeline</TextMarker> combining
              all the transformations I previously spread across different
              tools. Users needed a before-and-after comparison to find the
              right balance between file size and quality. Additionally, the
              tool had to run{" "}
              <TextMarker>
                locally for privacy, performance, and legal reasons
              </TextMarker>
              . This also eliminated the need for a backend.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Human-Centered Design */}
        <ProjectSection>
          <ProjectHeading>Human-Centered Design</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              The design process was rooted in{" "}
              <TextMarker>understanding real user workflows</TextMarker>. I
              started by analyzing my own pain points as a designer, then
              validated these assumptions by engaging with communities on Reddit
              and gathering feedback from early testers.
            </ProjectText>

            <ProjectTextBlock>
              <ProjectSubHeading>Research &amp; Discovery</ProjectSubHeading>
              <ProjectText>
                Before writing any code, I documented the tasks I performed
                repeatedly: converting screenshots to WebP, compressing hero
                images, resizing assets for different breakpoints. I mapped out
                which tools I used for each step and identified the friction
                points: context switching, inconsistent quality settings, and
                lack of batch processing.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Continuous Feedback Loop</ProjectSubHeading>
              <ProjectText>
                Rather than building in isolation, I{" "}
                <TextMarker>shared progress publicly</TextMarker> from early
                stages. Reddit became my primary channel for user research.
                Posts generated hundreds of comments with specific use cases I
                hadn&apos;t considered, like scaling by the shorter side for
                social media thumbnails, or the need for keyboard-only
                workflows.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Prioritizing Feedback</ProjectSubHeading>
              <ProjectText>
                Not every suggestion made it into the app. I developed a
                framework for evaluating requests:{" "}
                <TextMarker>
                  Does this affect many users? Does it fit the app&apos;s scope?
                  Can it be implemented without adding complexity?
                </TextMarker>{" "}
                This helped maintain focus while still being responsive to the
                community.
              </ProjectText>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Design */}
        <ProjectSection>
          <ProjectHeading>Design</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              I wanted the app to feel <TextMarker>native to macOS</TextMarker>,
              so I chose{" "}
              <TextureIcon src="/images/texture-icons/swift.webp" alt="Swift" />{" "}
              Swift for development. This allowed for the implementation of{" "}
              <TextMarker>
                physics-based animations, trackpad gestures, and haptic feedback
              </TextMarker>
              .
            </ProjectText>

            <ProjectTextBlock>
              <ProjectSubHeading>The Pipeline</ProjectSubHeading>
              <ProjectText>
                The interface reflects the pipeline concept: a toolbar
                containing all available adjustments. The file format sits at
                the start, as it dictates the available steps (e.g., JPEG vs.
                PNG options). This is followed by resizing, compression
                (quality), flipping, background removal, and metadata stripping.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Size Controls</ProjectSubHeading>
              <ProjectText>
                Resizing presented a few challenges. Users needed to scale by
                height, width, or, <TextMarker>based on feedback</TextMarker>,
                the shorter side. I also needed to include cropping and size
                templates. The challenge was fitting these options into a
                compact, easy-to-understand control. Since cropping and scaling
                along a specific side are rarely done simultaneously, I used a
                switch to toggle between these two modes.
              </ProjectText>
              <div className="w-full mx-auto">
                <VideoFrame
                  src="/projects/convert-compress/videos/resize.webm"
                  description="Resize Width, Height or on shorter side. Switch between cropping and scaling."
                  className="w-full mx-auto"
                  showTesaStripes={false}
                />
              </div>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Sliders</ProjectSubHeading>
              <ProjectText>
                I implemented sliders to let users quickly snap to common
                values. For image size, this includes powers of two up to 4K
                (16, 32... 3840) and standard resolutions like 1080p. Quality
                adjusts in increments of five. For precise control, clicking the
                slider converts it into a text input field.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>File Management</ProjectSubHeading>
              <ProjectText>
                To support different workflows, files can be loaded via the
                Finder, drag-and-drop (to the icon or window), or copy-paste.
                Once loaded, files are immediately transformed based on the
                current pipeline settings, showing the estimated export size in
                pixels and kilobytes. Users can remove individual images or copy
                the processed versions directly to the clipboard.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Comparison</ProjectSubHeading>
              <ProjectText>
                A direct comparison view was a priority for me and the users. It
                helps estimate how much an image can be compressed without
                visible quality loss. I built a UI where a slider overlays the
                new version on top of the original. Both images zoom
                synchronously for close inspection, and a double-click resets
                the view to 100%. Parameters can be adjusted while viewing the
                comparison for <TextMarker>immediate feedback</TextMarker>.
              </ProjectText>
              <VideoFrame
                src="/projects/convert-compress/videos/comparison.webm"
                description="Comparison view"
                className="w-full mx-auto"
                showTesaStripes={false}
              />
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Details</ProjectSubHeading>
              <ProjectText>
                A few smaller details improved the user experience. I added
                keyboard shortcuts for changing formats, opening the comparison
                view, deleting, and saving. Users also requested templates,
                allowing them to save and reuse specific pipelines.
              </ProjectText>
              <ProjectText>
                The save button also acts as a status indicator. It shows
                progress during import and export. After exporting, the app
                automatically reveals the saved images in the folder. If no
                specific destination is selected, it defaults to the source
                folder.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>App Icon</ProjectSubHeading>
              <ProjectText>
                For the app icon, I used Apple&apos;s new{" "}
                <TextMarker>
                  Icon Composer in{" "}
                  <TextureIcon
                    src="/images/texture-icons/xcode.webp"
                    alt="Xcode"
                  />{" "}
                  Xcode
                </TextMarker>
                , which allows layered, dynamic icons that adapt to light and
                dark mode. I prepared the individual layers in{" "}
                <TextureIcon
                  src="/images/texture-icons/figma.webp"
                  alt="Figma"
                />{" "}
                Figma, then imported them into Icon Composer. The tool limits
                you to 5 layers which required some fiddling to achieve the
                depth and hierarchy I had in mind while keeping the icon
                readable across both appearance modes.
              </ProjectText>
              <GridSection>
                <div className="grid grid-cols-2 gap-16">
                  <ImageFrame
                    src="/projects/convert-compress/images/appicon-light.webp"
                    alt="App Icon Light"
                    width={500}
                    height={500}
                    description="Light mode"
                  />
                  <ImageFrame
                    src="/projects/convert-compress/images/appicon-dark.webp"
                    alt="App Icon Dark"
                    width={500}
                    height={500}
                    description="Dark mode"
                  />
                </div>
              </GridSection>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Release */}
        <ProjectSection>
          <ProjectHeading>Release</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Preparing for the{" "}
              <PencilUnderline href="https://apps.apple.com/us/app/convert-compress/id6752861983">
                App Store
              </PencilUnderline>{" "}
              involved creating assets and translating the app into{" "}
              <TextMarker>over 17 languages</TextMarker>. I released the app on
              October 1, 2025. The process wasn&apos;t entirely smooth; I
              initially requested permission to access the Downloads folder to
              streamline imports. This caused a rejection during review, so I
              had to remove that specific permission to get the app published.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Iterative Improvement */}
        <ProjectSection>
          <ProjectHeading>Iterative Improvement</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              After the release, I shared my progress on Reddit. The community
              reception was positive, but posts also generated suggestions on
              how to make the app more useful. I kept a backlog of these ideas,
              considering how to integrate them{" "}
              <TextMarker>without cluttering the interface</TextMarker>.
              Features like the cropping tool and the zoomable comparison view
              came <TextMarker>directly from this feedback</TextMarker>. I am
              still working on the app, with plans to potentially add
              video/audio conversion and support for more formats.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Marketing */}
        <ProjectSection>
          <ProjectHeading>Marketing</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Marketing took place almost exclusively on Reddit, with additional
              launches on{" "}
              <PencilUnderline href="https://www.producthunt.com/products/convert-compress">
                Product Hunt
              </PencilUnderline>{" "}
              and{" "}
              <PencilUnderline href="https://betalist.com/startups/convert-compress">
                BetaList
              </PencilUnderline>
              . I also designed a landing page at{" "}
              <PencilUnderline href="https://convert-compress.com">
                convert-compress.com
              </PencilUnderline>
              . Since the tool is{" "}
              <PencilUnderline href="https://github.com/rpgraffi/convert-compress">
                open source
              </PencilUnderline>
              , I could post in developer communities like r/SwiftUI and
              r/WebDev, though most users came from r/MacApps. My{" "}
              <PencilUnderline href="https://www.reddit.com/r/SwiftUI/comments/1nzov5y/for_my_first_swift_app_i_built_a_native_macos/">
                post
              </PencilUnderline>{" "}
              in r/SwiftUI became the subreddit&apos;s{" "}
              <TextMarker>top-voted post of all time</TextMarker>. On Product Hunt, the app{" "}
              <TextMarker>hit the top 10 with 112 upvotes</TextMarker> without any special marketing for the launch. Collectively,{" "}
              <TextMarker>over 300,000 people</TextMarker> viewed the posts.
            </ProjectText>
            <ImageFrame
              src="/projects/convert-compress/images/apple-stats.webp"
              alt="Apple Connect Stats 29. September 2025 - 7. December 2025"
              width={1000}
              height={1000}
              description="Apple Connect Stats 29. September 2025 - 7. December 2025"
              className="mix-blend-multiply max-w-text-content mx-auto"
            />
          </ProjectSectionContent>
        </ProjectSection>

        {/* Development */}
        <ProjectSection>
          <ProjectHeading>Development</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              As this was my{" "}
              <TextMarker>
                first{" "}
                <TextureIcon
                  src="/images/texture-icons/swift.webp"
                  alt="Swift"
                />{" "}
                Swift project
              </TextMarker>
              , using
              <TextureIcon
                src="/images/texture-icons/xcode.webp"
                alt="Xcode"
              />{" "}
              Xcode with Cursor helped significantly with understanding the
              syntax. I used Claude Sonnet 4.5 and Gemini 3 to assist with the
              code. The focus was on utilizing{" "}
              <TextMarker>native macOS APIs</TextMarker>, such as ImageIO and
              StoreKit.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* What I Learned */}
        <ProjectSection>
          <ProjectHeading>What I Learned</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Developing a product <TextMarker>from start to finish</TextMarker>
              , including feedback, marketing, and support, is a lot of work,
              but enjoyable. I learned that{" "}
              <TextMarker>
                user feedback shouldn&apos;t always be implemented exactly as
                requested
              </TextMarker>
              . It is better to evaluate if the issue affects many users and
              fits the broader context of the app before building a solution.
              Reddit proved to be an effective platform when engaging
              organically and putting effort into responses. The community is
              active and honest, providing exactly the kind of direct feedback
              needed to improve a product. And last, image processing is way
              harder than I thought.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContent>
    </main>
  );
}
