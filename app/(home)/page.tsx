import { Metadata } from "next";
import Link from "next/link";

import NewPostsCarousel from "../ui/home/new-posts";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .home-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 2rem;
          gap: 2rem;
        }
        .home-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* HEADER */
        .home-header {
          padding: 2rem 2.25rem;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }
        .home-header::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(124,109,250,.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .home-header::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(91,156,246,.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .home-title {
          font-size: 2.2rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #e8eaf2 30%, #9fa6ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .home-subtitle {
          font-size: 0.82rem;
          color: #6b7091;
          font-weight: 300;
          margin-top: 0.45rem;
        }

        /* SECTION LABEL */
        .home-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          color: #6b7091;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        /* CONTENT CARD */
        .home-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 1.75rem;
        }

        /* VIEW MORE BUTTON */
        .view-more-btn {
          font-family: 'Sora', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          color: #a0a3b8;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: border-color 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .view-more-btn:hover {
          border-color: #7c6dfa;
          color: #e8eaf2;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(124, 109, 250, 0.15);
        }
        .view-more-btn:active {
          transform: translateY(0);
        }
        .view-more-btn .btn-arrow {
          font-size: 0.9rem;
          transition: transform 0.2s;
        }
        .view-more-btn:hover .btn-arrow {
          transform: translateX(2px);
        }
      `}</style>

      <main className="home-page">
        <div className="home-inner">
          {/* Header */}
          <div className="home-header">
            <div className="home-title">Home</div>
            <div className="home-subtitle">
              Discover the latest posts from the network
            </div>
          </div>

          {/* Carousel */}
          <div className="home-card">
            <p className="home-section-label">Latest posts</p>
            <NewPostsCarousel />
          </div>

          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/posts" className="view-more-btn">
              View all posts
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>

        <div
          id="comments"
          dangerouslySetInnerHTML={{
            __html:
              "<!-- Dev comment: flag1{K7mR2pX9nQ} the admin account has a weak password, we should probably change that. We currently don't sanitise the private posts, should probably fix that, additionally, they are displayed without being escaped on the user's page. -->",
          }}
        />
      </main>
    </>
  );
}
