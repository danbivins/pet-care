interface PetServiceSchemaProps {
  service: {
    serviceType: string;
    name: string;
    phone: string;
    website: string;
    address: string;
    hours: Record<string, string>;
    priceRange: string;
    rating: number;
    reviewCount: number;
  };
}

export function PetServiceSchema({ service }: PetServiceSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `#${service.serviceType}`,
    "name": service.name,
    "telephone": service.phone,
    "url": service.website,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": service.address.split(',')[0],
      "addressLocality": "Austin",
      "addressRegion": "TX",
      "postalCode": "78701"
    },
    "openingHours": Object.entries(service.hours)
      .map(([day, hours]) => hours !== "Closed" ? `${day.slice(0,2).toUpperCase()} ${hours}` : null)
      .filter(Boolean),
    "priceRange": service.priceRange,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": service.rating,
      "reviewCount": service.reviewCount
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
