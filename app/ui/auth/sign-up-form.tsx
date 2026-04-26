"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { checkUsernameExists, signUp } from "@/app/lib/actions";
import { SignUpState } from "@/app/lib/definitions";

const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/;

export default function SignUpForm() {
  let isValid = false;
  const [usernameDialogue, setUsernameDialogue] = useState("");
  const [isValidUsername, setValidUsername] = useState(false);
  const [passwordDialogue, setPasswordDialogue] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepDialogue, setPasswordRepDialogue] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(
    signUp,
    { error: null, success: false },
  );

  const router = useRouter();

  useEffect(() => {
    if (!isPending && state.success) {
      router.replace("/auth/login");
    }
  }, [state.success, isPending, router]);

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
      message =
        "Password must contain an uppercase and lowercase letter, a number and a symbol.";
    }
    setPasswordDialogue(message);
  }

  function checkRepPassword(repPassword: string, currentPassword: string) {
    if (repPassword && repPassword !== currentPassword) {
      setPasswordRepDialogue("Passwords must match");
      return;
    }

    setPasswordRepDialogue("");
    return;
  }
  const isValidPassword = passwordRegex.test(password) && password.length >= 8;
  const passwordsMatch = password === repPassword;
  isValid = isValidUsername && isValidPassword && passwordsMatch;

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          onChange={(e) => checkUsernameDebounced(e.target.value)}
          onBlur={(e) => {
            checkUsernameDebounced.cancel();
            checkUsernameImmediate(e.target.value);
          }}
        />
        {usernameDialogue && (
          <p className="bg-base-surface shadow-glow-red/10 hover:shadow-glow-red/20 px-2 py-1 rounded-lg w-fit text-content-danger transition duration-300 hover:cursor-default">
            {usernameDialogue}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);
            checkPassword(value);
            if (repPassword) {
              checkRepPassword(repPassword, value);
            }
          }}
        />
        {passwordDialogue && (
          <p className="bg-base-surface shadow-glow-red/10 hover:shadow-glow-red/20 px-2 py-1 rounded-lg w-fit text-content-danger transition duration-300 hover:cursor-default">
            {passwordDialogue}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password-rep">Repeat Password</label>
        <input
          type="password"
          name="password-rep"
          id="password-rep"
          required
          onChange={(e) => {
            const value = e.target.value;
            setRepPassword(value);
            checkRepPassword(value, password);
          }}
        />
        {passwordRepDialogue && (
          <p className="bg-base-surface shadow-glow-red/10 hover:shadow-glow-red/20 px-2 py-1 rounded-lg w-fit text-content-danger transition duration-300 hover:cursor-default">
            {passwordRepDialogue}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={!isValid || isPending}
        className="bg-base-input hover:bg-base-hover disabled:hover:bg-base-input disabled:cursor-not-allowed"
      >
        Sign Up
      </button>
      {state.error && (
        <p className="bg-base-surface shadow-glow-red/10 px-2 py-1 rounded-lg w-fit text-content-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
