import { savePrivateRecord } from "../../../lib/private-store";

const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);
function sameOrigin(request: Request) { const origin = request.headers.get("origin"); return !origin || new URL(origin).host === new URL(request.url).host; }
function text(data: FormData, key: string) { return String(data.get(key) ?? "").trim(); }
function receipt(prefix: string) { return `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; }

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origine non autorisée" }, { status: 403 });
  const data = await request.formData();
  if (text(data, "website")) return Response.json({ ok: true, receipt: "REÇU" });
  const fullName = text(data, "fullName"), email = text(data, "email"), message = text(data, "message");
  const consent = data.get("consent") === "yes" || data.get("consent") === "on";
  if (!fullName || !email.includes("@") || !message || !consent) return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  const input = data.get("attachment");
  const files = input instanceof File && input.size > 0 ? [input] : [];
  if (files.some((file) => file.size > maxFileSize || !allowedTypes.has(file.type))) return Response.json({ error: "Format ou taille de fichier non autorisé" }, { status: 400 });
  const requestReceipt = receipt("GEEF-C");
  try {
    await savePrivateRecord("contact", requestReceipt, { receipt: requestReceipt, requestType: text(data, "requestType") || "Demande générale", fullName, organization: text(data, "organization"), role: text(data, "role"), email, phone: text(data, "phone"), country: text(data, "country"), sector: text(data, "sector"), budget: text(data, "budget"), timeframe: text(data, "timeframe"), message, consent: true, status: "new" }, files);
    return Response.json({ receipt: requestReceipt }, { status: 201 });
  } catch { return Response.json({ error: "La demande n’a pas pu être enregistrée" }, { status: 503 }); }
}
