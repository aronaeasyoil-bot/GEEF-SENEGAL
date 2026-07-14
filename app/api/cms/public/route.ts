import { getMergedCmsFields } from "../../../../lib/cms-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const path = new URL(request.url).searchParams.get("path") ?? "/";
    const fields = await getMergedCmsFields(path, "published");
    return Response.json({ fields }, { headers: { "Cache-Control": "public, max-age=0, must-revalidate", "X-Robots-Tag": "noindex" } });
  } catch {
    return Response.json({ fields: {} }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  }
}
