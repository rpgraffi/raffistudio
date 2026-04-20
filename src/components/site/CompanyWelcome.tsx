"use client";

import { TextMarker } from "@/components/natural-ui/TextMarker";
import { track } from "@vercel/analytics";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const COMPANY_MAX = 40;
const NOTE_MAX = 200;
const ROLE_MAX = 40;
const REF_MAX = 40;
const VISIT_KEY_PREFIX = "company-welcome:visited:";

function sanitize(raw: string | null, max: number): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/[<>]/g, "").slice(0, max);
  return cleaned.length > 0 ? cleaned : null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

type Word = {
  text: string;
  isCompany?: boolean;
  suffix?: string;
};

function buildLines(
  isReturning: boolean,
  greeting: string,
  company: string,
): { line1: Word[]; line2: Word[] } {
  const line1: Word[] = isReturning
    ? [
        { text: "Welcome" },
        { text: "back," },
        { text: company, isCompany: true, suffix: "." },
      ]
    : [
        { text: `${greeting},` },
        { text: company, isCompany: true, suffix: "." },
      ];

  const line2Text = isReturning
    ? "Glad you came around again."
    : "Glad to see you here.";
  const line2: Word[] = line2Text.split(" ").map((text) => ({ text }));

  return { line1, line2 };
}

function CompanyWelcomeInner() {
  const params = useSearchParams();
  const companyRaw = sanitize(params.get("com"), COMPANY_MAX);
  const company = companyRaw ? capitalize(companyRaw) : null;
  const role = sanitize(params.get("role"), ROLE_MAX);
  const ref = sanitize(params.get("ref"), REF_MAX);
  const note = sanitize(params.get("note"), NOTE_MAX);

  const [mounted, setMounted] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    if (!company) return;

    const key = VISIT_KEY_PREFIX + company.toLowerCase();
    let wasSeen = false;
    try {
      wasSeen = window.localStorage.getItem(key) !== null;
      window.localStorage.setItem(key, String(Date.now()));
    } catch {
      // localStorage can be unavailable (private mode, blocked) — not fatal.
    }
    setIsReturning(wasSeen);

    try {
      track("company_visit", {
        company,
        role: role ?? "",
        ref: ref ?? "",
        returning: wasSeen,
      });
    } catch {
      // Analytics is best-effort.
    }
  }, [company, role, ref]);

  useEffect(() => {
    if (!mounted || !company) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      const badge = section.querySelector<HTMLElement>(".welcome-badge");
      if (badge) {
        tl.fromTo(
          badge,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );
      }

      const words = section.querySelectorAll<HTMLElement>(".welcome-word");
      if (words.length > 0) {
        tl.fromTo(
          words,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
          },
          badge ? "-=0.2" : 0,
        );
      }

      const noteEl = section.querySelector<HTMLElement>(".welcome-note");
      if (noteEl) {
        tl.fromTo(
          noteEl,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2",
        );
      }

      // Scroll-linked fade: the section's opacity and y are a function of
      // the scroll position, so scrolling back up smoothly brings it back.
      // Only transform and opacity are animated — no layout thrash.
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.to(section, {
          opacity: 0,
          y: -30,
          ease: "none",
        }),
      });

      // After the intro, auto-scroll to the real hero. `autoKill` bails
      // if the user takes over scrolling themselves.
      const nextSection = section.nextElementSibling as HTMLElement | null;
      tl.to(
        window,
        {
          scrollTo: nextSection
            ? { y: nextSection, autoKill: true }
            : { y: window.innerHeight, autoKill: true },
          duration: 1.2,
          ease: "power2.inOut",
        },
        "+=1.5",
      );
    }, section);

    return () => ctx.revert();
  }, [mounted, company]);

  if (!company) return null;

  if (!mounted) {
    return <section aria-hidden className="min-h-screen w-full" />;
  }

  const greeting = getGreeting();
  const { line1, line2 } = buildLines(isReturning, greeting, company);

  return (
    <section
      ref={sectionRef}
      aria-label={`Welcome ${company}`}
      className="min-h-screen w-full max-w-site mx-auto px-8 flex flex-col justify-center gap-10"
    >
      
            {role ? (
              <div className="welcome-badge self-start" style={{ opacity: 0 }}>
                <AvailabilityBadge role={role} />
              </div>
            ) : null}
      <h1 className="text-3xl md:text-5xl font-medium text-zinc-900 leading-tight">
        <WordLine words={line1} keyPrefix="l1" />
        <br />
        <WordLine words={line2} keyPrefix="l2" />
      </h1>

      {note ? (
        <p
        className="welcome-note max-w-2xl text-lg md:text-xl text-zinc-700 leading-relaxed"
        style={{ opacity: 0 }}
        >
          {note}
        </p>
      ) : null}
    </section>
  );
}

function WordLine({ words, keyPrefix }: { words: Word[]; keyPrefix: string }) {
  return (
    <span className="inline">
      {words.map((w, i) => (
        <span key={`${keyPrefix}-${i}`}>
          <span
            className="welcome-word inline-block"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            {w.isCompany ? (
              <>
                <TextMarker color="#facc15" paddingX={6} paddingY={0}>
                  {w.text}
                </TextMarker>
                {w.suffix ?? ""}
              </>
            ) : (
              w.text
            )}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

function AvailabilityBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 self-start px-3.5 py-1.5 rounded-full bg-white/70 text-sm font-medium text-zinc-800">
      <span className="relative flex h-2.5 w-2.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <span>
        Applying for <span className="text-zinc-900">{role}</span>
      </span>
    </span>
  );
}

export function CompanyWelcome() {
  return (
    <Suspense fallback={null}>
      <CompanyWelcomeInner />
    </Suspense>
  );
}
