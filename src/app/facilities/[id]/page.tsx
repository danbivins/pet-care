import { createApiClients } from "@/lib/api/clients";
import Image from "next/image";

interface Props { params: Promise<{ id: string }> }

export default async function FacilityPage({ params }: Props) {
  const { id } = await params;
  const { googlePlaces } = createApiClients();
  const { data } = await googlePlaces.get("/place/details/json", {
    params: { place_id: id, fields: "name,formatted_address,formatted_phone_number,website,photo,rating,review,opening_hours,geometry" },
  });
  const place = data?.result || null;

  const photos: string[] = [];
  for (const p of (place?.photos || []).slice(0, 6)) {
    const ref = p.photo_reference;
    const url = `${"https://maps.googleapis.com/maps/api"}/place/photo?maxwidth=800&photo_reference=${ref}&key=${process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY}`;
    photos.push(url);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{place?.name || "Facility"}</h1>
      <p className="text-neutral-600 mb-6">{place?.formatted_address}</p>

      {photos.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {photos.map((src, i) => (
            <Image key={i} src={src} alt="Facility photo" width={600} height={400} className="rounded-md object-cover w-full h-48" />
          ))}
        </div>
      )}

      <section className="space-y-2">
        {place?.formatted_phone_number && (
          <p><span className="font-medium">Phone:</span> {place.formatted_phone_number}</p>
        )}
        {place?.website && (
          <p><a href={place.website} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Website</a></p>
        )}
        {place?.opening_hours?.weekday_text?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium">Hours</p>
            <ul className="text-sm text-neutral-700">
              {place.opening_hours.weekday_text.map((l: string) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}


