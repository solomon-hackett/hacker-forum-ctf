const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const lineWidths = ["w-full", "w-5/6", "w-4/6", "w-3/4", "w-2/3"];

export function CarouselSkeleton() {
  return (
    <div className="w-400">
      <div className="mb-4 px-2">
        <div className="bg-white/10 rounded w-64 h-8 shimmer" />
      </div>

      <div className="flex flex-row gap-6 px-2 pb-4 overflow-x-auto snap-mandatory snap-x">
        {Array.from({ length: 10 }).map((_, i) => (
          <PostCardSkeleton key={i} />
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
    <div className="flex flex-col bg-base-surface p-4 rounded-lg w-72 h-80 snap-start shrink-0">
      <div className={`bg-white/10 rounded h-6 shimmer ${w1} opacity-90`} />
      <div
        className={`bg-white/10 mt-2 rounded h-4 shimmer ${w2} opacity-80`}
      />

      <div className="flex flex-col flex-1 gap-2 mt-4">
        <div className={`bg-white/10 rounded h-3 shimmer ${w1} opacity-70`} />
        <div className={`bg-white/10 rounded h-3 shimmer ${w2} opacity-60`} />
        <div className={`bg-white/10 rounded h-3 shimmer ${w3} opacity-50`} />
      </div>

      <div className="bg-white/10 opacity-80 mt-3 rounded w-24 h-4 shimmer" />
      <div className="bg-white/10 opacity-60 mt-2 rounded w-20 h-3 shimmer" />
    </div>
  );
}
