import Link from "next/link";
import { Suspense } from "react";

import UserPosts from "@/app/ui/account/user-posts";
import { auth } from "@/auth";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default async function Page() {
  const session = await auth();
  const id = session?.user?.id;
  const role = session?.user?.role;
  const isAdmin = role === "admin";

  return (
    <>
      {/* SAME STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .account-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .account-container {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .account-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
        }

        .account-title {
          font-size: 1rem;
          font-weight: 600;
          color: #e8eaf2;
        }

        .account-subtitle {
          font-size: 0.8rem;
          color: #6b7091;
        }

        .account-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
        }

        .account-loading {
          padding: 2rem;
          text-align: center;
          color: #6b7091;
          font-size: 0.85rem;
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          font-size: 0.8rem;
          border-radius: 10px;
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          color: #e8eaf2;
          text-decoration: none;
        }

        .create-btn:hover {
          border-color: #3d4155;
        }
      `}</style>

      <div className="account-page">
        <div className="account-container">
          {/* Header */}
          <div className="account-header">
            <div>
              <div className="account-title">Your Posts</div>
              <div className="account-subtitle">Manage your content</div>
            </div>

            {!isAdmin && (
              <Link
                href="/posts/create?redirect=/account/posts"
                className="create-btn"
              >
                <PlusCircleIcon className="w-4 h-4" />
                Create
              </Link>
            )}
          </div>

          {/* Posts */}
          <div className="account-card">
            <Suspense
              fallback={<div className="account-loading">Loading posts...</div>}
            >
              {id ? (
                <UserPosts id={id} isAdmin={isAdmin} />
              ) : (
                <div className="account-loading">You are not signed in.</div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
