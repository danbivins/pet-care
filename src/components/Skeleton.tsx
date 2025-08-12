export default function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
}

// Optimized skeleton components for different use cases
export function PetServiceSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative mx-auto max-w-6xl mt-6 rounded-3xl overflow-hidden bg-gray-200 min-h-[360px] md:min-h-[520px]">
      <div className="relative grid md:grid-cols-2 items-stretch h-full">
        <div className="relative z-10 px-6 sm:px-10 py-10 flex items-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <div className="pt-4">
              <Skeleton className="h-12 w-48 rounded-lg" />
            </div>
          </div>
        </div>
        <Skeleton className="h-full min-h-[300px] md:min-h-[520px]" />
      </div>
    </div>
  );
}

export function CategoryPillsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full" />
      ))}
    </div>
  );
}


