"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { loadGoogleMaps } from "@/lib/googleMapsLoader";
import { analytics } from "@/components/Analytics";
import { generateFacilityDescription } from "@/lib/facilityDescriptions-simple";

type Place = {
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text?: string[] };
  photos?: any[];
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  reviews?: any[];
  vicinity?: string;
};

export default function Client({ id }: { id: string }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "")
      .then(() => {
        const service = new (window as any).google.maps.places.PlacesService(document.createElement("div"));
        service.getDetails(
          {
            placeId: id,
            fields: [
              "name",
              "formatted_address",
              "formatted_phone_number",
              "website",
              "photos",
              "opening_hours",
              "types",
              "rating",
              "user_ratings_total",
              "price_level",
              "reviews",
              "vicinity",
            ],
          },
          (result: any, status: any) => {
            if (!isMounted) return;
            if (status === (window as any).google.maps.places.PlacesServiceStatus.OK) {
              setPlace(result);
              const urls = (result.photos || []).slice(0, 6).map((p: any) => p.getUrl({ maxWidth: 1200 }));
              setPhotoUrls(urls);
              
              // Track facility view
              analytics.trackFacilityView(id, result.name || "Unknown Facility");
            } else {
              setError(String(status));
            }
          }
        );
      })
      .catch((e) => setError(String(e?.message || e)));
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {!place && !error && <p>Loading facility details…</p>}
      {error && <p className="text-red-700">Failed to load details: {error}</p>}
      {place && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{place.name || "Facility"}</h1>
            <p className="text-neutral-600 mb-4">{place.formatted_address}</p>
            
            {/* Rating and basic info */}
            <div className="flex items-center gap-4 mb-6">
              {place.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{place.rating}</span>
                  {place.user_ratings_total && (
                    <span className="text-gray-500">({place.user_ratings_total} reviews)</span>
                  )}
                </div>
              )}
              {place.price_level && (
                <div className="text-green-600 font-medium">
                  {'$'.repeat(place.price_level)} Price Level
                </div>
              )}
            </div>
          </div>

          {photoUrls.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {photoUrls.map((src, i) => (
                // Use a normal img tag to avoid next/image domain config for Google content
                <img key={i} src={src} alt="Facility photo" className="rounded-md object-cover w-full h-48" />
              ))}
            </div>
          )}

          {/* Rich Description */}
          <article className="bg-gray-50 rounded-xl p-6 mb-8">
            <div 
              className="text-gray-700 leading-relaxed facility-description"
              dangerouslySetInnerHTML={{ 
                __html: generateFacilityDescription(place)
              }}
            />
          </article>

          {/* Contact Information */}
          {(place.formatted_phone_number || place.website) && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ fontSize: '1.5rem' }}>Contact</h2>
              <div className="space-y-3">
                {place.formatted_phone_number && (
                  <p style={{ fontSize: '1.25rem' }}>
                    <span className="font-medium">Phone:</span> 
                    <a href={`tel:${place.formatted_phone_number}`} className="text-blue-600 hover:underline ml-2">
                      {place.formatted_phone_number}
                    </a>
                  </p>
                )}
                {place.website && (
                  <p style={{ fontSize: '1.25rem' }}>
                    <span className="font-medium">Website:</span>
                    <a 
                      href={place.website} 
                      className="text-blue-600 hover:underline ml-2" 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={() => analytics.trackExternalLink("website", place.name || "Unknown")}
                    >
                      {place.website}
                    </a>
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Hours */}
          {place.opening_hours?.weekday_text?.length && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ fontSize: '1.5rem' }}>Hours</h2>
              <ul className="space-y-1">
                {place.opening_hours.weekday_text.map((hours: string) => (
                  <li key={hours} className="text-gray-700" style={{ fontSize: '1.25rem' }}>{hours}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}


