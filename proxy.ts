import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((req) => {
  const res = NextResponse.next();

  const cookie = req.cookies.get("paywall_unlocked");

  if (!cookie) {
    res.cookies.set("paywall_unlocked", "false", {
      path: "/upcoming",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  const isLoggedIn = !!req.auth?.user;

  const isProtected =
    req.nextUrl.pathname.startsWith("/account") ||
    req.nextUrl.pathname.startsWith("/posts/create") ||
    req.nextUrl.pathname.startsWith("/in-review");

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
