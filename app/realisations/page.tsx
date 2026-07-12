import type { Metadata } from "next";
import { CaseStudyListing } from "../components/Listings";
import { PageHero, ProjectCTA, ValidationNotice } from "../components/Primitives";

export const metadata: Metadata = { title: "Réalisations", description: "Exemples de missions d’études, de structuration et de conseil, présentés dans le respect de la confidentialité." };
export default function RealisationsPage() { return <><PageHero eyebrow="Réalisations" title="La confidentialité n’empêche pas de montrer notre méthode." intro="Ce portfolio présente la structure des missions et anonymise les informations sensibles. Aucun résultat n’est publié sans validation." image="/images/partnership.webp" alt="Deux professionnels concluant un accord par une poignée de main." /><section className="content-section is-white"><div className="container"><ValidationNotice>Certaines références sont présentées de manière anonyme afin de respecter nos engagements de confidentialité. Les fiches actuelles proviennent du brief et restent à valider avant publication.</ValidationNotice><CaseStudyListing /></div></section><ProjectCTA compact /></>; }
