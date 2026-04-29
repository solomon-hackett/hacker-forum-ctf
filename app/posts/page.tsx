import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { fetchPostsPages } from "@/app/lib/data";
import Pagination from "@/app/ui/posts/pagination";
import PostGrid from "@/app/ui/posts/post-grid";
import Search from "@/app/ui/posts/search";
import SortDropdown from "@/app/ui/posts/sort";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Posts",
  description: "View the posts on the GhostNet dark web hacker forum.",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    private?: number;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  if (searchParams?.private === undefined) {
    const params = new URLSearchParams();
    if (searchParams?.query) params.set("query", searchParams.query);
    if (searchParams?.sort) params.set("sort", searchParams.sort);
    if (searchParams?.page) params.set("page", searchParams.page);
    params.set("private", "0");
    redirect(`/posts?${params.toString()}`);
  }

  const query = searchParams?.query || "";
  const sort = searchParams?.sort || "";
  const priv = Number(searchParams?.private) || 0;
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPostsPages(query);

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
        }
        .posts-header-bg {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .posts-header-bg::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(124,109,250,.1) 0%, transparent 70%);
        }
        .posts-header-bg::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(91,156,246,.07) 0%, transparent 70%);
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
          position: relative;
          z-index: 1;
        }
        .posts-subtitle {
          font-size: 0.82rem;
          color: #6b7091;
          font-weight: 300;
          margin-top: 0.45rem;
          position: relative;
          z-index: 1;
        }

        .posts-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        .create-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          height: 40px;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 10px;
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          color: #e8eaf2;
          text-decoration: none;
          white-space: nowrap;
          margin-left: auto;
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

        /* SKELETON */
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .posts-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .posts-skeleton-item {
          height: 160px;
          border-radius: 12px;
          background: linear-gradient(90deg, #1a1d27 25%, #22263a 50%, #1a1d27 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite linear;
        }

        /* PAGINATION */
        .posts-pagination {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #2a2d3a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <main className="posts-page">
        <div className="posts-inner">
          {/* Header */}
          <div className="posts-header">
            <div className="posts-header-bg" aria-hidden="true" />
            <div className="posts-title">Posts</div>
            <div className="posts-subtitle">
              Explore content from across the network
            </div>
            <div className="posts-controls">
              <Search />
              <SortDropdown />
              <Link href="/posts/create?redirect=/posts" className="create-btn">
                <PlusCircleIcon className="w-4 h-4" />
                Create a Post
              </Link>
            </div>
          </div>

          {/* Grid */}
          <div className="posts-card">
            <p className="posts-section-label">All posts</p>
            <Suspense
              key={`${query}-${sort}-${priv}-${currentPage}`}
              fallback={
                <div className="posts-skeleton">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="posts-skeleton-item" />
                  ))}
                </div>
              }
            >
              <PostGrid
                query={query}
                sort={sort}
                priv={priv}
                currentPage={currentPage}
              />
            </Suspense>
            <div className="posts-pagination">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
