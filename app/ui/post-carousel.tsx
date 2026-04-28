"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Post } from "@/app/lib/definitions";

const BASE_CLONES = 3;

export default function Carousel({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isJumping = useRef(false);

  const total = posts.length;
  const CLONE_COUNT = Math.min(BASE_CLONES, total);

  const allPosts = [
    ...posts.slice(-CLONE_COUNT),
    ...posts,
    ...posts.slice(0, CLONE_COUNT),
  ];

  const cardWidth = useCallback(() => {
    const container = scrollRef.current;
    const card = container?.children[0] as HTMLElement | undefined;
    if (!container || !card) return 296;
    const styles = getComputedStyle(container);
    const gap = parseInt(styles.gap || styles.columnGap || "16") || 16;
    return card.offsetWidth + gap;
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollLeft = CLONE_COUNT * cardWidth();
  }, [CLONE_COUNT, cardWidth]);

  const teleport = useCallback((container: HTMLDivElement, target: number) => {
    container.style.scrollSnapType = "none";
    container.scrollLeft = target;
    requestAnimationFrame(() => {
      container.style.scrollSnapType = "";
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let debounce: ReturnType<typeof setTimeout>;

    function onScroll() {
      if (isJumping.current) return;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const el = scrollRef.current;
        if (!el) return;
        const cw = cardWidth();
        const idx = Math.floor((el.scrollLeft + cw / 2) / cw);
        const realIdx = idx - CLONE_COUNT;
        if (realIdx < 0) {
          isJumping.current = true;
          const corrected = realIdx + total;
          teleport(el, (corrected + CLONE_COUNT) * cw);
          setActiveIndex(corrected);
        } else if (realIdx >= total) {
          isJumping.current = true;
          const corrected = realIdx - total;
          teleport(el, (corrected + CLONE_COUNT) * cw);
          setActiveIndex(corrected);
        } else {
          setActiveIndex(realIdx);
        }
      }, 80);
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(debounce);
    };
  }, [cardWidth, teleport, total, CLONE_COUNT]);

  const scrollToReal = useCallback(
    (realIndex: number) => {
      const container = scrollRef.current;
      if (!container) return;
      container.scrollTo({
        left: (realIndex + CLONE_COUNT) * cardWidth(),
        behavior: "smooth",
      });
      setActiveIndex(realIndex);
    },
    [CLONE_COUNT, cardWidth],
  );

  function scrollBy(dir: number) {
    scrollToReal((activeIndex + dir + total) % total);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .carousel-outer {
          font-family: 'Sora', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 0.25rem 0 0.75rem;
        }

        .carousel-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .carousel-btn {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #13151c;
          border: 1px solid #2a2d3a;
          color: #6b7091;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .carousel-btn:hover {
          border-color: #3d4155;
          color: #e8eaf2;
          box-shadow: 0 8px 32px rgba(0,0,0,.4);
        }

        .carousel-track-wrap {
          flex: 1;
          overflow: hidden;
          padding: 6px 0 8px;
          margin: -6px 0 -8px;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
        }

        .carousel-track {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 0 4px;
        }
        .carousel-track::-webkit-scrollbar { display: none; }

        .carousel-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 280px;
          max-width: 280px;
          flex-shrink: 0;
          scroll-snap-align: start;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .carousel-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(124,109,250,.07) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.3s;
          opacity: 0;
        }
        .carousel-card:hover {
          border-color: #3d4155;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,.4);
        }
        .carousel-card:hover::before {
          opacity: 1;
        }

        .carousel-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7091;
          width: fit-content;
        }

        .carousel-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.01em;
          line-height: 1.4;
          margin: 0;
        }

        .carousel-divider {
          height: 1px;
          background: #2a2d3a;
          border: none;
          margin: 0;
        }

        .carousel-content {
          font-size: 0.82rem;
          color: #9096b8;
          line-height: 1.7;
          font-weight: 300;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .carousel-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: auto;
          padding-top: 0.25rem;
        }

        .carousel-read-more {
          font-size: 0.72rem;
          font-weight: 500;
          color: #5b9cf6;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .carousel-card:hover .carousel-read-more {
          color: #7c6dfa;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
        }
        .carousel-dot {
          height: 4px;
          width: 14px;
          border-radius: 3px;
          background: #2a2d3a;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .carousel-dot.active {
          width: 28px;
          background: linear-gradient(90deg, #7c6dfa, #5b9cf6);
        }
        .carousel-dot:hover:not(.active) {
          background: #3d4155;
        }
      `}</style>

      <div className="carousel-outer">
        <div className="carousel-row">
          <button
            className="carousel-btn"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
          >
            ←
          </button>

          <div className="carousel-track-wrap">
            <div className="carousel-track" ref={scrollRef}>
              {allPosts.map((post, i) => (
                <Link
                  key={`${post.id}-${i}`}
                  href={`/posts/${post.id}`}
                  className="carousel-card"
                >
                  <h2 className="carousel-title">{post.title}</h2>
                  <hr className="carousel-divider" />
                  <p className="carousel-content">{post.content}</p>
                  <div className="carousel-footer">
                    <span className="carousel-read-more">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            className="carousel-btn"
            onClick={() => scrollBy(1)}
            aria-label="Next"
          >
            →
          </button>
        </div>

        <div className="carousel-dots">
          {posts.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === activeIndex ? " active" : ""}`}
              onClick={() => scrollToReal(i)}
              aria-label={`Go to post ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
