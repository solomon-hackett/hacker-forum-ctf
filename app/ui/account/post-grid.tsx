"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deletePost } from "@/app/lib/actions";
import { fetchUserPosts } from "@/app/lib/data";
import {
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function DeleteModal({
  postTitle,
  onConfirm,
  onCancel,
  isPending,
}: {
  postTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="delete-backdrop" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon-wrap">
          <ExclamationTriangleIcon
            className="w-6 h-6"
            style={{ color: "#f26f6f" }}
          />
        </div>
        <h2 className="delete-title">Delete post?</h2>
        <p className="delete-body">
          <span style={{ color: "#e8eaf2", fontWeight: 500 }}>{postTitle}</span>{" "}
          will be permanently removed. This cannot be undone.
        </p>
        <div className="delete-actions">
          <button
            className="delete-cancel-btn"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            className="delete-confirm-btn"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostGrid({
  posts,
  isAdmin,
}: {
  posts: Awaited<ReturnType<typeof fetchUserPosts>>;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    await deletePost(pendingDelete.id);
    setIsDeleting(false);
    setPendingDelete(null);
    router.refresh();
  }

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
        .post-card:hover::before { opacity: 1; }

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
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(124,109,250,.3), rgba(91,156,246,.3));
          border: 1px solid rgba(124,109,250,.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 600; color: #a99df5; flex-shrink: 0;
        }
        .post-username { font-size: 0.78rem; font-weight: 500; color: #a99df5; }
        .post-role {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem; border-radius: 6px;
          padding: 2px 7px; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .post-role-member  { color: #888780; background: rgba(136,135,128,.1); border: 1px solid rgba(136,135,128,.2); }
        .post-role-moderator { color: #ef9f27; background: rgba(239,159,39,.1); border: 1px solid rgba(239,159,39,.2); }
        .post-role-admin   { color: #f09595; background: rgba(240,149,149,.1); border: 1px solid rgba(240,149,149,.2); }

        .post-divider { height: 1px; background: #2a2d3a; border: none; margin: 0; }

        .post-content {
          font-size: 0.82rem; color: #9096b8; line-height: 1.7; font-weight: 300; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
        }

        .post-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: auto; padding-top: 0.25rem;
        }
        .post-read-more {
          font-size: 0.72rem; font-weight: 500; color: #5b9cf6;
          text-decoration: none; letter-spacing: 0.02em; transition: color 0.2s;
        }
        .post-read-more:hover { color: #7c6dfa; }

        /* ACTION BUTTONS */
        .post-actions { display: flex; align-items: center; gap: 0.4rem; }
        .post-action-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 7px;
          border: 1px solid #2a2d3a; background: #1a1d27;
          cursor: pointer; transition: border-color 0.2s, background 0.2s, color 0.2s;
          color: #6b7091; text-decoration: none;
        }
        .post-action-btn:hover { border-color: #3d4155; color: #e8eaf2; background: #22263a; }
        .post-action-btn-delete:hover { border-color: rgba(242,111,111,.4); color: #f26f6f; background: rgba(242,111,111,.08); }

        .post-empty {
          font-family: 'Sora', sans-serif; grid-column: 1 / -1; text-align: center;
          padding: 4rem 2rem; color: #6b7091; font-size: 0.875rem; font-weight: 300;
        }

        /* DELETE MODAL */
        .delete-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: fade-in 0.15s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .delete-modal {
          font-family: 'Sora', sans-serif;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 2rem;
          width: 100%; max-width: 380px;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
          text-align: center;
          animation: slide-up 0.18s ease;
        }
        @keyframes slide-up {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .delete-modal::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(242,111,111,.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .delete-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(242,111,111,.1); border: 1px solid rgba(242,111,111,.2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.25rem;
        }
        .delete-title {
          font-size: 1.15rem; font-weight: 600; color: #e8eaf2;
          letter-spacing: -0.01em; margin: 0;
        }
        .delete-body {
          font-size: 0.8rem; color: #6b7091; font-weight: 300;
          line-height: 1.6; margin: 0;
        }
        .delete-actions {
          display: flex; gap: 0.65rem; margin-top: 0.5rem; width: 100%;
        }
        .delete-cancel-btn {
          flex: 1; padding: 0.65rem;
          background: #1a1d27; border: 1px solid #2a2d3a;
          border-radius: 10px; color: #a0a3b8;
          font-family: 'Sora', sans-serif; font-size: 0.875rem; font-weight: 500;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .delete-cancel-btn:hover:not(:disabled) { border-color: #3d4155; color: #e8eaf2; }
        .delete-cancel-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .delete-confirm-btn {
          flex: 1; padding: 0.65rem;
          background: rgba(242,111,111,.12); border: 1px solid rgba(242,111,111,.3);
          border-radius: 10px; color: #f26f6f;
          font-family: 'Sora', sans-serif; font-size: 0.875rem; font-weight: 500;
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
        }
        .delete-confirm-btn:hover:not(:disabled) {
          background: rgba(242,111,111,.2); border-color: rgba(242,111,111,.5);
        }
        .delete-confirm-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="post-grid">
        {posts.length === 0 ? (
          <div className="post-empty">No posts yet. Write your first.</div>
        ) : (
          posts.map((post) => {
            const initials = post.author_username
              ? post.author_username.slice(0, 2).toUpperCase()
              : "??";
            const isXss = post.successful_xss && !post.public;
            return isXss ? (
              <XssCard
                key={post.id}
                post={post}
                onDelete={(id, title) => setPendingDelete({ id, title })}
              />
            ) : (
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
                  <Link
                    href={`/posts/${post.id}?redirect=/account/posts`}
                    className="post-read-more"
                  >
                    Read more →
                  </Link>
                  {!isAdmin && (
                    <div className="post-actions">
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="post-action-btn"
                        title="Edit post"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        className="post-action-btn post-action-btn-delete"
                        title="Delete post"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete({ id: post.id, title: post.title });
                        }}
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {pendingDelete && (
        <DeleteModal
          postTitle={pendingDelete.title}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
          isPending={isDeleting}
        />
      )}
    </>
  );
}

function XssCard({
  post,
  onDelete,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    author_username: string;
    author_role: string;
    created_at: string;
  };
  onDelete: (id: number, title: string) => void;
}) {
  const [flagField] = useState<"title" | "content">(() =>
    /<script/i.test(post.title) ? "title" : "content",
  );

  const initials = post.author_username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="post-card">
      <div className="post-header">
        {flagField === "title" ? (
          <h2
            className="post-title"
            dangerouslySetInnerHTML={{
              __html: `<script>alert("flag6{Z9fL2qX7wA}")</script>`,
            }}
          />
        ) : (
          <h2 className="post-title">{post.title}</h2>
        )}
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

      {flagField === "content" ? (
        <p
          className="post-content"
          dangerouslySetInnerHTML={{
            __html: `<script>alert("flag6{Z9fL2qX7wA}")</script>`,
          }}
        />
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      <div className="post-footer">
        <Link
          href={`/posts/${post.id}?redirect=/account/posts`}
          className="post-read-more"
        >
          Read more →
        </Link>
        <div className="post-actions">
          <Link
            href={`/posts/${post.id}/edit`}
            className="post-action-btn"
            title="Edit post"
            onClick={(e) => e.stopPropagation()}
          >
            <PencilIcon className="w-3.5 h-3.5" />
          </Link>
          <button
            className="post-action-btn post-action-btn-delete"
            title="Delete post"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id, post.title);
            }}
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
