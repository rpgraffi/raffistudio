import NoiseOverlay from "@/components/layout/NoiseOverlay";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { PageTransitionProvider } from "@/components/layout/PageTransition";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LoadingProvider } from "@/context/LoadingContext";
import { ShadowBackground } from "@/components/shadows/ShadowBackground";
import type { Metadata } from "next";
import { Fira_Code, Heebo } from "next/font/google";
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

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
});

const baseUrl = "https://raffi.studio";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Raphael Wennmacher",
  url: baseUrl,
  email: "me@raffi.studio",
  jobTitle: "UX/UI Designer & Developer",
  description:
    "HCI researcher, UX/UI designer, and developer based in Munich. Finishing a master's in HCI and CS at LMU.",
  sameAs: [
    "https://github.com/rpgraffi",
    "https://www.linkedin.com/in/raphael-wennmacher/",
    "https://www.instagram.com/raffis.insta/",
  ],
  knowsAbout: ["HCI", "UX Design", "UI Systems", "AI Interfaces", "Product Design"],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Ludwig Maximilian University of Munich",
    url: "https://www.lmu.de",
  },
};

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
        url: "/images/Profile.avif",
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
    images: ["/images/Profile.avif"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${sentient.variable} ${firaCode.variable} ${heebo.variable} antialiased relative min-h-screen`}
      >
        <LoadingProvider>
          <LoadingScreen />
          <NoiseOverlay />
          {/* Persistent ShadowBackground - stays across page navigations */}
          <div className="fixed top-0 left-0 h-lvh w-full z-[-1] mix-blend-multiply pointer-events-none">
            <ShadowBackground className="h-lvh w-full" shadowScale={0.8} />
          </div>
          <SmoothScroll>
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </SmoothScroll>
        </LoadingProvider>
      </body>
    </html>
  );
}
