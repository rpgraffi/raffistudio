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
import ShadowBackground from "@/components/shadows/ShadowBackground";
import { StarRating } from "@/components/ui/StarRating";
import { TextureIcon } from "@/components/ui/TextureIcon";
import { TextureSection } from "@/components/ui/TextureSection";
import Link from "next/link";
import Image from "next/image";
import { GridSection } from "@/components/ui/GridSection";
import { InlineCode } from "@/components/ui/Code";

export default function LMUAppPage() {
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
              <DrawingHeadline
                className="text-5xl md:text-7xl text-zinc-900 font-sentient"
                triggerOnView={false}
                animate={true}
                lineDelay={0.5}
                as="h1"
              >
                LMU
                <br />
                Students
              </DrawingHeadline>

              <div className="flex gap-6 text-lg text-zinc-800">
                <PencilUnderline href="https://apps.apple.com/de/app/lmu-students/id6505039729">
                  App Store
                </PencilUnderline>
                <PencilUnderline href="https://play.google.com/store/apps/details?id=com.lmu_dev.lmu_app">
                  Play Store
                </PencilUnderline>
                <PencilUnderline href="https://github.com/lmu-devs/">
                  GitHub
                </PencilUnderline>
                <PencilUnderline href="https://lmu-dev.org">
                  Website
                </PencilUnderline>
              </div>
            </div>

            {/* Spacer */}
            <div className="md:col-span-2 hidden md:block"></div>

            {/* Right: Description */}
            <div className="md:col-span-5">
              <div className="text-xl md:text-2xl text-zinc-800 leading-10 font-normal">
                <RuledText className="leading-10">
                  An open source mobile app for students of the Ludwig
                  Maximilian University of Munich.
                  <br />
                  From students, for students. Available on iOS and Android.
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
          <div className="w-full max-w-site mx-auto p-8 md:p-12 flex flex-wrap gap-8 items-center justify-between">
            <StarRating rating={4.9} className="w-full max-w-[400px]" />
            <Link
              href="https://apps.apple.com/de/app/lmu-students/id6505039729"
              target="_blank"
              className="block h-[80px] md:h-[80px] w-auto hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/images/texture-icons/download_app_store.webp"
                alt="Download from App Store"
                width={800}
                height={200}
                className="w-full md:w-auto md:h-full object-contain"
              />
            </Link>
          </div>
        </div>
      </TextureSection>

      {/* Content Section */}
      <ProjectContent>
        {/* Motivation */}
        <ProjectSection>
          <ProjectHeading>Motivation</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              We&apos;re writing the year 2024 and the{" "}
              <TextMarker>biggest university in Germany</TextMarker>, the LMU,
              still has no app for students. No easy way to check the canteen
              menu, available libraries, grades, lectures — and services
              cluttered around 20 different websites.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* The Team */}
        <ProjectSection>
          <ProjectHeading>The Team</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              I wasn&apos;t alone with this thought. One night at Café Cosmos we
              forged plans to solve this ourselves.{" "}
              <TextMarker>
                Suffering together created a strong connection
              </TextMarker>
              . So Paul Walter, Lukas Plenk, me and some other LMU students
              started the vision and began the work.
            </ProjectText>

            <ProjectTextBlock>
              <ProjectSubHeading>University Course</ProjectSubHeading>
              <ProjectText>
                At one point we thought, why limit the capacity to us — there
                should be more students taking part in creating their own
                solution. <TextMarker>From students, for students</TextMarker>.
                So we talked to professors and PhDs and were able to host our
                own official class called „Full Stack App Development" for the
                winter and summer semester 2025.
              </ProjectText>
              <ProjectText>
                We received over 30 applications from students to take the class
                and chose 8 to join the team. We had weekly meetings discussing
                progress, teaching concepts of modern frontend architecture,
                color theory and more.
              </ProjectText>
              <GridSection className="max-w-text-content mx-auto flex items-center justify-center py-8">
                <Image
                  src="/images/projects/lmu-app/class-team.webp"
                  alt="Class Team"
                  width={1024}
                  height={1024}
                  className="w-full h-auto"
                />
              </GridSection>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Challenges */}
        <ProjectSection>
          <ProjectHeading>Challenges</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              The whole project had several obstacles, to name some:
            </ProjectText>

            <ProjectTextBlock>
              <ProjectSubHeading>Legacy Infrastructure</ProjectSubHeading>
              <ProjectText>
                The outdated system doesn&apos;t only make it hard for students
                to look up information but also for our system to access it.
                There were <TextMarker>no clean APIs and interfaces</TextMarker>{" "}
                to access the information. So it was evident we had to build
                that ourselves — store the data on our side to not overwhelm the
                old system and bring the information into a new structure that
                can be used to populate a UI with information. This way we would
                have the whole data pipeline in control.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>
                Learning Backend Development
              </ProjectSubHeading>
              <ProjectText>
                Nobody on our team had ever written a backend. So the whole
                hosting, server, database, scraping, API thing was new to us.
                Even though my background is more on the UX side,{" "}
                <TextMarker>
                  I jumped head first into the topic and took responsibility
                </TextMarker>{" "}
                of it since then.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>User Communication</ProjectSubHeading>
              <ProjectText>
                It was clear that the first release was missing some essential
                student features like checking available courses, calendar and
                news — due to lack of APIs and infrastructure from LMU. So we
                needed a way to show what the app can do, what is missing and
                actually give users a way to communicate their needs.
              </ProjectText>
              <ProjectText>
                For this we added a <TextMarker>wishlist</TextMarker>, where
                they were able to see and vote on current ideas. This addressed
                the high expectations students have for an app, and also gave us
                a way to prioritize what we would implement next.
              </ProjectText>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Making it Official */}
        <ProjectSection>
          <ProjectHeading>Making it Official</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              We definitely wanted to make the app look, feel and appear
              official. So we needed a legal way to call it the{" "}
              <TextMarker>„LMU Students" App</TextMarker>, which we decided to
              be the name after a long brainstorming session.
            </ProjectText>
            <ProjectText>
              This and other reasons led us to first found the university group{" "}
              <TextMarker>LMU Developers</TextMarker> and afterwards the student
              organization „Technik Referat" of the Student Council. I was
              officially elected to be the leader of those organizations, but we
              shared that role equally in our team. Everyone leads so everyone
              takes responsibility and has the ability to decide.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Stakeholders */}
        <ProjectSection>
          <ProjectHeading>Stakeholders</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Over the course of 2 years we met a lot of people. Something they
              had in common was they really loved what we were doing so far.
              Students (of course), but{" "}
              <TextMarker>
                also professors, the head of IT, and the new vice presidents
                Julia Dittrich and Philip Baaske
              </TextMarker>
              .
            </ProjectText>
            <ProjectText>
              Special thanks goes to <TextMarker>Prof. Florian Alt</TextMarker>{" "}
              and <TextMarker>Dr. Florian Behmann</TextMarker> who supported our
              journey.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Competition */}
        <ProjectSection>
          <ProjectHeading>Competition</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              In every step of our journey we compared ourselves to other
              companies or student organizations. To name some: UniNow, Studo,
              TUM Campus, Ingolstadt Neuland, ETH Zurich, TU Berlin, Stanford
              and more. The goal was clear:{" "}
              <TextMarker>
                extracting what works &amp; building it better
              </TextMarker>
              .
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Release */}
        <ProjectSection>
          <ProjectHeading>Release</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              After half a year, on 03.02.2025, we released our first internal
              beta version to the App Store and Play Store. We invited many
              friends and students who visited our official university{" "}
              <PencilUnderline href="https://www.linkedin.com/feed/update/urn:li:activity:7292482113751187457">
                exhibition
              </PencilUnderline>{" "}
              of the Media Informatics Group.
            </ProjectText>
            <GridSection className="max-w-text-content mx-auto flex items-center justify-center py-8">
              <Image
                src="/images/projects/lmu-app/beta-release.webp"
                alt="Beta Release"
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
            </GridSection>
            <ProjectText>
              Fresh to the start of the Summer Semester 25 we painted the final
              strokes and <TextMarker>released the app officially</TextMarker>.
            </ProjectText>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Design */}
        <ProjectSection>
          <ProjectHeading>Design</ProjectHeading>
          <ProjectSectionContent>
            <ProjectTextBlock>
              <ProjectSubHeading>Language</ProjectSubHeading>
              <ProjectText>
                The style I aimed for was{" "}
                <TextMarker>modern, simple and mobile friendly</TextMarker>. I
                took inspiration from other apps I very much enjoy using, like
                Revolut.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Design System</ProjectSubHeading>
              <ProjectText>
                The fundament of all designs: our design system. It was
                handcrafted by myself in{" "}
                <TextureIcon
                  src="/images/texture-icons/figma.webp"
                  alt="Figma"
                />{" "}
                Figma — with auto layout, variables, components and variants.
                Supporting light and dark mode and{" "}
                <TextMarker>over 100 custom components</TextMarker>.
              </ProjectText>
              <GridSection className="max-w-text-content mx-auto flex items-center justify-center py-8">
                <Image
                  src="/images/projects/lmu-app/designsystem_cover.webp"
                  alt="Beta Release"
                  width={1024}
                  height={1024}
                  className="w-full h-auto"
                />
              </GridSection>
              <ProjectText>
                The system was built in a way that can also be reproduced in
                code in our{" "}
                <TextureIcon
                  src="/images/texture-icons/flutter.webp"
                  alt="Flutter"
                />{" "}
                Flutter frontend. So when Paul and Lukas started with the
                frontend, the first step was to translate all the elements like
                colors, components etc. into a mirrored Flutter design system.
                This made designing and building UIs very fast.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Colors</ProjectSubHeading>
              <ProjectText>
                All color palettes were custom created with a{" "}
                <TextMarker>perceptually uniform colorspace</TextMarker> called
                OkLCH on{" "}
                <PencilUnderline href="https://oklch-palette.vercel.app/#70,0.1,134,100">
                  oklch-palette.vercel.app
                </PencilUnderline>
                . This ensured accessibility and contrast over all colors for
                the same value. E.g. a <InlineCode>yellow-10</InlineCode> has
                the same contrast as
                <InlineCode>red-10</InlineCode>.
              </ProjectText>
              <GridSection className="w-full mx-auto flex items-center justify-center py-8">
                <Image
                  src="/images/projects/lmu-app/oklab.gif"
                  alt="App Icon Light"
                  unoptimized
                  width={384}
                  height={384}
                />
              </GridSection>
              <ProjectText>
                Since our brand color is green, we chose it as our accent color
                — which isn&apos;t ideal because it can get confusing with
                success states. The gray palette was also derived from that and
                inherited a greenish tint.
              </ProjectText>
              <ProjectText>
                We added those palettes in a variable collection in{" "}
                <TextureIcon
                  src="/images/texture-icons/figma.webp"
                  alt="Figma"
                />{" "}
                Figma as primary color tokens and built a second semantic layer
                on top that was exposed to our design files.
              </ProjectText>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Backend */}
        <ProjectSection>
          <ProjectHeading>Backend</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              After talking to the head of IT at LMU, we knew they were using{" "}
              <TextureIcon
                src="/images/texture-icons/python.webp"
                alt="Python"
              />{" "}
              Python,{" "}
              <TextureIcon
                src="/images/texture-icons/fastapi.webp"
                alt="FastAPI"
              />{" "}
              FastAPI,{" "}
              <TextureIcon
                src="/images/texture-icons/docker.webp"
                alt="Docker"
              />{" "}
              Docker and{" "}
              <TextureIcon
                src="/images/texture-icons/postgres.webp"
                alt="Postgres"
              />{" "}
              Postgres. This answered the question which tech stack to use,
              since it also seemed pretty modern and easy to use.
            </ProjectText>
            <ProjectText>
              We started by connecting our domain{" "}
              <PencilUnderline href="http://api.lmu-dev.org">
                api.lmu-dev.org
              </PencilUnderline>{" "}
              to a Linux server hosted on Digital Ocean. Same for the staging
              environment. Our backend currently sits in a mono repo which spins
              up different{" "}
              <TextureIcon
                src="/images/texture-icons/docker.webp"
                alt="Docker"
              />{" "}
              Docker containers for the data_fetcher and the API, as well as the
              database and{" "}
              <TextureIcon src="/images/texture-icons/nginx.webp" alt="Nginx" />{" "}
              nginx as a proxy which we use for SSL management and port
              forwarding.
            </ProjectText>
            <GridSection className="max-w-text-content mx-auto flex items-center justify-center py-8">
              <Image
                src="/images/projects/lmu-app/backend-structure.png"
                alt="Backend Structure"
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
            </GridSection>

            <ProjectTextBlock>
              <ProjectSubHeading>Data Fetcher</ProjectSubHeading>
              <ProjectText>
                For each topic like food, cinema etc. we added a{" "}
                <TextMarker>time-scheduled scraper</TextMarker> to the container
                which then collected the data and saved it in our database.
              </ProjectText>
              <ProjectText>
                For some content like the libraries we had to deal with
                unstructured data, so we used LLMs to interpret what the website
                gave us and put it into a format we could save. Some websites
                were so cluttered it wasn&apos;t possible to solve with regex.
              </ProjectText>
              <ProjectText>
                For the canteen menus we did a similar thing — they were
                automatically translated with DeepL. Generally our approach was
                to improve the data quality we got with other APIs. We also did
                that for the movies: we added information like IMDb ratings,
                movie posters, trailers etc.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Database</ProjectSubHeading>
              <ProjectText>
                This was probably the hardest part —{" "}
                <TextMarker>getting the relations right</TextMarker>. Especially
                when you deal with translations, it isn&apos;t enough to just
                put a „title" column. We needed to create a new translation
                table with all fields that needed localization.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>API</ProjectSubHeading>
              <ProjectText>
                To implement the API fast I went with{" "}
                <TextureIcon
                  src="/images/texture-icons/fastapi.webp"
                  alt="FastAPI"
                />{" "}
                FastAPI. Each endpoint had its own Pydantic model which was also
                used as a response model, as well as a service layer to get the
                information from the DB and the router.
              </ProjectText>
              <ProjectText>
                Some endpoints were protected and only accessible with API keys
                of different scopes. Some endpoints have a soft protection. For
                example, getting canteen dishes will return a result
                authenticated or not, but when a user is recognized it also
                returns the dish likes for that user.
              </ProjectText>
              <ProjectText>
                Available endpoints can be found in the{" "}
                <PencilUnderline href="http://api.lmu-dev.org/docs">
                  API documentation
                </PencilUnderline>
                .
              </ProjectText>
              <ProjectText>
                To make the API more responsive we would like to add a Redis
                cache database.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>GitHub</ProjectSubHeading>
              <ProjectText>
                We used{" "}
                <TextureIcon
                  src="/images/texture-icons/github.webp"
                  alt="GitHub"
                />{" "}
                GitHub not only as a version control tool but also for project
                planning. Issues were always connected to branches.
              </ProjectText>
              <ProjectText>
                We also used <TextMarker>GitHub Actions</TextMarker> to
                automatically deploy the{" "}
                <TextureIcon
                  src="/images/texture-icons/docker.webp"
                  alt="Docker"
                />{" "}
                Docker containers and spin them up on staging/prod. This
                significantly improved our workflow since once something was
                merged with staging it would get deployed. To push to prod,
                another action took the staging Docker container, renamed it and
                published it over SSL on the prod server.
              </ProjectText>
            </ProjectTextBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Content Management</ProjectSubHeading>
              <ProjectText>
                There is some data you can&apos;t crawl... so you have to
                manage. We started content management with writing hardcoded
                values in the backend, then switched to API endpoints and
                finally settled on a CMS system. After some research we chose{" "}
                <TextureIcon
                  src="/images/texture-icons/directus.webp"
                  alt="Directus"
                />{" "}
                <TextMarker>Directus</TextMarker> (over Strapi) because it could
                be integrated into our current database.
              </ProjectText>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Frontend */}
        <ProjectSection>
          <ProjectHeading>Frontend</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Since Lukas and Paul are very familiar with{" "}
              <TextureIcon
                src="/images/texture-icons/flutter.webp"
                alt="Flutter"
              />{" "}
              <TextureIcon src="/images/texture-icons/dart.webp" alt="Dart" />{" "}
              <TextMarker>Flutter/Dart</TextMarker>, this was an obvious choice
              — also to support multi-platform development for iOS and Android.
            </ProjectText>
            <ProjectText>
              Working tightly in a cross-functional team was fantastic. This
              ensured the UI was set up exactly how it was intended. It really
              helped knowing how to code.
            </ProjectText>
            <ProjectText>
              The frontend was set up with each feature encapsulated as its own
              package. The design system was the core package used everywhere.
              This provided a very <TextMarker>clean architecture</TextMarker> —
              some would even call it over-engineering.
            </ProjectText>
            <GridSection className="max-w-text-content mx-auto flex items-center justify-center py-8">
              <Image
                src="/images/projects/lmu-app/frontendmvvm.png"
                alt="Frontend MVVM"
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
            </GridSection>
          </ProjectSectionContent>
        </ProjectSection>

        {/* What I Learned */}
        <ProjectSection>
          <ProjectHeading>What I Learned</ProjectHeading>
          <ProjectSectionContent>
            <ProjectUnorderedList>
              <li>
                <TextMarker>
                  UX and backend are a powerful combination
                </TextMarker>
                , because when you know how a UI should look like you also know
                exactly which data needs to be provided to the frontend.
              </li>
              <li>
                Onboarding new people in a long-running project takes a lot of
                time and is sometimes not worth it.
              </li>
              <li>
                {" "}
                <TextMarker>
                  Working with skilled people is really a blessing
                </TextMarker>
                . Especially if they have an eye for the details. Thanks to the
                best 2 frontend devs I know, Paul and Lukas ❤️
              </li>
              <li>
                Building an effective channel for user feedback is really
                important.
              </li>
            </ProjectUnorderedList>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContent>
    </main>
  );
}
