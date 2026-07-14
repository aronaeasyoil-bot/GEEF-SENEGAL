"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { caseStudies, expertises, publications, sectors } from "../../lib/site-data";
import { ArrowLink, ProjectCTA, SectionHeading, ValidationNotice } from "./Primitives";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const duration = 900;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      setDisplay(0);
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.7 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function NewsletterForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", body: new FormData(form) });
      if (!response.ok) throw new Error("request failed");
      form.reset();
      setState("sent");
    } catch { setState("error"); }
  }
  return (
    <form className="newsletter-form" onSubmit={submit}>
      <div className="form-grid four-columns">
        <label><span>Prénom</span><input name="firstName" autoComplete="given-name" required /></label>
        <label><span>Nom</span><input name="lastName" autoComplete="family-name" required /></label>
        <label><span>Adresse e-mail</span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Secteur d’intérêt</span><select name="sector" defaultValue=""><option value="" disabled>Choisir</option>{sectors.map((sector) => <option key={sector.slug}>{sector.title}</option>)}</select></label>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
      <div className="newsletter-submit">
        <label className="consent-field"><input name="consent" type="checkbox" value="yes" required /><span>J’accepte que mes données soient utilisées pour recevoir les publications, conformément à la politique de confidentialité.</span></label>
        <button className="button button-primary" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : "M’inscrire"}</button>
      </div>
      <p className="form-status" aria-live="polite">
        {state === "sent" && "Votre inscription a bien été enregistrée."}
        {state === "error" && "L’inscription n’a pas pu être enregistrée. Merci de réessayer."}
      </p>
    </form>
  );
}

export function HomePage() {
  const [activeSector, setActiveSector] = useState(0);
  const currentSector = sectors[activeSector];

  return (
    <>
      <section className="home-hero" aria-labelledby="home-hero-title">
        <img className="hero-image" src="/images/hero-team.webp" alt="Équipe de professionnelles réunies autour d’une table avec leurs ordinateurs portables." />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-watermark" aria-hidden="true">GEEF</div>
        <div className="container hero-content">
          <div className="hero-kicker"><span /> Cabinet d’Études et d’Ingénierie Financières</div>
          <h1 id="home-hero-title">Transformer les projets ambitieux en investissements <em>solides et durables.</em></h1>
          <p className="hero-descriptor">Études économiques · Ingénierie financière · Structuration de financements</p>
          <p className="hero-intro">Nous accompagnons l’étude, la structuration et le financement de projets au Sénégal et en Afrique.</p>
          <div className="hero-actions">
            <Link className="button button-primary hero-primary-action" href="/expertises">Découvrir nos expertises <span aria-hidden="true">↗</span></Link>
            <Link className="button button-project hero-project-action" href="/soumettre-un-projet">Présentez votre projet <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="hero-caption">Photographie illustrative · réunion stratégique</div>
      </section>

      <section className="audience-strip" aria-label="Publics accompagnés">
        <div className="container">
          <span>Entreprises</span><i /><span>Institutions publiques</span><i /><span>Investisseurs</span><i /><span>Partenaires au développement</span>
        </div>
      </section>

      <section className="section section-intro">
        <div className="container intro-grid">
          <SectionHeading eyebrow="Notre proposition de valeur" title="Une expertise financière au service de vos ambitions" />
          <div className="intro-copy">
            <p className="lead">GEEF-SENEGAL SARL fournit des études fiables, structure des financements adaptés et accompagne ses clients dans leurs décisions stratégiques.</p>
            <p>Notre approche associe expertise locale, méthodes rigoureuses, innovation et compréhension des enjeux économiques africains.</p>
            <ArrowLink href="/cabinet">Découvrir le cabinet</ArrowLink>
          </div>
        </div>
        <div className="container expertise-card-grid">
          {expertises.map((expertise, index) => (
            <Link className="expertise-card" href={`/expertises/${expertise.slug}`} key={expertise.slug}>
              <div className="expertise-card-media">
                <img src={expertise.image} alt={expertise.alt} />
                <span className="card-number">0{index + 1}</span>
              </div>
              <div className="expertise-card-body">
                <span className="eyebrow">{expertise.eyebrow}</span>
                <h3>{expertise.shortTitle}</h3>
                <p>{expertise.intro}</p>
                <span className="expertise-card-cta">Explorer l’expertise <i aria-hidden="true">↗</i></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="stats-band">
        <div className="container">
          <div className="stat-card"><strong><CountUp value={10} /></strong><span>consultants expérimentés</span></div>
          <div className="stat-card"><strong><CountUp value={4} /></strong><span>grands pôles d’expertise</span></div>
          <div className="stat-card"><strong><CountUp value={6} /></strong><span>secteurs prioritaires</span></div>
          <div className="stat-card stat-words"><strong>Local <i>&</i> international</strong><span>une approche ouverte sur les marchés</span></div>
        </div>
        <div className="container"><ValidationNotice>Ces chiffres sont provisoires et doivent être confirmés par GEEF-SENEGAL avant mise en production publique.</ValidationNotice></div>
      </section>

      <section className="section expertise-list-section">
        <div className="container split-heading">
          <SectionHeading eyebrow="Nos savoir-faire" title="Des expertises mobilisées à chaque étape du projet" intro="De la première hypothèse à la mise en œuvre, nous adaptons l’équipe, les outils et le niveau d’analyse à la décision attendue." />
          <Link className="button button-outline" href="/expertises">Explorer toutes nos expertises</Link>
        </div>
        <div className="container expertise-service-grid">
          {[
            "Études de marché", "Études de faisabilité", "Business plans", "Modélisation financière",
            "Structuration de financements", "Levée de fonds", "Partenariats public-privé", "Évaluation d’entreprises",
            "Restructuration financière", "Conseil en investissement", "Assistance à la décision", "Formation & capacités",
          ].map((item, index) => <Link href="/expertises" key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><i aria-hidden="true">↗</i></Link>)}
        </div>
      </section>

      <section className="section sectors-section">
        <div className="container">
          <SectionHeading eyebrow="Secteurs" title="Une expertise multisectorielle" intro="Une lecture financière ne prend tout son sens qu’en comprenant les dynamiques opérationnelles, réglementaires et de marché propres à chaque secteur." light />
          <div className="sector-explorer">
            <div className="sector-tabs" role="tablist" aria-label="Choisir un secteur">
              {sectors.map((sector, index) => (
                <button key={sector.slug} type="button" role="tab" aria-selected={index === activeSector} onClick={() => setActiveSector(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span><strong>{sector.title}</strong><i aria-hidden="true">→</i>
                </button>
              ))}
            </div>
            <article className="sector-visual" role="tabpanel">
              <img key={currentSector.image} src={currentSector.image} alt={currentSector.alt} />
              <div className="sector-visual-overlay" />
              <div>
                <span className="eyebrow eyebrow-light">{currentSector.shortTitle}</span>
                <h3>{currentSector.title}</h3>
                <p>{currentSector.intro}</p>
                <Link href={`/secteurs/${currentSector.slug}`}>Découvrir le secteur <span aria-hidden="true">↗</span></Link>
              </div>
              <small>Photographie illustrative</small>
            </article>
          </div>
        </div>
      </section>

      <section className="section case-section">
        <div className="container split-heading">
          <SectionHeading eyebrow="Réalisations" title="Des solutions concrètes pour des projets à fort impact" intro="Quelques formats de missions représentatifs. Les informations sensibles restent volontairement anonymisées." />
          <Link className="button button-outline" href="/realisations">Voir toutes nos réalisations</Link>
        </div>
        <div className="container case-card-grid">
          {caseStudies.slice(0, 3).map((item) => (
            <article className="case-card" key={item.title}>
              <div className="case-image"><img src={item.image} alt="" /><span>{item.status}</span><small>Illustration</small></div>
              <div className="case-body"><span className="eyebrow">{item.sector}</span><h3>{item.title}</h3><p>{item.mission}</p><small>{item.client}</small><Link href="/realisations" aria-label={`En savoir plus sur ${item.title}`}>Voir la mission <span aria-hidden="true">↗</span></Link></div>
            </article>
          ))}
        </div>
        <div className="container"><ValidationNotice>Les références ci-dessus sont des contenus de démonstration issus du brief. Le cabinet doit valider leur publication, leur formulation et tout résultat associé.</ValidationNotice></div>
      </section>

      <section className="section methodology-section">
        <div className="container methodology-layout">
          <div>
            <SectionHeading eyebrow="Notre méthodologie" title="Une démarche rigoureuse, participative et orientée résultats" intro="Chaque mission est cadrée autour d’une décision, d’hypothèses explicites et de livrables directement exploitables." light />
            <div className="method-tags"><span>Démarche scientifique</span><span>Contrôle qualité</span><span>Confidentialité</span><span>Reporting</span></div>
          </div>
          <ol className="method-timeline">
            {["Comprendre le projet", "Collecter et analyser les données", "Évaluer les scénarios", "Structurer la solution financière", "Accompagner la mise en œuvre"].map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step}</strong><p>{["Objectifs, contexte, décisions et critères de succès.", "Sources, entretiens, hypothèses et qualité de l’information.", "Analyses quantitatives, qualitatives et tests de sensibilité.", "Modèle économique, financement, risques et conditions clés.", "Feuille de route, reporting et suivi des recommandations."][index]}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section leadership-section">
        <div className="container leadership-layout">
          <div className="portrait-placeholder">
            <img src="/images/seybanou-ly-mbacke.jpeg" alt="Portrait officiel de Madame Seybanou Ly Mbacké, directrice générale de GEEF-SENEGAL SARL." />
          </div>
          <div className="leadership-copy">
            <span className="eyebrow">Direction générale</span>
            <h2>Madame Seybanou LY MBACKE</h2>
            <p className="title">Directrice générale de GEEF-SENEGAL SARL</p>
            <p className="lead">Une expérience transversale de la banque, de la finance internationale, de l’investissement et de l’accompagnement des organisations.</p>
            <div className="leadership-tags"><span>Banque</span><span>Investissement</span><span>Garanties financières</span><span>Microfinance</span><span>Entrepreneuriat</span><span>Audit</span><span>Institutions publiques</span></div>
            <Link className="button button-outline" href="/equipe">Découvrir son parcours</Link>
            <small>Biographie détaillée et diplômes à compléter après validation officielle.</small>
          </div>
        </div>
      </section>

      <section className="section publications-section">
        <div className="container split-heading">
          <SectionHeading eyebrow="Analyses et perspectives" title="Des repères pour comprendre, décider et agir" intro="Le futur centre de ressources réunira notes économiques, analyses sectorielles, guides et actualités du cabinet." />
          <Link className="button button-outline" href="/publications">Toutes les publications</Link>
        </div>
        <div className="container publication-grid">
          {publications.map((item) => (
            <article className="publication-card" key={item.slug}>
              <div className="publication-image"><img src={item.image} alt="" /><span>{item.status}</span></div>
              <div className="publication-meta"><span>{item.category}</span><span>{item.date}</span><span>{item.readTime}</span></div>
              <h3>{item.title}</h3><p>{item.summary}</p>
              <Link href={item.slug === "preparer-etude-faisabilite" ? `/publications/${item.slug}` : "/publications"}>Lire l’analyse <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <ProjectCTA />

      <section className="partners-placeholder">
        <div className="container">
          <span className="eyebrow">Partenaires & clients</span>
          <h2>Un espace réservé aux collaborations autorisées.</h2>
          <p>Les logos seront affichés uniquement après accord écrit et validation par GEEF-SENEGAL.</p>
          <div className="logo-placeholders" aria-hidden="true"><i>LOGO</i><i>LOGO</i><i>LOGO</i><i>LOGO</i><i>LOGO</i></div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container newsletter-layout">
          <div><span className="eyebrow">Newsletter</span><h2>Recevez nos analyses économiques et financières</h2><p>Une sélection périodique de contenus utiles, sans surcharge.</p></div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
