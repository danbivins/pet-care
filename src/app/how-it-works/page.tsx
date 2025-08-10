import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How GoFitLocal Works - Find Your Perfect Fitness Facility",
  description: "Learn how GoFitLocal helps you discover gyms, yoga studios, CrossFit boxes, and fitness centers near you. Simple search, detailed info, direct contact.",
  openGraph: {
    title: "How GoFitLocal Works - Find Your Perfect Fitness Facility",
    description: "Learn how GoFitLocal helps you discover gyms, yoga studios, CrossFit boxes, and fitness centers near you.",
  },
};

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="prose prose-lg mx-auto">
        <h1>How GoFitLocal Works</h1>
        
        <p className="lead">
          Finding the right fitness facility has never been easier. GoFitLocal connects you with gyms, 
          studios, and fitness centers in your area through our simple, powerful search platform.
        </p>

        <h2>🔍 Search Your Area</h2>
        <p>
          Start by entering your city and state. Our platform searches through thousands of fitness 
          facilities powered by Google Places data to show you options in your area.
        </p>

        <h2>🏷️ Filter by Category</h2>
        <p>
          Choose from popular fitness categories including:
        </p>
        <ul>
          <li><strong>Traditional Gyms</strong> - Full-service fitness centers with equipment and classes</li>
          <li><strong>Yoga Studios</strong> - Dedicated spaces for yoga, meditation, and mindfulness</li>
          <li><strong>CrossFit Boxes</strong> - High-intensity functional fitness training</li>
          <li><strong>Pilates Studios</strong> - Low-impact strength and flexibility training</li>
          <li><strong>Martial Arts Dojos</strong> - Karate, jiu-jitsu, taekwondo, and more</li>
          <li><strong>Dance Studios</strong> - Ballet, hip-hop, ballroom, and contemporary dance</li>
          <li><strong>Boxing Gyms</strong> - Boxing training, kickboxing, and combat sports</li>
          <li><strong>Climbing Gyms</strong> - Indoor rock climbing and bouldering</li>
          <li><strong>Swimming Facilities</strong> - Pools, aquatic centers, and water fitness</li>
        </ul>

        <h2>🔧 Refine Your Search</h2>
        <p>
          Use our smart filters to find exactly what you need:
        </p>
        <ul>
          <li><strong>Open Now</strong> - See only facilities currently open</li>
          <li><strong>Has Pool</strong> - Find places with swimming facilities</li>
          <li><strong>24/7 Access</strong> - Locate gyms with round-the-clock availability</li>
          <li><strong>Sort Options</strong> - Order results by rating or distance</li>
        </ul>

        <h2>📍 View Details & Location</h2>
        <p>
          Each facility listing includes:
        </p>
        <ul>
          <li>Contact information and website</li>
          <li>Hours of operation</li>
          <li>Photos of the facility</li>
          <li>Address and location details</li>
          <li>Interactive map view</li>
        </ul>

        <h2>💡 Why Choose GoFitLocal?</h2>
        <ul>
          <li><strong>Comprehensive Coverage</strong> - We search across all major fitness categories</li>
          <li><strong>Real-Time Data</strong> - Information powered by Google Places for accuracy</li>
          <li><strong>User-Friendly</strong> - Simple search with powerful filtering options</li>
          <li><strong>Mobile Optimized</strong> - Works perfectly on all devices</li>
          <li><strong>No Account Required</strong> - Start searching immediately</li>
        </ul>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Ready to Find Your Fitness Home?</h3>
          <p className="text-yellow-700 mb-4">
            Start your search now and discover the perfect fitness facility in your area.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Start Searching
          </Link>
        </div>

        <h2>📞 Questions or Feedback?</h2>
        <p>
          Have questions about how GoFitLocal works or suggestions for improvement? 
          We&apos;d love to hear from you. Check out our <a href="/legal">Legal & Sources</a> page 
          for more information about our data sources and policies.
        </p>
      </div>
    </main>
  );
}
