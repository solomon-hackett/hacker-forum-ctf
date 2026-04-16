import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const protectedRoutes =
        nextUrl.pathname.startsWith("/account") ||
        nextUrl.pathname.startsWith("/posts/create");

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
