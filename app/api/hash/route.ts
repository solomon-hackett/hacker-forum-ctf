import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get("p");

  if (!password) {
    return NextResponse.json(
      { error: "Missing 'p' query parameter" },
      { status: 400 },
    );
  }

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    return NextResponse.json({ hash });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to hash password: ${err}` },
      { status: 500 },
    );
  }
}
