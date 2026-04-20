import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShadowBackground v2 — Demo",
  description:
    "Interactive demo: ShadowBackground v2 — single-layer wind influence map shadow with per-pixel phase-offset animation.",
  openGraph: {
    title: "ShadowBackground v2 Demo • Raphael Wennmacher",
    description:
      "Interactive demo: ShadowBackground v2 — single-layer wind influence map shadow with per-pixel phase-offset animation.",
  },
};

export default function ShadowBackgroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
