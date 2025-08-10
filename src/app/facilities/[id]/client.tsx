"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { loadGoogleMaps } from "@/lib/googleMapsLoader";
import { analytics } from "@/components/Analytics";

type Place = {
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text?: string[] };
  photos?: any[];
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
          <h1 className="text-3xl font-bold mb-2">{place.name || "Facility"}</h1>
          <p className="text-neutral-600 mb-6">{place.formatted_address}</p>

          {photoUrls.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {photoUrls.map((src, i) => (
                // Use a normal img tag to avoid next/image domain config for Google content
                <img key={i} src={src} alt="Facility photo" className="rounded-md object-cover w-full h-48" />
              ))}
            </div>
          )}

          <section className="space-y-2">
            {place.formatted_phone_number && (
              <p><span className="font-medium">Phone:</span> {place.formatted_phone_number}</p>
            )}
            {place.website && (
              <p>
                <a 
                  href={place.website} 
                  className="text-blue-600" 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => analytics.trackExternalLink("website", place.name || "Unknown")}
                >
                  {place.website}
                </a>
              </p>
            )}
            {place.opening_hours?.weekday_text?.length ? (
              <div className="mt-4">
                <p className="font-medium">Hours</p>
                <ul className="text-sm text-neutral-700">
                  {place.opening_hours.weekday_text!.map((l: string) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}


