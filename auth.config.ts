import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const isLoggedIn = !!user;

      const isProtected =
        nextUrl.pathname.startsWith("/account") ||
        nextUrl.pathname.startsWith("/posts/create") ||
        nextUrl.pathname.startsWith("/api/set-allowed") ||
        nextUrl.pathname.startsWith("/api/set-successful-xss") ||
        nextUrl.pathname.startsWith("/api/env") ||
        nextUrl.pathname.startsWith("/in-review");

      const isSystemRoute =
        nextUrl.pathname.startsWith("/api/set-allowed") ||
        nextUrl.pathname.startsWith("/api/set-successful-xss") ||
        nextUrl.pathname.startsWith("/in-review");

      const isAdminRoute =
        nextUrl.pathname.startsWith("/api/env") && !isSystemRoute;

      const REQUIRED_UUID = process.env.SYSTEM_UUID;

      if (isSystemRoute) {
        if (user?.id !== REQUIRED_UUID) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return true;
      }
      if (isAdminRoute) {
        if (user?.role !== "admin") {
          return NextResponse.json(
            { error: "You must be an admin to access this resource." },
            { status: 401 },
          );
        }
        return true;
      }

      if (isProtected) {
        return isLoggedIn;
      }

      if (isLoggedIn && nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/account", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
