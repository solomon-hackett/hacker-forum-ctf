import { Metadata } from "next";
import Link from "next/link";

import { fetchNewPosts } from "@/app/lib/data";

import { Post } from "../../lib/definitions";

export const metadata: Metadata = {
  title: "Admin",
  description: "GhostNet admin panel.",
};

export default async function Page() {
  const recentPosts = await fetchNewPosts();

  const stats = {
    users: 142,
    posts: 831,
    todayPosts: 17,
    reports: 3,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .admin-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 3rem 1.5rem;
        }
        .admin-container {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
          position: relative;
          overflow: hidden;
        }
        .admin-header::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(124,109,250,.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .admin-title { font-size: 1rem; font-weight: 600; color: #e8eaf2; letter-spacing: -0.01em; }
        .admin-subtitle { font-size: 0.8rem; color: #6b7091; margin-top: 2px; }
        .admin-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          border-radius: 8px;
          background: rgba(124,109,250,.1);
          border: 1px solid rgba(124,109,250,.25);
          color: #9fa6ff;
        }
        .admin-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          color: #6b7091;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .admin-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
          transition: border-color 0.2s, transform 0.2s;
        }
        .admin-card:hover {
          border-color: #3d4155;
          transform: translateY(-2px);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .stat-tile {
          background: #0e1018;
          border: 1px solid #2a2d3a;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7091;
        }
        .stat-value {
          font-size: 1.6rem;
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .stat-value.accent { color: #7c6dfa; }
        .stat-value.danger { color: #f87171; }
        .posts-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }
        .posts-table th {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7091;
          text-align: left;
          padding: 0 0.75rem 0.75rem;
          border-bottom: 1px solid #2a2d3a;
        }
        .posts-table td {
          padding: 0.75rem;
          color: #9096b8;
          border-bottom: 1px solid #1a1d27;
          vertical-align: middle;
        }
        .posts-table tr:last-child td { border-bottom: none; }
        .posts-table tr:hover td {
          color: #e8eaf2;
          background: rgba(255,255,255,.02);
        }
        .post-title-cell {
          color: #e8eaf2 !important;
          font-weight: 500;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .post-author-cell {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #5b9cf6 !important;
        }
        .post-action-btn {
          font-family: 'Sora', sans-serif;
          font-size: 0.7rem;
          padding: 0.28rem 0.6rem;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          margin-left: 4px;
        }
        .btn-remove {
          background: rgba(239,68,68,.08);
          border: 1px solid rgba(239,68,68,.2);
          color: #f87171;
        }
        .btn-remove:hover {
          background: rgba(239,68,68,.15);
          border-color: rgba(239,68,68,.4);
        }
        .btn-view {
          background: rgba(91,156,246,.08);
          border: 1px solid rgba(91,156,246,.2);
          color: #5b9cf6;
          text-decoration: none;
          display: inline-block;
        }
        .btn-view:hover {
          background: rgba(91,156,246,.15);
          border-color: rgba(91,156,246,.4);
        }
        .admin-empty {
          text-align: center;
          padding: 2rem;
          color: #6b7091;
          font-size: 0.82rem;
        }
      `}</style>

      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <div>
              <div className="admin-title">Admin Panel</div>
              <div className="admin-subtitle">GhostNet forum overview</div>
            </div>
            <span className="admin-badge">Admin</span>
          </div>

          <div className="admin-card">
            <p className="admin-section-label">Site Stats</p>
            <div className="stats-grid">
              <div className="stat-tile">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{stats.users}</span>
              </div>
              <div className="stat-tile">
                <span className="stat-label">Total Posts</span>
                <span className="stat-value accent">{stats.posts}</span>
              </div>
              <div className="stat-tile">
                <span className="stat-label">Posts Today</span>
                <span className="stat-value">{stats.todayPosts}</span>
              </div>
              <div className="stat-tile">
                <span className="stat-label">Reports</span>
                <span className="stat-value danger">{stats.reports}</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <p className="admin-section-label">Recent Posts</p>
            {recentPosts.length === 0 ? (
              <div className="admin-empty">No posts yet.</div>
            ) : (
              <table className="posts-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post: Post) => (
                    <tr key={post.id}>
                      <td className="post-title-cell">{post.title}</td>
                      <td className="post-author-cell">
                        {post.author_username}
                      </td>
                      <td>{post.created_at}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <Link
                          href={`/posts/${post.id}`}
                          className="post-action-btn btn-view"
                        >
                          View
                        </Link>
                        <button className="post-action-btn btn-remove">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="post-title-cell">
                      flag7&#123;m4Tq8BzP1K&#125;
                    </td>
                    <td className="post-author-cell">admin</td>
                    <td>67 days ago</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <p className="post-action-btn btn-view">View</p>
                      <button className="post-action-btn btn-remove">
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
