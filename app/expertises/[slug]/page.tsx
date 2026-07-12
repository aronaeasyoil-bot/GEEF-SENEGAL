import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { expertises } from "../../../lib/site-data";
import { PageHero, ProjectCTA, SectionHeading } from "../../components/Primitives";

export function generateStaticParams() { return expertises.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const expertise = expertises.find((item) => item.slug === slug);
  return expertise ? { title: expertise.title, description: expertise.intro } : {};
}

export default async function ExpertiseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const expertise = expertises.find((item) => item.slug === slug);
  if (!expertise) notFound();
  const index = expertises.findIndex((item) => item.slug === slug);
  return (
    <>
      <PageHero eyebrow={`Expertise 0${index + 1}`} title={expertise.title} intro={expertise.intro}>
        <Link className="button button-project" href={`/contact?expertise=${expertise.slug}`}>Parler à un expert</Link>
      </PageHero>
      <section className="content-section is-white">
        <div className="container content-grid">
          <SectionHeading eyebrow="Notre intervention" title="Transformer une question complexe en décision structurée." />
          <div className="content-copy"><p className="lead">{expertise.description}</p><p>Le périmètre, les sources, les hypothèses et le format des livrables sont définis avec le client. La mission est ensuite pilotée par étapes, avec des validations intermédiaires.</p></div>
        </div>
      </section>
      <section className="content-section is-mist">
        <div className="container content-grid">
          <div><SectionHeading eyebrow="Problématiques traitées" title="Les questions auxquelles nous répondons" /></div>
          <ol className="numbered-list">{expertise.challenges.map((item) => <li key={item}><div><strong>{item}</strong><p>Analyse adaptée au contexte, aux données disponibles et à la décision attendue.</p></div></li>)}</ol>
        </div>
      </section>
      <section className="content-section is-white">
        <div className="container split-heading"><SectionHeading eyebrow="Prestations" title="Un périmètre modulaire" intro="Les prestations peuvent être réalisées séparément ou combinées dans une mission intégrée." /></div>
        <div className="container service-list-grid">{expertise.services.map((service, idx) => <article key={service}><span>{String(idx + 1).padStart(2, "0")}</span><h3>{service}</h3><p>Objectifs, méthode et livrables précisés dans la proposition d’intervention.</p></article>)}</div>
      </section>
      <section className="content-section is-mist">
        <div className="container content-grid reverse">
          <ol className="process-steps">{expertise.methodology.map((step, idx) => <li key={step}><span>{idx + 1}</span><strong>{step}</strong></li>)}</ol>
          <div className="content-copy"><span className="eyebrow">Méthodologie</span><h2>Une progression claire, de la question aux recommandations.</h2><p>Les hypothèses sont tracées, les scénarios sont comparés et les résultats sont présentés dans un format exploitable par les équipes et instances de décision.</p><div className="tag-list">{expertise.beneficiaries.map((item) => <span key={item}>{item}</span>)}</div></div>
        </div>
      </section>
      <section className="content-section is-white">
        <div className="container content-grid">
          <SectionHeading eyebrow="Questions fréquentes" title="Avant de démarrer une mission" />
          <div className="faq-list">{expertise.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>
      <ProjectCTA compact />
    </>
  );
}
