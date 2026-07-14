import type { Metadata } from "next";
import { CaseStudyListing } from "../components/Listings";
import { PageHero, ProjectCTA } from "../components/Primitives";

export const metadata: Metadata = { title: "Réalisations", description: "Exemples de missions d’études, de structuration et de conseil, présentés dans le respect de la confidentialité." };
export default function RealisationsPage() { return <><PageHero eyebrow="Réalisations" title="La confidentialité n’empêche pas de montrer notre méthode." intro="Ce portfolio présente des missions représentatives et anonymise les informations sensibles conformément à nos engagements de confidentialité." image="/images/partnership.webp" alt="Deux professionnels concluant un accord par une poignée de main." /><section className="content-section is-white"><div className="container"><CaseStudyListing /></div></section><ProjectCTA compact /></>; }
