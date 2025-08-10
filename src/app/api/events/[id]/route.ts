import { NextRequest } from "next/server";
import { createApiClients } from "@/lib/api/clients";
import { decorateTicketmasterUrl } from "@/lib/affiliates";

export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!process.env.TICKETMASTER_API_KEY) {
    return Response.json({ error: "Ticketmaster API key missing" }, { status: 503 });
  }
  try {
    const { ticketmaster } = createApiClients();
    const { data } = await ticketmaster.get(`/events/${id}.json`);
    if (!data) return Response.json({ error: "Not found" }, { status: 404 });

    const venue = data?._embedded?.venues?.[0];
    const attractions = data?._embedded?.attractions || [];
    const event = {
      id: data.id,
      name: data.name,
      date: data.dates?.start?.dateTime,
      ticketUrl: decorateTicketmasterUrl(data.url),
      venue: venue?.name,
      venueAddress: venue?.address?.line1,
      city: venue?.city?.name,
      state: venue?.state?.stateCode,
      attractions: attractions.map((a: any) => ({ id: a.id, name: a.name, url: a.url })),
    };
    return Response.json(event);
  } catch (err: any) {
    console.error("/api/events/[id] error", err);
    return Response.json({ error: "Server error", detail: String(err?.message || err) }, { status: 500 });
  }
}


