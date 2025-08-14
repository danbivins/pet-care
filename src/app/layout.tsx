import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
// Analytics imports removed - using Google Analytics only
import { GoogleAnalytics } from "@/components/Analytics";
import { defaultMetadata, websiteJsonLd } from "@/lib/seo";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
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
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        
        {/* Critical CSS and fonts */}
        <link rel="preload" href="/hero.jpg" as="image" fetchPriority="high" />
        
        {/* Inline critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: var(--font-geist-sans), system-ui, sans-serif; }
            .skip-link { position: absolute; top: -40px; left: 6px; z-index: 1000; }
            .skip-link:focus { top: 6px; }
            header { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(0,0,0,0.1); }
            .max-w-6xl { max-width: 72rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .h-14 { height: 3.5rem; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .gap-3 { gap: 0.75rem; }
            .w-6 { width: 1.5rem; }
            .h-6 { height: 1.5rem; }
            .bg-black { background-color: #000; }
            .rounded-sm { border-radius: 0.125rem; }
            .font-extrabold { font-weight: 800; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .tracking-tight { letter-spacing: -0.025em; }
            .hidden { display: none; }
            .md\\:flex { display: none; }
            @media (min-width: 768px) { .md\\:flex { display: flex; } }
            .gap-6 { gap: 1.5rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .hover\\:text-blue-600:hover { color: #2563eb; }
            .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
          `
        }} />
        
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XZ0FK0DZ9M`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XZ0FK0DZ9M');
          `}
        </Script>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b" role="banner">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-block w-6 h-6 logo rounded-sm" aria-hidden />
                <span className="font-extrabold text-xl tracking-tight logo-name">LocalPetGuide</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm" role="navigation" aria-label="Main navigation">
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  Blog
                </Link>
                <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </nav>
            </div>
          </header>
          <main id="main-content" role="main">
            {children}
          </main>
          <footer className="mt-16 border-t" role="contentinfo">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p>© {new Date().getFullYear()} LocalPetGuide. All rights reserved.</p>
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
      </body>
    </html>
  );
}
