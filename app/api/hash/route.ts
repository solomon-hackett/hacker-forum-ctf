import bcrypt from "bcrypt";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("p");

  if (!password) {
    return Response.json(
      { error: "Missing required search param: p" },
      { status: 400 },
    );
  }

  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);

  return Response.json({ hash });
}
