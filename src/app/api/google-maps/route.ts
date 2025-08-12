import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const zoom = searchParams.get("zoom") || "13";

    if (!lat || !lng) {
      return Response.json({ error: "lat and lng parameters are required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Google Maps API key not configured" }, { status: 500 });
    }

    // Return map configuration instead of making API calls
    // The actual map rendering will happen client-side with the API key
    const mapConfig = {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      zoom: parseInt(zoom),
      apiKey: apiKey // This is safe for Maps JavaScript API
    };

    return Response.json(mapConfig);
  } catch (error: any) {
    console.error("/api/google-maps error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
