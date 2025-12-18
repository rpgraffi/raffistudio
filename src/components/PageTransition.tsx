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
  useState,
} from "react";

interface PageTransitionContextType {
  isExiting: boolean;
  navigateTo: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isExiting: false,
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

const FADE_OUT_DURATION = 0.3; // seconds

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

  const navigateTo = useCallback(
    (href: string) => {
      // Don't transition if same page
      if (href === pathname) return;

      setIsExiting(true);
      setPendingHref(href);
    },
    [pathname]
  );

  // Navigate after fade-out completes
  useEffect(() => {
    if (isExiting && pendingHref) {
      const timeout = setTimeout(() => {
        router.push(pendingHref);
      }, FADE_OUT_DURATION * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isExiting, pendingHref, router]);

  // Reset exit state when pathname changes (navigation complete)
  useEffect(() => {
    setIsExiting(false);
    setPendingHref(null);
  }, [pathname]);

  return (
    <PageTransitionContext.Provider value={{ isExiting, navigateTo }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

interface PageTransitionWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrap page content with this to enable fade-out on navigation.
 * The fade-in is handled by each page individually.
 */
export function PageTransitionWrapper({
  children,
  className,
}: PageTransitionWrapperProps) {
  const { isExiting } = usePageTransition();

  return (
    <motion.div
      className={className}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: FADE_OUT_DURATION, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface TransitionLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "onClick"> {
  children: ReactNode;
}

/**
 * A Link component that triggers the page fade-out transition before navigating.
 * Use this instead of next/link for internal navigation.
 */
export function TransitionLink({
  href,
  children,
  ...props
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow cmd/ctrl click for new tab
    if (e.metaKey || e.ctrlKey) return;

    const hrefString = typeof href === "string" ? href : href.pathname ?? "/";

    // Only handle internal links
    if (hrefString.startsWith("/")) {
      e.preventDefault();
      navigateTo(hrefString);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
