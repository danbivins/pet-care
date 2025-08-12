import { NextRequest } from "next/server";
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

    let queries = buildQueries(city, state, categories).slice(0, 12);
    if (emergency) queries = queries.map((q) => `${q} emergency 24 hour`);

    const results: any[] = [];
    const ids = new Set<string>();
    
    // Use our internal places search API instead of calling Google directly
    await Promise.all(
      queries.map(async (q) => {
        try {
          const searchUrl = new URL('/api/places-search', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
          searchUrl.searchParams.set('query', q);
          if (openNow) searchUrl.searchParams.set('opennow', 'true');

          const response = await fetch(searchUrl.toString());
          if (!response.ok) {
            console.warn(`Places search failed for query: ${q}`, response.status);
            return;
          }

          const data = await response.json();
          const items = data.results || [];
          
          for (const r of items) {
            if (!ids.has(r.googlePlaceId)) {
              ids.add(r.googlePlaceId);
              results.push(r);
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
