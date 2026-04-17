"use client";

import {
  animate as fmAnimate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type TransitionDirection = "forward" | "backward";

interface ClickPosition {
  x: number;
  y: number;
}

interface PageTransitionContextType {
  isExiting: boolean;
  direction: TransitionDirection;
  navigateTo: (href: string, clickPos?: ClickPosition) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isExiting: false,
  direction: "forward",
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

const TRANSITION_DURATION = 0.9;
const ENTER_DURATION = 0.8;
const ENTER_DELAY = 0.3;
const CONTENT_FADE_DELAY = 0.3;
const BLUR_AMOUNT = 20;
const INNER_RADIUS_PCT = 0.1;

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({
  children,
}: PageTransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [direction, setDirection] = useState<TransitionDirection>("forward");
  const [clickPosition, setClickPosition] = useState<ClickPosition | null>(
    null,
  );

  const radius = useMotionValue(0);
  const innerRadius = useTransform(radius, (r) => r * INNER_RADIUS_PCT);
  const animRef = useRef<ReturnType<typeof fmAnimate> | null>(null);
  const maxRadiusRef = useRef(2500);

  const cx = clickPosition?.x ?? 0;
  const cy = clickPosition?.y ?? 0;

  const maskImage = useMotionTemplate`radial-gradient(circle at ${cx}px ${cy}px, black ${innerRadius}px, transparent ${radius}px)`;

  const navigateTo = useCallback(
    (href: string, clickPos?: ClickPosition) => {
      if (href === pathname) return;

      const currentDepth = pathname.split("/").filter(Boolean).length;
      const targetDepth = href.split("/").filter(Boolean).length;

      setDirection(targetDepth > currentDepth ? "forward" : "backward");
      setClickPosition(
        clickPos ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      );
      maxRadiusRef.current =
        Math.hypot(window.innerWidth, window.innerHeight) * 2;
      setIsExiting(true);
      setPendingHref(href);
    },
    [pathname],
  );

  useEffect(() => {
    if (isExiting && clickPosition) {
      animRef.current?.stop();
      radius.jump(0);
      animRef.current = fmAnimate(radius, maxRadiusRef.current, {
        duration: TRANSITION_DURATION,
        ease: [0.4, 0, 0.2, 1],
      });
    }
  }, [isExiting, clickPosition, radius]);

  useEffect(() => {
    if (isExiting && pendingHref) {
      const timeout = setTimeout(() => {
        router.push(pendingHref);
      }, TRANSITION_DURATION * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isExiting, pendingHref, router]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setIsExiting(false);
    setPendingHref(null);
    setClickPosition(null);
    animRef.current?.stop();
    radius.jump(0);
  }, [pathname, radius]);

  return (
    <PageTransitionContext.Provider
      value={{ isExiting, direction, navigateTo }}
    >
      {children}

      {/* Progressive radial blur */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-9999"
        style={{
          backdropFilter: `blur(${BLUR_AMOUNT}px)`,
          WebkitBackdropFilter: `blur(${BLUR_AMOUNT}px)`,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
        animate={{ opacity: isExiting ? 1 : 0 }}
        transition={{
          opacity: { duration: isExiting ? 0 : ENTER_DELAY + 0.2 },
        }}
      />

      {/* White radial glow from click point */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-9999"
        style={{
          background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.06) 35%, transparent 70%)`,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
        animate={{ opacity: isExiting ? 1 : 0 }}
        transition={{
          opacity: { duration: isExiting ? 0 : ENTER_DELAY + 0.2 },
        }}
      />
    </PageTransitionContext.Provider>
  );
}

interface PageTransitionWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageTransitionWrapper({
  children,
  className,
}: PageTransitionWrapperProps) {
  const { isExiting } = usePageTransition();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: isExiting
          ? TRANSITION_DURATION - CONTENT_FADE_DELAY
          : ENTER_DURATION,
        ease: isExiting ? [0.4, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
        delay: isExiting ? CONTENT_FADE_DELAY : ENTER_DELAY,
      }}
    >
      {children}
    </motion.div>
  );
}

interface TransitionLinkProps extends Omit<
  React.ComponentProps<typeof Link>,
  "onClick"
> {
  children: ReactNode;
}

export function TransitionLink({
  href,
  children,
  ...props
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;

    const hrefString = typeof href === "string" ? href : (href.pathname ?? "/");

    if (hrefString.startsWith("/")) {
      e.preventDefault();
      navigateTo(hrefString, { x: e.clientX, y: e.clientY });
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
