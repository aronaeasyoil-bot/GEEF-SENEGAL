import { cookies } from "next/headers";

const COOKIE_NAME = "geef_admin_session";
const SESSION_SECONDS = 12 * 60 * 60;

function adminSecret() {
  return process.env.GEEF_ADMIN_SECRET ?? "";
}

function configuredPasswordHash() {
  return process.env.GEEF_ADMIN_PASSWORD_HASH ?? "";
}

async function hexDigest(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signature(value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(adminSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const result = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(result), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export function adminAuthConfigured() {
  return adminSecret().length >= 32 && configuredPasswordHash().length === 64;
}

export async function verifyAdminPassword(password: string) {
  if (!adminAuthConfigured()) return false;
  return constantTimeEqual(await hexDigest(password), configuredPasswordHash());
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${expiresAt}.${await signature(String(expiresAt))}`;
}

export async function verifyAdminSession() {
  if (!adminAuthConfigured()) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value ?? "";
  const [expiresRaw, receivedSignature] = token.split(".");
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !receivedSignature) return false;
  return constantTimeEqual(receivedSignature, await signature(expiresRaw));
}

export const adminSessionCookie = { name: COOKIE_NAME, maxAge: SESSION_SECONDS };
