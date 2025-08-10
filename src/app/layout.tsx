import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoFitLocal — Discover Gyms, Studios & Fitness Centers",
  description:
    "Search gyms, yoga, CrossFit, pilates, martial arts, and more. Powered by Google Places.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-block w-6 h-6 bg-black rounded-sm" aria-hidden />
                <span className="font-extrabold text-xl tracking-tight">GoFitLocal</span>
              </Link>
            </div>
          </header>
          {children}
          <footer className="mt-16 border-t">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p>© {new Date().getFullYear()} GoFitLocal. All rights reserved.</p>
              <div className="flex gap-4">
                <a className="hover:underline" href="/legal">Legal & Sources</a>
              </div>
            </div>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
