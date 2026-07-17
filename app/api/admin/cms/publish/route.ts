import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "../../../../../lib/admin-auth";
import { publishCmsPaths } from "../../../../../lib/cms-store";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  try { return !origin || new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

export async function POST(request: Request) {
  if (!sameOrigin(request) || !await verifyAdminSession()) return Response.json({ error: "Introuvable" }, { status: 404 });
  try {
    const body = await request.json() as { paths?: string[] };
    if (!body.paths?.length || body.paths.length > 4) return Response.json({ error: "Pages invalides" }, { status: 400 });
    const records = await publishCmsPaths(body.paths);
    for (const path of body.paths) if (!path.startsWith("/__")) revalidatePath(path);
    if (body.paths.includes("/__financial-partners__")) revalidatePath("/");
    return Response.json({ published: true, records: records.map((record) => ({ path: record.path, publishedAt: record.publishedAt })) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Publication impossible" }, { status: 400 });
  }
}
