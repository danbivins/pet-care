import { NextRequest } from "next/server";
import { createApiClients } from "@/lib/api/clients";
import { getCached, setCached } from "@/lib/cache";

export const revalidate = 0;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  veterinary: ["veterinarian", "vet clinic", "animal hospital", "veterinary clinic"],
  grooming: ["pet grooming", "dog grooming", "cat grooming", "pet groomer", "dog wash"],
  boarding: ["pet boarding", "dog boarding", "pet daycare", "dog daycare", "kennel", "pet hotel"],
  training: ["dog training", "pet training", "dog obedience", "puppy training", "dog trainer"],
  sitting: ["pet sitting", "dog walking", "pet sitter", "dog walker", "pet care services", "pet nanny", "house sitting pets"],
  emergency: ["emergency vet", "24 hour vet", "emergency animal hospital"],
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
    const emergency = searchParams.get("emergency") === "1";
    // const acceptsInsurance = searchParams.get("acceptsInsurance") === "1";
    const sort = searchParams.get("sort") || "rating"; // rating | distance

    if (!city && !state) {
      return Response.json({ error: "city or state is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_PLACES_API_KEY && !process.env.GOOGLE_MAPS_API_KEY) {
      return Response.json({ error: "Google Places API key is missing" }, { status: 503 });
    }

    const cacheKey = `pet-services:${city}-${state}:${categories.sort().join("|")}:${emergency ? 'emergency' : ''}`.toLowerCase();
    const cached = await getCached(cacheKey);
    if (cached) return Response.json(cached);

    const { googlePlaces } = createApiClients();
    let queries = buildQueries(city, state, categories).slice(0, 12);
    if (emergency) queries = queries.map((q) => `${q} emergency 24 hour`);

    const results: any[] = [];
    const ids = new Set<string>();
    await Promise.all(
      queries.map(async (q) => {
        try {
          const { data } = await googlePlaces.get("/place/textsearch/json", {
            params: { 
              query: q, 
              opennow: openNow ? true : undefined
            },
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
                rating: r.rating,
                priceLevel: r.price_level,
                types: r.types || [],
                googlePlaceId: r.place_id,
                openNow: r.opening_hours?.open_now,
                photos: r.photos?.slice(0, 3) || [],
              });
            }
          }
        } catch (error) {
          console.warn(`Query failed: ${q}`, error);
        }
      })
    );

    // Basic sort
    if (sort === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    await setCached(cacheKey, results, 3600); // Cache for 1 hour
    return Response.json(results);
  } catch (err: any) {
    console.error("/api/pet-services error", err);
    return Response.json({ error: "Server error", detail: String(err?.message || err) }, { status: 500 });
  }
}
