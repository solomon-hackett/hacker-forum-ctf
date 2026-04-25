import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const isLoggedIn = !!user;

      const protectedRoutes =
        nextUrl.pathname.startsWith("/account") ||
        nextUrl.pathname.startsWith("/posts/create") ||
        nextUrl.pathname.startsWith("/api/set-allowed") ||
        nextUrl.pathname.startsWith("/in-review");

      const REQUIRED_UUID = process.env.SYSTEM_UUID;

      if (
        nextUrl.pathname.startsWith("/api/set-allowed") ||
        nextUrl.pathname.startsWith("/in-review")
      ) {
        if (!isLoggedIn) {
          return false;
        }

        if (user?.id !== REQUIRED_UUID) {
          return new Response("Forbidden", { status: 403 });
        }

        return true;
      }

      if (protectedRoutes) {
        return isLoggedIn;
      }

      if (isLoggedIn && nextUrl.pathname === "/auth/login") {
        return Response.redirect(new URL("/account", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
