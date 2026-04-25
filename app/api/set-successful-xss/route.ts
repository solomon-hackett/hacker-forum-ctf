import { setSuccessfulXXS } from "@/app/lib/actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const idParam = searchParams.get("id");
  const id = idParam && !isNaN(Number(idParam)) ? Number(idParam) : 1;
  const success = await setSuccessfulXXS(id);
  if (success) {
    return Response.json({ success: true });
  } else {
    return Response.json({ success: false });
  }
}
