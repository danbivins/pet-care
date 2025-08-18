import { NextRequest } from "next/server";
import { getCached, setCached } from "@/lib/cache";

export const revalidate = 0;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  veterinary: ["veterinarian", "vet clinic", "animal hospital", "veterinary clinic"],
  grooming: ["pet grooming", "dog grooming", "cat grooming", "pet groomer", "dog wash"],
  boarding: ["pet boarding", "dog boarding", "pet daycare", "dog daycare", "kennel", "pet hotel"],
  pet_trainers: ["dog training", "pet training", "dog obedience", "puppy training", "dog trainer", "pet trainer", "behavioral training"],
  pet_sitters: ["pet sitting", "pet sitter", "house sitting pets", "pet care services", "pet nanny"],
  dog_walkers: ["dog walking", "dog walker", "pet walking", "dog walking service"],
  emergency: ["emergency vet", "24 hour vet", "emergency animal hospital"],
  pet_cremation: ["pet cremation", "pet crematory", "pet memorial", "pet funeral", "pet cremation service", "animal cremation", "pet aftercare"],
};

// Helper function to get coordinates for a city/state
async function getCoordinatesForLocation(city: string, state: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    const geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const params = new URLSearchParams({
      address: `${city}, ${state}`,
      key: apiKey
    });

    const response = await fetch(`${geocodeUrl}?${params.toString()}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
      return data.results[0].geometry.location;
    }
    return null;
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}

// Helper function to map categories to Google Places business types
function getBusinessTypesForCategories(categories: string[]): string[] {
  const businessTypeMap: Record<string, string[]> = {
    veterinary: ["veterinary_care"],
    grooming: ["pet_store"],
    boarding: ["lodging"],
    pet_trainers: ["establishment"],
    pet_sitters: ["establishment"],
    dog_walkers: ["establishment"],
    emergency: ["veterinary_care", "hospital"],
    pet_cremation: ["funeral_home", "establishment"]
  };

  const types: string[] = [];
  categories.forEach(cat => {
    const mappedTypes = businessTypeMap[cat] || [];
    types.push(...mappedTypes);
  });

  return [...new Set(types)]; // Remove duplicates
}

// Fallback to original text search method if nearby search fails
async function fallbackTextSearch(city: string, state: string, categories: string[], emergency: boolean, openNow: boolean, sort: string) {
  let queries = buildQueries(city, state, categories).slice(0, 6); // Reduced from 12 to 6
  if (emergency) queries = queries.map((q) => `${q} emergency 24 hour`);

  const results: any[] = [];
  const ids = new Set<string>();
  
  // Use our internal places search API
  await Promise.all(
    queries.map(async (q) => {
      try {
        const searchUrl = new URL('/api/places-search', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
        searchUrl.searchParams.set('query', q);

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

  // Apply filters
  let filteredResults = results;
  if (openNow) {
    filteredResults = results.filter(r => r.openNow === true);
  }

  // Remove duplicates and limit results
  const uniqueResults = filteredResults.filter((r: any, index: number, self: any[]) => 
    index === self.findIndex((t: any) => t.googlePlaceId === r.googlePlaceId)
  ).slice(0, 20);

  // Sort results
  if (sort === "rating") {
    uniqueResults.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
  }

  return Response.json(uniqueResults);
}

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
    const sort = searchParams.get("sort") || "rating";

    if (!city && !state) {
      return Response.json({ error: "city or state is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_PLACES_API_KEY && !process.env.GOOGLE_MAPS_API_KEY) {
      return Response.json({ error: "Google Places API key is missing" }, { status: 503 });
    }

    const cacheKey = `pet-services:${city}-${state}:${categories.sort().join("|")}:${emergency ? 'emergency' : ''}`.toLowerCase();
    const cached = await getCached(cacheKey);
    if (cached) return Response.json(cached);

    // Use nearby search instead of multiple text searches - much faster!
    const searchUrl = new URL('/api/places-search', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    
    // Get coordinates for the city/state
    const coordinates = await getCoordinatesForLocation(city, state);
    if (!coordinates) {
      return Response.json({ error: "Could not find coordinates for location" }, { status: 400 });
    }

    // Use nearby search with coordinates - single API call instead of multiple text searches
    searchUrl.searchParams.set('lat', coordinates.lat.toString());
    searchUrl.searchParams.set('lng', coordinates.lng.toString());
    searchUrl.searchParams.set('radius', '25000'); // 25km radius for comprehensive coverage
    
    // Add business type filters for better relevance
    const businessTypes = getBusinessTypesForCategories(categories);
    if (businessTypes.length > 0) {
      searchUrl.searchParams.set('types', businessTypes.join(','));
    }

    try {
      const response = await fetch(searchUrl.toString());
      if (!response.ok) {
        throw new Error(`Places search failed: ${response.status}`);
      }

      const data = await response.json();
      let results = data.results || [];

      // Apply filters
      if (emergency) {
        results = results.filter((r: any) => 
          r.types?.includes('veterinary_care') || 
          r.types?.includes('hospital') ||
          r.name?.toLowerCase().includes('emergency')
        );
      }

      if (openNow) {
        results = results.filter((r: any) => r.openNow === true);
      }

      // Remove duplicates and limit results
      const uniqueResults = results.filter((r: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.googlePlaceId === r.googlePlaceId)
      ).slice(0, 20); // Limit to 20 results for performance

      // Sort results
      if (sort === "rating") {
        uniqueResults.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
      }

      await setCached(cacheKey, uniqueResults, 3600); // Cache for 1 hour
      return Response.json(uniqueResults);
    } catch (error) {
      console.error("Nearby search failed, falling back to text search:", error);
      // Fallback to original text search method if nearby search fails
      return await fallbackTextSearch(city, state, categories, emergency, openNow, sort);
    }
  } catch (err: any) {
    console.error("/api/pet-services error", err);
    return Response.json({ error: "Server error", detail: String(err?.message || err) }, { status: 500 });
  }
}
