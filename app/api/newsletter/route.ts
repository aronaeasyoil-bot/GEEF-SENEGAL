import { savePrivateRecord, sha256Hex } from "../../../lib/private-store";

function sameOrigin(request: Request) { const origin = request.headers.get("origin"); return !origin || new URL(origin).host === new URL(request.url).host; }
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origine non autorisée" }, { status: 403 });
  const data = await request.formData();
  if (String(data.get("website") ?? "")) return Response.json({ ok: true });
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  const consent = data.get("consent") === "yes" || data.get("consent") === "on";
  if (!email || !email.includes("@") || !consent) return Response.json({ error: "E-mail et consentement requis" }, { status: 400 });
  try {
    const id = (await sha256Hex(email)).slice(0, 32);
    await savePrivateRecord("newsletter", id, { firstName: String(data.get("firstName") ?? "").trim(), lastName: String(data.get("lastName") ?? "").trim(), email, sector: String(data.get("sector") ?? "").trim(), consent: true, status: "pending_confirmation" }, [], true);
    return Response.json({ ok: true }, { status: 201 });
  } catch { return Response.json({ error: "Service momentanément indisponible" }, { status: 503 }); }
}
