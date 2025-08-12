// Simplified facility description generator

interface SimpleFacilityData {
  name?: string;
  formatted_address?: string;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
}

// Simple function to generate short descriptions for listings
export function generateShortDescription(facility: SimpleFacilityData): string {
  const name = facility.name || 'This facility';
  const address = facility.formatted_address || '';
  
  // Extract city from address
  const addressParts = address.split(', ');
  const city = addressParts[addressParts.length - 3] || 'the area';
  
  // Determine facility type from name
  const nameLC = name.toLowerCase();
  let type = 'fitness facility';
  let description = 'comprehensive fitness and wellness services';
  
  if (nameLC.includes('crossfit')) {
    type = 'CrossFit box';
    description = 'high-intensity functional fitness training';
  } else if (nameLC.includes('yoga')) {
    type = 'yoga studio';
    description = 'mindful movement and stress relief';
  } else if (nameLC.includes('pilates')) {
    type = 'Pilates studio';
    description = 'core strength and flexibility training';
  } else if (nameLC.includes('martial arts') || nameLC.includes('karate') || nameLC.includes('jiu jitsu')) {
    type = 'martial arts studio';
    description = 'self-defense and traditional martial arts';
  } else if (nameLC.includes('boxing')) {
    type = 'boxing gym';
    description = 'boxing training and combat fitness';
  } else if (nameLC.includes('dance')) {
    type = 'dance studio';
    description = 'creative movement and dance instruction';
  } else if (nameLC.includes('climbing')) {
    type = 'climbing gym';
    description = 'rock climbing and bouldering';
  } else if (nameLC.includes('swim') || nameLC.includes('aquatic')) {
    type = 'aquatic center';
    description = 'swimming and water-based fitness';
  }
  
  return `A ${type} in ${city} offering ${description}.`;
}

// Generate detailed description for facility pages
export function generateFacilityDescription(facility: SimpleFacilityData): string {
  const name = facility.name || 'This facility';
  const address = facility.formatted_address || '';
  const rating = facility.rating;
  const reviewCount = facility.user_ratings_total;
  
  // Extract location info
  const addressParts = address.split(', ');
  const city = addressParts[addressParts.length - 3] || 'the area';
  const neighborhood = addressParts[0] || 'the local area';
  
  // Determine facility characteristics
  const nameLC = name.toLowerCase();
  let type = 'fitness center';
  let equipment = 'modern fitness equipment and amenities';
  let specialty = 'comprehensive fitness and wellness';
  let ideal = 'fitness enthusiasts of all levels';
  
  if (nameLC.includes('crossfit')) {
    type = 'CrossFit box';
    equipment = 'Olympic barbells, bumper plates, pull-up rigs, and functional fitness equipment';
    specialty = 'high-intensity functional fitness training and community-driven workouts';
    ideal = 'athletes seeking challenging, varied workouts and strong community support';
  } else if (nameLC.includes('yoga')) {
    type = 'yoga studio';
    equipment = 'yoga mats, blocks, straps, and meditation props';
    specialty = 'mindful movement, flexibility, and stress relief';
    ideal = 'practitioners seeking mental clarity, flexibility, and inner peace';
  } else if (nameLC.includes('pilates')) {
    type = 'Pilates studio';
    equipment = 'reformer machines, Cadillac equipment, and mat-based apparatus';
    specialty = 'core strength, posture improvement, and low-impact conditioning';
    ideal = 'individuals seeking core strength, injury rehabilitation, or precise movement';
  }
  
  // Generate rating text
  let ratingText = '';
  if (rating) {
    ratingText = `With a ${rating}/5 star rating${reviewCount ? ` from ${reviewCount} reviews` : ''}, this facility has earned the trust of the local fitness community.`;
  }
  
  return `
<h2>Overview</h2>
<p>${name} stands out as a premier ${type} in ${city}, offering a modern fitness destination designed for enthusiasts of all levels. Located in ${neighborhood}, this facility provides ${equipment} in a welcoming environment.</p>

<h2>What Makes It Special</h2>
<p>The facility specializes in ${specialty}, creating an atmosphere where members can effectively pursue their fitness goals. ${ratingText}</p>

<h2>Perfect For</h2>
<p>This facility is ideal for ${ideal}. The welcoming community creates an encouraging environment where newcomers feel comfortable alongside experienced members.</p>

<h2>Location & Access</h2>
<p>Conveniently located at ${address}, the facility offers easy access for local residents and visitors to the area.</p>
`.trim();
}
