import type { Metadata } from "next";
import Link from "next/link";
import { sectors } from "../../lib/site-data";
import { PageHero, ProjectCTA, SectionHeading } from "../components/Primitives";

export const metadata: Metadata = { title: "Secteurs", description: "Banques, énergie, immobilier, agriculture, infrastructures et institutions publiques." };

export default function SectorsPage() {
  return (
    <>
      <PageHero eyebrow="Secteurs" title="Comprendre un secteur avant de structurer sa finance." intro="Six univers prioritaires où l’analyse économique, la connaissance opérationnelle et la modélisation doivent avancer ensemble." image="/images/infrastructure.webp" alt="Vue aérienne d’un pont et d’un paysage urbain ouest-africain." />
      <section className="content-section is-white">
        <div className="container split-heading"><SectionHeading eyebrow="Une expertise multisectorielle" title="Des enjeux distincts, une même exigence de rigueur" intro="Chaque secteur est abordé à partir de ses moteurs économiques, de son cadre réglementaire, de ses risques et de ses modes de financement." /></div>
        <div className="container sector-page-grid">
          {sectors.map((sector, index) => (
            <Link href={`/secteurs/${sector.slug}`} className="sector-page-card" key={sector.slug}>
              <img src={sector.image} alt={sector.alt} /><div className="sector-page-overlay" /><span>0{index + 1}</span><div><h2>{sector.title}</h2><p>{sector.intro}</p><strong>Explorer le secteur ↗</strong></div><small>Photographie illustrative</small>
            </Link>
          ))}
        </div>
      </section>
      <ProjectCTA compact />
    </>
  );
}
