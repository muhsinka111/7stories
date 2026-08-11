import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "7stories — Every brand has a story. Tell the right one.",
  description:
    "Turn your raw product facts into on-brand customer stories built on the seven timeless narrative arcs. The AI storytelling workspace for marketers, founders, and agencies.",
  openGraph: {
    title: "7stories — Every brand has a story. Tell the right one.",
    description:
      "Pick one of the seven basic plots. Paste your facts. Get a story your customers actually feel.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
