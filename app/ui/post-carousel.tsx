"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Post } from "@/app/lib/definitions";

const CLONE_COUNT = 3;

export default function Carousel({ posts }: { posts: Post[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isJumping = useRef(false);
  const total = posts.length;

  const allPosts = [
    ...posts.slice(-CLONE_COUNT),
    ...posts,
    ...posts.slice(0, CLONE_COUNT),
  ];

  const cardWidth = useCallback(() => {
    const card = scrollRef.current?.children[0] as HTMLElement | undefined;
    if (!card) return 296; // 280px card + 16px gap
    const gap = parseInt(getComputedStyle(scrollRef.current!).gap) || 16;
    return card.offsetWidth + gap;
  }, []);

  // Init: only touch the DOM, no setState (activeIndex already defaults to 0)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollLeft = CLONE_COUNT * cardWidth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Teleport helper: disable snap → set scrollLeft → re-enable snap next frame
  const teleport = useCallback(
    (container: HTMLElement, targetScrollLeft: number) => {
      container.style.scrollSnapType = "none";
      container.scrollLeft = targetScrollLeft;
      // Re-enable snap after the browser has painted the new position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.scrollSnapType = "";
        });
      });
    },
    [],
  );

  // Infinite scroll handler: debounced, async — setState in callback is fine
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let debounce: ReturnType<typeof setTimeout>;

    function onScroll() {
      if (isJumping.current) return;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const cw = cardWidth();
        const idx = Math.round(container!.scrollLeft / cw);
        const realIdx = idx - CLONE_COUNT;

        if (realIdx < 0) {
          isJumping.current = true;
          const corrected = realIdx + total;
          teleport(container!, (corrected + CLONE_COUNT) * cw);
          setActiveIndex(corrected);
          setTimeout(() => {
            isJumping.current = false;
          }, 100);
        } else if (realIdx >= total) {
          isJumping.current = true;
          const corrected = realIdx - total;
          teleport(container!, (corrected + CLONE_COUNT) * cw);
          setActiveIndex(corrected);
          setTimeout(() => {
            isJumping.current = false;
          }, 100);
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
  }, [cardWidth, teleport, total]);

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
    [cardWidth],
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
          gap: 1rem;
          padding: 0.5rem 0 1rem;
          max-width: 80vw;
        }

        .carousel-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1.5rem;
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
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
          font-size: 0.85rem;
        }
        .carousel-btn:hover {
          border-color: #7c6dfa;
          color: #e8eaf2;
          box-shadow: 0 0 12px rgba(124, 109, 250, 0.2);
        }

        .carousel-track-wrap {
          flex: 1;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          height: 
        }
        .carousel-track::-webkit-scrollbar {
          display: none;
        }

        .carousel-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          min-width: 280px;
          max-width: 280px;
          flex-shrink: 0;
          scroll-snap-align: start;
        }
        .carousel-card::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(124, 109, 250, 0.07) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .carousel-card:hover {
          border-color: #3d4155;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        .carousel-card:hover::before {
          opacity: 1;
        }

        .carousel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .carousel-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.01em;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .carousel-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: #6b7091;
          white-space: nowrap;
          padding-top: 2px;
          flex-shrink: 0;
        }

        .carousel-author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .carousel-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(124, 109, 250, 0.3), rgba(91, 156, 246, 0.3));
          border: 1px solid rgba(124, 109, 250, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 600;
          color: #a99df5;
          flex-shrink: 0;
        }
        .carousel-username {
          font-size: 0.78rem;
          font-weight: 500;
          color: #a99df5;
        }
        .carousel-role {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          border-radius: 6px;
          padding: 2px 7px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .post-role-member {
          color: #888780;
          background: rgba(136, 135, 128, 0.1);
          border: 1px solid rgba(136, 135, 128, 0.2);
        }
        .post-role-moderator {
          color: #ef9f27;
          background: rgba(239, 159, 39, 0.1);
          border: 1px solid rgba(239, 159, 39, 0.2);
        }
        .post-role-admin {
          color: #f09595;
          background: rgba(240, 149, 149, 0.1);
          border: 1px solid rgba(240, 149, 149, 0.2);
        }

        .carousel-divider {
          height: 1px;
          background: #2a2d3a;
          border: none;
          margin: 0;
        }
        .carousel-content {
          font-size: 0.8rem;
          color: #9096b8;
          line-height: 1.7;
          font-weight: 300;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .carousel-footer {
          display: flex;
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
        .carousel-read-more:hover {
          color: #7c6dfa;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }
        .carousel-dot {
          height: 5px;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: width 0.3s ease, background 0.3s ease;
          background: #2a2d3a;
          width: 16px;
        }
        .carousel-dot.active {
          width: 28px;
          background: linear-gradient(90deg, #7c6dfa, #5b9cf6);
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
              {allPosts.map((post, i) => {
                const initials = post.author_username
                  ? post.author_username.slice(0, 2).toUpperCase()
                  : "??";
                return (
                  <div key={`${post.id}-${i}`} className="carousel-card">
                    <div className="carousel-header">
                      <h2 className="carousel-title">{post.title}</h2>
                      <span className="carousel-date">{post.created_at}</span>
                    </div>

                    <div className="carousel-author">
                      <div className="carousel-avatar">{initials}</div>
                      <span className="carousel-username">
                        {post.author_username}
                      </span>
                      {post.author_role && (
                        <span
                          className={`carousel-role post-role-${post.author_role.toLowerCase()}`}
                        >
                          {post.author_role}
                        </span>
                      )}
                    </div>

                    <hr className="carousel-divider" />

                    <p className="carousel-content">{post.content}</p>

                    <div className="carousel-footer">
                      <a
                        href={`/posts/${post.id}`}
                        className="carousel-read-more"
                      >
                        Read more →
                      </a>
                    </div>
                  </div>
                );
              })}
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
