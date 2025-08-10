import { createApiClients } from "@/lib/api/clients";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VenuePage({ params }: Props) {
  const { id } = await params;

  // Try to get venue from DB by Google place ID or internal ID
  const venue = await prisma.venue.findFirst({
    where: { OR: [{ id }, { googlePlaceId: id }] },
  });

  const { googlePlaces } = createApiClients();
  let placeDetails: any = null;
  if (venue?.googlePlaceId || id) {
    const placeId = venue?.googlePlaceId || id;
    const { data } = await googlePlaces.get("/place/details/json", {
      params: { place_id: placeId, fields: "name,formatted_address,formatted_phone_number,website,photo,review,rating,geometry" },
    });
    placeDetails = data?.result || null;
  }

  const photos: string[] = [];
  if (placeDetails?.photos?.length) {
    for (const p of placeDetails.photos.slice(0, 4)) {
      const ref = p.photo_reference;
      const url = `${"https://maps.googleapis.com/maps/api"}/place/photo?maxwidth=800&photo_reference=${ref}&key=${process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY}`;
      photos.push(url);
    }
  }

  // Fetch upcoming events for this venue (Ticketmaster)
  let events: any[] = [];
  try {
    const tmRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/events?venueName=${encodeURIComponent(placeDetails?.name || venue?.name || "")}&city=${encodeURIComponent(venue?.city || "")}&state=${encodeURIComponent(venue?.state || "")}`,
      { cache: "no-store" }
    );
    if (tmRes.ok) {
      events = await tmRes.json();
    }
  } catch {}

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{placeDetails?.name || venue?.name || "Venue"}</h1>
      <p className="text-neutral-600 mb-6">{placeDetails?.formatted_address || venue?.address}</p>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {photos.map((src, i) => (
            <Image key={i} src={src} alt="Venue photo" width={600} height={400} className="rounded-md object-cover w-full h-48" />
          ))}
        </div>
      )}

      <section className="space-y-2">
        {placeDetails?.formatted_phone_number && (
          <p>
            <span className="font-medium">Phone:</span> {placeDetails.formatted_phone_number}
          </p>
        )}
        {placeDetails?.website && (
          <p>
            <a href={placeDetails.website} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
              Website
            </a>
          </p>
        )}
      </section>

      {events.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Upcoming events</h2>
          <ul className="space-y-3">
            {events.slice(0, 10).map((e) => (
              <li key={e.id} className="border rounded-md p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-sm text-neutral-600">{new Date(e.date).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <a className="text-blue-600 hover:underline" href={`/events/${encodeURIComponent(e.id)}`}>Details</a>
                  {e.ticketUrl && (
                    <a className="text-blue-600 hover:underline" href={e.ticketUrl} target="_blank" rel="noreferrer">
                      Tickets
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}


