"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { checkUsernameExists, signUp } from '@/app/lib/actions';
import { SignUpState } from '@/app/lib/definitions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { KeyIcon, UserIcon } from '@heroicons/react/24/solid';

const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/;

function ErrorPopup({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 font-mono text-red-400 text-xs animate-fade-in">
      <ExclamationCircleIcon className="w-3.5 h-3.5 shrink-0" />
      {message}
    </div>
  );
}

function StrengthMeter({ password }: { password: string }) {
  const getStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = password ? getStrength(password) : 0;
  const colors = [
    "bg-red-500",
    "bg-red-500",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-400",
  ];

  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
            password && i <= strength ? colors[strength] : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function SignUpForm() {
  let isValid = false;
  const [usernameDialogue, setUsernameDialogue] = useState("");
  const [isValidUsername, setValidUsername] = useState(false);
  const [passwordDialogue, setPasswordDialogue] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepDialogue, setPasswordRepDialogue] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [repMatchState, setRepMatchState] = useState<
    "none" | "match" | "mismatch"
  >("none");
  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(
    signUp,
    { error: null, success: false },
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.replace("/auth/login");
    }
  }, [state.success, router]);

  const lastRequestId = useRef(0);

  async function runUsernameValidation(username: string) {
    const requestId = ++lastRequestId.current;

    let message = "";
    let valid = true;

    if (!username) {
      message = "Please enter a username.";
      valid = false;
    } else if (username.length < 3) {
      message = "Username must be longer than 3 characters.";
      valid = false;
    } else if (!usernameRegex.test(username)) {
      message = "Only letters, numbers, underscores allowed.";
      valid = false;
    } else {
      const exists = await checkUsernameExists(username);
      if (requestId !== lastRequestId.current) return;
      if (exists) {
        message = "Username is taken";
        valid = false;
      }
    }

    setUsernameDialogue(message);
    setValidUsername(valid);
  }

  const checkUsernameDebounced = useDebouncedCallback(
    runUsernameValidation,
    250,
  );

  function checkUsernameImmediate(username: string) {
    runUsernameValidation(username);
  }

  function checkPassword(password: string) {
    let message = "";
    if (password.length < 8) {
      message = "Password should be 8 characters or more.";
    } else if (!passwordRegex.test(password)) {
      message = "Must contain uppercase, lowercase, number and symbol.";
    }
    setPasswordDialogue(message);
  }

  function checkRepPassword(repPassword: string, currentPassword: string) {
    if (!repPassword) {
      setPasswordRepDialogue("");
      setRepMatchState("none");
      return;
    }
    if (repPassword !== currentPassword) {
      setPasswordRepDialogue("Passwords must match");
      setRepMatchState("mismatch");
    } else {
      setPasswordRepDialogue("");
      setRepMatchState("match");
    }
  }

  const isValidPassword = passwordRegex.test(password) && password.length >= 8;
  const passwordsMatch = password === repPassword;
  isValid = isValidUsername && isValidPassword && passwordsMatch;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .signup-card {
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
        .signup-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(124,109,250,.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .signup-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(91,156,246,.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .signup-input {
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
        .signup-input::placeholder { color: #6b7091; font-size: 0.8rem; }
        .signup-input:focus {
          border-color: #7c6dfa;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.12);
        }
        .signup-submit {
          background: linear-gradient(135deg, #7c6dfa, #5b9cf6);
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.75rem 2.5rem;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 20px rgba(124, 109, 250, 0.25);
        }
        .signup-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(124, 109, 250, 0.35);
        }
        .signup-submit:active:not(:disabled) { transform: translateY(0); }
        .signup-submit:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          box-shadow: none;
        }
        .signup-error-mono {
          font-family: 'DM Mono', monospace;
        }
      `}</style>

      <form action={formAction} className="signup-card">
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#e8eaf2",
            letterSpacing: "-0.02em",
            marginBottom: "0.4rem",
          }}
        >
          Create account
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7091",
            fontWeight: 300,
            marginBottom: "2rem",
          }}
        >
          Join us — it only takes a moment.
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
              className="signup-input"
              type="text"
              name="username"
              id="username"
              placeholder="e.g. cool_user42"
              required
              onChange={(e) => checkUsernameDebounced(e.target.value)}
              onBlur={(e) => {
                checkUsernameDebounced.cancel();
                checkUsernameImmediate(e.target.value);
              }}
            />
            <UserIcon
              className="top-1/2 left-3 absolute w-4 h-4 -translate-y-1/2 pointer-events-none"
              style={{ color: "#6b7091" }}
            />
          </div>
          <ErrorPopup message={usernameDialogue} />
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
              className="signup-input"
              type="password"
              name="password"
              id="password"
              placeholder="8+ chars, mixed case & symbol"
              required
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                checkPassword(value);
                if (repPassword) checkRepPassword(repPassword, value);
              }}
            />
            <KeyIcon
              className="top-1/2 left-3 absolute w-4 h-4 -translate-y-1/2 pointer-events-none"
              style={{ color: "#6b7091" }}
            />
          </div>
          <StrengthMeter password={password} />
          <ErrorPopup message={passwordDialogue} />
        </div>

        {/* Repeat Password */}
        <div className="relative mb-5 w-full">
          <label
            htmlFor="password-rep"
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
            Repeat Password
          </label>
          <div className="relative">
            <input
              className="signup-input"
              type="password"
              name="password-rep"
              id="password-rep"
              placeholder="Same password again"
              required
              onChange={(e) => {
                const value = e.target.value;
                setRepPassword(value);
                checkRepPassword(value, password);
              }}
            />
            <KeyIcon
              className="top-1/2 left-3 absolute w-4 h-4 -translate-y-1/2 pointer-events-none"
              style={{ color: "#6b7091" }}
            />
            {repMatchState !== "none" && (
              <span
                className="top-1/2 right-3 absolute text-sm -translate-y-1/2"
                style={{
                  color: repMatchState === "match" ? "#52e0a0" : "#f26f6f",
                }}
              >
                {repMatchState === "match" ? "✓" : "✗"}
              </span>
            )}
          </div>
          <ErrorPopup message={passwordRepDialogue} />
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-2">
          <button
            type="submit"
            disabled={!isValid || isPending}
            className="signup-submit"
          >
            {isPending ? "Signing up…" : "Sign Up"}
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
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{
              color: "#5b9cf6",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Log in
          </Link>
        </p>

        {/* Server error */}
        {state.error && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg text-sm signup-error-mono"
            style={{
              background: "rgba(242,111,111,0.08)",
              border: "1px solid rgba(242,111,111,0.25)",
              color: "#f26f6f",
            }}
          >
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
            {state.error}
          </div>
        )}
      </form>
    </>
  );
}
