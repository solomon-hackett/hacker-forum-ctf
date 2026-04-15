"use client";

import { DisplayPost } from "@/app/lib/definitions";
import Link from "next/link";

export default function Carousel({
  title,
  items,
}: {
  title: string;
  items: DisplayPost[];
}) {
  return (
    <div className="w-400">
      <h1 className="mb-4 px-2 text-3xl">{title}</h1>

      <div className="flex flex-row gap-6 px-2 pb-4 overflow-x-auto scroll-smooth snap-mandatory snap-x">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-base-surface p-4 rounded-lg w-72 h-80 snap-start shrink-0"
          >
            <h2 className="font-bold text-xl">{item.title}</h2>

            <h3 className="opacity-70 text-sm">{item.author}</h3>

            <p className="flex-1 mt-2 text-sm line-clamp-3">{item.excerpt}</p>

            <Link
              href={`/posts/${item.id}`}
              className="mt-3 text-blue-500 text-sm"
            >
              Read More
            </Link>

            <p className="opacity-60 mt-2 text-xs">{item.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
