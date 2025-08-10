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
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-6">
            How GoFitLocal Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Finding the right fitness facility has never been easier. GoFitLocal connects you with gyms, 
            studios, and fitness centers in your area through our simple, powerful search platform.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-black mb-4">Search Your Area</h2>
            <p className="text-gray-600 leading-relaxed">
              Start by entering your city and state. Our platform searches through thousands of fitness 
              facilities powered by Google Places data to show you options in your area.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-4xl mb-4">🏷️</div>
            <h2 className="text-2xl font-bold text-black mb-4">Filter by Category</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Choose from popular fitness categories including:
            </p>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>Traditional Gyms</strong> - Full-service fitness centers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span><strong>Yoga Studios</strong> - Dedicated meditation spaces</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span><strong>CrossFit Boxes</strong> - High-intensity training</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span><strong>Pilates Studios</strong> - Low-impact strength training</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-black mb-4">Refine Your Search</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Use our smart filters to find exactly what you need:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">✓</span>
                <span><strong>Open Now</strong> - See only facilities currently open</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">🏊</span>
                <span><strong>Has Pool</strong> - Find places with swimming facilities</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">🌙</span>
                <span><strong>24/7 Access</strong> - Round-the-clock availability</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-4xl mb-4">📍</div>
            <h2 className="text-2xl font-bold text-black mb-4">View Details & Location</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Each facility listing includes:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Contact information and website</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Hours of operation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Photos of the facility</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>Interactive map view</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">💡 Why Choose GoFitLocal?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
              <p className="text-sm text-gray-600">Search across all major fitness categories</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Real-Time Data</h3>
              <p className="text-sm text-gray-600">Powered by Google Places for accuracy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">📱</span>
              </div>
              <h3 className="font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-sm text-gray-600">Works perfectly on all devices</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#fac748] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-black mb-4">Ready to Find Your Fitness Home?</h3>
          <p className="text-black/80 mb-6 max-w-2xl mx-auto">
            Start your search now and discover the perfect fitness facility in your area.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-[#023e8a] text-white px-8 py-3 rounded-xl hover:bg-[#032d66] transition-colors font-semibold"
          >
            Start Searching
          </Link>
        </div>

        {/* Footer Section */}
        <div className="text-center pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-4">📞 Questions or Feedback?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about how GoFitLocal works or suggestions for improvement? 
            We&apos;d love to hear from you. Check out our{" "}
            <Link href="/legal" className="text-blue-600 hover:underline">
              Legal & Sources
            </Link>{" "}
            page for more information about our data sources and policies.
          </p>
        </div>
      </div>
    </main>
  );
}
