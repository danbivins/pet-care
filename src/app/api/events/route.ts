import { NextRequest } from "next/server";
import { createApiClients } from "@/lib/api/clients";
import { getCached, setCached } from "@/lib/cache";
import { decorateTicketmasterUrl } from "@/lib/affiliates";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueName = searchParams.get("venueName") ?? undefined;
    const city = searchParams.get("city") ?? undefined;
    const stateCode = searchParams.get("state") ?? undefined;
    const cacheKey = `events:${venueName || "all"}:${city || ""}:${stateCode || ""}`;

    if (!process.env.TICKETMASTER_API_KEY) {
      return Response.json({ error: "Ticketmaster API key missing" }, { status: 503 });
    }

    const cached = await getCached(cacheKey);
    if (cached) return Response.json(cached);

    const { ticketmaster } = createApiClients();

    const params: Record<string, string> = {};
    if (venueName) params["venueName"] = venueName;
    if (city) params["city"] = city;
    if (stateCode) params["stateCode"] = stateCode;
    params["classificationName"] = "Music";
    params["size"] = "50";
    params["sort"] = "date,asc";

    const { data } = await ticketmaster.get("/events.json", { params });
    if (!data?._embedded?.events) {
      return Response.json({ events: [] });
    }
    const events = data._embedded.events.map((e: any) => ({
      id: e.id,
      name: e.name,
      date: e.dates?.start?.dateTime,
      venue: e._embedded?.venues?.[0]?.name,
      venueAddress: e._embedded?.venues?.[0]?.address?.line1,
      city: e._embedded?.venues?.[0]?.city?.name,
      state: e._embedded?.venues?.[0]?.state?.stateCode,
      priceRanges: e.priceRanges,
      ticketUrl: decorateTicketmasterUrl(e.url),
      attractions: e._embedded?.attractions?.map((a: any) => a.name) || [],
    }));

    await setCached(cacheKey, events, 6 * 60 * 60 * 1000);
    return Response.json(events);
  } catch (err: any) {
    console.error("/api/events error", err);
    return Response.json({ error: "Server error", detail: String(err?.message || err) }, { status: 500 });
  }
}


