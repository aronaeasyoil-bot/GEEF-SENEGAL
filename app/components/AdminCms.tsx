"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { expertises, sectors } from "../../lib/site-data";
import type { CmsEditableField, CmsFieldValue } from "../../lib/cms-types";

const basePages = [
  ["/", "Accueil"], ["/cabinet", "Le cabinet"], ["/expertises", "Expertises"], ["/secteurs", "Secteurs"],
  ["/realisations", "Réalisations"], ["/publications", "Publications"], ["/equipe", "Équipe"], ["/formations", "Formations"],
  ["/carrieres", "Carrières"], ["/contact", "Contact"], ["/soumettre-un-projet", "Soumettre un projet"], ["/brochure", "Brochure institutionnelle"],
  ["/mentions-legales", "Mentions légales"], ["/confidentialite", "Confidentialité"], ["/cookies", "Cookies"],
  ["/conditions-utilisation", "Conditions d’utilisation"], ["/en", "Accueil anglais"], ["/en/brochure", "Brochure anglaise"],
] as const;

const pages = [
  ...basePages.map(([path, label]) => ({ path, label })),
  ...expertises.map((item) => ({ path: `/expertises/${item.slug}`, label: `Expertise · ${item.shortTitle}` })),
  ...sectors.map((item) => ({ path: `/secteurs/${item.slug}`, label: `Secteur · ${item.shortTitle}` })),
];

type Status = { tone: "idle" | "working" | "success" | "error"; message: string };

export function AdminCms() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [route, setRoute] = useState("/");
  const [frameVersion, setFrameVersion] = useState(0);
  const [fields, setFields] = useState<CmsEditableField[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [draft, setDraft] = useState<CmsFieldValue>({ type: "text", value: "" });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>({ tone: "idle", message: "Sélectionnez un champ dans la liste." });

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== "geef:cms-fields" || event.data.path !== route) return;
      const incoming = Array.isArray(event.data.fields) ? event.data.fields as CmsEditableField[] : [];
      setFields(incoming);
      setStatus({ tone: "idle", message: `${incoming.length} champs modifiables détectés sur cette page.` });
      setActiveKey((current) => current && incoming.some((field) => field.key === current) ? current : "");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [route]);

  const active = fields.find((field) => field.key === activeKey);
  const grouped = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    const filtered = normalized ? fields.filter((field) => `${field.section} ${field.label} ${field.value}`.toLocaleLowerCase("fr").includes(normalized)) : fields;
    return filtered.reduce<Record<string, CmsEditableField[]>>((groups, field) => {
      (groups[field.section] ??= []).push(field);
      return groups;
    }, {});
  }, [fields, query]);

  function selectField(field: CmsEditableField) {
    setActiveKey(field.key);
    setDraft({ type: field.type, value: field.value, ...(field.type === "image" ? { alt: field.alt ?? "" } : {}) });
    setStatus({ tone: "idle", message: "Modifiez le champ puis enregistrez le brouillon." });
  }

  function changeRoute(nextRoute: string) {
    setFields([]);
    setActiveKey("");
    setStatus({ tone: "working", message: "Chargement de la page et de ses champs…" });
    setRoute(nextRoute);
  }

  function updatePreview(field: CmsFieldValue) {
    if (!active) return;
    iframeRef.current?.contentWindow?.postMessage({ type: "geef:cms-preview", key: active.key, field }, window.location.origin);
  }

  async function saveDraft(nextField = draft) {
    if (!active) return;
    setStatus({ tone: "working", message: "Enregistrement du brouillon…" });
    try {
      const response = await fetch("/api/admin/cms", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: active.path, key: active.key, field: nextField }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Enregistrement impossible");
      setFields((current) => current.map((field) => field.key === active.key ? { ...field, ...nextField } : field));
      setDraft(nextField);
      updatePreview(nextField);
      setStatus({ tone: "success", message: "Brouillon enregistré. Cliquez sur Publier pour le rendre visible." });
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Enregistrement impossible" });
    }
  }

  async function resetField() {
    if (!active) return;
    setStatus({ tone: "working", message: "Restauration du contenu d’origine…" });
    try {
      const response = await fetch("/api/admin/cms", {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: active.path, key: active.key }),
      });
      if (!response.ok) throw new Error("Restauration impossible");
      setFields([]);
      setActiveKey("");
      setFrameVersion((value) => value + 1);
      setStatus({ tone: "success", message: "Le brouillon personnalisé a été retiré." });
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Restauration impossible" });
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !active) return;
    setStatus({ tone: "working", message: "Téléversement de l’image…" });
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/api/admin/cms/media", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Téléversement impossible");
      const nextField: CmsFieldValue = { type: "image", value: result.url, alt: draft.alt || file.name.replace(/\.[^.]+$/, "") };
      await saveDraft(nextField);
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Téléversement impossible" });
    } finally {
      event.target.value = "";
    }
  }

  async function publish() {
    setStatus({ tone: "working", message: "Publication des modifications…" });
    try {
      const response = await fetch("/api/admin/cms/publish", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paths: [route, "/__global__"] }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Publication impossible");
      setStatus({ tone: "success", message: "Modifications publiées sur le site public." });
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Publication impossible" });
    }
  }

  return (
    <section id="editeur" className="admin-cms">
      <div className="admin-cms-toolbar">
        <div>
          <span className="eyebrow">Éditeur visuel</span>
          <h2>Gérez toutes les sections.</h2>
          <p>Choisissez une page, sélectionnez un texte ou une image, enregistrez puis publiez.</p>
        </div>
        <div className="admin-cms-actions">
          <label><span>Page à modifier</span><select value={route} onChange={(event) => changeRoute(event.target.value)}>{pages.map((page) => <option value={page.path} key={page.path}>{page.label}</option>)}</select></label>
          <button type="button" className="button button-project" onClick={publish} disabled={status.tone === "working"}>Publier la page</button>
        </div>
      </div>

      <div className={`admin-cms-status is-${status.tone}`} role="status" aria-live="polite">{status.message}</div>

      <div className="admin-cms-workspace">
        <aside className="admin-cms-fields">
          <label className="admin-cms-search"><span>Rechercher un champ</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titre, section, texte…" /></label>
          <div className="admin-cms-field-list">
            {Object.entries(grouped).map(([section, sectionFields]) => (
              <details open key={section}>
                <summary><span>{section}</span><small>{sectionFields.length}</small></summary>
                {sectionFields.map((field) => (
                  <button className={activeKey === field.key ? "is-active" : ""} type="button" key={field.key} onClick={() => selectField(field)}>
                    <span>{field.type === "image" ? "▣" : "T"}</span><div><strong>{field.type === "image" ? "Image" : "Texte"}</strong><small>{field.value.slice(0, 75) || "Champ vide"}</small></div>
                  </button>
                ))}
              </details>
            ))}
            {!fields.length && <p className="admin-cms-empty">Les champs apparaîtront après le chargement de l’aperçu.</p>}
          </div>
        </aside>

        <div className="admin-cms-preview">
          <div className="admin-preview-bar"><span>Aperçu sécurisé</span><a href={route} target="_blank" rel="noreferrer">Ouvrir la page ↗</a></div>
          <iframe ref={iframeRef} key={`${route}-${frameVersion}`} title={`Aperçu de ${pages.find((page) => page.path === route)?.label ?? route}`} src={`${route}${route.includes("?") ? "&" : "?"}cmsPreview=1`} />
        </div>

        <aside className="admin-cms-editor">
          {active ? (
            <>
              <div className="admin-editor-heading"><span>{active.section}</span><h3>{active.type === "image" ? "Modifier l’image" : "Modifier le texte"}</h3></div>
              {active.type === "text" ? (
                <label><span>Contenu</span><textarea rows={11} value={draft.value} onChange={(event) => { const next = { type: "text" as const, value: event.target.value }; setDraft(next); updatePreview(next); }} /></label>
              ) : (
                <>
                  <div className="admin-image-preview">{draft.value ? <img src={draft.value} alt={draft.alt ?? "Aperçu"} /> : <span>Aucune image</span>}</div>
                  <label className="admin-upload"><span>Remplacer l’image</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={uploadImage} /><small>JPG, PNG, WebP, AVIF ou GIF · 8 Mo maximum</small></label>
                  <label><span>Texte alternatif</span><textarea rows={3} value={draft.alt ?? ""} onChange={(event) => { const next = { type: "image" as const, value: draft.value, alt: event.target.value }; setDraft(next); updatePreview(next); }} /></label>
                </>
              )}
              <div className="admin-editor-actions"><button type="button" className="button button-primary" onClick={() => saveDraft()} disabled={status.tone === "working"}>Enregistrer le brouillon</button><button type="button" className="button button-outline" onClick={resetField}>Rétablir l’origine</button></div>
              <small className="admin-editor-note">Les visiteurs ne voient que la dernière version publiée. Vos brouillons restent privés.</small>
            </>
          ) : (
            <div className="admin-editor-placeholder"><span>✦</span><h3>Sélectionnez un champ</h3><p>Choisissez un texte ou une image dans la colonne de gauche pour commencer.</p></div>
          )}
        </aside>
      </div>
    </section>
  );
}
