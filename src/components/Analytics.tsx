"use client";
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") {
    return null;
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// Helper function to track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
};

// Pre-defined tracking functions for common events
export const analytics = {
  // Track when user searches for facilities
  trackSearch: (city: string, state: string, categories: string[]) => {
    trackEvent("search", {
      search_term: `${city}, ${state}`,
      categories: categories.join(","),
    });
  },

  // Track when user views facility details
  trackFacilityView: (facilityId: string, facilityName: string) => {
    trackEvent("view_item", {
      item_id: facilityId,
      item_name: facilityName,
      item_category: "fitness_facility",
    });
  },

  // Track when user clicks external links (website, directions)
  trackExternalLink: (linkType: "website" | "directions", facilityName: string) => {
    trackEvent("click", {
      link_type: linkType,
      facility_name: facilityName,
    });
  },

  // Track map interactions
  trackMapInteraction: (action: "open_modal" | "view_embedded") => {
    trackEvent("map_interaction", {
      action,
    });
  },
};

// Extend window object for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}
