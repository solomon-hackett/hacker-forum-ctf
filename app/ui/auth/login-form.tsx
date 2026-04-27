"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

import { authenticate } from "@/app/lib/actions";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  ExclamationCircleIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const [usernameFilled, setUsernameFilled] = useState(false);
  const [passwordFilled, setPasswordFilled] = useState(false);

  const isAllowed = usernameFilled && passwordFilled;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .login-card {
          font-family: 'Sora', sans-serif;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 400px;
          position: relative;
          overflow: hidden;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(124,109,250,.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(91,156,246,.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-input {
          width: 100%;
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          padding: 0.7rem 0.9rem 0.7rem 2.7rem;
          font-size: 0.875rem;
          font-family: 'Sora', sans-serif;
          color: #e8eaf2;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input::placeholder { color: #6b7091; font-size: 0.8rem; }
        .login-input:focus {
          border-color: #7c6dfa;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.12);
        }
        .login-submit {
          background: linear-gradient(135deg, #7c6dfa, #5b9cf6);
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.75rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 20px rgba(124, 109, 250, 0.25);
        }
        .login-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(124, 109, 250, 0.35);
        }
        .login-submit:active:not(:disabled) { transform: translateY(0); }
        .login-submit:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          box-shadow: none;
        }
        .login-error-mono {
          font-family: 'DM Mono', monospace;
        }
      `}</style>

      <form action={formAction} className="login-card">
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#e8eaf2",
            letterSpacing: "-0.02em",
            marginBottom: "0.4rem",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7091",
            fontWeight: 300,
            marginBottom: "2rem",
          }}
        >
          Log in to continue.
        </p>

        {/* Username */}
        <div className="relative mb-5 w-full">
          <label
            htmlFor="username"
            style={{
              display: "block",
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "#6b7091",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Username
          </label>
          <div className="relative">
            <input
              className="login-input"
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              required
              onChange={(e) => setUsernameFilled(!!e.target.value)}
            />
            <UserIcon
              className="top-1/2 left-3 absolute w-4 h-4 -translate-y-1/2 pointer-events-none"
              style={{ color: "#6b7091" }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="relative mb-5 w-full">
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "#6b7091",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Password
          </label>
          <div className="relative">
            <input
              className="login-input"
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              onChange={(e) => setPasswordFilled(!!e.target.value)}
            />
            <KeyIcon
              className="top-1/2 left-3 absolute w-4 h-4 -translate-y-1/2 pointer-events-none"
              style={{ color: "#6b7091" }}
            />
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {/* Submit */}
        <div className="flex justify-center mt-2">
          <button
            className="login-submit"
            aria-disabled={isPending}
            disabled={!isAllowed || isPending}
          >
            {isPending ? "Logging in…" : "Log in"}
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #2a2d3a" }}
          />
          <span style={{ fontSize: "0.75rem", color: "#6b7091" }}>or</span>
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #2a2d3a" }}
          />
        </div>

        <p
          style={{ textAlign: "center", fontSize: "0.8rem", color: "#6b7091" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            style={{
              color: "#5b9cf6",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </p>

        {/* Server error */}
        {errorMessage && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg text-sm login-error-mono"
            aria-live="polite"
            aria-atomic="true"
            style={{
              background: "rgba(242,111,111,0.08)",
              border: "1px solid rgba(242,111,111,0.25)",
              color: "#f26f6f",
            }}
          >
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
            {errorMessage}
          </div>
        )}
      </form>
    </>
  );
}
