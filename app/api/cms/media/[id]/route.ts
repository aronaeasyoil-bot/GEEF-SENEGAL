import { getCmsMedia } from "../../../../../lib/cms-store";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pathname = Buffer.from(id, "base64url").toString("utf8");
    const media = await getCmsMedia(pathname);
    if (!media) return new Response("Introuvable", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
    return new Response(media.body, {
      headers: {
        "Content-Type": media.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex",
        ...(media.etag ? { ETag: media.etag } : {}),
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
}
