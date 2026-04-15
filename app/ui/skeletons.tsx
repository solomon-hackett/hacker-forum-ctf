export function CarouselSkeleton() {
  return (
    <div className="w-400">
      <div className="mb-4 px-2">
        <div className="bg-white/10 rounded w-64 h-8 shimmer" />
      </div>

      <div className="flex flex-row gap-6 px-2 pb-4 overflow-x-auto snap-mandatory snap-x">
        {Array.from({ length: 10 }).map((_, i) => (
          <PostCardSkeleton key={i} delay={i * 120} />
        ))}
      </div>
    </div>
  );
}

export function PostCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex flex-col bg-base-surface p-4 rounded-lg w-72 h-80 snap-start shrink-0"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="bg-white/10 rounded w-3/4 h-6 shimmer"
        style={{ animationDelay: `${delay}ms` }}
      />

      <div
        className="bg-white/10 mt-2 rounded w-1/3 h-4 shimmer"
        style={{ animationDelay: `${delay + 10}ms` }}
      />

      <div className="flex flex-col flex-1 gap-2 mt-4">
        <div
          className="bg-white/10 rounded w-full h-3 shimmer"
          style={{ animationDelay: `${delay + 20}ms` }}
        />
        <div
          className="bg-white/10 rounded w-5/6 h-3 shimmer"
          style={{ animationDelay: `${delay + 30}ms` }}
        />
        <div
          className="bg-white/10 rounded w-4/6 h-3 shimmer"
          style={{ animationDelay: `${delay + 40}ms` }}
        />
      </div>

      <div
        className="bg-white/10 mt-3 rounded w-24 h-4 shimmer"
        style={{ animationDelay: `${delay + 50}ms` }}
      />

      <div
        className="bg-white/10 mt-2 rounded w-20 h-3 shimmer"
        style={{ animationDelay: `${delay + 60}ms` }}
      />
    </div>
  );
}
