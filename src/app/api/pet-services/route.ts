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

// Transform Google Places API response to our format
function transformPlaceResult(place: any) {
  return {
    id: place.place_id,
    name: place.name,
    address: place.formatted_address || place.vicinity,
    latitude: place.geometry?.location?.lat,
    longitude: place.geometry?.location?.lng,
    rating: place.rating,
    reviewCount: place.user_ratings_total,
    priceLevel: place.price_level,
    types: place.types || [],
    googlePlaceId: place.place_id,
    openNow: place.opening_hours?.open_now,
    photos: place.photos?.slice(0, 3) || [],
    phone: place.formatted_phone_number,
    website: place.website,
    businessStatus: place.business_status,
    openingHours: place.opening_hours?.weekday_text,
  };
}

// Call Google Places API directly (avoids self-call issues on Netlify)
async function callGooglePlaces(
  apiKey: string,
  opts: { query?: string; lat?: number; lng?: number; radius?: number; type?: string; keyword?: string }
): Promise<any[]> {
  const { query, lat, lng, radius = 25000, type, keyword } = opts;

  if (query) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${new URLSearchParams({ query, key: apiKey })}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Places API error: ${res.status}`);
    const data = await res.json();
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(data.error_message || data.status);
    }
    return (data.results || []).map(transformPlaceResult);
  }

  if (lat == null || lng == null) throw new Error("lat/lng required for nearby search");
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: String(radius),
    key: apiKey,
  });
  if (type) params.set("type", type);
  if (keyword) params.set("keyword", keyword);

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message || data.status);
  }
  return (data.results || []).map(transformPlaceResult);
}

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

// Fallback to text search when nearby search fails (calls Google directly)
async function fallbackTextSearch(
  apiKey: string,
  city: string,
  state: string,
  categories: string[],
  emergency: boolean,
  openNow: boolean,
  sort: string
) {
  let queries = buildQueries(city, state, categories).slice(0, 6);
  if (emergency) queries = queries.map((q) => `${q} emergency 24 hour`);

  const results: any[] = [];
  const ids = new Set<string>();

  await Promise.all(
    queries.map(async (q) => {
      try {
        const items = await callGooglePlaces(apiKey, { query: q });
        for (const r of items) {
          if (!ids.has(r.googlePlaceId)) {
            ids.add(r.googlePlaceId);
            results.push(r);
          }
        }
      } catch (error) {
        console.warn(`Text search failed for query: ${q}`, error);
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

    if (!city || !state) {
      return Response.json({ error: "city and state are required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Google Places API key is missing" }, { status: 503 });
    }

    const cacheKey = `pet-services:${city}-${state}:${categories.sort().join("|")}:${openNow ? "openNow" : ""}:${emergency ? "emergency" : ""}:${sort}`.toLowerCase();
    const cached = await getCached(cacheKey);
    if (cached) return Response.json(cached);

    // Get coordinates for the city/state
    const coordinates = await getCoordinatesForLocation(city, state);
    if (!coordinates) {
      console.warn("Could not geocode location, falling back to text search:", { city, state });
      return await fallbackTextSearch(apiKey, city, state, categories, emergency, openNow, sort);
    }

    const businessTypes = getBusinessTypesForCategories(categories);
    const primaryType = businessTypes.length > 0
      ? businessTypes.find(t => ['veterinary_care', 'pet_store', 'lodging', 'establishment', 'funeral_home'].includes(t))
      : undefined;

    try {
      // Call Google Places API directly (no self-call - fixes Netlify/serverless issues)
      let results = await callGooglePlaces(apiKey, {
        lat: coordinates.lat,
        lng: coordinates.lng,
        radius: 25000,
        type: primaryType,
        keyword: primaryType ? undefined : "pet veterinarian grooming",
      });

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
      ).slice(0, 20);

      // Sort results
      if (sort === "rating") {
        uniqueResults.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
      }

      await setCached(cacheKey, uniqueResults, 3600);
      return Response.json(uniqueResults);
    } catch (error) {
      console.error("Nearby search failed, falling back to text search:", error);
      return await fallbackTextSearch(apiKey, city, state, categories, emergency, openNow, sort);
    }
  } catch (err: any) {
    console.error("/api/pet-services error", err);
    return Response.json({ error: "Server error", detail: String(err?.message || err) }, { status: 500 });
  }
}
