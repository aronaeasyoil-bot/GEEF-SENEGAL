import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("replaces the starter with the GEEF-SENEGAL institutional site", async () => {
  const [page, layout, styles, data, home, shell] = await Promise.all([
    read("app/page.tsx"),
    read("app/layout.tsx"),
    read("app/globals.css"),
    read("lib/site-data.ts"),
    read("app/components/HomePage.tsx"),
    read("app/components/SiteShell.tsx"),
  ]);
  assert.match(page, /HomePage/);
  assert.match(layout, /GEEF-SENEGAL/);
  assert.match(layout, /ProfessionalService/);
  assert.match(styles, /--navy-950:\s*#071c2c/i);
  assert.match(home, /Madame Seybanou LY MBACKE/i);
  assert.match(home, /Présentez votre projet/i);
  assert.match(styles, /\.hero-watermark/);
  assert.match(shell, /mobile-lang-switch/);
  assert.doesNotMatch(page + layout, /Your site is taking shape|codex-preview/);
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
});

test("includes the requested public routes, confidential submission flow and legal pages", async () => {
  const required = [
    "app/cabinet/page.tsx",
    "app/expertises/page.tsx",
    "app/secteurs/page.tsx",
    "app/realisations/page.tsx",
    "app/publications/page.tsx",
    "app/equipe/page.tsx",
    "app/formations/page.tsx",
    "app/carrieres/page.tsx",
    "app/contact/page.tsx",
    "app/soumettre-un-projet/page.tsx",
    "app/administration/page.tsx",
    "app/api/projects/route.ts",
    "app/api/admin/cms/route.ts",
    "app/api/admin/cms/publish/route.ts",
    "app/api/admin/cms/media/route.ts",
    "app/api/cms/public/route.ts",
    "app/api/cms/media/[id]/route.ts",
    "app/components/AdminCms.tsx",
    "app/components/CmsRuntime.tsx",
    "lib/cms-store.ts",
    "drizzle/0001_loving_angel.sql",
    "public/documents/guide-preparation-etude-faisabilite.pdf",
    "public/og.png",
  ];
  await Promise.all(required.map((path) => access(new URL(path, root))));
  const form = await read("app/components/PublicForms.tsx");
  assert.match(form, /Étape \{step \+ 1\} sur \{steps.length\}/);
  assert.match(form, /financialDisclaimer/);
  const storage = await read("lib/private-store.ts");
  assert.match(storage, /access:\s*"private"/);
  assert.match(storage, /pending_scan/);
  const cmsStorage = await read("lib/cms-store.ts");
  assert.match(cmsStorage, /cms_pages/);
  assert.match(cmsStorage, /cms\/media/);
  const cmsApi = await read("app/api/admin/cms/route.ts");
  assert.match(cmsApi, /verifyAdminSession/);
  const admin = await read("app/administration/page.tsx");
  assert.match(admin, /AdminCms/);
  assert.match(admin, /Brouillons invisibles au public/);
});

test("keeps deployment targets explicit and secrets outside source control", async () => {
  const [hosting, vercel, gitignore, envExample] = await Promise.all([
    read(".openai/hosting.json"),
    read("vercel.json"),
    read(".gitignore"),
    read(".env.example"),
  ]);
  const hostingConfig = JSON.parse(hosting);
  assert.equal(hostingConfig.d1, "DB");
  assert.equal(hostingConfig.r2, "FILES");
  assert.match(hostingConfig.project_id, /^appgprj_/);
  assert.equal(JSON.parse(vercel).buildCommand, "next build");
  assert.match(gitignore, /\.env\*/);
  assert.match(envExample, /GEEF_ADMIN_PASSWORD_HASH/);
  assert.doesNotMatch(envExample, /=[a-f0-9]{32,}/i);
});
