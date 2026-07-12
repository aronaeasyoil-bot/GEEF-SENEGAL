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
  assert.match(home, /Madame Seynabou LY MBACKE/i);
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
