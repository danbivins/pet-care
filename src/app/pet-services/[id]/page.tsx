import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Clock, Phone, Globe, MapPin, Star, Shield, AlertTriangle } from "lucide-react";
import { PetServiceSchema } from "@/components/PetServiceSchema";

// Mock function to get pet service details - in a real app this would fetch from your database
async function getPetServiceDetails(id: string) {
  // This would be replaced with actual database/API call
  const mockService = {
    id,
    name: "Austin Veterinary Clinic",
    address: "123 Main St, Austin, TX 78701",
    phone: "(512) 555-0123",
    website: "https://austinvetclinic.com",
    rating: 4.7,
    reviewCount: 156,
    serviceType: "veterinary",
    specialties: ["dogs", "cats", "emergency"],
    servicesOffered: ["wellness exams", "vaccinations", "surgery", "dental care", "emergency care"],
    priceRange: "$$",
    acceptsInsurance: true,
    emergencyServices: true,
    certifications: ["AAHA", "Texas VMA"],
    openNow: true,
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    description: "Austin Veterinary Clinic has been serving the Austin community for over 20 years, providing compassionate care for dogs, cats, and exotic pets. Our team of experienced veterinarians and support staff are dedicated to keeping your pets healthy and happy.",
    reviews: [
      {
        id: "1",
        rating: 5,
        reviewText: "Excellent care for my anxious dog. Dr. Smith was incredibly patient and explained everything clearly.",
        authorName: "Sarah M.",
        date: "2024-01-15",
        verified: true
      },
      {
        id: "2", 
        rating: 5,
        reviewText: "Emergency visit on Sunday - they were amazing! Quick response and fair pricing.",
        authorName: "Mike R.",
        date: "2024-01-10",
        verified: true
      }
    ]
  };
  
  return mockService;
}

interface PetServicePageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PetServicePageProps) {
  const { id } = params;
  const service = await getPetServiceDetails(id);
  
  return {
    title: `${service.name} - Pet Care Services in Austin, TX`,
    description: `${service.description.slice(0, 160)}...`,
    openGraph: {
      title: service.name,
      description: service.description,
      type: 'business.business',
    },
  };
}

function ServiceBadges({ service }: { service: any }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {service.emergencyServices && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
          <AlertTriangle size={16} />
          Emergency Care
        </span>
      )}
      {service.acceptsInsurance && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
          <Shield size={16} />
          Accepts Insurance
        </span>
      )}
      {service.openNow && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          <Clock size={16} />
          Open Now
        </span>
      )}
      {service.certifications.map((cert: string) => (
        <span key={cert} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
          {cert} Certified
        </span>
      ))}
    </div>
  );
}

function ContactActions({ service }: { service: any }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      <div className="space-y-3">
        <a 
          href={`tel:${service.phone}`}
          className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Phone size={20} />
          <div>
            <div className="font-medium">Call Now</div>
            <div className="text-sm opacity-90">{service.phone}</div>
          </div>
        </a>
        
        {service.website && (
          <a 
            href={service.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe size={20} />
            <div>
              <div className="font-medium">Visit Website</div>
              <div className="text-sm text-gray-600">Learn more online</div>
            </div>
          </a>
        )}
        
        <button className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full">
          <MapPin size={20} />
          <div>
            <div className="font-medium">Get Directions</div>
            <div className="text-sm text-gray-600 text-left">{service.address}</div>
          </div>
        </button>
      </div>
    </div>
  );
}

function Reviews({ reviews }: { reviews: any[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <article key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <header className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-yellow-500" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <h3 className="font-semibold">{review.authorName}</h3>
              </div>
              <time className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </time>
            </header>
            <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

async function PetServiceContent({ params }: PetServicePageProps) {
  const { id } = params;
  const service = await getPetServiceDetails(id);
  
  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="bg-gray-50 px-4 py-3" aria-label="Breadcrumb">
        <div className="mx-auto max-w-6xl">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/pet-services" className="text-blue-600 hover:underline">
                Pet Services
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">{service.name}</li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <header className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500 fill-current" size={16} />
                      <span className="font-medium">{service.rating}</span>
                      <span>({service.reviewCount} reviews)</span>
                    </div>
                    <span>•</span>
                    <span className="capitalize">{service.serviceType}</span>
                    <span>•</span>
                    <span>{service.priceRange}</span>
                  </div>
                </div>
              </div>
              
              <ServiceBadges service={service} />
            </header>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Services Offered</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {service.servicesOffered.map((service: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <Heart size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Specialties */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Pet Types & Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {service.specialties.map((specialty: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                    {specialty}
                  </span>
                ))}
              </div>
            </section>

            {/* Hours */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Hours</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-600 pb-2">Day</th>
                      <th className="text-left text-sm font-medium text-gray-600 pb-2">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {Object.entries(service.hours).map(([day, hours]) => (
                      <tr key={day}>
                        <td className="text-sm text-gray-900 capitalize py-1">{day}</td>
                        <td className="text-sm text-gray-700 py-1">{hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Reviews reviews={service.reviews} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <ContactActions service={service} />
              
              {/* Ad Zone - Sidebar Rectangle */}
              <div className="ad-zone sidebar-rectangle" role="complementary" aria-label="Sponsored content">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Advertisement</p>
                  <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-sm">300x250 Ad Space</span>
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recommended Pet Supplies</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Keep your pet healthy with these veterinarian-recommended products:
                </p>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">Premium Dog Food</h4>
                    <p className="text-xs text-gray-600 mb-2">Veterinarian-recommended nutrition</p>
                    <a 
                      href="#" 
                      rel="sponsored" 
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Shop on Chewy - $45.99
                    </a>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">Dental Health Chews</h4>
                    <p className="text-xs text-gray-600 mb-2">Support dental health between cleanings</p>
                    <a 
                      href="#" 
                      rel="sponsored" 
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Shop on Petco - $12.99
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <PetServiceSchema service={service} />
    </>
  );
}

export default async function PetServicePage({ params }: PetServicePageProps) {
  return <PetServiceContent params={params} />;
}