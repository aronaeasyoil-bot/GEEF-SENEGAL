"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { caseStudies, publications, trainings } from "../../lib/site-data";

export function CaseStudyListing() {
  const [sector, setSector] = useState("Tous");
  const filtered = useMemo(() => sector === "Tous" ? caseStudies : caseStudies.filter((item) => item.sector === sector), [sector]);
  const sectors = ["Tous", ...Array.from(new Set(caseStudies.map((item) => item.sector)))];
  return (
    <>
      <div className="filter-bar" aria-label="Filtrer les réalisations">
        <label><span>Secteur</span><select value={sector} onChange={(event) => setSector(event.target.value)}>{sectors.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="portfolio-grid" aria-live="polite">
        {filtered.map((item) => (
          <article className="portfolio-card" key={item.title}>
            <div className="portfolio-image"><img src={item.image} alt="" /><span>Photographie illustrative</span></div>
            <div className="portfolio-body"><div className="portfolio-meta"><span>{item.sector}</span><span>{item.status}</span></div><h2>{item.title}</h2><p>{item.mission}</p><strong>{item.client}</strong><details><summary>Découvrir notre intervention</summary><dl><div><dt>Contexte</dt><dd>Mission conduite pour répondre à un besoin d’analyse, de structuration ou de décision d’investissement.</dd></div><div><dt>Mission de GEEF-SENEGAL</dt><dd>{item.mission}</dd></div><div><dt>Méthodologie</dt><dd>Cadrage, collecte, analyse, modélisation et recommandations.</dd></div><div><dt>Résultats</dt><dd>Livrables opérationnels et recommandations communiqués dans le respect des engagements de confidentialité.</dd></div></dl></details></div>
          </article>
        ))}
      </div>
    </>
  );
}

export function PublicationListing() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const categories = ["Tous", ...Array.from(new Set(publications.map((item) => item.category)))];
  const filtered = useMemo(() => publications.filter((item) => (category === "Tous" || item.category === category) && `${item.title} ${item.summary}`.toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr"))), [category, query]);
  return (
    <>
      <div className="resource-toolbar">
        <label className="resource-search"><span className="sr-only">Rechercher une publication</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un titre ou un sujet" /><i aria-hidden="true">⌕</i></label>
        <div className="filter-pills" role="group" aria-label="Filtrer par catégorie">{categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>
      <div className="resource-grid" aria-live="polite">
        {filtered.map((item) => <article className="resource-card" key={item.slug}><img src={item.image} alt="" /><div><span className="draft-badge">{item.status}</span><div className="publication-meta"><span>{item.category}</span><span>{item.date}</span><span>{item.readTime}</span></div><h2>{item.title}</h2><p>{item.summary}</p>{item.slug === "preparer-etude-faisabilite" ? <Link href={`/publications/${item.slug}`}>Lire l’analyse ↗</Link> : <Link href={`/contact?demande=publication&sujet=${encodeURIComponent(item.title)}`}>Échanger sur ce sujet ↗</Link>}</div></article>)}
        {!filtered.length && <p>Aucun contenu ne correspond à cette recherche.</p>}
      </div>
    </>
  );
}

export function TrainingCatalog() {
  const [format, setFormat] = useState("Tous");
  const filtered = format === "Tous" ? trainings : trainings.filter((item) => item.format === format);
  return (
    <>
      <div className="filter-pills training-filters" role="group" aria-label="Filtrer par modalité">{["Tous", "Présentiel", "En ligne", "En entreprise", "Sur mesure"].map((item) => <button type="button" key={item} className={format === item ? "active" : ""} onClick={() => setFormat(item)}>{item}</button>)}</div>
      <div className="training-grid">
        {filtered.map((item, index) => <article className="training-card" key={item.title}><div className="training-top"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.format}</strong></div><h2>{item.title}</h2><dl><div><dt>Objectifs</dt><dd>Acquérir des méthodes et outils applicables aux situations professionnelles.</dd></div><div><dt>Public cible</dt><dd>{item.audience}</dd></div><div><dt>Durée</dt><dd>{item.duration}</dd></div><div><dt>Sessions</dt><dd>Programmation sur demande, en présentiel ou à distance.</dd></div></dl><span className="draft-badge">{item.status}</span><Link className="button button-outline" href={`/contact?demande=formation&formation=${encodeURIComponent(item.title)}`}>Demander le programme</Link></article>)}
      </div>
    </>
  );
}

export function ArticleUtilities() {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
    const onScroll = () => { const height = document.documentElement.scrollHeight - window.innerHeight; setProgress(height > 0 ? Math.min((window.scrollY / height) * 100, 100) : 0); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent("Préparer une étude de faisabilité : 7 questions structurantes");
  return (
    <>
      <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className="share-bar" aria-label="Partager cette publication"><strong>Partager</strong><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn</a><a href={`https://wa.me/?text=${text}%20${encodedUrl}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook</a><a href={`mailto:?subject=${text}&body=${encodedUrl}`}>E-mail</a></div>
    </>
  );
}
