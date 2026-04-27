import Link from "next/link";

import { fetchPostById } from "@/app/lib/data";

export default async function PostPage({ id }: { id: string }) {
  const post = await fetchPostById(id);

  const initials = post.author_username
    ? post.author_username.slice(0, 2).toUpperCase()
    : "??";

  const role = post.author_role?.toLowerCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .post-page {
          font-family: 'Sora', sans-serif;
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .post-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #6b7091;
          text-decoration: none;
          letter-spacing: 0.02em;
          margin-bottom: 2rem;
          transition: color 0.2s;
        }
        .post-back:hover { color: #e8eaf2; }
        .post-back::before {
          content: '←';
          font-size: 0.85rem;
        }

        .post-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .post-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(124,109,250,.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .post-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(91,156,246,.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .post-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin: 0 0 1.25rem;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
        }
        .post-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(124,109,250,.3), rgba(91,156,246,.3));
          border: 1px solid rgba(124,109,250,.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: #a99df5;
          flex-shrink: 0;
        }
        .post-author-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #a99df5;
        }
        .post-role {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          border-radius: 6px;
          padding: 2px 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .post-role-member {
          color: #888780;
          background: rgba(136,135,128,.1);
          border: 1px solid rgba(136,135,128,.2);
        }
        .post-role-moderator {
          color: #ef9f27;
          background: rgba(239,159,39,.1);
          border: 1px solid rgba(239,159,39,.2);
        }
        .post-role-admin {
          color: #f09595;
          background: rgba(240,149,149,.1);
          border: 1px solid rgba(240,149,149,.2);
        }
        .post-meta-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #2a2d3a;
          flex-shrink: 0;
        }
        .post-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          color: #6b7091;
        }

        .post-divider {
          height: 1px;
          background: #2a2d3a;
          border: none;
          margin: 0 0 1.75rem;
        }

        .post-content {
          font-size: 0.925rem;
          color: #9096b8;
          line-height: 1.85;
          font-weight: 300;
          margin: 0;
          white-space: pre-wrap;
        }
      `}</style>

      <div className="post-page">
        <Link href="/posts" className="post-back">
          Back to posts
        </Link>

        <article className="post-card">
          <h1 className="post-title">{post.title}</h1>

          <div className="post-meta">
            <div className="post-avatar">{initials}</div>
            <span className="post-author-name">{post.author_username}</span>
            {post.author_role && (
              <span className={`post-role post-role-${role}`}>
                {post.author_role}
              </span>
            )}
            <span className="post-meta-sep" />
            <span className="post-date">{post.created_at}</span>
          </div>

          <hr className="post-divider" />

          <p className="post-content">{post.content}</p>
        </article>
      </div>
    </>
  );
}
