import type { Metadata } from "next";
import type { ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Clock, Phone, Globe, MapPin, Star, Shield, AlertTriangle } from "lucide-react";
import { PetServiceSchema } from "@/components/PetServiceSchema";

// Function to get pet service details from the API
async function getPetServiceDetails(id: string) {
  try {
    // Call our API endpoint to get real data from Google Places
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/pet-services/${id}`);
    
    if (!response.ok) {
      console.error("Failed to fetch pet service details:", response.status);
      return null;
    }
    
    const service = await response.json();
    return service as any; // Type assertion for now - in production you'd define proper types
  } catch (error) {
    console.error("Error fetching pet service details:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams: _searchParams }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getPetServiceDetails(resolvedParams.id);
  
  if (!service) {
    return {
      title: "Pet Service Not Found",
      description: "The requested pet service could not be found."
    };
  }
  
  return {
    title: `${service.name} - Pet Care Services in Austin, TX`,
    description: `${service.description.slice(0, 160)}...`,
    openGraph: {
      title: service.name,
      description: service.description,
      type: 'website',
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
        {service.phone && (
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
        )}
        
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
            <div className="font-medium text-left">Get Directions</div>
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
            <header className="flex items-start justify-between mb-3 pb-8 listing-header">
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

async function PetServiceContent({ params }: { params: { id: string } }) {
  const service = await getPetServiceDetails(params.id);
  
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
                    {service.rating && service.reviewCount ? (
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="font-medium">{service.rating}</span>
                        <span>({service.reviewCount} Google reviews)</span>
                      </div>
                    ) : service.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="font-medium">{service.rating}</span>
                        <span>(Google reviews)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">No ratings yet</span>
                      </div>
                    )}
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
                {service.specialties?.map((specialty: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                    {specialty}
                  </span>
                )) || <span className="text-gray-500">Specialties not available</span>}
              </div>
            </section>

            {/* Hours */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Hours</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {service.hours && Object.keys(service.hours).length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-sm font-medium text-gray-600 pb-2">Day</th>
                        <th className="text-left text-sm font-medium text-gray-600 pb-2">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      {Object.entries(service.hours as Record<string, string>).map(([day, hours]) => (
                        <tr key={day}>
                          <td className="text-sm text-gray-900 capitalize py-1">{day}</td>
                          <td className="text-sm text-gray-700 py-1">{hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Hours not available</p>
                )}
              </div>
            </section>

            {/* Location */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <address className="text-gray-700 not-italic">
                  {service.address}
                </address>
              </div>
            </section>

            {service.reviews && service.reviews.length > 0 && (
              <Reviews reviews={service.reviews} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <ContactActions service={service} />
              
              {/* Ad Zone - Sidebar Rectangle
              <div className="ad-zone sidebar-rectangle" role="complementary" aria-label="Sponsored content">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Advertisement</p>
                  <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-sm">300x250 Ad Space</span>
                  </div>
                </div>
              </div>
               */}

              {/* Recommended Products
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
               */}
            </div>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <PetServiceSchema service={service} />
    </>
  );
}

export default async function PetServicePage(props: Props) {
  const resolvedParams = await props.params;
  return <PetServiceContent params={resolvedParams} />;
}
