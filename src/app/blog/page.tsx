import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get Fit Blog - Expert Tips & Guides | GoFitLocal",
  description: "Discover expert fitness tips, gym selection guides, and wellness advice to help you achieve your fitness goals. From choosing the right gym to workout strategies.",
  openGraph: {
    title: "Get Fit Blog - Expert Tips & Guides | GoFitLocal",
    description: "Discover expert fitness tips, gym selection guides, and wellness advice to help you achieve your fitness goals.",
    type: "website",
  },
};

const blogPosts = [
  {
    slug: "kettlebell-training-complete-guide",
    title: "Kettlebell Training: Your Complete Guide to Building Strength, Power, and Endurance",
    excerpt: "Master kettlebell training with our comprehensive guide. Learn proper form, programming, and expert techniques for building functional strength and explosive power.",
    date: "2025-01-10",
    readTime: "12 min read",
    category: "Strength Training"
  },
  {
    slug: "what-to-look-for-in-a-new-gym",
    title: "What to Look for in a New Gym: Your Complete Selection Guide",
    excerpt: "Finding the right gym can make or break your fitness journey. This comprehensive guide will help you find the perfect fitness home.",
    date: "2025-01-10",
    readTime: "8 min read",
    category: "Gym Selection"
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-6">
          Get Fit Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Expert tips, guides, and insights to help you achieve your fitness goals. 
          From choosing the right gym to mastering your workout routine.
        </p>
      </div>

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

      {/* Call to Action */}
      <div className="mt-16 bg-[#fac748] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-4">Ready to Find Your Perfect Gym?</h2>
        <p className="text-black/80 mb-6 max-w-2xl mx-auto">
          Use our gym finder tool to discover fitness facilities in your area and compare amenities, 
          pricing, and member reviews.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-[#023e8a] text-white px-8 py-3 rounded-xl hover:bg-[#032d66] transition-colors font-semibold no-underline"
        >
          Find Gyms Near You
        </Link>
      </div>
    </main>
  );
}
