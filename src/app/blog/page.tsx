import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pet Care Resources & Tips | PetCareLocal",
  description: "Expert advice, local insights, and practical tips to help you provide the best care for your furry, feathered, or scaled family members.",
  openGraph: {
    title: "Pet Care Resources & Tips | PetCareLocal",
    description: "Expert advice and practical tips for pet owners to find the best veterinary care, grooming, and pet services.",
    type: "website",
  },
};

const blogPosts = [
  {
    slug: "choosing-right-veterinarian",
    title: "How to Choose the Right Veterinarian for Your Pet",
    excerpt: "Finding a trusted veterinarian is one of the most important decisions you'll make as a pet owner. Learn what to look for, questions to ask, and red flags to avoid.",
    date: "2024-08-15",
    readTime: "8 min read",
    category: "Veterinary Care"
  },
  {
    slug: "professional-grooming-guide",
    title: "Professional Pet Grooming: What to Expect and How to Prepare",
    excerpt: "First time taking your pet to a professional groomer? Our comprehensive guide covers everything from preparation to what happens during the appointment.",
    date: "2024-08-10",
    readTime: "6 min read",
    category: "Grooming"
  },
  {
    slug: "emergency-vet-guide",
    title: "When to Visit an Emergency Vet: A Pet Owner's Guide",
    excerpt: "Learn to recognize the warning signs that require immediate veterinary attention and how to find emergency care in your area.",
    date: "2024-08-08",
    readTime: "5 min read",
    category: "Emergency Care"
  },
  {
    slug: "boarding-vs-pet-sitting",
    title: "Pet Boarding vs. In-Home Pet Sitting: Which is Right for You?",
    excerpt: "Compare the benefits and drawbacks of different pet care options when you travel. Make the best choice for your pet's comfort and safety.",
    date: "2024-08-05",
    readTime: "7 min read",
    category: "Pet Care"
  },
  {
    slug: "finding-pet-trainer",
    title: "How to Find a Qualified Pet Trainer in Your Area",
    excerpt: "Training is essential for a well-behaved pet. Learn how to identify qualified trainers, what methods to look for, and red flags to avoid.",
    date: "2024-08-01",
    readTime: "6 min read",
    category: "Training"
  }
];

const categories = [
  { name: "Veterinary Care", count: 12, href: "/blog/category/veterinary-care" },
  { name: "Grooming", count: 8, href: "/blog/category/grooming" },
  { name: "Training", count: 6, href: "/blog/category/training" },
  { name: "Nutrition", count: 5, href: "/blog/category/nutrition" },
  { name: "Emergency Care", count: 4, href: "/blog/category/emergency-care" },
  { name: "Pet Care", count: 10, href: "/blog/category/pet-care" }
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-6">
          Pet Care Resources & Tips
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Expert advice, local insights, and practical tips to help you provide the best care 
          for your furry, feathered, or scaled family members.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-black mb-4 leading-tight">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors no-underline"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {post.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read full article →
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2" aria-label="Pagination">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</span>
              <Link href="/blog?page=2" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</Link>
              <Link href="/blog?page=3" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</Link>
              <Link href="/blog?page=2" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next →</Link>
            </nav>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
            <nav>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link 
                      href={category.href}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors group"
                    >
                      <span className="group-hover:text-blue-600">{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest pet care tips and local service recommendations delivered to your inbox.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Ad Zone - Sidebar Rectangle */}
          <div className="ad-zone sidebar-rectangle" role="complementary" aria-label="Sponsored content">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Advertisement</p>
              <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-sm">300x250 Ad Space</span>
              </div>
            </div>
          </div>

          {/* Popular Articles */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog/choosing-right-veterinarian" className="text-sm text-blue-600 hover:underline">
                  How to Choose the Right Veterinarian
                </Link>
              </li>
              <li>
                <Link href="/blog/emergency-vet-guide" className="text-sm text-blue-600 hover:underline">
                  When to Visit an Emergency Vet
                </Link>
              </li>
              <li>
                <Link href="/blog/professional-grooming-guide" className="text-sm text-blue-600 hover:underline">
                  Professional Pet Grooming Guide
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-[#fac748] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-4">Ready to Find Quality Pet Care?</h2>
        <p className="text-black/80 mb-6 max-w-2xl mx-auto">
          Use our pet service finder to discover trusted veterinarians, groomers, trainers, and 
          pet sitters in your area. Compare services, read reviews, and book appointments.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-[#023e8a] text-white px-8 py-3 rounded-xl hover:bg-[#032d66] transition-colors font-semibold no-underline"
        >
          Find Pet Services Near You
        </Link>
      </div>
    </main>
  );
}