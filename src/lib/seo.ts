import type { Metadata } from "next";

// Base SEO configuration
export const defaultMetadata: Metadata = {
  title: "GoFitLocal — Discover Gyms, Studios & Fitness Centers",
  description: "Find the best fitness facilities near you. Search gyms, yoga studios, CrossFit boxes, pilates studios, martial arts dojos, and more. Powered by Google Places.",
  keywords: [
    "gym finder",
    "fitness center",
    "yoga studio",
    "crossfit",
    "pilates",
    "martial arts",
    "fitness directory",
    "local gyms",
    "workout facilities",
    "fitness classes"
  ],
  authors: [{ name: "GoFitLocal" }],
  creator: "GoFitLocal",
  publisher: "GoFitLocal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gofitlocal.netlify.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GoFitLocal",
    title: "GoFitLocal — Discover Gyms, Studios & Fitness Centers",
    description: "Find the best fitness facilities near you. Search gyms, yoga studios, CrossFit boxes, pilates studios, martial arts dojos, and more.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Person lifting weights in a gym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoFitLocal — Discover Gyms, Studios & Fitness Centers",
    description: "Find the best fitness facilities near you. Search gyms, yoga studios, CrossFit boxes, pilates studios, martial arts dojos, and more.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Generate SEO-friendly metadata for facility pages
export function generateFacilityMetadata(facilityName: string, address: string): Metadata {
  const title = `${facilityName} - Fitness Facility | GoFitLocal`;
  const description = `Get details about ${facilityName} located at ${address}. View hours, photos, contact info, and more fitness facilities nearby.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

// Generate metadata for city pages
export function generateCityMetadata(city: string, state: string): Metadata {
  const title = `Best Gyms & Fitness Centers in ${city}, ${state} | GoFitLocal`;
  const description = `Discover top-rated gyms, yoga studios, CrossFit boxes, and fitness centers in ${city}, ${state}. Find hours, reviews, and contact information.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

// JSON-LD structured data for fitness facilities
export function generateFacilityJsonLd(facility: {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  hours?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: facility.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: facility.address,
    },
    telephone: facility.phone,
    url: facility.website,
    openingHours: facility.hours,
  };
}

// JSON-LD for the main website
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GoFitLocal",
  description: "Find the best fitness facilities near you",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gofitlocal.netlify.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://gofitlocal.netlify.app"}/?city={search_term_string}&state={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
