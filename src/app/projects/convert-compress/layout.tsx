import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert & Compress",
  description:
    "Case study: Convert & Compress — a native macOS app for image conversion and compression. Swift, UX design, and marketing. Munich, Winter 2025.",
  openGraph: {
    title: "Convert & Compress • Raphael Wennmacher",
    description:
      "Case study: Convert & Compress — a native macOS app for image conversion and compression. Swift, UX design, and marketing. Munich, Winter 2025.",
    url: "https://raffi.studio/projects/convert-compress",
    images: [
      {
        url: "/images/project/work-cards/onepager.webp",
        width: 1200,
        height: 630,
        alt: "Convert & Compress — Raphael Wennmacher",
      },
    ],
  },
  twitter: {
    title: "Convert & Compress • Raphael Wennmacher",
    description:
      "Case study: Convert & Compress — a native macOS app for image conversion and compression. Swift, UX design, and marketing. Munich, Winter 2025.",
    images: ["/images/project/work-cards/onepager.webp"],
  },
};

export default function ConvertCompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
