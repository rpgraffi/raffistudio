import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMU Students App",
  description:
    "Case study: LMU Students App — a full-stack mobile app redesign for LMU Munich students. UX design, Flutter frontend, Python/FastAPI backend, PostgreSQL. Munich, Fall 2024.",
  openGraph: {
    title: "LMU Students App • Raphael Wennmacher",
    description:
      "Case study: LMU Students App — a full-stack mobile app redesign for LMU Munich students. UX design, Flutter frontend, Python/FastAPI backend, PostgreSQL. Munich, Fall 2024.",
    url: "https://raffi.studio/projects/lmu-app",
    images: [
      {
        url: "/images/project/work-cards/lmu.avif",
        width: 1200,
        height: 630,
        alt: "LMU Students App — Raphael Wennmacher",
      },
    ],
  },
  twitter: {
    title: "LMU Students App • Raphael Wennmacher",
    description:
      "Case study: LMU Students App — a full-stack mobile app redesign for LMU Munich students. UX design, Flutter frontend, Python/FastAPI backend, PostgreSQL. Munich, Fall 2024.",
    images: ["/images/project/work-cards/lmu.avif"],
  },
};

export default function LmuAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
