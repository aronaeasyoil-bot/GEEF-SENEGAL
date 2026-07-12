import { get, list, put } from "@vercel/blob";

type StoredAttachment = {
  pathname: string;
  originalName: string;
  contentType: string;
  size: number;
  status: "pending_scan";
};

type StoredRecord = Record<string, unknown> & {
  id: string;
  kind: string;
  createdAt: string;
  attachments: StoredAttachment[];
};

declare global {
  var __geefLocalRecords: Map<string, StoredRecord> | undefined;
}

function localRecords() {
  globalThis.__geefLocalRecords ??= new Map<string, StoredRecord>();
  return globalThis.__geefLocalRecords;
}

export function privateStoreConfigured() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

function safeExtension(filename: string) {
  const match = filename.toLowerCase().match(/\.[a-z0-9]{1,8}$/);
  return match?.[0] ?? ".bin";
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function savePrivateRecord(
  kind: "contact" | "project" | "newsletter",
  id: string,
  payload: Record<string, unknown>,
  files: File[] = [],
  allowOverwrite = false,
) {
  const attachments: StoredAttachment[] = [];
  if (privateStoreConfigured()) {
    for (const file of files) {
      const attachmentId = crypto.randomUUID();
      const pathname = `uploads/${kind}/${id}/${attachmentId}${safeExtension(file.name)}`;
      await put(pathname, file, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: file.type || "application/octet-stream",
        cacheControlMaxAge: 60,
      });
      attachments.push({ pathname, originalName: file.name, contentType: file.type || "application/octet-stream", size: file.size, status: "pending_scan" });
    }
  }

  const record: StoredRecord = { id, kind, ...payload, attachments, createdAt: new Date().toISOString() };
  if (privateStoreConfigured()) {
    await put(`records/${kind}/${id}.json`, JSON.stringify(record), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite,
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60,
    });
    return { durable: true };
  }

  localRecords().set(`${kind}:${id}`, record);
  return { durable: false };
}

async function countPrefix(prefix: string) {
  let cursor: string | undefined;
  let total = 0;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    total += page.blobs.length;
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return total;
}

export async function getRecordCounts() {
  if (privateStoreConfigured()) {
    const [contacts, projects, subscribers] = await Promise.all([
      countPrefix("records/contact/"),
      countPrefix("records/project/"),
      countPrefix("records/newsletter/"),
    ]);
    return { contacts, projects, subscribers, connected: true };
  }
  const keys = Array.from(localRecords().keys());
  return {
    contacts: keys.filter((key) => key.startsWith("contact:")).length,
    projects: keys.filter((key) => key.startsWith("project:")).length,
    subscribers: keys.filter((key) => key.startsWith("newsletter:")).length,
    connected: false,
  };
}

export async function getPrivateFile(pathname: string) {
  if (!privateStoreConfigured()) return null;
  return get(pathname, { access: "private", useCache: false });
}
