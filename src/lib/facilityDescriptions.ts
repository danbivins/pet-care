// Facility description generator using Google Places data

export interface FacilityData {
  name: string;
  formatted_address: string;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    weekday_text?: string[];
    open_now?: boolean;
  };
  photos?: any[];
  reviews?: any[];
  vicinity?: string;
}

// Extract city and neighborhood from address
function parseLocation(address: string) {
  const parts = address.split(', ');
  const city = parts[parts.length - 3] || 'the area';
  const state = parts[parts.length - 2] || '';
  const neighborhood = parts[0] || '';
  
  return { city, state, neighborhood };
}

// Determine facility type and characteristics
function analyzeFacilityType(name: string, types: string[] = []) {
  const nameLC = name.toLowerCase();
  const typesStr = types.join(' ').toLowerCase();
  
  if (nameLC.includes('crossfit') || typesStr.includes('crossfit')) {
    return {
      type: 'CrossFit box',
      equipment: 'Olympic barbells, bumper plates, pull-up rigs, and functional fitness equipment',
      specialty: 'high-intensity functional fitness training and community-driven workouts',
      atmosphere: 'energetic, supportive community atmosphere',
      ideal: 'athletes looking for challenging, varied workouts and strong community support'
    };
  }
  
  if (nameLC.includes('yoga') || typesStr.includes('yoga')) {
    return {
      type: 'yoga studio',
      equipment: 'yoga mats, blocks, straps, and meditation props',
      specialty: 'mindful movement, flexibility, and stress relief',
      atmosphere: 'peaceful, zen-like environment designed for relaxation and focus',
      ideal: 'practitioners seeking mental clarity, flexibility, and stress relief'
    };
  }
  
  if (nameLC.includes('pilates')) {
    return {
      type: 'Pilates studio',
      equipment: 'reformer machines, Cadillac equipment, and mat-based apparatus',
      specialty: 'core strength, posture improvement, and low-impact conditioning',
      atmosphere: 'focused, precise environment emphasizing proper form and technique',
      ideal: 'individuals seeking core strength, injury rehabilitation, or low-impact fitness'
    };
  }
  
  if (nameLC.includes('martial arts') || nameLC.includes('karate') || nameLC.includes('jiu jitsu') || nameLC.includes('taekwondo')) {
    return {
      type: 'martial arts dojo',
      equipment: 'training mats, heavy bags, protective gear, and traditional weapons',
      specialty: 'discipline, self-defense, and traditional martial arts training',
      atmosphere: 'respectful, disciplined environment focused on tradition and technique',
      ideal: 'students of all ages interested in self-defense, discipline, and martial arts tradition'
    };
  }
  
  if (nameLC.includes('boxing') || nameLC.includes('fight')) {
    return {
      type: 'boxing gym',
      equipment: 'heavy bags, speed bags, boxing rings, and training equipment',
      specialty: 'boxing technique, cardiovascular conditioning, and combat sports',
      atmosphere: 'intense, focused training environment',
      ideal: 'boxers, fitness enthusiasts, and those seeking high-intensity cardio workouts'
    };
  }
  
  if (nameLC.includes('dance') || nameLC.includes('ballet')) {
    return {
      type: 'dance studio',
      equipment: 'mirrored walls, ballet barres, and professional sound systems',
      specialty: 'various dance styles, rhythm, and artistic expression',
      atmosphere: 'creative, expressive environment celebrating movement and artistry',
      ideal: 'dancers of all levels and those seeking creative, fun fitness alternatives'
    };
  }
  
  if (nameLC.includes('climbing') || nameLC.includes('boulder')) {
    return {
      type: 'climbing gym',
      equipment: 'climbing walls, bouldering areas, and safety equipment',
      specialty: 'rock climbing, bouldering, and upper body strength development',
      atmosphere: 'adventurous, supportive community focused on problem-solving and progression',
      ideal: 'climbers and adventure seekers looking for unique strength and mental challenges'
    };
  }
  
  if (nameLC.includes('swim') || nameLC.includes('aquatic') || nameLC.includes('pool')) {
    return {
      type: 'aquatic center',
      equipment: 'swimming pools, lap lanes, and water fitness equipment',
      specialty: 'swimming, water aerobics, and low-impact aquatic fitness',
      atmosphere: 'refreshing, low-impact environment suitable for all fitness levels',
      ideal: 'swimmers, those recovering from injury, and anyone seeking low-impact exercise'
    };
  }
  
  // Default to traditional gym
  return {
    type: 'fitness center',
    equipment: 'cardio machines, free weights, strength training equipment, and functional fitness areas',
    specialty: 'comprehensive fitness training and wellness',
    atmosphere: 'welcoming, inclusive environment for fitness enthusiasts of all levels',
    ideal: 'anyone looking to improve their overall fitness, from beginners to experienced athletes'
  };
}

// Generate peak hours based on facility type
function generatePeakHours(facilityType: string) {
  if (facilityType.includes('yoga') || facilityType.includes('pilates')) {
    return 'early morning (6-8 AM) and evening (6-8 PM) classes';
  }
  if (facilityType.includes('crossfit')) {
    return 'early morning (5:30-7 AM) and evening (5:30-7:30 PM) WOD sessions';
  }
  if (facilityType.includes('martial arts') || facilityType.includes('dance')) {
    return 'evening hours (5-8 PM) when classes are typically scheduled';
  }
  return 'early morning (6-8 AM) and evening (5-7 PM) hours';
}

// Generate membership insights based on rating and reviews
function generateMembershipInsights(rating?: number, reviewCount?: number, facilityType?: string) {
  const ratingText = rating 
    ? rating >= 4.5 ? 'highly rated' 
    : rating >= 4.0 ? 'well-regarded'
    : rating >= 3.5 ? 'solid'
    : 'developing'
    : 'newly established';
    
  const popularityText = reviewCount 
    ? reviewCount > 100 ? 'popular destination with a strong member base'
    : reviewCount > 50 ? 'growing community'
    : reviewCount > 20 ? 'intimate, close-knit community'
    : 'boutique facility'
    : 'emerging fitness destination';
    
  const peakHours = generatePeakHours(facilityType || 'fitness center');
    
  return `This ${ratingText} facility is a ${popularityText}. Peak hours are typically during ${peakHours}. For a less crowded experience, consider visiting during mid-morning or early afternoon hours.`;
}

// Main function to generate facility description
export function generateFacilityDescription(facility: FacilityData): string {
  const { city, neighborhood } = parseLocation(facility.formatted_address || '');
  const analysis = analyzeFacilityType(facility.name || '', facility.types);
  const membershipInsights = generateMembershipInsights(
    facility.rating, 
    facility.user_ratings_total, 
    analysis.type
  );
  
  const hasPhotos = facility.photos && facility.photos.length > 0;
  const photoCount = hasPhotos ? facility.photos.length : 0;
  
  const facilityName = facility.name || 'This facility';
  const address = facility.formatted_address || 'this location';
  
  return `
**Overview:**
${facilityName} stands out as a premier ${analysis.type} in ${city}, offering a modern fitness destination designed for enthusiasts of all levels. Located in ${neighborhood}, this facility combines quality ${analysis.equipment} with ${analysis.atmosphere}.

**What Makes It Special:**
The facility specializes in ${analysis.specialty}, providing an environment where members can pursue their fitness goals effectively. ${hasPhotos ? `With ${photoCount} photos showcasing the space, ` : ''}you can see the attention to detail that goes into creating an optimal workout environment.

**Amenities & Features:**
• **Equipment:** ${analysis.equipment}
• **Atmosphere:** ${analysis.atmosphere}
• **Specialty Focus:** ${analysis.specialty}
${facility.opening_hours?.weekday_text ? `• **Hours:** ${facility.opening_hours.weekday_text[0]} (see full schedule for all days)` : ''}
${facility.rating ? `• **Member Rating:** ${facility.rating}/5 stars` : ''}

**Perfect For:**
This facility is ideal for ${analysis.ideal}. The diverse member base creates an encouraging environment where newcomers feel comfortable alongside experienced practitioners.

**Membership Insights:**
${membershipInsights}

**Getting There:**
Conveniently located at ${address}, the facility offers easy access for local residents and commuters alike.
`.trim();
}

// Shorter version for listing cards
export function generateShortDescription(facility: FacilityData): string {
  const analysis = analyzeFacilityType(facility.name || '', facility.types);
  const { city } = parseLocation(facility.formatted_address || '');
  
  return `A ${analysis.type} in ${city} specializing in ${analysis.specialty}. Perfect for ${analysis.ideal}.`;
}
