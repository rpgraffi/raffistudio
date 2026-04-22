"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const postcards = [
  { src: "/images/reviews/postcard-tim.webp", alt: "Review from Tim" },
  { src: "/images/reviews/postcard-ingrid.webp", alt: "Review from Ingrid" },
  { src: "/images/reviews/postcard-tommy.webp", alt: "Review from Tommy" },
  { src: "/images/reviews/postcard-lukas.webp", alt: "Review from Lukas" },
];

const SEED_ROTATIONS = [2.4, -3.1, 1.0, -1.6];

export function ReviewStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    if (!section || !stack) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        y: "110vh",
        rotateX: 130,
        scale: 3,
        opacity: 0.50,
        transformPerspective: 800,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          pin: stack,
        },
      });

      cards.forEach((card, i) => {
        const landRotation = SEED_ROTATIONS[i];

        tl.to(
          card,
          {
            y: 0,
            rotateX: 0,
            rotateZ: landRotation,
            scale: 1,
            opacity: 1,
            transformPerspective: 800,
            duration: 1,
            ease: "circ.out",
          },
          i * 0.9,
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${(postcards.length + 1) * 50}vh` }}>
      <div ref={stackRef} className="h-screen w-full flex items-center justify-center">
        <h2 className="absolute inset-0 flex items-center justify-center text-center text-4xl md:text-6xl font-bold text-foreground pointer-events-none select-none z-0">
          Love from my<br />colleagues
        </h2>
        <div className="relative w-[90vw] max-w-[600px] aspect-900/628">
          {postcards.map((card, i) => (
            <div
              key={card.src}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="absolute inset-0 will-change-transform [box-shadow:0_4px_8px_rgba(0,0,0,0.18)]"
              style={{ zIndex: i + 1 }}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 400px, (max-width: 768px) 520px, 640px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
