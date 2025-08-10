import { NextRequest } from "next/server";
import { createApiClients } from "@/lib/api/clients";
import { getCached, setCached } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city")?.trim() || "";
    const state = searchParams.get("state")?.trim() || "";
    if (!city && !state) {
      return Response.json({ error: "city or state is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_PLACES_API_KEY && !process.env.GOOGLE_MAPS_API_KEY) {
      return Response.json(
        { error: "Google Places API key is missing on the server" },
        { status: 503 }
      );
    }

    const q = `${city}-${state}`.toLowerCase();
    const cacheKey = `venues:${q}`;
    const cached = await getCached(cacheKey);
    if (cached) return Response.json(cached);

    const { googlePlaces } = createApiClients();

    // Use Google Places Text Search for music venues in the city/state
    const textQuery = ["music venue", city, state].filter(Boolean).join(", ");
    const { data } = await googlePlaces.get("/place/textsearch/json", {
      params: {
        query: textQuery,
      },
    });

    if (data?.status && data.status !== "OK") {
      return Response.json(
        { error: "Places API error", status: data.status, message: data?.error_message },
        { status: 502 }
      );
    }

    const venues = (data?.results || []).map((r: any) => ({
      id: r.place_id,
      name: r.name,
      address: r.formatted_address,
      latitude: r.geometry?.location?.lat,
      longitude: r.geometry?.location?.lng,
      googlePlaceId: r.place_id,
    }));

    // Upsert minimal venues to DB for future enrichment
    const dbUrl = process.env.DATABASE_URL || "";
    const dbConfigured = dbUrl && !dbUrl.includes("user:password");
    if (dbConfigured) {
      for (const v of venues) {
        await prisma.venue.upsert({
          where: { googlePlaceId: v.googlePlaceId },
          create: {
            name: v.name,
            address: v.address ?? "",
            city,
            state,
            latitude: v.latitude,
            longitude: v.longitude,
            googlePlaceId: v.googlePlaceId,
          },
          update: {
            name: v.name,
            address: v.address ?? "",
            city,
            state,
            latitude: v.latitude,
            longitude: v.longitude,
          },
        });
      }
    }

    await setCached(cacheKey, venues);
    return Response.json(venues);
  } catch (err: any) {
    console.error("/api/venues error", err);
    return Response.json({ error: "Server error", detail: String(err?.message || err) }, { status: 500 });
  }
}


