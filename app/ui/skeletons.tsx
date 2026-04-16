const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const lineWidths = ["w-full", "w-5/6", "w-4/6", "w-3/4", "w-2/3"];

export function CarouselSkeleton() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 px-2">
        <div className="bg-neutral-200 dark:bg-neutral-800 rounded w-48 h-9 shimmer" />
        <div className="flex items-center gap-2">
          <div className="bg-neutral-200 dark:bg-neutral-800 rounded-full w-9 h-9 shimmer" />
          <div className="bg-neutral-200 dark:bg-neutral-800 rounded-full w-9 h-9 shimmer" />
        </div>
      </div>

      {/* Scroll track */}
      <div className="flex flex-row gap-6 px-2 pb-4 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 shimmer ${i === 0 ? "w-5" : "w-1.5"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  const w1 = lineWidths[rand(0, lineWidths.length - 1)];
  const w2 = lineWidths[rand(0, lineWidths.length - 1)];
  const w3 = lineWidths[rand(0, lineWidths.length - 1)];

  return (
    <div className="flex flex-col bg-white dark:bg-neutral-900 shadow-sm p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-72 h-80 shrink-0">
      {/* Title */}
      <div
        className={`bg-neutral-200 dark:bg-neutral-800 rounded h-5 shimmer ${w1}`}
      />
      <div
        className={`bg-neutral-200 dark:bg-neutral-800 rounded h-5 mt-1.5 shimmer ${w2} opacity-60`}
      />

      {/* Author */}
      <div className="bg-neutral-200 dark:bg-neutral-800 opacity-70 mt-2.5 rounded w-24 h-3 shimmer" />

      {/* Excerpt lines */}
      <div className="flex flex-col flex-1 gap-2 mt-4">
        <div
          className={`bg-neutral-200 dark:bg-neutral-800 rounded h-3 shimmer ${w1}`}
        />
        <div
          className={`bg-neutral-200 dark:bg-neutral-800 rounded h-3 shimmer ${w2}`}
        />
        <div
          className={`bg-neutral-200 dark:bg-neutral-800 rounded h-3 shimmer ${w3}`}
        />
        <div
          className={`bg-neutral-200 dark:bg-neutral-800 rounded h-3 shimmer ${w1} opacity-50`}
        />
      </div>

      {/* Footer: Read more + date */}
      <div className="flex justify-between items-center mt-4">
        <div className="bg-neutral-200 dark:bg-neutral-800 rounded w-20 h-3.5 shimmer" />
        <div className="bg-neutral-200 dark:bg-neutral-800 opacity-60 rounded w-16 h-3 shimmer" />
      </div>
    </div>
  );
}

export function PostGridSkeleton() {
  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-10 w-full">
      {Array.from({ length: 15 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
