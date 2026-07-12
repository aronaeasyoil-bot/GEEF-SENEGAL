import { savePrivateRecord } from "../../../lib/private-store";

const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]);
function text(data: FormData, key: string) { return String(data.get(key) ?? "").trim(); }
function sameOrigin(request: Request) { const origin = request.headers.get("origin"); return !origin || new URL(origin).host === new URL(request.url).host; }
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origine non autorisée" }, { status: 403 });
  const data = await request.formData();
  if (text(data, "website")) return Response.json({ ok: true, receipt: "REÇU" });
  const required = ["fullName", "organization", "role", "country", "email", "phone", "projectTitle", "sector", "location", "maturity", "description", "expectedOutcome"];
  if (required.some((key) => !text(data, key)) || !text(data, "email").includes("@") || data.get("consent") !== "yes" || data.get("financialDisclaimer") !== "yes") return Response.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  const files = data.getAll("documents").filter((item): item is File => item instanceof File && item.size > 0);
  if (files.some((file) => file.size > maxFileSize || !allowedTypes.has(file.type))) return Response.json({ error: "Un document dépasse 10 Mo ou utilise un format non autorisé" }, { status: 400 });
  const id = crypto.randomUUID();
  const receipt = `GEEF-P-${Date.now().toString(36).toUpperCase()}-${id.slice(0, 6).toUpperCase()}`;
  try {
    await savePrivateRecord("project", id, { receipt, fullName: text(data, "fullName"), organization: text(data, "organization"), role: text(data, "role"), country: text(data, "country"), email: text(data, "email"), phone: text(data, "phone"), projectTitle: text(data, "projectTitle"), sector: text(data, "sector"), location: text(data, "location"), maturity: text(data, "maturity"), description: text(data, "description"), needs: data.getAll("needs").map(String), expectedOutcome: text(data, "expectedOutcome"), estimatedAmount: text(data, "estimatedAmount"), mobilizedAmount: text(data, "mobilizedAmount"), requestedAmount: text(data, "requestedAmount"), financingType: text(data, "financingType"), timeframe: text(data, "timeframe"), consent: true, status: "submitted" }, files);
    return Response.json({ receipt }, { status: 201 });
  } catch { return Response.json({ error: "Le projet n’a pas pu être enregistré" }, { status: 503 }); }
}
