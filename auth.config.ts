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
        nextUrl.pathname.startsWith("/api") ||
        nextUrl.pathname.startsWith("/in-review");

      const isAdminRoute =
        nextUrl.pathname.startsWith("/api") ||
        nextUrl.pathname.startsWith("/in-review");

      const REQUIRED_UUID = process.env.SYSTEM_UUID;

      if (isAdminRoute) {
        if (!isLoggedIn) return false;

        if (user?.id !== REQUIRED_UUID) {
          return new Response("Forbidden", { status: 403 });
        }

        return true;
      }

      if (isProtected) {
        return isLoggedIn;
      }

      if (isLoggedIn && nextUrl.pathname === "/auth/login") {
        return NextResponse.redirect(new URL("/account", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
