import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSession, verifyAdminPassword } from "../../../../lib/admin-auth";

function sameOrigin(request: Request) { const origin = request.headers.get("origin"); return !origin || new URL(origin).host === new URL(request.url).host; }
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origine non autorisée" }, { status: 403 });
  const data = await request.formData();
  const password = String(data.get("password") ?? "");
  if (!await verifyAdminPassword(password)) return NextResponse.redirect(new URL("/administration?erreur=identifiants", request.url), 303);
  const response = NextResponse.redirect(new URL("/administration", request.url), 303);
  response.cookies.set(adminSessionCookie.name, await createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: adminSessionCookie.maxAge });
  return response;
}
