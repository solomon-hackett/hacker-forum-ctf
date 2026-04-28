import { Metadata } from "next";
import { Suspense } from "react";

import NotificationTray from "@/app/ui/account/notification-tray";
import UserInfo from "@/app/ui/account/user-info";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Account",
  description: "View your GhostNet account.",
};

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
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

        /* HEADER BAR */
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
          letter-spacing: -0.01em;
        }

        .account-subtitle {
          font-size: 0.8rem;
          color: #6b7091;
          margin-top: 2px;
        }

        /* CONTENT CARD */
        .account-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;
          padding: 1.5rem;

          box-shadow: 0 8px 32px rgba(0,0,0,.25);
          transition: border-color 0.2s, transform 0.2s;
        }

        .account-card:hover {
          border-color: #3d4155;
          transform: translateY(-2px);
        }

        /* LOADING STATE */
        .account-loading {
          padding: 2rem;
          text-align: center;
          color: #6b7091;
          font-size: 0.85rem;
        }
      `}</style>

      <div className="account-page">
        <div className="account-container">
          {/* Header */}
          <div className="account-header">
            <div>
              <div className="account-title">Account</div>
              <div className="account-subtitle">
                Manage your GhostNet profile and activity
              </div>
            </div>

            <NotificationTray id={userId} />
          </div>

          {/* User Info */}
          {userId && (
            <div className="account-card">
              <Suspense
                fallback={
                  <div className="account-loading">
                    Loading user information...
                  </div>
                }
              >
                <UserInfo id={userId} />
              </Suspense>
            </div>
          )}

          {!userId && (
            <div className="account-card">
              <div className="account-loading">You are not signed in.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
