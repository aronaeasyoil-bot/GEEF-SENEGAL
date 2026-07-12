import type { Metadata } from "next";
import Link from "next/link";
import { expertises } from "../../lib/site-data";
import { PageHero, ProjectCTA, SectionHeading } from "../components/Primitives";

export const metadata: Metadata = { title: "Nos Expertises", description: "Études de faisabilité, ingénierie financière, conseil stratégique et formation à Dakar." };

export default function ExpertisesPage() {
  return (
    <>
      <PageHero eyebrow="Nos Expertises" title="De l’analyse initiale à la solution financière." intro="Quatre pôles complémentaires pour étudier la viabilité, modéliser les scénarios, structurer le financement et renforcer les capacités." image="/images/finance-analysis.webp" alt="Consultants analysant des graphiques financiers dans un espace professionnel." />
      <section className="content-section is-white">
        <div className="container split-heading"><SectionHeading eyebrow="Quatre pôles" title="Choisir le bon niveau d’accompagnement" intro="Chaque mandat est construit autour d’une question précise, d’un périmètre explicite et de livrables convenus." /></div>
        <div className="container service-detail-grid expertise-page-grid">
          {expertises.map((expertise, index) => (
            <article className="service-detail-card" key={expertise.slug}>
              <span className="service-index">0{index + 1}</span>
              <span className="eyebrow">{expertise.eyebrow}</span>
              <h2>{expertise.title}</h2>
              <p>{expertise.intro}</p>
              <ul>{expertise.services.slice(0, 5).map((service) => <li key={service}>{service}</li>)}</ul>
              <Link href={`/expertises/${expertise.slug}`}>Découvrir cette expertise <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="content-section is-mist">
        <div className="container content-grid">
          <SectionHeading eyebrow="Une équipe adaptée" title="Des compétences mobilisées selon la mission" />
          <div className="content-copy"><p className="lead">Finance, économie, ingénierie de projet, droit et fiscalité peuvent être combinés dans une même mission.</p><p>La composition précise de l’équipe, les profils et références sont présentés au client avant le démarrage. Aucun intervenant n’est publié sur ce site sans validation.</p><Link className="button button-outline" href="/equipe">Notre approche d’équipe</Link></div>
        </div>
      </section>
      <ProjectCTA compact />
    </>
  );
}
