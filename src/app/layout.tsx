import NoiseOverlay from "@/components/NoiseOverlay";
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


export const metadata: Metadata = {
  title: "Raphael Wennmacher • Portfolio",
  description:
    "I focus on HCI, UX/UI systems, and AI interfaces. I craft digital products with intent. Based in munich, finishing my master’s in HCI and CS at LMU.",
  icons: {
    icon: "/favicon.png",
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
        {children}
      </body>
    </html>
  );
}
