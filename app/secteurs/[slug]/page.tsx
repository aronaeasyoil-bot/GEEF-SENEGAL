import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sectors } from "../../../lib/site-data";
import { PageHero, ProjectCTA, SectionHeading } from "../../components/Primitives";

export function generateStaticParams() { return sectors.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const sector = sectors.find((item) => item.slug === slug); return sector ? { title: sector.title, description: sector.intro } : {}; }

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = sectors.find((item) => item.slug === slug);
  if (!sector) notFound();
  return (
    <>
      <PageHero eyebrow="Secteur" title={sector.title} intro={sector.intro} image={sector.image} alt={sector.alt}><Link className="button button-project" href={`/contact?secteur=${sector.slug}`}>Échanger sur votre projet</Link></PageHero>
      <section className="content-section is-white">
        <div className="container content-grid">
          <SectionHeading eyebrow="Enjeux" title="Une analyse construite autour des réalités du secteur" />
          <div className="content-copy"><p className="lead">La viabilité financière dépend des conditions opérationnelles, du marché, de la réglementation et de l’allocation des risques.</p><p>Nos travaux relient ces dimensions dans des scénarios cohérents et documentés, adaptés à la maturité du projet.</p><div className="tag-list">{sector.stakes.map((item) => <span key={item}>{item}</span>)}</div></div>
        </div>
      </section>
      <section className="content-section is-mist">
        <div className="container split-heading"><SectionHeading eyebrow="Accompagnements" title="Des prestations ajustées aux décisions à prendre" /></div>
        <div className="container service-list-grid">{sector.services.map((service, idx) => <article key={service}><span>{String(idx + 1).padStart(2, "0")}</span><h3>{service}</h3><p>Analyse, modélisation et recommandations selon le contexte du projet.</p></article>)}</div>
      </section>
      <section className="content-section is-white">
        <div className="container content-grid reverse">
          <div className="quote-panel"><blockquote>« Une bonne structure financière commence par une compréhension exacte du projet. »</blockquote><p>Les hypothèses sectorielles alimentent directement le modèle économique et les tests de sensibilité.</p></div>
          <div className="content-copy"><span className="eyebrow">Expertises mobilisées</span><h2>Un accompagnement transversal.</h2><p>Selon la mission, le cabinet combine étude de marché, faisabilité, modélisation financière, stratégie de financement et assistance à la décision.</p><Link className="button button-outline" href="/expertises">Découvrir nos expertises</Link></div>
        </div>
      </section>
      <ProjectCTA compact />
    </>
  );
}
