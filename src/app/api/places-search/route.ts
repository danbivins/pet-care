import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "5000";
    const type = searchParams.get("type");

    if (!query && (!lat || !lng)) {
      return Response.json({ 
        error: "Either query parameter or lat/lng parameters are required" 
      }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Google Places API key not configured" }, { status: 500 });
    }

    let apiUrl: string;
    let params: URLSearchParams;

    if (query) {
      // Text search
      apiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
      params = new URLSearchParams({
        query: query,
        key: apiKey
      });
    } else {
      // Nearby search
      apiUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
      params = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: radius,
        key: apiKey
      });
      
      if (type) {
        params.append("type", type);
      }
    }

    const response = await fetch(`${apiUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status && data.status !== "OK") {
      return Response.json({
        error: "Google Places API error",
        status: data.status,
        message: data.error_message
      }, { status: 502 });
    }

    // Transform results to match our expected format
    const results = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || place.vicinity,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
      rating: place.rating,
      priceLevel: place.price_level,
      types: place.types || [],
      googlePlaceId: place.place_id,
      openNow: place.opening_hours?.open_now,
      photos: place.photos?.slice(0, 3) || [],
    }));

    return Response.json({
      results: results,
      status: data.status,
      next_page_token: data.next_page_token
    });

  } catch (error: any) {
    console.error("/api/places-search error:", error);
    return Response.json({ 
      error: "Server error", 
      detail: error.message 
    }, { status: 500 });
  }
}
