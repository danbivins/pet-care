import type { Metadata } from "next";

// Base SEO configuration
export const defaultMetadata: Metadata = {
  title: "PetCareLocal — Find Trusted Pet Care Services Near You",
  description: "Discover vetted veterinarians, groomers, trainers, and pet sitters in your local area. Compare services, read reviews, and book appointments with confidence.",
  keywords: [
    "veterinarian",
    "pet care",
    "dog grooming",
    "pet boarding",
    "pet training",
    "animal hospital",
    "emergency vet",
    "pet services",
    "pet sitting",
    "pet daycare",
    "local vet",
    "pet care directory"
  ],
  authors: [{ name: "PetCareLocal" }],
  creator: "PetCareLocal",
  publisher: "PetCareLocal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://petcarelocal.netlify.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "PetCareLocal",
    title: "PetCareLocal — Find Trusted Pet Care Services Near You",
    description: "Discover vetted veterinarians, groomers, trainers, and pet sitters in your local area. Compare services, read reviews, and book appointments.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Happy pet owner with their dog at a veterinary clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PetCareLocal — Find Trusted Pet Care Services Near You",
    description: "Discover vetted veterinarians, groomers, trainers, and pet sitters in your local area. Compare services and read reviews.",
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

// Generate SEO-friendly metadata for pet service pages
export function generatePetServiceMetadata(serviceName: string, address: string, serviceType: string): Metadata {
  const title = `${serviceName} - ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services | PetCareLocal`;
  const description = `Get details about ${serviceName} located at ${address}. View hours, services, reviews, and contact info for ${serviceType} care.`;
  
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
  const title = `Best Pet Care Services in ${city}, ${state} | PetCareLocal`;
  const description = `Find trusted veterinarians, pet groomers, boarding facilities, and trainers in ${city}, ${state}. Read reviews, compare services, and book appointments.`;
  
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

// Generate metadata for service type pages
export function generateServiceTypeMetadata(serviceType: string, city?: string, state?: string): Metadata {
  const location = city && state ? ` in ${city}, ${state}` : "";
  const title = `Best ${serviceType} Services${location} | PetCareLocal`;
  const description = `Find top-rated ${serviceType} services${location}. Compare providers, read reviews, and book appointments with trusted professionals.`;
  
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

// JSON-LD structured data for pet services
export function generatePetServiceJsonLd(service: {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  serviceType: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  latitude?: number;
  longitude?: number;
}) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: service.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: service.address,
    },
    telephone: service.phone,
    url: service.website,
    priceRange: service.priceRange,
  };

  // Add location if available
  if (service.latitude && service.longitude) {
    (baseSchema as any).geo = {
      "@type": "GeoCoordinates",
      latitude: service.latitude,
      longitude: service.longitude,
    };
  }

  // Add ratings if available
  if (service.rating && service.reviewCount) {
    (baseSchema as any).aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: service.rating,
      reviewCount: service.reviewCount,
    };
  }

  // Specify more specific business type based on service type
  switch (service.serviceType) {
    case "veterinary":
      (baseSchema as any)["@type"] = "VeterinaryCare";
      break;
    case "grooming":
      (baseSchema as any).additionalType = "https://schema.org/PetGroomer";
      break;
    case "boarding":
      (baseSchema as any).additionalType = "https://schema.org/PetBoardingService";
      break;
    case "training":
      (baseSchema as any).additionalType = "https://schema.org/PetTrainer";
      break;
    default:
      (baseSchema as any).additionalType = "https://schema.org/PetCare";
  }

  return baseSchema;
}

// JSON-LD for the main website
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PetCareLocal",
  description: "Find trusted pet care services near you",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://petcarelocal.netlify.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://petcarelocal.netlify.app"}/?city={search_term_string}&state={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "PetCareLocal",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://petcarelocal.netlify.app",
  },
};

// Generate blog article JSON-LD
export function generateArticleJsonLd(article: {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Organization",
      name: article.author || "PetCareLocal",
    },
    publisher: {
      "@type": "Organization",
      name: "PetCareLocal",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://petcarelocal.netlify.app",
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    url: article.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    articleSection: article.category,
  };
}