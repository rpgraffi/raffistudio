"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Module-level singleton — lets sibling components call {@link scrollToWithLenis} without context or prop-drilling. */
let _lenis: Lenis | null = null;

type LenisScrollToOptions = Parameters<Lenis["scrollTo"]>[1];

/** Scroll to a target via Lenis, keeping it in sync with the smooth-scroll loop.
 *  Falls back to native scroll when Lenis hasn't initialised yet. */
export function scrollToWithLenis(
  target: HTMLElement | number,
  options?: LenisScrollToOptions,
) {
  if (_lenis) {
    _lenis.scrollTo(target, options);
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis();
    _lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      _lenis = null;
    };
  }, []);

  return <>{children}</>;
}
