"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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
  clickPosition: ClickPosition | null;
  navigateTo: (href: string, clickPos?: ClickPosition) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isExiting: false,
  direction: "forward",
  clickPosition: null,
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

const TRANSITION_DURATION = 0.4;
const ENTER_DURATION = 0.8;
const ENTER_DELAY = 0.3;

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

  const navigateTo = useCallback(
    (href: string, clickPos?: ClickPosition) => {
      if (href === pathname) return;

      const currentDepth = pathname.split("/").filter(Boolean).length;
      const targetDepth = href.split("/").filter(Boolean).length;

      setDirection(targetDepth > currentDepth ? "forward" : "backward");
      setClickPosition(clickPos ?? null);
      setIsExiting(true);
      setPendingHref(href);
    },
    [pathname],
  );

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
  }, [pathname]);

  return (
    <PageTransitionContext.Provider
      value={{ isExiting, direction, clickPosition, navigateTo }}
    >
      {children}
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
  const { isExiting, direction, clickPosition } = usePageTransition();

  const exitScale = direction === "forward" ? 1.15 : 0.85;

  const origin =
    isExiting && clickPosition
      ? `${clickPosition.x}px ${clickPosition.y}px`
      : undefined;

  return (
    <>
      {/* Backdrop-filter overlay — cheaper than filter on the whole subtree */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-9999"
        animate={{
          backdropFilter: isExiting ? "blur(12px)" : "blur(0px)",
          opacity: isExiting ? 1 : 0,
        }}
        transition={{ duration: TRANSITION_DURATION, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Content — scale + opacity with entrance and exit animations */}
      <motion.div
        className={className}
        style={origin ? { transformOrigin: origin } : undefined}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? exitScale : 1,
        }}
        transition={{
          duration: isExiting ? TRANSITION_DURATION : ENTER_DURATION,
          ease: isExiting ? [0.4, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
          delay: isExiting ? 0 : ENTER_DELAY,
        }}
      >
        {children}
      </motion.div>
    </>
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
      navigateTo(hrefString, { x: e.pageX, y: e.pageY });
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
