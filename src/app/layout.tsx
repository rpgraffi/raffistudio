import NoiseOverlay from "@/components/NoiseOverlay";
import type { Metadata } from "next";
import { Fira_Code, Geist, Geist_Mono, Inter } from "next/font/google";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${inter.variable} ${sentient.variable} ${firaCode.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
