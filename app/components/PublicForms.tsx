"use client";

import { FormEvent, useRef, useState } from "react";
import { sectors } from "../../lib/site-data";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm({ defaultType = "Demande générale", compact = false }: { defaultType?: string; compact?: boolean }) {
  const [state, setState] = useState<FormState>("idle");
  const [receipt, setReceipt] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", body: new FormData(form) });
      const data = (await response.json()) as { receipt?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "request failed");
      setReceipt(data.receipt ?? "Demande reçue");
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="success-panel" role="status">
        <span aria-hidden="true">✓</span>
        <h3>Votre demande a bien été transmise.</h3>
        <p>Notre équipe reviendra vers vous après un premier examen. Référence : <strong>{receipt}</strong></p>
        <button type="button" className="button button-outline" onClick={() => setState("idle")}>Envoyer une autre demande</button>
      </div>
    );
  }

  return (
    <form className={`public-form ${compact ? "is-compact" : ""}`} onSubmit={submit}>
      <div className="form-grid two-columns">
        <label><span>Nom complet *</span><input name="fullName" autoComplete="name" required /></label>
        <label><span>Organisation</span><input name="organization" autoComplete="organization" /></label>
        <label><span>Fonction</span><input name="role" autoComplete="organization-title" /></label>
        <label><span>Adresse e-mail *</span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Téléphone</span><input name="phone" type="tel" autoComplete="tel" /></label>
        <label><span>Pays *</span><input name="country" autoComplete="country-name" defaultValue="Sénégal" required /></label>
        <label><span>Type de demande *</span><select name="requestType" defaultValue={defaultType} required><option>Demande générale</option><option>Prise de rendez-vous</option><option>Demande d’expertise</option><option>Inscription à une formation</option><option>Candidature</option><option>Partenariat</option></select></label>
        <label><span>Secteur</span><select name="sector" defaultValue=""><option value="">À préciser</option>{sectors.map((sector) => <option key={sector.slug} value={sector.slug}>{sector.title}</option>)}</select></label>
        {!compact && <><label><span>Budget indicatif <small>(facultatif)</small></span><input name="budget" placeholder="Ex. à définir" /></label><label><span>Délai souhaité</span><select name="timeframe" defaultValue=""><option value="">À préciser</option><option>Moins d’un mois</option><option>1 à 3 mois</option><option>3 à 6 mois</option><option>Plus de 6 mois</option></select></label></>}
      </div>
      <label className="full-field"><span>Votre message *</span><textarea name="message" rows={compact ? 4 : 6} placeholder="Contexte, besoin, décision attendue…" required /></label>
      {!compact && <label className="file-field"><span>Pièce jointe <small>PDF, DOCX, XLSX — 10 Mo maximum</small></span><input name="attachment" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" /><small>Les documents transmis ne sont jamais affichés publiquement. Ils sont réservés aux personnes autorisées.</small></label>}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
      <label className="consent-field form-consent"><input name="consent" type="checkbox" value="yes" required /><span>J’accepte le traitement de mes données pour répondre à cette demande et reconnais avoir pris connaissance de la politique de confidentialité. *</span></label>
      <div className="form-footer">
        <p>* Champs obligatoires. Ne transmettez pas d’information confidentielle avant accord sur les modalités de la mission.</p>
        <button type="submit" className="button button-primary" disabled={state === "sending"}>{state === "sending" ? "Transmission…" : "Envoyer ma demande"}</button>
      </div>
      {state === "error" && <p className="form-error" role="alert">La demande n’a pas pu être enregistrée. Vérifiez les champs ou contactez-nous par e-mail.</p>}
    </form>
  );
}

const steps = ["Porteur du projet", "Présentation", "Accompagnement", "Données financières", "Documents"];
const needs = ["Étude de faisabilité", "Business plan", "Modélisation financière", "Recherche de financement", "Structuration financière", "Partenariat public-privé", "Évaluation", "Conseil stratégique", "Autre besoin"];

export function ProjectForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>("idle");
  const [receipt, setReceipt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function validateCurrentStep() {
    const form = formRef.current;
    if (!form) return false;
    const current = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!current) return false;
    const controls = Array.from(current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"));
    for (const control of controls) {
      if (!control.checkValidity()) { control.reportValidity(); return false; }
    }
    return true;
  }

  function next() { if (validateCurrentStep()) setStep((value) => Math.min(value + 1, steps.length - 1)); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    const form = event.currentTarget;
    setState("sending");
    try {
      const response = await fetch("/api/projects", { method: "POST", body: new FormData(form) });
      const data = (await response.json()) as { receipt?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "request failed");
      setReceipt(data.receipt ?? "Projet reçu");
      setState("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { setState("error"); }
  }

  if (state === "sent") {
    return (
      <div className="project-success" role="status">
        <span className="success-orbit" aria-hidden="true">✓</span>
        <span className="eyebrow">Soumission reçue</span>
        <h2>Merci. Votre projet a été transmis de façon confidentielle.</h2>
        <p>Référence : <strong>{receipt}</strong>. Conservez-la pour vos échanges avec le cabinet. Un accusé de réception électronique sera envoyé lorsque le service de messagerie sera activé.</p>
        <div><a className="button button-outline" href="/">Retour à l’accueil</a><button className="button button-primary" type="button" onClick={() => { setState("idle"); setStep(0); }}>Soumettre un autre projet</button></div>
      </div>
    );
  }

  return (
    <form ref={formRef} className="project-wizard" onSubmit={submit} encType="multipart/form-data">
      <div className="wizard-progress">
        <div className="progress-summary"><span>Étape {step + 1} sur {steps.length}</span><strong>{steps[step]}</strong><span>{Math.round(((step + 1) / steps.length) * 100)}%</span></div>
        <div className="progress-track"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <ol>{steps.map((item, index) => <li className={index === step ? "active" : index < step ? "done" : ""} key={item}><button type="button" onClick={() => index < step && setStep(index)} disabled={index > step}><span>{index < step ? "✓" : index + 1}</span>{item}</button></li>)}</ol>
      </div>

      <div className="wizard-card" aria-live="polite">
        <fieldset data-step="0" hidden={step !== 0}>
          <legend><span>01</span><div><strong>Parlez-nous du porteur du projet</strong><small>Ces informations permettent d’identifier l’interlocuteur principal.</small></div></legend>
          <div className="form-grid two-columns">
            <label><span>Nom complet *</span><input name="fullName" autoComplete="name" required /></label>
            <label><span>Entreprise ou institution *</span><input name="organization" autoComplete="organization" required /></label>
            <label><span>Fonction *</span><input name="role" autoComplete="organization-title" required /></label>
            <label><span>Pays *</span><input name="country" defaultValue="Sénégal" autoComplete="country-name" required /></label>
            <label><span>Adresse e-mail *</span><input name="email" type="email" autoComplete="email" required /></label>
            <label><span>Téléphone *</span><input name="phone" type="tel" autoComplete="tel" required /></label>
          </div>
        </fieldset>

        <fieldset data-step="1" hidden={step !== 1}>
          <legend><span>02</span><div><strong>Présentez votre projet</strong><small>Restez synthétique. Une description de 5 à 10 lignes suffit à ce stade.</small></div></legend>
          <div className="form-grid two-columns">
            <label><span>Titre du projet *</span><input name="projectTitle" required /></label>
            <label><span>Secteur *</span><select name="sector" defaultValue="" required><option value="" disabled>Choisir un secteur</option>{sectors.map((sector) => <option key={sector.slug} value={sector.slug}>{sector.title}</option>)}<option value="autre">Autre secteur</option></select></label>
            <label><span>Localisation *</span><input name="location" placeholder="Ville, pays" required /></label>
            <label><span>Niveau d’avancement *</span><select name="maturity" defaultValue="" required><option value="" disabled>Choisir</option><option>Idée / opportunité</option><option>Pré-faisabilité</option><option>Étude existante</option><option>Financement recherché</option><option>Projet en réalisation</option><option>Projet à restructurer</option></select></label>
          </div>
          <label className="full-field"><span>Description du projet *</span><textarea name="description" rows={7} required placeholder="Objectif, bénéficiaires ou clients, principales composantes, contraintes identifiées…" /></label>
        </fieldset>

        <fieldset data-step="2" hidden={step !== 2}>
          <legend><span>03</span><div><strong>Précisez le besoin d’accompagnement</strong><small>Vous pouvez sélectionner plusieurs réponses.</small></div></legend>
          <div className="choice-grid">{needs.map((need) => <label key={need}><input name="needs" type="checkbox" value={need} /><span>{need}</span></label>)}</div>
          <label className="full-field"><span>Décision ou résultat attendu *</span><textarea name="expectedOutcome" required rows={5} placeholder="Ex. valider la faisabilité, préparer un dossier bancaire, comparer des scénarios…" /></label>
        </fieldset>

        <fieldset data-step="3" hidden={step !== 3}>
          <legend><span>04</span><div><strong>Partagez les ordres de grandeur disponibles</strong><small>Ces montants restent indicatifs et ne constituent pas une demande publique de financement.</small></div></legend>
          <div className="form-grid two-columns">
            <label><span>Montant estimatif du projet</span><input name="estimatedAmount" placeholder="Montant et devise" /></label>
            <label><span>Financement déjà mobilisé</span><input name="mobilizedAmount" placeholder="Montant et devise" /></label>
            <label><span>Financement recherché</span><input name="requestedAmount" placeholder="Montant et devise" /></label>
            <label><span>Type de financement envisagé</span><select name="financingType" defaultValue=""><option value="">À déterminer</option><option>Dette bancaire</option><option>Fonds propres</option><option>Subvention</option><option>Financement mixte</option><option>Partenariat public-privé</option><option>Autre</option></select></label>
            <label><span>Délai souhaité</span><select name="timeframe" defaultValue=""><option value="">À préciser</option><option>Moins d’un mois</option><option>1 à 3 mois</option><option>3 à 6 mois</option><option>Plus de 6 mois</option></select></label>
          </div>
          <div className="confidentiality-box"><span aria-hidden="true">◇</span><p>Les montants sont stockés comme texte et ne sont jamais affichés publiquement. Ils servent uniquement au cadrage de la demande.</p></div>
        </fieldset>

        <fieldset data-step="4" hidden={step !== 4}>
          <legend><span>05</span><div><strong>Ajoutez les documents utiles</strong><small>Cette étape est facultative. N’envoyez que les documents nécessaires au premier examen.</small></div></legend>
          <label className="upload-zone"><input name="documents" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" /><span aria-hidden="true">⇧</span><strong>Choisir un ou plusieurs documents</strong><small>Présentation, business plan, étude existante, documents financiers ou autorisations · 10 Mo maximum par fichier</small></label>
          <div className="security-list"><div><span>01</span><strong>Espace privé</strong><p>Aucun document transmis n’est publié.</p></div><div><span>02</span><strong>Accès limité</strong><p>Seules les personnes autorisées examinent la demande.</p></div><div><span>03</span><strong>Contrôle préalable</strong><p>Les fichiers restent en attente de vérification avant ouverture.</p></div></div>
          <label className="consent-field form-consent"><input name="consent" type="checkbox" value="yes" required /><span>Je confirme être autorisé à transmettre ces informations et j’accepte leur traitement pour l’analyse de ma demande. *</span></label>
          <label className="consent-field form-consent"><input name="financialDisclaimer" type="checkbox" value="yes" required /><span>Je comprends que cette soumission ne constitue ni une offre de financement ni un conseil financier personnalisé. *</span></label>
        </fieldset>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
        <div className="wizard-actions">
          {step > 0 ? <button type="button" className="button button-outline" onClick={() => setStep((value) => value - 1)}>← Étape précédente</button> : <span />}
          {step < steps.length - 1 ? <button type="button" className="button button-primary" onClick={next}>Continuer →</button> : <button type="submit" className="button button-project" disabled={state === "sending"}>{state === "sending" ? "Transmission sécurisée…" : "Transmettre mon projet"}</button>}
        </div>
        {state === "error" && <p className="form-error" role="alert">La transmission n’a pas abouti. Vérifiez la taille et le format des fichiers, puis réessayez.</p>}
      </div>
    </form>
  );
}
