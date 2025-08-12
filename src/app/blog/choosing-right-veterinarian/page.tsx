import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Choose the Right Veterinarian for Your Pet | LocalPetGuide",
  description: "Finding a trusted veterinarian is one of the most important decisions you'll make as a pet owner. Learn what to look for, questions to ask, and red flags to avoid.",
  openGraph: {
    title: "How to Choose the Right Veterinarian for Your Pet",
    description: "Complete guide to finding the perfect veterinary care for your pet",
    type: "article",
  },
};

export default function ChoosingVeterinarianArticle() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          </li>
          <li>/</li>
          <li className="text-gray-700">Choosing the Right Veterinarian</li>
        </ol>
      </nav>

      {/* Back to Blog */}
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <article className="prose prose-lg max-w-none">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              Veterinary Care
            </span>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <time dateTime="2024-08-15">August 15, 2024</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>8 minute read</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>Pet Care Team</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Choose the Right Veterinarian for Your Pet
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Choosing the right veterinarian is one of the most important decisions you&apos;ll make as a pet owner. 
            Your vet will be your partner in keeping your furry family member healthy, happy, and comfortable 
            throughout their life. Here&apos;s your complete guide to finding the perfect veterinary care for your pet.
          </p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search Early</h2>
            <p>
              Don&apos;t wait until your pet needs medical attention to start looking for a veterinarian. Begin your search 
              when you first adopt your pet, or even before. This gives you time to research options, schedule 
              meet-and-greet appointments, and make an informed decision without the pressure of a medical emergency.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Essential Factors to Consider</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Location and Convenience</h3>
            <p>
              Choose a veterinary clinic that&apos;s reasonably close to your home. In emergencies, every minute counts, 
              and you don&apos;t want to spend precious time traveling across town. Additionally, convenient location 
              makes it easier to keep up with routine appointments and preventive care.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Services Offered</h3>
            <p>Consider what services you&apos;ll need both now and in the future:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Routine Care:</strong> Wellness exams, vaccinations, dental cleanings</li>
              <li><strong>Emergency Services:</strong> After-hours care or emergency referral protocols</li>
              <li><strong>Specialized Care:</strong> Surgery, dentistry, exotic pet care</li>
              <li><strong>Additional Services:</strong> Grooming, boarding, behavioral counseling</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Hospital Accreditation and Staff Credentials</h3>
            <p>
              Look for veterinary hospitals accredited by the American Animal Hospital Association (AAHA). 
              This voluntary accreditation ensures the practice meets high standards for equipment, medical protocols, 
              and continuing education.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions to Ask During Your Visit</h2>
            <p>
              Schedule a meet-and-greet appointment to tour the facility and meet the staff. Here are essential 
              questions to ask:
            </p>

            <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic text-lg">
              &quot;What are your emergency protocols? Do you handle after-hours emergencies or refer to another clinic?&quot;
            </blockquote>

            <ul className="list-disc pl-6 space-y-2">
              <li>What are your hours of operation?</li>
              <li>How do you handle prescription refills and follow-up questions?</li>
              <li>What payment options do you accept?</li>
              <li>Do you offer wellness plans or payment programs?</li>
              <li>How far in advance do I need to schedule routine appointments?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Red Flags to Watch For</h2>
            <p>Trust your instincts if you notice any of these warning signs:</p>

            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Lack of cleanliness:</strong> The facility should be spotless and odor-free</li>
              <li><strong>Unwillingness to show you around:</strong> Reputable clinics are proud of their facilities</li>
              <li><strong>Pressure for unnecessary services:</strong> Good vets explain why treatments are needed</li>
              <li><strong>Poor communication:</strong> Staff should explain procedures clearly and answer questions patiently</li>
              <li><strong>Outdated equipment:</strong> Modern diagnostic tools indicate quality care</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Building a Relationship</h2>
            <p>Once you&apos;ve chosen a veterinarian, focus on building a strong relationship:</p>

            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Keep detailed records of your pet&apos;s health history</li>
              <li>Ask questions during appointments</li>
              <li>Follow through with recommended treatments and preventive care</li>
              <li>Communicate openly about your concerns and observations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Consider Switching Vets</h2>
            <p>Sometimes, despite your best efforts, a veterinary relationship doesn&apos;t work out. Consider switching if:</p>

            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>You consistently feel rushed during appointments</li>
              <li>Your concerns aren&apos;t taken seriously</li>
              <li>Treatment recommendations seem excessive or unexplained</li>
              <li>The clinic is frequently understaffed or disorganized</li>
              <li>Your pet seems stressed or fearful during visits</li>
            </ul>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              💡 Pro Tip
            </h3>
            <p className="text-blue-800">
              Many veterinary clinics offer new client discounts or wellness packages. Ask about these options 
              during your initial visit to get the best value for your pet&apos;s care.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finding Vets in Your Area</h2>
            <p>
              Ready to start your search? Use our veterinarian finder to explore qualified vets in your area, 
              complete with reviews, services offered, and contact information. You can filter by specialties, 
              hours, and location to find the perfect match for your pet&apos;s needs.
            </p>
          </section>

          {/* Recommended Products Section */}
          <div className="bg-gray-50 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold mb-4">Essential Supplies for Vet Visits</h3>
            <p className="text-gray-600 mb-4">Make vet visits easier with these helpful products:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Comfort Pet Carrier</h4>
                <p className="text-sm text-gray-600 mb-3">Reduce travel stress with a well-ventilated, comfortable carrier</p>
                <a 
                  href="#" 
                  rel="sponsored" 
                  className="text-blue-600 hover:underline text-sm"
                >
                  Shop on Chewy - $49.99
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Calming Treats</h4>
                <p className="text-sm text-gray-600 mb-3">Help anxious pets stay calm during vet visits</p>
                <a 
                  href="#" 
                  rel="sponsored" 
                  className="text-blue-600 hover:underline text-sm"
                >
                  Shop on Petco - $18.99
                </a>
              </div>
            </div>
          </div>

          <p className="text-lg">
            Remember, the best veterinarian for your pet is one who communicates well with you, provides compassionate care, 
            and helps you feel confident about your pet&apos;s health decisions. Take your time, ask questions, and trust your 
            instincts when making this important choice.
          </p>
        </div>
      </article>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-2">Share this article:</h3>
            <div className="flex gap-3">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Facebook
              </button>
              <button className="px-3 py-1 bg-sky-500 text-white rounded text-sm hover:bg-sky-600">
                Twitter
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                Email
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-3">You might also like:</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/blog/emergency-vet-guide" className="text-blue-600 hover:underline">
                When to Visit an Emergency Vet
              </Link>
            </li>
            <li>
              <Link href="/blog/professional-grooming-guide" className="text-blue-600 hover:underline">
                Professional Pet Grooming Guide
              </Link>
            </li>
            <li>
              <Link href="/blog/boarding-vs-pet-sitting" className="text-blue-600 hover:underline">
                Pet Boarding vs. In-Home Pet Sitting
              </Link>
            </li>
          </ul>
        </div>
      </footer>

      {/* Call to Action */}
      <div className="mt-12 bg-[#fac748] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-4">Ready to Find a Great Veterinarian?</h2>
        <p className="text-black/80 mb-6">
          Use our vet finder to discover qualified veterinarians in your area with reviews and detailed information.
        </p>
        <Link 
          href="/?categories=veterinary" 
          className="inline-block bg-[#023e8a] text-white px-8 py-3 rounded-xl hover:bg-[#032d66] transition-colors font-semibold no-underline"
        >
          Find Veterinarians Near You
        </Link>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "How to Choose the Right Veterinarian for Your Pet",
            "description": "Complete guide to finding the perfect veterinary care for your pet, including what to look for, questions to ask, and red flags to avoid.",
            "author": {
              "@type": "Organization",
              "name": "LocalPetGuide"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LocalPetGuide"
            },
            "datePublished": "2024-08-15",
            "dateModified": "2024-08-15"
          })
        }}
      />
    </main>
  );
}
