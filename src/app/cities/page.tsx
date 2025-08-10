import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Popular Cities - Find Gyms & Fitness Centers Nationwide | GoFitLocal",
  description: "Discover gyms, yoga studios, and fitness centers in popular cities across the United States. Search by location to find the best fitness facilities near you.",
  openGraph: {
    title: "Popular Cities - Find Gyms & Fitness Centers Nationwide | GoFitLocal",
    description: "Discover gyms, yoga studios, and fitness centers in popular cities across the United States.",
  },
};

const popularCities = [
  // Major metros
  { name: "New York", state: "NY", population: "8.3M" },
  { name: "Los Angeles", state: "CA", population: "4M" },
  { name: "Chicago", state: "IL", population: "2.7M" },
  { name: "Houston", state: "TX", population: "2.3M" },
  { name: "Phoenix", state: "AZ", population: "1.7M" },
  { name: "Philadelphia", state: "PA", population: "1.6M" },
  { name: "San Antonio", state: "TX", population: "1.5M" },
  { name: "San Diego", state: "CA", population: "1.4M" },
  { name: "Dallas", state: "TX", population: "1.3M" },
  { name: "Austin", state: "TX", population: "1M" },
  
  // Fitness-focused cities
  { name: "Denver", state: "CO", population: "715K" },
  { name: "Seattle", state: "WA", population: "750K" },
  { name: "San Francisco", state: "CA", population: "875K" },
  { name: "Boston", state: "MA", population: "685K" },
  { name: "Atlanta", state: "GA", population: "500K" },
  { name: "Miami", state: "FL", population: "470K" },
  { name: "Portland", state: "OR", population: "650K" },
  { name: "Nashville", state: "TN", population: "695K" },
  { name: "Charlotte", state: "NC", population: "885K" },
  { name: "Tampa", state: "FL", population: "400K" },
  
  // Growing fitness markets
  { name: "Raleigh", state: "NC", population: "470K" },
  { name: "Orlando", state: "FL", population: "310K" },
  { name: "San Jose", state: "CA", population: "1M" },
  { name: "Cleveland", state: "OH", population: "385K" },
  { name: "Las Vegas", state: "NV", population: "650K" },
  { name: "Kansas City", state: "MO", population: "510K" },
  { name: "Virginia Beach", state: "VA", population: "450K" },
  { name: "Sacramento", state: "CA", population: "520K" },
  { name: "Minneapolis", state: "MN", population: "430K" },
  { name: "Indianapolis", state: "IN", population: "885K" },
];

export default function CitiesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Fitness Facilities in Popular Cities</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore gyms, yoga studios, CrossFit boxes, and fitness centers in major cities across the United States. 
          Click on any city to start your search.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {popularCities.map((city) => (
          <Link
            key={`${city.name}-${city.state}`}
            href={`/?city=${encodeURIComponent(city.name)}&state=${encodeURIComponent(city.state)}`}
            className="group block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                {city.name}
              </h3>
              <span className="text-sm text-gray-500 font-medium">{city.state}</span>
            </div>
            <p className="text-sm text-gray-600">Population: {city.population}</p>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Don&apos;t See Your City?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          GoFitLocal covers fitness facilities nationwide. Search for any city or town in the United States 
          to find gyms, studios, and fitness centers in your area.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Search Any City
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">What You&apos;ll Find</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              🏋️
            </div>
            <h3 className="font-semibold mb-2">Traditional Gyms</h3>
            <p className="text-sm text-gray-600">Full-service fitness centers with equipment, classes, and amenities</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              🧘
            </div>
            <h3 className="font-semibold mb-2">Yoga Studios</h3>
            <p className="text-sm text-gray-600">Dedicated spaces for yoga, meditation, and mindfulness practices</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              ⚡
            </div>
            <h3 className="font-semibold mb-2">CrossFit Boxes</h3>
            <p className="text-sm text-gray-600">High-intensity functional fitness training and community</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              🩰
            </div>
            <h3 className="font-semibold mb-2">Pilates Studios</h3>
            <p className="text-sm text-gray-600">Low-impact strength, flexibility, and core training</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              🥋
            </div>
            <h3 className="font-semibold mb-2">Martial Arts</h3>
            <p className="text-sm text-gray-600">Karate, jiu-jitsu, taekwondo, and other combat sports</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              🏊
            </div>
            <h3 className="font-semibold mb-2">Aquatic Centers</h3>
            <p className="text-sm text-gray-600">Swimming pools, water fitness, and aquatic programs</p>
          </div>
        </div>
      </div>
    </main>
  );
}
