"use client";

import { useState } from "react";
import { signUp, checkUsernameExists } from "@/app/lib/actions";

const regex = /^[a-zA-Z0-9_]$/i;

export default function SignUpForm() {
  const [usernameDialogue, setUsernameDialogue] = useState("");
  const [isValidUsername, setValidUsername] = useState(false);
  const [passwordDialogue, setPasswordDialogue] = useState("");
  const [isValidPassword, setValidPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordRepDialogue, setPasswordRepDialogue] = useState("");
  const [repPassword, setRepPassword] = useState("");

  async function checkUsername(username: string) {
    if (username == "") {
      setUsernameDialogue("Please enter a username.");
      setValidUsername(false);
      return;
    }

    if (await checkUsernameExists(username)) {
      setUsernameDialogue("Username is taken, please try another.");
      setValidUsername(false);
      return;
    }

    if (regex.test(username)) {
      setUsernameDialogue(
        "Invalid username format; username cannot contain symbols.",
      );
      setValidUsername(false);
      return;
    }
    if (username.length < 3) {
      setUsernameDialogue("Username must be longer than 3 characters.");
      setValidUsername(false);
      return;
    }

    setUsernameDialogue("");
    setValidUsername(true);
    return;
  }
  function checkPassword(password: string) {
    setPasswordDialogue("");
    setPassword(password);
    setValidPassword(true);
    return;
  }
  function checkRepPassword(repPassword: string) {
    if (repPassword !== password) {
      setPasswordRepDialogue("Passwords must match");
      setRepPassword(repPassword);
      return;
    }
    setPasswordRepDialogue("");
    setRepPassword(repPassword);
    return;
  }

  const isValid =
    isValidUsername && isValidPassword && password === repPassword;

  return (
    <form action={signUp}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          onChange={(e) => checkUsername(e.target.value)}
          onFocus={(e) => checkUsername(e.target.value)}
        />
        <p className="bg-base-surface shadow-glow-red/10 hover:shadow-glow-red/20 px-2 py-1 rounded-lg w-fit text-content-danger transition duration-300 hover:cursor-default">
          {usernameDialogue}
        </p>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          onChange={(e) => checkPassword(e.target.value)}
        />
        <p className="bg-base-surface shadow-glow-red/10 hover:shadow-glow-red/20 px-2 py-1 rounded-lg w-fit text-content-danger transition duration-300 hover:cursor-default">
          {passwordDialogue}
        </p>
      </div>
      <div>
        <label htmlFor="password-rep">Repeat Password</label>
        <input
          type="password"
          name="password-rep"
          id="password-rep"
          required
          onChange={(e) => checkRepPassword(e.target.value)}
        />
        <p className="bg-base-surface shadow-glow-red/10 hover:shadow-glow-red/20 px-2 py-1 rounded-lg w-fit text-content-danger transition duration-300 hover:cursor-default">
          {passwordRepDialogue}
        </p>
      </div>
      <button
        type="submit"
        disabled={!isValid}
        className="bg-base-input hover:bg-base-hover disabled:hover:bg-base-input disabled:cursor-not-allowed"
      >
        Sign Up
      </button>
    </form>
  );
}
