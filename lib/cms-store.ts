import { get, put } from "@vercel/blob";
import type { CmsFieldValue, CmsPageRecord } from "./cms-types";

type CloudflareRuntime = {
  DB?: {
    prepare(query: string): {
      bind(...values: unknown[]): {
        first<T>(): Promise<T | null>;
        run(): Promise<unknown>;
      };
    };
  };
  FILES?: {
    put(key: string, value: ReadableStream | ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
    get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string }; etag?: string } | null>;
  };
};

type StoredMedia = { body: BodyInit; contentType: string; etag?: string };

declare global {
  var __geefCmsPages: Map<string, CmsPageRecord> | undefined;
  var __geefCmsMedia: Map<string, { bytes: ArrayBuffer; contentType: string }> | undefined;
}

const GLOBAL_PATH = "/__global__";

function localPages() {
  globalThis.__geefCmsPages ??= new Map<string, CmsPageRecord>();
  return globalThis.__geefCmsPages;
}

function localMedia() {
  globalThis.__geefCmsMedia ??= new Map<string, { bytes: ArrayBuffer; contentType: string }>();
  return globalThis.__geefCmsMedia;
}

function emptyPage(path: string): CmsPageRecord {
  return { path, draft: {}, published: {}, updatedAt: new Date().toISOString(), publishedAt: null };
}

function normalizePath(path: string) {
  const clean = path.trim().split("?")[0].replace(/\/{2,}/g, "/");
  if (clean === GLOBAL_PATH) return GLOBAL_PATH;
  if (!clean.startsWith("/") || clean.includes("..") || clean.length > 180) throw new Error("Chemin CMS non autorisé");
  return clean === "/" ? "/" : clean.replace(/\/$/, "");
}

function blobConfigured() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

async function cloudflareRuntime(): Promise<CloudflareRuntime | null> {
  if (blobConfigured()) return null;
  try {
    const workerRuntime = await import("cloudflare:workers");
    return workerRuntime.env as unknown as CloudflareRuntime;
  } catch {
    return null;
  }
}

function blobPageKey(path: string) {
  return `cms/pages/${Buffer.from(path).toString("base64url")}.json`;
}

async function readBlobPage(path: string) {
  try {
    const result = await get(blobPageKey(path), { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return await new Response(result.stream).json() as CmsPageRecord;
  } catch {
    return null;
  }
}

async function writeBlobPage(record: CmsPageRecord) {
  await put(blobPageKey(record.path), JSON.stringify(record), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
}

async function readD1Page(runtime: CloudflareRuntime, path: string) {
  if (!runtime.DB) return null;
  const row = await runtime.DB.prepare(
    "SELECT path, draft_json, published_json, updated_at, published_at FROM cms_pages WHERE path = ?",
  ).bind(path).first<{ path: string; draft_json: string; published_json: string; updated_at: string; published_at: string | null }>();
  if (!row) return null;
  return {
    path: row.path,
    draft: JSON.parse(row.draft_json || "{}"),
    published: JSON.parse(row.published_json || "{}"),
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  } satisfies CmsPageRecord;
}

async function writeD1Page(runtime: CloudflareRuntime, record: CmsPageRecord) {
  if (!runtime.DB) throw new Error("Stockage D1 indisponible");
  await runtime.DB.prepare(
    `INSERT INTO cms_pages (path, draft_json, published_json, updated_at, published_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(path) DO UPDATE SET draft_json = excluded.draft_json, published_json = excluded.published_json,
       updated_at = excluded.updated_at, published_at = excluded.published_at`,
  ).bind(record.path, JSON.stringify(record.draft), JSON.stringify(record.published), record.updatedAt, record.publishedAt).run();
}

export async function getCmsPage(rawPath: string): Promise<CmsPageRecord> {
  const path = normalizePath(rawPath);
  if (blobConfigured()) return await readBlobPage(path) ?? emptyPage(path);
  const runtime = await cloudflareRuntime();
  if (runtime?.DB) return await readD1Page(runtime, path) ?? emptyPage(path);
  return localPages().get(path) ?? emptyPage(path);
}

async function writeCmsPage(record: CmsPageRecord) {
  if (blobConfigured()) return writeBlobPage(record);
  const runtime = await cloudflareRuntime();
  if (runtime?.DB) return writeD1Page(runtime, record);
  localPages().set(record.path, record);
}

export async function saveCmsField(rawPath: string, key: string, field: CmsFieldValue) {
  const path = normalizePath(rawPath);
  if (!/^[a-z0-9._-]{3,160}$/i.test(key)) throw new Error("Clé CMS non autorisée");
  if (!field || !["text", "image"].includes(field.type) || typeof field.value !== "string") throw new Error("Valeur CMS invalide");
  if (field.value.length > 20_000 || (field.alt?.length ?? 0) > 500) throw new Error("Contenu trop long");
  const record = await getCmsPage(path);
  record.draft[key] = { type: field.type, value: field.value.trim(), ...(field.type === "image" ? { alt: field.alt?.trim() ?? "" } : {}) };
  record.updatedAt = new Date().toISOString();
  await writeCmsPage(record);
  return record;
}

export async function deleteCmsField(rawPath: string, key: string) {
  const path = normalizePath(rawPath);
  const record = await getCmsPage(path);
  delete record.draft[key];
  record.updatedAt = new Date().toISOString();
  await writeCmsPage(record);
  return record;
}

export async function publishCmsPaths(rawPaths: string[]) {
  const records: CmsPageRecord[] = [];
  for (const rawPath of [...new Set(rawPaths)]) {
    const path = normalizePath(rawPath);
    const record = await getCmsPage(path);
    record.published = structuredClone(record.draft);
    record.publishedAt = new Date().toISOString();
    record.updatedAt = record.publishedAt;
    await writeCmsPage(record);
    records.push(record);
  }
  return records;
}

export async function getMergedCmsFields(rawPath: string, mode: "draft" | "published") {
  const path = normalizePath(rawPath);
  const [globalRecord, pageRecord] = await Promise.all([getCmsPage(GLOBAL_PATH), getCmsPage(path)]);
  return { ...globalRecord[mode], ...pageRecord[mode] };
}

function safeImageExtension(file: File) {
  const extensions: Record<string, string> = {
    "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif", "image/gif": ".gif",
  };
  return extensions[file.type] ?? "";
}

export async function saveCmsMedia(file: File) {
  const extension = safeImageExtension(file);
  if (!extension) throw new Error("Format d’image non autorisé");
  if (file.size < 1 || file.size > 8 * 1024 * 1024) throw new Error("L’image doit peser moins de 8 Mo");
  const pathname = `cms/media/${crypto.randomUUID()}${extension}`;
  if (blobConfigured()) {
    await put(pathname, file, { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: file.type, cacheControlMaxAge: 31536000 });
  } else {
    const runtime = await cloudflareRuntime();
    if (runtime?.FILES) await runtime.FILES.put(pathname, file.stream(), { httpMetadata: { contentType: file.type } });
    else localMedia().set(pathname, { bytes: await file.arrayBuffer(), contentType: file.type });
  }
  return { pathname, id: Buffer.from(pathname).toString("base64url"), contentType: file.type, size: file.size };
}

export async function getCmsMedia(pathname: string): Promise<StoredMedia | null> {
  if (!pathname.startsWith("cms/media/") || pathname.includes("..")) return null;
  if (blobConfigured()) {
    const result = await get(pathname, { access: "private", useCache: true });
    if (!result || result.statusCode !== 200) return null;
    return { body: result.stream, contentType: result.blob.contentType || "application/octet-stream", etag: result.blob.etag };
  }
  const runtime = await cloudflareRuntime();
  if (runtime?.FILES) {
    const object = await runtime.FILES.get(pathname);
    if (!object) return null;
    return { body: object.body, contentType: object.httpMetadata?.contentType ?? "application/octet-stream", etag: object.etag };
  }
  const local = localMedia().get(pathname);
  return local ? { body: local.bytes, contentType: local.contentType } : null;
}

export const cmsGlobalPath = GLOBAL_PATH;
