import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Page() {
  return (
    <main>
      <form action="" className="bg-base-surface">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
        <button type="submit">
          <p>Login</p>
          <ArrowRightIcon />
        </button>
      </form>
    </main>
  );
}
