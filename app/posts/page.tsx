import { Metadata } from "next";

import PostGrid from "@/app/ui/posts/post-grid";

export const metadata: Metadata = {
  title: "Posts",
  description: "View the posts on the GhostNet dark web hacker forum.",
};

export default function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .posts-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 2rem;
          gap: 2rem;
        }
        .posts-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* HEADER */
        .posts-header {
          padding: 2rem 2.25rem;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }
        .posts-header::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(124,109,250,.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .posts-header::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(91,156,246,.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .posts-title {
          font-size: 2.2rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #e8eaf2 30%, #9fa6ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .posts-subtitle {
          font-size: 0.82rem;
          color: #6b7091;
          font-weight: 300;
          margin-top: 0.45rem;
        }

        /* SECTION LABEL */
        .posts-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          color: #6b7091;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        /* GRID CARD */
        .posts-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 1.75rem;
        }
      `}</style>

      <main className="posts-page">
        <div className="posts-inner">
          {/* Header */}
          <div className="posts-header">
            <div className="posts-title">Posts</div>
            <div className="posts-subtitle">
              Explore content from across the network
            </div>
          </div>

          {/* Grid */}
          <div className="posts-card">
            <p className="posts-section-label">All posts</p>
            <PostGrid />
          </div>
        </div>
      </main>
    </>
  );
}
