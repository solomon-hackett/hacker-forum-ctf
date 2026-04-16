"use client";
import { DisplayPost } from "@/app/lib/definitions";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

export default function Carousel({
  title,
  items,
}: {
  title: string;
  items: DisplayPost[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);

  const CARD_WIDTH = 288 + 24;
  const CLONE_COUNT = 10;

  const displayItems = [
    ...Array.from({ length: CLONE_COUNT }, (_, i) => items[i % items.length]),
    ...Array.from({ length: CLONE_COUNT }, (_, i) => items[i % items.length]),
    ...Array.from({ length: CLONE_COUNT }, (_, i) => items[i % items.length]),
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = CLONE_COUNT * CARD_WIDTH;
  }, [CLONE_COUNT, CARD_WIDTH]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isScrolling.current) return;

    const totalWidth = CLONE_COUNT * CARD_WIDTH;
    const start = totalWidth;
    const end = totalWidth * 2;

    if (el.scrollLeft >= end) {
      isScrolling.current = true;
      el.scrollLeft -= totalWidth;
      isScrolling.current = false;
    }
    if (el.scrollLeft <= start - totalWidth) {
      isScrolling.current = true;
      el.scrollLeft += totalWidth;
      isScrolling.current = false;
    }

    const realOffset = el.scrollLeft - start;
    setActiveIndex(
      ((Math.round(realOffset / CARD_WIDTH) % CLONE_COUNT) + CLONE_COUNT) %
        CLONE_COUNT,
    );
  }, [CARD_WIDTH, CLONE_COUNT]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -CARD_WIDTH : CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const start = CLONE_COUNT * CARD_WIDTH;
    el.scrollTo({ left: start + i * CARD_WIDTH, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 px-2">
        <h1 className="font-bold text-3xl tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex justify-center items-center bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 rounded-full w-9 h-9 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex justify-center items-center bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 rounded-full w-9 h-9 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="flex flex-row gap-6 px-2 pb-4 overflow-x-auto scroll-smooth snap-mandatory snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayItems.map((item, i) => (
          <article
            key={`${item.id}-${i}`}
            className="group flex flex-col bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-72 h-80 transition-all hover:-translate-y-0.5 duration-200 snap-start shrink-0"
          >
            <h2 className="font-semibold text-primary line-clamp-2 leading-snug">
              {item.title}
            </h2>
            <p className="mt-1 font-medium text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wide">
              {item.author}
            </p>
            <p className="flex-1 mt-3 text-neutral-600 dark:text-neutral-400 text-sm line-clamp-4 leading-relaxed">
              {item.excerpt}
            </p>
            <div className="flex justify-between items-center mt-4">
              <Link
                href={`/posts/${item.id}`}
                className="group/link inline-flex items-center gap-1 font-medium text-blue-500 hover:text-blue-600 text-sm transition-colors"
              >
                Read more
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform translate-x-0 group-hover/link:translate-x-0.5"
                >
                  <path
                    d="M3 7h8M8 4l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <time className="text-neutral-400 dark:text-neutral-500 text-xs">
                {item.created_at}
              </time>
            </div>
          </article>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: CLONE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to item ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-5 bg-neutral-800 dark:bg-neutral-200"
                : "w-1.5 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
