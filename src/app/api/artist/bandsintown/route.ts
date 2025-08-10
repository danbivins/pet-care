import { NextRequest } from "next/server";
import { createApiClients } from "@/lib/api/clients";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return Response.json({ error: "name is required" }, { status: 400 });
  try {
    const { bandsintown } = createApiClients();
    const { data } = await bandsintown.get(`/artists/${encodeURIComponent(name)}`);
    return Response.json({ url: data?.url, facebook_page_url: data?.facebook_page_url });
  } catch (err: any) {
    return Response.json({ error: String(err?.message || err) }, { status: 500 });
  }
}


