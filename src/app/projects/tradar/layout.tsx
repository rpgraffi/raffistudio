import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tradar",
  description:
    "Case study: Tradar — a UX/UI and web design project featuring animations, user flows, and interactive prototypes. Built with React and Rive. Munich, 2023.",
  openGraph: {
    title: "Tradar • Raphael Wennmacher",
    description:
      "Case study: Tradar — a UX/UI and web design project featuring animations, user flows, and interactive prototypes. Built with React and Rive. Munich, 2023.",
    url: "https://raffi.studio/projects/tradar",
    images: [
      {
        url: "/images/project/work-cards/tradar.avif",
        width: 1200,
        height: 630,
        alt: "Tradar project — Raphael Wennmacher",
      },
    ],
  },
  twitter: {
    title: "Tradar • Raphael Wennmacher",
    description:
      "Case study: Tradar — a UX/UI and web design project featuring animations, user flows, and interactive prototypes. Built with React and Rive. Munich, 2023.",
    images: ["/images/project/work-cards/tradar.avif"],
  },
};

export default function TradarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
