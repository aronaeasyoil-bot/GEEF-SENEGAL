import { verifyAdminSession } from "../../../../../lib/admin-auth";
import { getPrivateFile } from "../../../../../lib/private-store";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifyAdminSession()) return Response.json({ error: "Non autorisé" }, { status: 403 });
  const { id } = await params;
  try {
    const pathname = Buffer.from(id, "base64url").toString("utf8");
    if (!pathname.startsWith("uploads/")) return Response.json({ error: "Chemin non autorisé" }, { status: 400 });
    const result = await getPrivateFile(pathname);
    if (!result || result.statusCode !== 200) return Response.json({ error: "Document introuvable" }, { status: 404 });
    return new Response(result.stream, { headers: { "Content-Type": result.blob.contentType, "Content-Disposition": "attachment", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return Response.json({ error: "Service indisponible" }, { status: 503 }); }
}
