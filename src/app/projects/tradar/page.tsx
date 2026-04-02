"use client";

import {
  ProjectContent,
  ProjectHeading,
  ProjectSection,
  ProjectSectionContent,
  ProjectSubHeading,
  ProjectText,
  ProjectTextBlock,
  ProjectUnorderedList,
} from "@/app/projects/components/ProjectContent";
import { ProjectStats } from "@/app/projects/components/ProjectStats";
import Header from "@/components/Header";
import DrawingHeadline from "@/components/natural-ui/DrawingHeadline";
import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { RuledText } from "@/components/natural-ui/RuledText";
import { TextMarker } from "@/components/natural-ui/TextMarker";
import { PageTransitionWrapper } from "@/components/PageTransition";
import { StarRating } from "@/components/ui/StarRating";
import { TextureIcon } from "@/components/ui/TextureIcon";
import { TextureSection } from "@/components/ui/TextureSection";
import { IPhoneCarousel } from "@/components/ui/IPhoneCarousel";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { GridSection } from "@/components/ui/GridSection";
import { RiveAnimation } from "@/components/ui/RiveAnimation";
import { TradarAnimation } from "@/app/projects/tradar/TradarAnimation";
import { VideoFrame } from "@/components/ui/VideoFrame";
import { useProjectIntro } from "@/hooks/useProjectIntro";
import { motion } from "framer-motion";

export default function TradarPage() {
  const {
    startDrawing,
    headlineOffset,
    hasInitialPosition,
    isIntroComplete,
    isHeadlineCentered,
    headlineRef,
    springConfig,
  } = useProjectIntro();

  return (
    <PageTransitionWrapper>
      <main className="min-h-screen font-sans relative overflow-x-clip">
        {/* Header with fade-in */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isIntroComplete ? 1 : 0,
            y: isIntroComplete ? 0 : -20,
          }}
          transition={springConfig}
        >
          <Header />
        </motion.div>

        {/* Hero Content */}
        <div className="flex-1 w-full min-h-screen mx-auto flex flex-col gap-8 pb-20 pt-32 md:pt-32 relative z-50">
          {/* Top Content Area - Phone Carousel */}
          <motion.div
            className="flex-1 flex justify-center items-center min-h-[400px] z-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: isIntroComplete ? 1 : 0,
              y: isIntroComplete ? 0 : 40,
            }}
            transition={{ ...springConfig, delay: 0.1 }}
          >
            <IPhoneCarousel
              images={[
                {
                  src: "/projects/tradar/images/phones/market.avif",
                  alt: "Tradar Market Screen",
                },
                {
                  src: "/projects/tradar/images/phones/trade-profile.avif",
                  alt: "Tradar Trade Profile Screen",
                },
                {
                  src: "/projects/tradar/images/phones/buy.avif",
                  alt: "Tradar Buy Screen",
                },
                {
                  src: "/projects/tradar/images/phones/club.avif",
                  alt: "Tradar Club Screen",
                },
                {
                  src: "/projects/tradar/images/phones/trc-profile.avif",
                  alt: "Tradar TRC Profile Screen",
                },
                {
                  src: "/projects/tradar/images/phones/trc-transactions.avif",
                  alt: "Tradar TRC Transactions Screen",
                },
                {
                  src: "/projects/tradar/images/phones/deposit.avif",
                  alt: "Tradar Deposit Screen",
                },
                {
                  src: "/projects/tradar/images/phones/filter.avif",
                  alt: "Tradar Filter Screen",
                },
                {
                  src: "/projects/tradar/images/phones/bio.avif",
                  alt: "Tradar Bio Screen",
                },
                {
                  src: "/projects/tradar/images/phones/onboarding.avif",
                  alt: "Tradar Onboarding Screen",
                },
                {
                  src: "/projects/tradar/images/phones/tradar-won.avif",
                  alt: "Tradar Won Screen",
                },
              ]}
            />
          </motion.div>

          {/* Bottom Split View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end z-10 max-w-site mx-auto px-8 md:px-12">
            {/* Left: Title & Links */}
            <div className="md:col-span-5 flex flex-col gap-8">
              <div
                ref={headlineRef}
                className="relative"
                style={{ visibility: headlineOffset ? "visible" : "hidden" }}
              >
                <motion.div
                  className="relative z-50"
                  initial={false}
                  animate={{
                    x:
                      isHeadlineCentered && headlineOffset
                        ? headlineOffset.x
                        : 0,
                    y:
                      isHeadlineCentered && headlineOffset
                        ? headlineOffset.y
                        : 0,
                  }}
                  transition={
                    hasInitialPosition ? springConfig : { duration: 0 }
                  }
                >
                  <DrawingHeadline
                    className="text-5xl md:text-7xl text-zinc-900 font-sentient"
                    triggerOnView={false}
                    animate={startDrawing}
                    lineDelay={0.5}
                    as="h1"
                  >
                    Tradar
                  </DrawingHeadline>
                </motion.div>
              </div>

              {/* Links */}
              <motion.div
                className="flex flex-wrap gap-6 text-lg text-zinc-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isIntroComplete ? 1 : 0,
                  y: isIntroComplete ? 0 : 20,
                }}
                transition={{ ...springConfig, delay: 0.2 }}
              >
                <PencilUnderline href="https://www.google.com/search?q=MFC+Labs+GmbH+Tradar">
                  More Information
                </PencilUnderline>
              </motion.div>
            </div>

            {/* Spacer */}
            <div className="md:col-span-2 hidden md:block"></div>

            {/* Right: Description */}
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isIntroComplete ? 1 : 0,
                y: isIntroComplete ? 0 : 20,
              }}
              transition={{ ...springConfig, delay: 0.3 }}
            >
              <div className="text-xl md:text-2xl text-zinc-800 leading-10 font-normal">
                <RuledText className="leading-10">
                  A mobile platform for football fans to legally invest in
                  soccer players. Built for MFC Labs GmbH in cooperation with
                  Userdoo.
                </RuledText>
              </div>
            </motion.div>
          </div>
        </div>

        <TextureSection>
          <div className="py-20 md:py-32">
            <ProjectStats
              stats={[
                { value: "10.000", label: "Users" },
                { value: "4,6", label: "Stars" },
                { value: "60", label: "Ratings" },
                { value: "Insolvent", label: "Status" },
              ]}
              tools={[
                { src: "/images/texture-icons/figma.webp", alt: "Figma" },
                { src: "/images/texture-icons/webflow.webp", alt: "Webflow" },
                { src: "/images/texture-icons/react.webp", alt: "React" },
                { src: "/images/texture-icons/rive.webp", alt: "Rive" },
              ]}
            />
            <div className="w-full max-w-site mx-auto p-8 md:p-12 flex flex-wrap gap-8 items-center justify-between">
              <StarRating rating={4.6} className="w-full max-w-[400px]" />
            </div>
          </div>
        </TextureSection>

        {/* Content Section */}
        <ProjectContent>
          {/* Context and Role */}
          <ProjectSection>
            <ProjectHeading>Context and Role</ProjectHeading>
            <ProjectSectionContent>
              <ProjectText>
                I worked as a freelance UX/UI Designer for{" "}
                <TextMarker>MFC Labs GmbH</TextMarker> (later EML Sport
                Innovation) in cooperation with{" "}
                <PencilUnderline href="https://userdoo.com">
                  Userdoo
                </PencilUnderline>
                . I was introduced to the project by Tommy Haake, whom I met at
                THI Ingolstadt. I spent almost{" "}
                <TextMarker>two years</TextMarker> on this project. The
                objective was to build a mobile platform for traditional
                football fans to legally invest in soccer players.
              </ProjectText>
            </ProjectSectionContent>
          </ProjectSection>

          {/* The Problem */}
          <ProjectSection>
            <ProjectHeading>The Problem</ProjectHeading>
            <ProjectSectionContent>
              <ProjectText>
                MFC Labs GmbH aimed to build the{" "}
                <TextMarker>first platform of its kind</TextMarker>. The goal
                was to start with Peer to Peer (P2P) trading and eventually
                advance into an order book based system. When a player was
                bought, the investment generated dividends in a secondary
                currency called <TextMarker>TRC</TextMarker>. This dividend was
                calculated directly from the real match performance of the
                respective soccer player.
              </ProjectText>
            </ProjectSectionContent>
          </ProjectSection>

          {/* The Challenges */}
          <ProjectSection>
            <ProjectHeading>The Challenges</ProjectHeading>
            <ProjectSectionContent>
              <ProjectText>
                Because users invested real money into the platform,{" "}
                <TextMarker>establishing trust was fundamental</TextMarker>.
                Trust required absolute transparency regarding costs, processes,
                and a clean user experience. To understand effective
                communication for financial technologies, I analyzed blogs by{" "}
                <PencilUnderline href="https://builtformars.com">
                  Peter Ramsey
                </PencilUnderline>
                . His analyses of other FinTech startups helped me evaluate what
                worked and what could be improved. This research guided how we
                communicated fees, the buying and selling processes, system
                delays, and dividend distributions.
              </ProjectText>
              <ProjectText>
                Furthermore, users had to open an{" "}
                <TextMarker>official bank account within the app</TextMarker>.
                The registration flow had to be as straightforward and simple as
                possible. To organize future iterative versions, I documented an
                idea regarding the Know Your Customer process. If users scan
                their passport or ID, manual entry of names and streets could be
                skipped. The identity provider we worked with did not supply
                this data at the time, which required manual data entry, but I
                noted this as an interesting startup idea and a necessary future
                improvement.
              </ProjectText>
            </ProjectSectionContent>
          </ProjectSection>

          {/* Interface Design */}
          <ProjectSection>
            <ProjectHeading>Interface Design</ProjectHeading>
            <ProjectSectionContent>
              <ProjectText>
                My work began with cleaning up the old design files and aligning
                the new interface with strict legal requirements. I incorporated
                the brand guidelines into the new visual direction. I designed
                the entire product largely{" "}
                <TextMarker>independently</TextMarker>, while maintaining
                continuous feedback loops with Tommy Haake, CTO Christian
                Dotterweich, PM Klaudia Khamani, and the development team.
              </ProjectText>
              <ProjectText>
                The final design consisted of{" "}
                <TextMarker>over 170 screens</TextMarker>. This scope included
                the complete onboarding flow for opening a bank account,
                application tutorials, buying and selling processes, detailed
                player statistics, the market, the store, and notification
                design. All screens were connected into a{" "}
                <TextMarker>fully functional prototype</TextMarker> representing
                every state of the application. This prototype was utilized for
                user testing and provided exact clarification for the
                development team.
              </ProjectText>
              <GridSection className="max-w-text-content mx-auto">
                <div className="p-8">
                  <VideoFrame
                    src="/projects/tradar/videos/demo.webm"
                    description="Tradar — Prototype Walkthrough"
                    className="w-full"
                    showTesaStripes={false}
                  />
                </div>
              </GridSection>
            </ProjectSectionContent>
          </ProjectSection>

          {/* Design System */}
          <ProjectSection>
            <ProjectHeading>Design System</ProjectHeading>
            <ProjectSectionContent>
              <ProjectText>
                I built a{" "}
                <TextureIcon
                  src="/images/texture-icons/figma.webp"
                  alt="Figma"
                />{" "}
                Figma design system from scratch to keep the platform scalable,
                manageable, and easy to work with. It aligned strictly with the
                brand guidelines and consisted of{" "}
                <TextMarker>over 130 components and variants</TextMarker>. It
                utilized full auto layout and applied specific design tokens.
              </ProjectText>

              <ProjectTextBlock>
                <ProjectSubHeading>Storybook Synchronization</ProjectSubHeading>
                <ProjectText>
                  To align the design with the code, I established a
                  synchronization between the Figma UI components and the{" "}
                  <TextureIcon
                    src="/images/texture-icons/react.webp"
                    alt="React"
                  />{" "}
                  React Native code using Storybook. This was particularly
                  important for list item components, which were used
                  extensively throughout the application. Making sure the code
                  behaved and looked exactly as it did in Figma was a priority.
                </ProjectText>
                <ProjectText>
                  I aligned the property names, styling, and behavior. This
                  ensured developers only had to set the correct properties on
                  their components to achieve the intended visual result{" "}
                  <TextMarker>without friction</TextMarker>.
                </ProjectText>
                <ImageFrame
                  src="/projects/tradar/images/list-item.avif"
                  alt="List Item Component"
                  width={1024}
                  height={1024}
                  description="List Item Component"
                  className="w-full h-auto max-w-text-content mx-auto"
                />
              </ProjectTextBlock>
            </ProjectSectionContent>
          </ProjectSection>

          {/* Business Logic and Additional Responsibilities */}
          <ProjectSection>
            <ProjectHeading>Additional Responsibilities</ProjectHeading>
            <ProjectSectionContent>
              <ProjectText>
                As the sole UX designer responsible for the entire product, I
                was tightly integrated with the team and involved from the
                inception of ideas.{" "}
                <TextMarker>UX does not happen in the background.</TextMarker>
              </ProjectText>

              <ProjectTextBlock>
                <ProjectSubHeading>Price Building</ProjectSubHeading>
                <ProjectText>
                  To calculate a user portfolio value, we needed to calculate a
                  reasonable price for the underlying assets. In Peer to Peer
                  trading, this is complex because the user sets the price. We
                  required a{" "}
                  <TextMarker>
                    smoothing mechanism that was stable against market
                    corruption
                  </TextMarker>{" "}
                  but still reflected updated prices. I developed a tool to
                  simulate different averaging approaches for the technical
                  team.
                </ProjectText>
              </ProjectTextBlock>

              <ProjectTextBlock>
                <ProjectSubHeading>UX Writing</ProjectSubHeading>
                <ProjectText>
                  I wrote the user interface copy myself. Inspired by the Apple
                  Human Interface Guidelines, I created a reusable Markdown
                  prompt to ensure the language remained{" "}
                  <TextMarker>aligned with the target audience</TextMarker>.
                </ProjectText>
              </ProjectTextBlock>

              <ProjectTextBlock>
                <ProjectSubHeading>Asset Creation Pipeline</ProjectSubHeading>
                <ProjectText>
                  Store items, especially game tickets, had to be replaced
                  frequently but followed a strict visual structure. I created a
                  template connected to the design system and an Excel sheet.
                  The marketing team only had to update the Excel sheet. The
                  tickets were then{" "}
                  <TextMarker>automatically generated</TextMarker> with custom
                  club icons, names, ticket amounts, and dates.
                </ProjectText>
              </ProjectTextBlock>

              <ProjectTextBlock>
                <ProjectSubHeading>Rive Animations</ProjectSubHeading>
                <ProjectText>
                  I designed and implemented state management animations using
                  the{" "}
                  <TextureIcon
                    src="/images/texture-icons/rive.webp"
                    alt="Rive"
                  />{" "}
                  Rive runtime. For transaction feedback, I wanted an idle
                  animation that transformed based on the state. I designed a
                  concept of a soccer ball moving towards a goal. Upon a
                  successful transaction,{" "}
                  <TextMarker>the ball hit the goal</TextMarker> and morphed
                  into a green checkbox. Upon failure, it missed and transformed
                  into a red error symbol.
                </ProjectText>
                <GridSection className="max-w-text-content mx-auto">
                  <div className="grid grid-cols-2 gap-8 p-8">
                    <TradarAnimation />
                    <RiveAnimation
                      src="/projects/tradar/rive/live_badge.riv"
                      description="Live Badge Animation"
                    />
                  </div>
                </GridSection>
              </ProjectTextBlock>

              <ProjectTextBlock>
                <ProjectSubHeading>Website</ProjectSubHeading>
                <ProjectText>
                  I designed and developed the complete landing page using{" "}
                  <TextureIcon
                    src="/images/texture-icons/webflow.webp"
                    alt="Webflow"
                  />{" "}
                  Webflow, including CMS integration. The website is currently
                  offline.
                </ProjectText>
              </ProjectTextBlock>
            </ProjectSectionContent>
          </ProjectSection>

          {/* Outcomes */}
          <ProjectSection>
            <ProjectHeading>Outcomes</ProjectHeading>
            <ProjectSectionContent>
              <ProjectText>
                The project was successfully released and remained in operation
                for <TextMarker>six months</TextMarker>. Based on application
                store ratings, users explicitly highlighted the{" "}
                <TextMarker>simplicity and clarity</TextMarker> of the app. The
                project was eventually shut down due to internal structural
                conflicts within the company.
              </ProjectText>
            </ProjectSectionContent>
          </ProjectSection>

          {/* Learnings */}
          <ProjectSection>
            <ProjectHeading>Learnings</ProjectHeading>
            <ProjectSectionContent>
              <ProjectUnorderedList>
                <li>
                  <TextMarker>Pulling multiple disciplines together</TextMarker>{" "}
                  — design, writing, animation, and tooling — requires strong
                  ownership and a clear product vision.
                </li>
                <li>
                  Handling user funds demands an uncompromising approach to
                  transparency and trust in every design decision.
                </li>
                <li>
                  <TextMarker>
                    Keeping developer requirements and strict legal frameworks
                    in mind
                  </TextMarker>{" "}
                  is critical and cannot be treated as an afterthought.
                </li>
                <li>
                  Challenging decisions and full responsibility for the design
                  direction of a complex product build resilience and judgment
                  that cannot be learned any other way.
                </li>
              </ProjectUnorderedList>
            </ProjectSectionContent>
          </ProjectSection>
        </ProjectContent>
      </main>
    </PageTransitionWrapper>
  );
}
