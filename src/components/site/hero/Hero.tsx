"use client";

import { PencilUnderline } from "@/components/natural-ui/PencilStroke";
import { RuledText } from "@/components/natural-ui/RuledText";
import { Mail } from "@/components/site/hero/Mail";
import { Resume } from "@/components/site/hero/Resume";
import { useLoading } from "@/context/LoadingContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const HEADING = "I love to design and develop digital products.";

const DESCRIPTION =
  "Always up to date, and obsessed with the details. I understand products holistically, from the user all the way to the customer's door, and build things people actually want to buy. Freelancing for 5+ years while studying at LMU Munich.";

function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((chunk) => chunk.length > 0);
}

function groupByLine(elements: HTMLElement[]): HTMLElement[][] {
  const buckets = new Map<number, HTMLElement[]>();
  elements.forEach((el) => {
    const top = Math.round(el.offsetTop);
    const bucket = buckets.get(top);
    if (bucket) bucket.push(el);
    else buckets.set(top, [el]);
  });
  return Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, group]) => group);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLoading } = useLoading();

  // Tracks whether the ruled-line reveal animation has completed.
  // Passed to RuledText so that any re-renders after the animation (e.g. from
  // mobile URL-bar resize) render lines as immediately visible instead of hidden.
  const [linesRevealed, setLinesRevealed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (isLoading) return;

    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const headingWords =
      section.querySelectorAll<HTMLElement>(".hero-heading-word");
    const descWords = Array.from(
      section.querySelectorAll<HTMLElement>(".hero-desc-word"),
    );
    const links = section.querySelectorAll<HTMLElement>(".hero-link");
    const icons = section.querySelectorAll<HTMLElement>(".hero-icon");
    const image = section.querySelector<HTMLElement>(".hero-image");

    gsap.set(headingWords, { opacity: 0, yPercent: 55 });
    gsap.set(descWords, { opacity: 0, y: 10 });
    gsap.set(links, { opacity: 0, x: -28 });
    gsap.set(icons, { opacity: 0, y: 12 });
    if (image) gsap.set(image, { opacity: 0, scale: 0.94 });

    if (prefersReduced) {
      // linesRevealed is already true when prefersReduced (lazy-initialised above),
      // so RuledText renders the clip-path fully open. Just reveal the other elements.
      gsap.set([headingWords, descWords, links, icons], {
        opacity: 1,
        x: 0,
        y: 0,
        yPercent: 0,
      });
      if (image) gsap.set(image, { opacity: 1, scale: 1 });
      return;
    }

    let rafId = 0;
    let cancelled = false;
    let timelineReady = false;
    let introTl: gsap.core.Timeline | null = null;

    const runIntro = () => {
      if (cancelled || timelineReady) return;

      const ruledLinesNow = section.querySelectorAll<HTMLElement>(
        "[data-ruled-line]",
      );

      if (ruledLinesNow.length === 0) {
        rafId = requestAnimationFrame(runIntro);
        return;
      }

      timelineReady = true;

      const descLines = groupByLine(descWords);

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setLinesRevealed(true),
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });
      introTl = tl;

      if (image) {
        tl.to(
          image,
          { opacity: 1, scale: 1, duration: 0.85, ease: "power2.out" },
          0,
        );
      }

      tl.to(
        headingWords,
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.48,
          stagger: 0.04,
        },
        0.02,
      );

      tl.to(
        links,
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.055,
          ease: "power2.out",
        },
        0.38,
      );

      const LINE_STAGGER = 0.15;

      descLines.forEach((line, i) => {
        const lineStart = 0.22 + i * LINE_STAGGER;

        tl.to(
          line,
          { opacity: 1, y: 0, duration: 1.0 },
          lineStart,
        );

        const stroke = ruledLinesNow[i];
        if (stroke) {
          tl.to(
            stroke,
            { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "power3.out" },
            lineStart + 0.15,
          );
        }
      });

      tl.to(
        icons,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "back.out(1.25)",
        },
        "-=0.35",
      );
    };

    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(runIntro);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      introTl?.kill();
    };
  }, [isLoading]);

  // Memoised so RuledText's children reference stays stable between renders
  // (e.g. when linesRevealed flips). This prevents a spurious measure() call
  // inside RuledText that would otherwise re-run on every Hero re-render.
  const headingWordElements = useMemo(
    () =>
      splitWords(HEADING).map((chunk, i) =>
        /^\s+$/.test(chunk) ? (
          <React.Fragment key={i}>{chunk}</React.Fragment>
        ) : (
          <span
            key={i}
            className="hero-heading-word inline-block will-change-transform"
          >
            {chunk}
          </span>
        ),
      ),
    [],
  );

  const descWordElements = useMemo(
    () =>
      splitWords(DESCRIPTION).map((chunk, i) =>
        /^\s+$/.test(chunk) ? (
          <React.Fragment key={i}>{chunk}</React.Fragment>
        ) : (
          <span key={i} className="hero-desc-word inline-block will-change-transform">
            {chunk}
          </span>
        ),
      ),
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full max-w-site mx-auto px-8 py-12 flex items-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
        <div className="order-2 lg:order-1 flex flex-col gap-10 items-start">
          <h1 className="text-3xl md:text-5xl font-medium text-zinc-800">
            {headingWordElements}
          </h1>

          <div className="hero-desc w-full">
            <RuledText
              className="text-lg max-w-xl leading-8"
              revealed={linesRevealed}
            >
              {descWordElements}
            </RuledText>
          </div>

          <div className="flex gap-4">
            <span className="hero-link inline-block will-change-transform">
              <PencilUnderline href="https://github.com/rpgraffi">
                GitHub
              </PencilUnderline>
            </span>
            <span className="hero-link inline-block will-change-transform">
              <PencilUnderline href="https://www.linkedin.com/in/raphael-wennmacher/">
                LinkedIn
              </PencilUnderline>
            </span>
            <span className="hero-link inline-block will-change-transform">
              <PencilUnderline href="https://www.instagram.com/raffis.insta/">
                Instagram
              </PencilUnderline>
            </span>
          </div>

          <div className="flex flex-row gap-12 items-center mt-8">
            <span className="hero-icon inline-block will-change-transform">
              <Mail width={100} url="mailto:me@raffi.studio" />
            </span>
            <span className="hero-icon inline-block will-change-transform">
              <Resume
                width={80}
                url="/files/resume.pdf"
                filename="Raphael-Wennmacher-Resume.pdf"
              />
            </span>
          </div>
        </div>

        <div className="hero-image order-1 lg:order-2 w-full h-[45vh] sm:h-[55vh] lg:h-[70vh] relative rounded-2xl overflow-hidden will-change-transform">
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
  );
}
