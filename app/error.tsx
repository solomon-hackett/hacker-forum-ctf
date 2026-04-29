"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .error-root {
          font-family: 'Sora', sans-serif;
          background: #0d0f15;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background glows */
        .error-root::before {
          content: '';
          position: fixed;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(242,111,111,.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .error-root::after {
          content: '';
          position: fixed;
          bottom: -80px; left: 20%;
          width: 400px; height: 200px;
          background: radial-gradient(ellipse, rgba(124,109,250,.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .error-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 480px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .error-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Top-right corner glow */
        .error-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(242,111,111,.1) 0%, transparent 70%);
          pointer-events: none;
        }
        /* Bottom-left corner glow */
        .error-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(124,109,250,.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .error-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: rgba(242, 111, 111, 0.1);
          border: 1px solid rgba(242, 111, 111, 0.22);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.4rem;
          flex-shrink: 0;
        }

        .error-code {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f26f6f;
          background: rgba(242, 111, 111, 0.08);
          border: 1px solid rgba(242, 111, 111, 0.18);
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .error-title {
          font-size: 1.6rem;
          font-weight: 600;
          color: #e8eaf2;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
          line-height: 1.2;
        }

        .error-subtitle {
          font-size: 0.8rem;
          color: #6b7091;
          font-weight: 300;
          margin: 0 0 1.6rem;
          line-height: 1.6;
        }

        /* Digest / message box */
        .error-detail {
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin-bottom: 2rem;
        }
        .error-detail-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #6b7091;
          margin-bottom: 0.35rem;
        }
        .error-detail-value {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          color: #a0a3b8;
          word-break: break-all;
          line-height: 1.5;
        }

        .error-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .error-btn-primary {
          background: linear-gradient(135deg, #7c6dfa, #5b9cf6);
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.7rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 20px rgba(124, 109, 250, 0.25);
        }
        .error-btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(124, 109, 250, 0.35);
        }
        .error-btn-primary:active { transform: translateY(0); }

        .error-btn-ghost {
          background: transparent;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          color: #a0a3b8;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          padding: 0.7rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .error-btn-ghost:hover {
          border-color: #7c6dfa;
          color: #e8eaf2;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.1);
        }

        /* Divider */
        .error-divider {
          height: 1px;
          background: #2a2d3a;
          margin: 1.75rem 0;
        }

        .error-footer {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          color: #3d4159;
          text-align: center;
          letter-spacing: 0.04em;
        }
      `}</style>

      <main className="error-root">
        <div className={`error-card${visible ? " visible" : ""}`}>
          {/* Icon */}
          <div className="error-icon-wrap">
            <ExclamationTriangleIcon
              style={{ width: "1.4rem", height: "1.4rem", color: "#f26f6f" }}
            />
          </div>

          {/* Badge */}
          <span className="error-code">runtime error</span>

          {/* Heading */}
          <h1 className="error-title">Something went wrong</h1>
          <p className="error-subtitle">
            An unexpected error occurred. You can try again or head back — your
            data should be safe.
          </p>

          {/* Error detail */}
          <div className="error-detail">
            <p className="error-detail-label">Details</p>
            <p className="error-detail-value">
              {error.message || "An unknown error occurred."}
              {error.digest && (
                <span
                  style={{
                    display: "block",
                    marginTop: "0.3rem",
                    color: "#3d4159",
                  }}
                >
                  digest: {error.digest}
                </span>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="error-actions">
            <button className="error-btn-primary" onClick={reset}>
              <ArrowPathIcon style={{ width: "1rem", height: "1rem" }} />
              Try again
            </button>
            <button
              className="error-btn-ghost"
              onClick={() => {
                router.back();
              }}
            >
              <ArrowLeftIcon style={{ width: "1rem", height: "1rem" }} />
              Go back
            </button>
          </div>

          <div className="error-divider" />

          <p className="error-footer">ghostnet // error boundary</p>
        </div>
      </main>
    </>
  );
}
