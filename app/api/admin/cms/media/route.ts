import { verifyAdminSession } from "../../../../../lib/admin-auth";
import { saveCmsMedia } from "../../../../../lib/cms-store";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  try { return !origin || new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

export async function POST(request: Request) {
  if (!sameOrigin(request) || !await verifyAdminSession()) return Response.json({ error: "Introuvable" }, { status: 404 });
  try {
    const data = await request.formData();
    const file = data.get("image");
    if (!(file instanceof File)) return Response.json({ error: "Image manquante" }, { status: 400 });
    const media = await saveCmsMedia(file);
    return Response.json({ url: `/api/cms/media/${media.id}`, contentType: media.contentType, size: media.size }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Téléversement impossible" }, { status: 400 });
  }
}
