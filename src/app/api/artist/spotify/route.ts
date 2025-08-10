import { NextRequest } from "next/server";
import { searchArtistByName } from "@/lib/spotify";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return Response.json({ error: "name is required" }, { status: 400 });
  try {
    const artist = await searchArtistByName(name);
    return Response.json(artist ?? {});
  } catch (err: any) {
    return Response.json({ error: String(err?.message || err) }, { status: 500 });
  }
}


