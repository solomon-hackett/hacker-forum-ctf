// app/api/hash/route.js  (App Router)
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("p");

  if (!password) {
    return NextResponse.json(
      { error: "Missing required query parameter: p" },
      { status: 400 },
    );
  }

  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);

  return NextResponse.json({ hash });
}
