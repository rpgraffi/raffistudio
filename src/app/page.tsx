"use client";

import { PageTransitionWrapper } from "@/components/layout/PageTransition";
import { Patch } from "@/components/projects/Patches";
import { CompanyWelcome } from "@/components/site/CompanyWelcome";
import { Folder } from "@/components/site/projects/Folder";
import { Hero } from "@/components/site/hero/Hero";
import { ReviewStack } from "@/components/site/reviews/ReviewStack";
import { ToolsSection } from "@/components/site/tools/ToolsSection";
import { Analytics } from "@vercel/analytics/next";
import Image from "next/image";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Raphael Wennmacher",
  url: "https://raffi.studio",
  email: "me@raffi.studio",
  jobTitle: "UX/UI Designer & Developer",
  description:
    "HCI researcher, UX/UI designer, and developer based in Munich. Finishing a master's in HCI and CS at LMU.",
  sameAs: [
    "https://github.com/rpgraffi",
    "https://www.linkedin.com/in/raphael-wennmacher/",
    "https://www.instagram.com/raffis.insta/",
  ],
  knowsAbout: [
    "HCI",
    "UX Design",
    "UI Systems",
    "AI Interfaces",
    "Product Design",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Ludwig Maximilian University of Munich",
    url: "https://www.lmu.de",
  },
};

export default function Home() {
  return (
    <PageTransitionWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen relative flex flex-col gap-12 items-center overflow-x-hidden">
        <Analytics />
        {/* <GlassRuler /> */}
        <CompanyWelcome />
        <Hero />

        {/* Tools Section — WebGL stream of tool icons funneling into a folder */}
        <ToolsSection />

        {/* Projects Section */}
        <section className="w-full max-w-site mx-auto px-8 py-32">
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl text-center md:mb-32">
            My Work
          </h2>
          <div className="grid grid-cols-1 auto-rows-[70vh] place-items-center md:flex md:flex-wrap md:auto-rows-auto md:justify-center md:gap-52">
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
              title="TRADAR"
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

        {/* Reviews Section */}
        <ReviewStack />

      </main>
    </PageTransitionWrapper>
  );
}
