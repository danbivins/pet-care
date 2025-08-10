import { NextRequest } from "next/server";
import { createApiClients } from "@/lib/api/clients";
import { getCached, setCached } from "@/lib/cache";

export const revalidate = 0;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  gym: ["gym", "fitness center", "fitness club"],
  yoga: ["yoga studio", "yoga"],
  crossfit: ["crossfit"],
  pilates: ["pilates studio", "pilates"],
  martial_arts: ["martial arts", "dojo", "bjj", "taekwondo", "karate"],
  dance: ["dance studio"],
  boxing: ["boxing gym"],
  climbing: ["rock climbing gym", "climbing wall"],
  swimming: ["swimming pool", "aquatic center"],
};

function buildQueries(city: string, state: string, categories: string[]): string[] {
  const location = [city, state].filter(Boolean).join(", ");
  const list = categories.length > 0 ? categories : Object.keys(CATEGORY_KEYWORDS);
  const queries: string[] = [];
  for (const cat of list) {
    const words = CATEGORY_KEYWORDS[cat] || [cat];
    for (const w of words) {
      queries.push([w, location].filter(Boolean).join(" in "));
    }
  }
  return queries;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city")?.trim() || "";
    const state = searchParams.get("state")?.trim() || "";
    const categoriesParam = searchParams.get("categories")?.trim() || "";
    const categories = categoriesParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const openNow = searchParams.get("openNow") === "1";
    const hasPool = searchParams.get("hasPool") === "1"; // heuristic via query
    const is24h = searchParams.get("is24h") === "1"; // heuristic via query
    const sort = searchParams.get("sort") || "rating"; // rating | distance (distance needs coords)

    if (!city && !state) {
      return Response.json({ error: "city or state is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_PLACES_API_KEY && !process.env.GOOGLE_MAPS_API_KEY) {
      return Response.json({ error: "Google Places API key is missing" }, { status: 503 });
    }

    const cacheKey = `facilities:${city}-${state}:${categories.sort().join("|")}`.toLowerCase();
    const cached = await getCached(cacheKey);
    if (cached) return Response.json(cached);

    const { googlePlaces } = createApiClients();
    let queries = buildQueries(city, state, categories).slice(0, 12);
    if (hasPool) queries = queries.map((q) => `${q} with pool`);
    if (is24h) queries = queries.map((q) => `${q} 24 hours`);

    const results: any[] = [];
    const ids = new Set<string>();
    await Promise.all(
      queries.map(async (q) => {
        const { data } = await googlePlaces.get("/place/textsearch/json", {
          params: { query: q, opennow: openNow ? true : undefined },
        });
        const items = (data?.results || []) as any[];
        for (const r of items) {
          if (!ids.has(r.place_id)) {
            ids.add(r.place_id);
            results.push({
              id: r.place_id,
              name: r.name,
              address: r.formatted_address,
              latitude: r.geometry?.location?.lat,
              longitude: r.geometry?.location?.lng,
              googlePlaceId: r.place_id,
            });
          }
        }
      })
    );

    // Basic sort
    if (sort === "rating") {
      // Will require a details fetch; keep as-is for now
    }

    await setCached(cacheKey, results);
    return Response.json(results);
  } catch (err: any) {
    console.error("/api/facilities error", err);
    return Response.json({ error: "Server error", detail: String(err?.message || err) }, { status: 500 });
  }
}


