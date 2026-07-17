"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  defaultFinancialPartners,
  financialPartnersCmsKey,
  financialPartnersCmsPath,
  parseFinancialPartners,
  type FinancialPartner,
} from "../../lib/financial-partners";

type Status = { tone: "idle" | "working" | "success" | "error"; message: string };

export function AdminFinancialPartners() {
  const [partners, setPartners] = useState<FinancialPartner[]>(defaultFinancialPartners);
  const [status, setStatus] = useState<Status>({ tone: "idle", message: "Modifiez les fiches, puis enregistrez et publiez." });

  useEffect(() => {
    fetch(`/api/admin/cms?path=${encodeURIComponent(financialPartnersCmsPath)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        const value = result?.fields?.[financialPartnersCmsKey]?.value;
        if (value) setPartners(parseFinancialPartners(value));
      })
      .catch(() => setStatus({ tone: "error", message: "Chargement des partenaires impossible." }));
  }, []);

  function update(index: number, field: keyof FinancialPartner, value: string) {
    setPartners((current) => current.map((partner, itemIndex) => itemIndex === index ? { ...partner, [field]: value } : partner));
  }

  function addPartner() {
    setPartners((current) => [...current, {
      id: crypto.randomUUID(),
      name: "",
      role: "Partenaire financier",
      country: "Émirats arabes unis",
      description: "",
      image: "",
      alt: "",
    }]);
  }

  function removePartner(index: number) {
    setPartners((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function uploadImage(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus({ tone: "working", message: "Téléversement de la photo…" });
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/api/admin/cms/media", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Téléversement impossible");
      update(index, "image", result.url);
      if (!partners[index].alt) update(index, "alt", partners[index].name ? `Portrait de ${partners[index].name}.` : file.name.replace(/\.[^.]+$/, ""));
      setStatus({ tone: "success", message: "Photo ajoutée. Enregistrez le brouillon pour la conserver." });
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Téléversement impossible" });
    } finally {
      event.target.value = "";
    }
  }

  async function save(publish = false) {
    setStatus({ tone: "working", message: publish ? "Enregistrement et publication…" : "Enregistrement du brouillon…" });
    try {
      const response = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: financialPartnersCmsPath,
          key: financialPartnersCmsKey,
          field: { type: "text", value: JSON.stringify(partners) },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Enregistrement impossible");
      if (publish) {
        const publishResponse = await fetch("/api/admin/cms/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paths: [financialPartnersCmsPath] }),
        });
        const publishResult = await publishResponse.json();
        if (!publishResponse.ok) throw new Error(publishResult.error || "Publication impossible");
      }
      setStatus({ tone: "success", message: publish ? "Partenaires publiés sur le site." : "Brouillon enregistré. Il reste invisible aux visiteurs." });
    } catch (error) {
      setStatus({ tone: "error", message: error instanceof Error ? error.message : "Enregistrement impossible" });
    }
  }

  return (
    <section id="partenaires-financiers" className="admin-partners-manager">
      <div className="admin-partners-head">
        <div><span className="eyebrow">Collection administrable</span><h2>Partenaires financiers</h2><p>Ajoutez, modifiez, réordonnez ou supprimez les fiches affichées sur la page d’accueil.</p></div>
        <button type="button" className="button button-outline" onClick={addPartner}>Ajouter un partenaire</button>
      </div>
      <div className={`admin-cms-status is-${status.tone}`} role="status" aria-live="polite">{status.message}</div>
      <div className="admin-partners-list">
        {partners.map((partner, index) => (
          <article className="admin-partner-card" key={partner.id}>
            <div className="admin-partner-photo">
              {partner.image ? <img src={partner.image} alt={partner.alt || partner.name} /> : <span>Photo à ajouter</span>}
              <label><span>Choisir une photo</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => uploadImage(index, event)} /></label>
            </div>
            <div className="admin-partner-fields">
              <label><span>Nom complet</span><input value={partner.name} onChange={(event) => update(index, "name", event.target.value)} /></label>
              <div>
                <label><span>Fonction</span><input value={partner.role} onChange={(event) => update(index, "role", event.target.value)} /></label>
                <label><span>Pays</span><input value={partner.country} onChange={(event) => update(index, "country", event.target.value)} /></label>
              </div>
              <label><span>Description</span><textarea rows={3} value={partner.description} onChange={(event) => update(index, "description", event.target.value)} /></label>
              <label><span>Texte alternatif de la photo</span><input value={partner.alt} onChange={(event) => update(index, "alt", event.target.value)} /></label>
            </div>
            <div className="admin-partner-order">
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <button type="button" onClick={() => setPartners((current) => index ? current.map((item, i) => i === index - 1 ? current[index] : i === index ? current[index - 1] : item) : current)} disabled={index === 0} aria-label={`Monter ${partner.name || "ce partenaire"}`}>↑</button>
              <button type="button" onClick={() => setPartners((current) => index < current.length - 1 ? current.map((item, i) => i === index ? current[index + 1] : i === index + 1 ? current[index] : item) : current)} disabled={index === partners.length - 1} aria-label={`Descendre ${partner.name || "ce partenaire"}`}>↓</button>
              <button type="button" className="is-danger" onClick={() => removePartner(index)}>Supprimer</button>
            </div>
          </article>
        ))}
      </div>
      <div className="admin-partners-actions">
        <button type="button" className="button button-outline" onClick={() => save(false)} disabled={status.tone === "working"}>Enregistrer le brouillon</button>
        <button type="button" className="button button-project" onClick={() => save(true)} disabled={status.tone === "working"}>Enregistrer et publier</button>
      </div>
      <small>Les fiches sans nom ou sans photo ne sont jamais affichées sur le site public.</small>
    </section>
  );
}
