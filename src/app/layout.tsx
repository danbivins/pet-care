import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/Analytics";
import { defaultMetadata, websiteJsonLd } from "@/lib/seo";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-block w-6 h-6 bg-black rounded-sm" aria-hidden />
                <span className="font-extrabold text-xl tracking-tight">GoFitLocal</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  Blog
                </Link>
                <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="mt-16 border-t">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p>© {new Date().getFullYear()} GoFitLocal. All rights reserved.</p>
              <div className="flex gap-4">
                <Link className="hover:underline" href="/cities">Popular Cities</Link>
                <Link className="hover:underline" href="/blog">Blog</Link>
                <Link className="hover:underline" href="/how-it-works">How It Works</Link>
                <Link className="hover:underline" href="/legal">Legal & Sources</Link>
              </div>
            </div>
          </footer>
        </Providers>
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
