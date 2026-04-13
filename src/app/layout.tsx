import NoiseOverlay from "@/components/NoiseOverlay";
import { PageTransitionProvider } from "@/components/PageTransition";
import ShadowBackground from "@/components/shadows/ShadowBackground";
import type { Metadata } from "next";
import { Caveat, Fira_Code, Heebo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const sentient = localFont({
  src: [
    {
      path: "../fonts/sentient/Sentient-Variable.woff2",
      style: "normal",
    },
    {
      path: "../fonts/sentient/Sentient-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-sentient",
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
});

const baseUrl = "https://raffi.studio";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Raphael Wennmacher • Portfolio",
    template: "%s • Raphael Wennmacher",
  },
  description:
    "I focus on HCI, UX/UI systems, and AI interfaces. I craft digital products with intent. Based in Munich, finishing my master's in HCI and CS at LMU.",
  keywords: [
    "HCI",
    "UX design",
    "UI design",
    "portfolio",
    "Munich",
    "AI interfaces",
    "product design",
    "freelance designer",
    "LMU",
  ],
  authors: [{ name: "Raphael Wennmacher", url: baseUrl }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Raphael Wennmacher",
    title: "Raphael Wennmacher • Portfolio",
    description:
      "I focus on HCI, UX/UI systems, and AI interfaces. I craft digital products with intent. Based in Munich, finishing my master's in HCI and CS at LMU.",
    images: [
      {
        url: "/images/Profile.webp",
        width: 1200,
        height: 630,
        alt: "Raphael Wennmacher — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raphael Wennmacher • Portfolio",
    description:
      "I focus on HCI, UX/UI systems, and AI interfaces. I craft digital products with intent. Based in Munich, finishing my master's in HCI and CS at LMU.",
    images: ["/images/Profile.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sentient.variable} ${firaCode.variable} ${caveat.variable} ${heebo.variable} antialiased relative min-h-screen`}
      >
        <NoiseOverlay />
        {/* Persistent ShadowBackground - stays across page navigations */}
        <div className="fixed inset-0 z-[-1] mix-blend-multiply pointer-events-none opacity-70">
          <ShadowBackground className="h-lvh w-lvw" />
        </div>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
