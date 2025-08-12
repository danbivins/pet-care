import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return Response.json({ error: "Pet service ID is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Google Places API key not configured" }, { status: 500 });
    }

    // Get place details from Google Places API
    const detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";
    const detailsParams = new URLSearchParams({
      place_id: id,
      fields: "name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,types,business_status,photos,price_level",
      key: apiKey
    });

    const response = await fetch(`${detailsUrl}?${detailsParams.toString()}`);
    
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

    const place = data.result;
    
    // Transform the data to match our expected format
    const service = {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      priceLevel: place.price_level,
      types: place.types || [],
      openNow: place.opening_hours?.open_now,
      photos: place.photos?.slice(0, 3) || [],
      businessStatus: place.business_status,
      openingHours: place.opening_hours?.weekday_text || [],
      
      // Determine service type based on Google Places types
      serviceType: determineServiceType(place.types || []),
      
      // Generate mock data for fields not available from Google Places
      specialties: generateSpecialties(place.types || []),
      servicesOffered: generateServices(place.types || []),
      priceRange: generatePriceRange(place.price_level),
      acceptsInsurance: true, // Default assumption
      emergencyServices: place.types?.includes("veterinary_care") || false,
      certifications: [], // Not available from Google Places
      description: generateDescription(place.name, place.types || []),
      hours: generateHours(place.opening_hours?.weekday_text || []),
      reviews: [] // Reviews not available from basic Places API
    };

    return Response.json(service);
  } catch (error: any) {
    console.error("/api/pet-services/[id] error:", error);
    return Response.json({ 
      error: "Server error", 
      detail: error.message 
    }, { status: 500 });
  }
}

function determineServiceType(types: string[]): string {
  if (types.includes("veterinary_care")) return "veterinary";
  if (types.includes("pet_store")) return "grooming";
  if (types.includes("lodging")) return "boarding";
  if (types.includes("establishment")) return "training";
  return "pet care";
}

function generateSpecialties(types: string[]): string[] {
  const specialties = [];
  if (types.includes("veterinary_care")) {
    specialties.push("dogs", "cats");
    if (types.includes("hospital")) specialties.push("emergency");
  }
  if (types.includes("pet_store")) {
    specialties.push("dogs", "cats", "grooming");
  }
  return specialties;
}

function generateServices(types: string[]): string[] {
  if (types.includes("veterinary_care")) {
    return ["wellness exams", "vaccinations", "surgery", "dental care", "emergency care"];
  }
  if (types.includes("pet_store")) {
    return ["grooming", "bathing", "nail trimming", "ear cleaning", "styling"];
  }
  return ["pet care services"];
}

function generatePriceRange(priceLevel?: number): string {
  if (!priceLevel) return "$$";
  switch (priceLevel) {
    case 1: return "$";
    case 2: return "$$";
    case 3: return "$$$";
    case 4: return "$$$$";
    default: return "$$";
  }
}

function generateDescription(name: string, types: string[]): string {
  if (types.includes("veterinary_care")) {
    return `${name} provides comprehensive veterinary care for pets, including wellness exams, vaccinations, surgery, and emergency services. Our experienced team is dedicated to keeping your pets healthy and happy.`;
  }
  if (types.includes("pet_store")) {
    return `${name} offers professional pet grooming services to keep your furry friends looking their best. We provide bathing, nail trimming, ear cleaning, and styling services.`;
  }
  return `${name} offers quality pet care services to meet all your pet's needs.`;
}

function generateHours(weekdayText: string[]): Record<string, string> {
  if (weekdayText.length === 0) {
    return {
      monday: "Hours not available",
      tuesday: "Hours not available",
      wednesday: "Hours not available",
      thursday: "Hours not available",
      friday: "Hours not available",
      saturday: "Hours not available",
      sunday: "Hours not available"
    };
  }

  const hours: Record<string, string> = {};
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  weekdayText.forEach((text, index) => {
    if (days[index]) {
      hours[days[index]] = text;
    }
  });

  return hours;
}
