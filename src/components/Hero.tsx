"use client";
import Image from "next/image";

export default function Hero({
  title = "Find Trusted Pet Care Services Near You",
  subtitle = "Discover veterinarians, groomers, trainers, and pet sitters in your local area. Compare services, read reviews, and book appointments with confidence.",
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative mx-auto max-w-6xl mt-6 rounded-3xl overflow-hidden bg-[#fac748] min-h-[360px] md:min-h-[520px]">
      <div className="relative grid md:grid-cols-2 items-stretch h-full">
        {/* Left: copy on clean gradient */}
        <div className="relative z-10 px-6 sm:px-10 py-10 text-black flex items-center">
          <div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black" style={{ lineHeight: '62px' }}>
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-black/80 text-base sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-6">{children}</div>
          </div>
        </div>

        {/* Right: hero image, optimized for LCP */}
        <div className="relative h-full min-h-[300px] md:min-h-[520px]">
          <Image
            src="/hero.jpg"
            alt="Happy pet owner with their dog at a veterinary clinic"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
            className="object-cover object-center md:object-[70%]"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          {/* No overlay/gradient on hero */}
        </div>
      </div>
    </section>
  );
}


