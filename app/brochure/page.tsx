import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/Primitives";

const brochureUrl = "/documents/brochure-institutionnelle-geef-senegal-2026.pdf";

export const metadata: Metadata = {
  title: "Brochure institutionnelle",
  description: "Consultez et téléchargez la brochure institutionnelle 2026 de GEEF-SENEGAL.",
  alternates: { canonical: "/brochure", languages: { "fr-SN": "/brochure", en: "/en/brochure" } },
};

export default function BrochurePage() {
  return (
    <>
      <PageHero eyebrow="GEEF-SENEGAL · Édition 2026" title="Notre brochure institutionnelle" intro="Découvrez notre cabinet, nos expertises, notre méthodologie et notre engagement au service de projets solides et durables.">
        <a className="button button-project" href={brochureUrl} download="Brochure-institutionnelle-GEEF-SENEGAL-2026.pdf">Télécharger la brochure ↓</a>
      </PageHero>
      <section className="section brochure-section">
        <div className="container">
          <div className="brochure-toolbar">
            <div><span className="eyebrow">Lecture en ligne</span><h2>Consultez la brochure sans quitter le site</h2></div>
            <div>
              <a className="button button-primary" href={brochureUrl} download="Brochure-institutionnelle-GEEF-SENEGAL-2026.pdf">Télécharger le PDF</a>
              <Link className="button button-outline" href="/contact">Nous contacter</Link>
            </div>
          </div>
          <div className="brochure-viewer">
            <iframe src={`${brochureUrl}#view=FitH&toolbar=1&navpanes=0`} title="Brochure institutionnelle GEEF-SENEGAL 2026" />
          </div>
          <p className="brochure-fallback">Si le document ne s’affiche pas dans votre navigateur, <a href={brochureUrl} download="Brochure-institutionnelle-GEEF-SENEGAL-2026.pdf">téléchargez directement la brochure</a>.</p>
        </div>
      </section>
    </>
  );
}
