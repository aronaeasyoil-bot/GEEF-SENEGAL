import { verifyAdminSession } from "../../../../lib/admin-auth";
import { deleteCmsField, getMergedCmsFields, saveCmsField } from "../../../../lib/cms-store";
import type { CmsFieldValue } from "../../../../lib/cms-types";

export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  try { return !origin || new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

async function authorized() {
  return await verifyAdminSession();
}

export async function GET(request: Request) {
  if (!await authorized()) return Response.json({ error: "Introuvable" }, { status: 404 });
  try {
    const path = new URL(request.url).searchParams.get("path") ?? "/";
    return Response.json({ fields: await getMergedCmsFields(path, "draft") }, { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });
  } catch {
    return Response.json({ error: "Lecture impossible" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request) || !await authorized()) return Response.json({ error: "Introuvable" }, { status: 404 });
  try {
    const body = await request.json() as { path?: string; key?: string; field?: CmsFieldValue };
    if (!body.path || !body.key || !body.field) return Response.json({ error: "Données incomplètes" }, { status: 400 });
    const record = await saveCmsField(body.path, body.key, body.field);
    return Response.json({ saved: true, updatedAt: record.updatedAt }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Enregistrement impossible" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request) || !await authorized()) return Response.json({ error: "Introuvable" }, { status: 404 });
  try {
    const body = await request.json() as { path?: string; key?: string };
    if (!body.path || !body.key) return Response.json({ error: "Données incomplètes" }, { status: 400 });
    await deleteCmsField(body.path, body.key);
    return Response.json({ deleted: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Suppression impossible" }, { status: 400 });
  }
}
