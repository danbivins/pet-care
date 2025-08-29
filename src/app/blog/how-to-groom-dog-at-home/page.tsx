import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Groom a Dog at Home | LocalPetGuide",
  description: "Help your dog look and feel their best when you can't get to a local groomer this week.",
  openGraph: {
    title: "How to Groom a Dog at Home",
    description: "Help your dog look and feel their best when you can't get to a local groomer this week.",
    type: "article",
    publishedTime: "2024-12-10T00:00:00.000Z",
    authors: ["Jane Doe"],
    tags: ["dog grooming", "home grooming", "pet care", "dog maintenance", "grooming tips"],
  },
};

export default function HowToGroomDogAtHomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-700">How to Groom a Dog at Home</li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <div className="mb-6">
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Grooming
          </span>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <time dateTime="2024-12-10">
              December 10, 2024
            </time>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>By Jane Doe</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6 leading-tight">
          How to Groom a Dog at Home
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Help your dog look and feel their best when you can&apos;t get to a local groomer this week.
        </p>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Sometimes life happens. Your groomer is booked for three weeks, your dog rolled in something questionable at the park, or you just want to save some money. Whatever the reason, grooming your dog at home doesn&apos;t have to be a disaster waiting to happen. With the right approach and realistic expectations, you can keep your pup looking decent until you can get back to the professionals.
        </p>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">Before We Start: Managing Expectations</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Let&apos;s be real – your first attempt probably won&apos;t look like a professional grooming job, and that&apos;s totally fine. The goal here is to keep your dog clean, comfortable, and presentable. Think &quot;maintenance grooming&quot; rather than &quot;ready for the dog show.&quot;
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Also, some dogs genuinely need professional grooming. If your poodle hasn&apos;t been groomed in months or your dog has severe matting, it&apos;s better to bite the bullet and find an available groomer, even if it means driving a bit further.
        </p>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">What You&apos;ll Need</h2>
        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Basic supplies:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Dog shampoo (never use human shampoo – it messes with their skin pH)</li>
          <li>Towels you don&apos;t mind getting hairy</li>
          <li>A brush appropriate for your dog&apos;s coat</li>
          <li>Nail clippers designed for dogs</li>
          <li>Cotton balls or pads</li>
          <li>Dog toothbrush and toothpaste</li>
        </ul>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Nice-to-have extras:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>A blow dryer (human ones work, just use cool air)</li>
          <li>Grooming scissors (blunt-tip for safety)</li>
          <li>Ear cleaning solution</li>
          <li>Non-slip mat for the tub</li>
        </ul>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">Step 1: The Pre-Bath Brush Out</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          This step is crucial and often skipped. Wet mats become tight mats, so brush your dog thoroughly before the bath. If you hit serious tangles, work them out gently with your fingers or consider using a detangling spray.
        </p>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">For different coat types:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Short coats: A rubber curry brush works great</li>
          <li>Long coats: Start with a slicker brush, finish with a comb</li>
          <li>Thick undercoats: An undercoat rake can be a lifesaver</li>
        </ul>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Don&apos;t rush this part. Put on a good podcast and take your time.
        </p>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">Step 2: The Bath</h2>
        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Setup tips:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Use lukewarm water – hot water can irritate their skin</li>
          <li>Place a non-slip mat in the tub if you have one</li>
          <li>Have everything within reach before you start</li>
          <li>Close the bathroom door (trust me on this)</li>
        </ul>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">The actual washing:</h3>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
          <li>Wet your dog thoroughly, starting from the neck down</li>
          <li>Apply shampoo and work it into a lather, avoiding the face and ears</li>
          <li>Rinse, rinse, and then rinse some more – leftover soap causes itching</li>
          <li>For the face, use a damp washcloth with just a tiny bit of shampoo</li>
        </ol>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          <strong>Pro tip:</strong> Most dogs hate the sound of running water hitting the tub. Cup your hand over the faucet to muffle the sound, or use a detachable shower head on low pressure.
        </p>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">Step 3: Drying</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Pat, don&apos;t rub, with towels to avoid creating new tangles. If using a blow dryer, keep it on cool and move it constantly. Some dogs love blow dryers, others act like you&apos;re torturing them. Know your audience.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          For thick coats, you might need to brush as you dry to prevent mats from forming.
        </p>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">Step 4: Basic Trimming</h2>
        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Only attempt this if:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>You have proper grooming scissors (blunt-tip)</li>
          <li>Your dog is calm and cooperative</li>
          <li>You&apos;re just doing light maintenance</li>
        </ul>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Safe areas to trim:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Hair around the paw pads (carefully!)</li>
          <li>Hair covering the eyes</li>
          <li>Sanitary areas (the hair around, well, you know)</li>
        </ul>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Areas to avoid:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Anything near the ears</li>
          <li>Major coat shaping</li>
          <li>Anything you&apos;re not confident about</li>
        </ul>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          When in doubt, don&apos;t cut. It&apos;s better to have a slightly shaggy dog than one with an unfortunate haircut.
        </p>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">Step 5: Nails, Ears, and Teeth</h2>
        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Nail trimming:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Only trim the white tips, never the pink &quot;quick&quot;</li>
          <li>If your dog has dark nails and you can&apos;t see the quick, just trim tiny amounts</li>
          <li>It&apos;s better to trim more frequently and take less off each time</li>
        </ul>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Ear cleaning:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Use cotton balls with a bit of ear cleaning solution</li>
          <li>Wipe only what you can see – never go deep into the ear canal</li>
          <li>If your dog&apos;s ears smell bad or look infected, skip this and see the vet</li>
        </ul>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">Teeth brushing:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Use dog toothpaste (human toothpaste is toxic to dogs)</li>
          <li>Start slowly – just let them lick the toothpaste off your finger at first</li>
          <li>Work up to actually brushing a few teeth at a time</li>
        </ul>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">When to Call in the Professionals</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6"><strong>Don&apos;t attempt home grooming if:</strong></p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Your dog is severely matted</li>
          <li>They&apos;re aggressive or extremely anxious about being handled</li>
          <li>You need breed-specific cuts</li>
          <li>There are skin issues or infections</li>
          <li>Your dog needs their anal glands expressed (leave this to the pros)</li>
        </ul>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">Making It Less Stressful</h2>
        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">For your dog:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Start with short sessions and work up to longer ones</li>
          <li>Use high-value treats throughout the process</li>
          <li>Take breaks if either of you gets frustrated</li>
          <li>End on a positive note, even if you don&apos;t finish everything</li>
        </ul>

        <h3 className="text-2xl font-semibold text-black mt-8 mb-4">For you:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          <li>Wear clothes you don&apos;t mind getting wet and hairy</li>
          <li>Accept that your bathroom will look like a fur bomb went off</li>
          <li>Remember that practice makes progress, not perfection</li>
        </ul>

        <h2 className="text-3xl font-bold text-black mt-12 mb-6">The Bottom Line</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Home grooming isn&apos;t about replacing your professional groomer – it&apos;s about maintaining your dog&apos;s comfort and cleanliness between visits. Some dogs will never love being groomed at home, and that&apos;s okay. Do what you can, keep it positive, and don&apos;t stress about perfection.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Your dog doesn&apos;t care if their haircut is Instagram-worthy. They just want to be clean, comfortable, and loved. And honestly? A slightly imperfect grooming job done with patience and care is better than a perfect one done with stress and frustration.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Plus, there&apos;s something pretty satisfying about a clean, fluffy dog who smells good and feels soft. Even if they do shake and get hair all over your bathroom five minutes later.
        </p>
      </article>

      {/* Call to Action */}
      <div className="mt-16 bg-purple-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-4">Need Professional Grooming?</h2>
        <p className="text-gray-700 mb-6">
          When you&apos;re ready for a professional touch, we can help you find trusted groomers in your area.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold no-underline"
        >
          Find Pet Groomers Near You
        </Link>
      </div>

      {/* Related Articles */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-black mb-6">Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/blog/choosing-right-veterinarian" className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-black mb-2">How to Choose the Right Veterinarian for Your Pet</h4>
            <p className="text-gray-600 text-sm">Finding a trusted veterinarian is one of the most important decisions you&apos;ll make as a pet owner.</p>
          </Link>
          <Link href="/blog/pet-boarding-vs-in-home-pet-sitting" className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-black mb-2">Pet Boarding vs. In-Home Pet Sitting</h4>
            <p className="text-gray-600 text-sm">Compare the benefits and drawbacks of different pet care options when you travel.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
