import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE = "7stories.com";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE}`),
  title: {
    default: "7stories — AI cinematic storytelling studio",
    template: "%s — 7stories",
  },
  description:
    "Turn any moment, brand, or project into a cinematic story with an AI-generated cover image or film. Pick a category, add photos, choose your models, and get a story that moves people.",
  keywords: [
    "AI storytelling",
    "cinematic story generator",
    "AI video generator",
    "wedding story",
    "brand story",
    "customer story",
    "AI image generator",
    "7stories",
  ],
  openGraph: {
    type: "website",
    siteName: "7stories",
    url: `https://${SITE}`,
    title: "7stories — AI cinematic storytelling studio",
    description:
      "Turn any moment, brand, or project into a cinematic story with an AI-generated cover image or film. Pick a category, add photos, choose your models.",
    locale: "en_US",
    images: [{ url: `/og.png`, width: 1200, height: 630, alt: "7stories" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "7stories — AI cinematic storytelling studio",
    description: "Turn any moment into a cinematic story with AI.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `https://${SITE}` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Structured data — WebSite + Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "WebSite", name: "7stories", url: `https://${SITE}`, potentialAction: { "@type": "SearchAction", target: `https://${SITE}/?q={q}`, "query-input": "required name=q" } },
                { "@type": "Organization", name: "7stories", url: `https://${SITE}`, logo: `https://${SITE}/favicon.ico` },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
