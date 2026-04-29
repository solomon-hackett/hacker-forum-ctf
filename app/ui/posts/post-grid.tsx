import { fetchFilteredPosts } from "@/app/lib/data";

export default async function PostGrid({
  query,
  sort,
  priv,
  currentPage,
}: {
  query: string;
  sort: string;
  priv: number;
  currentPage: number;
}) {
  const posts = await fetchFilteredPosts(query, sort, priv, currentPage);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .post-grid {
          font-family: 'Sora', sans-serif;
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
          padding: 1.5rem;
          width: 100%;
        }
        @media (min-width: 768px) {
          .post-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1280px) {
          .post-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .post-card {
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
          cursor: pointer;
        }
        .post-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(124,109,250,.07) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.3s;
          opacity: 0;
        }
        .post-card:hover {
          border-color: #3d4155;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,.4);
        }
        .post-card:hover::before {
          opacity: 1;
        }

        .post-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .post-title {
          font-size: 1rem;
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.01em;
          line-height: 1.4;
          margin: 0;
        }
        .post-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          color: #6b7091;
          white-space: nowrap;
          padding-top: 2px;
          flex-shrink: 0;
        }

        .post-author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .post-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(124,109,250,.3), rgba(91,156,246,.3));
          border: 1px solid rgba(124,109,250,.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 600;
          color: #a99df5;
          flex-shrink: 0;
        }
        .post-username {
          font-size: 0.78rem;
          font-weight: 500;
          color: #a99df5;
        }
        .post-role {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          border-radius: 6px;
          padding: 2px 7px;
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

        .post-divider {
          height: 1px;
          background: #2a2d3a;
          border: none;
          margin: 0;
        }

        .post-content {
          font-size: 0.82rem;
          color: #9096b8;
          line-height: 1.7;
          font-weight: 300;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: auto;
          padding-top: 0.25rem;
        }
        .post-read-more {
          font-size: 0.72rem;
          font-weight: 500;
          color: #5b9cf6;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .post-read-more:hover { color: #7c6dfa; }

        .post-empty {
          font-family: 'Sora', sans-serif;
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7091;
          font-size: 0.875rem;
          font-weight: 300;
        }
      `}</style>

      <div className="post-grid">
        {posts.length === 0 ? (
          <div className="post-empty">
            No posts yet. Be the first to write one.
          </div>
        ) : (
          posts.map((post) => {
            const initials = post.author_username
              ? post.author_username.slice(0, 2).toUpperCase()
              : "??";

            return (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <h2 className="post-title">{post.title}</h2>
                  <span className="post-date">{post.created_at}</span>
                </div>

                <div className="post-author">
                  <div className="post-avatar">{initials}</div>
                  <span className="post-username">{post.author_username}</span>
                  {post.author_role && (
                    <span
                      className={`post-role post-role-${post.author_role.toLowerCase()}`}
                    >
                      {post.author_role}
                    </span>
                  )}
                </div>

                <hr className="post-divider" />

                <p className="post-content">{post.content}</p>

                <div className="post-footer">
                  <a href={`/posts/${post.id}`} className="post-read-more">
                    Read more →
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
