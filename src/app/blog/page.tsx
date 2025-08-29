"use client";

import Link from "next/link";
import { useState } from "react";

const blogPosts = [
  {
    title: "How to Find a Qualified Pet Trainer",
    excerpt: "Discover the essential qualities to look for when choosing a professional pet trainer for your furry friend.",
    slug: "how-to-find-qualified-pet-trainer",
    category: "Training",
    readTime: "5 min read",
    publishDate: "2024-12-15",
    author: "Jane Doe"
  },
  {
    title: "Pet Boarding vs. In-Home Pet Sitting: Which is Right for You?",
    excerpt: "Compare the pros and cons of pet boarding facilities versus in-home pet sitting services to make the best choice for your pet.",
    slug: "pet-boarding-vs-in-home-pet-sitting",
    category: "Boarding",
    readTime: "6 min read",
    publishDate: "2024-12-12",
    author: "Jane Doe"
  },
  {
    title: "How to Groom Your Dog at Home: A Complete Guide",
    excerpt: "Learn professional grooming techniques you can use at home to keep your dog clean, healthy, and looking great.",
    slug: "how-to-groom-dog-at-home",
    category: "Grooming",
    readTime: "8 min read",
    publishDate: "2024-12-10",
    author: "Jane Doe"
  },
  {
    title: "Choosing the Right Veterinarian for Your Pet",
    excerpt: "Essential tips for finding a veterinarian who will provide the best care for your beloved companion.",
    slug: "choosing-right-veterinarian",
    category: "Veterinary",
    readTime: "7 min read",
    publishDate: "2024-12-08",
    author: "Jane Doe"
  },
  {
    title: "Saying Goodbye: A Compassionate Guide to Pet Cremation",
    excerpt: "A compassionate guide to pet cremation options, helping you make informed decisions during one of life's most difficult moments.",
    slug: "saying-goodbye-compassionate-guide-pet-cremation",
    category: "Pet Care",
    readTime: "12 min read",
    publishDate: "2024-12-19",
    author: "Jane Doe"
  }
];

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Pet Care", count: 1 },
  { name: "Training", count: 1 },
  { name: "Boarding", count: 1 },
  { name: "Grooming", count: 1 },
  { name: "Veterinary", count: 1 }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory && selectedCategory !== "All" 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

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
            {filteredPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">{post.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{new Date(post.publishDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
                    >
                      Read more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination - Only show when there are more than 10 posts */}
          {filteredPosts.length > 10 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2" aria-label="Pagination">
                {Array.from({ length: Math.ceil(filteredPosts.length / 10) }, (_, i) => (
                  <Link 
                    key={i + 1}
                    href={`/blog?page=${i + 1}`} 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      i === 0 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
                {Math.ceil(filteredPosts.length / 10) > 1 && (
                  <Link 
                    href="/blog?page=2" 
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name === 'All' ? null : category.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.name || (selectedCategory === null && category.name === 'All')
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          {/* 
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
          */}

          {/* Ad Zone - Sidebar Rectangle
          <div className="ad-zone sidebar-rectangle" role="complementary" aria-label="Sponsored content">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Advertisement</p>
              <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-sm">300x250 Ad Space</span>
              </div>
            </div>
          </div>
           */}

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
                <Link href="/blog/pet-boarding-vs-in-home-pet-sitting" className="text-sm text-blue-600 hover:underline">
                  Pet Boarding vs. In-Home Pet Sitting
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-find-qualified-pet-trainer" className="text-sm text-blue-600 hover:underline">
                  How to Find a Qualified Pet Trainer
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
