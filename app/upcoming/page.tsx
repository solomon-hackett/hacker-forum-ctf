import { cookies } from "next/headers";

export default async function UpcomingPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("paywall_unlocked")?.value === "true";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .upcoming-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 2rem;
          gap: 2rem;
        }
        .upcoming-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .upcoming-header {
          padding: 2rem 2.25rem;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }
        .upcoming-header::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(124,109,250,.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .upcoming-header::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(91,156,246,.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .upcoming-title {
          font-size: 2.2rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          background: linear-gradient(90deg, #e8eaf2 30%, #9fa6ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .upcoming-subtitle {
          font-size: 0.82rem;
          color: #6b7091;
          font-weight: 300;
          margin-top: 0.45rem;
        }

        .upcoming-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          color: #6b7091;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .upcoming-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 1.75rem;
          position: relative;
          overflow: hidden;
        }

        .upcoming-content {
          font-size: 0.92rem;
          color: #9096b8;
          font-weight: 300;
          line-height: 1.7;
        }

        .upcoming-blur {
          filter: blur(8px);
          user-select: none;
          pointer-events: none;
        }

        .paywall-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(2px);
        }

        .paywall-modal {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 2.25rem 2.5rem;
          text-align: center;
          max-width: 360px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .paywall-modal::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(124,109,250,.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .paywall-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .paywall-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.01em;
          margin-bottom: 0.5rem;
        }

        .paywall-desc {
          font-size: 0.8rem;
          color: #6b7091;
          font-weight: 300;
          line-height: 1.6;
        }
      `}</style>

      <main className="upcoming-page">
        <div className="upcoming-inner">
          <div className="upcoming-header">
            <div className="upcoming-title">Upcoming Feature</div>
            <div className="upcoming-subtitle">
              Exclusive content for members
            </div>
          </div>

          <div className={`upcoming-card ${unlocked ? "" : "upcoming-blur"}`}>
            <p className="upcoming-section-label">Premium content</p>
            <p className="upcoming-content">
              {/* eslint-disable-next-line react/no-danger */}
              flag11&#123;a8Kp3VtM6s&#125;
            </p>
          </div>
        </div>

        {!unlocked && (
          <div className="paywall-overlay">
            <div className="paywall-modal">
              <div className="paywall-icon">🔒</div>
              <div className="paywall-title">Members only</div>
              <p className="paywall-desc">
                This feature is available to paid members. Upgrade your account
                to unlock access.
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
