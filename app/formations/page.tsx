import type { Metadata } from "next";
import { TrainingCatalog } from "../components/Listings";
import { PageHero, SectionHeading } from "../components/Primitives";

export const metadata: Metadata = { title: "Formations", description: "Catalogue de formations en ingénierie financière, business plan, modélisation et financement de projets." };
export default function TrainingsPage() { return <><PageHero eyebrow="Formations" title="Des compétences financières qui s’appliquent dès le retour au bureau." intro="Programmes en présentiel, en ligne, en entreprise ou sur mesure, construits autour de cas pratiques et d’outils réutilisables." image="/images/hero-team.webp" alt="Équipe en réunion de travail autour d’ordinateurs portables." /><section className="content-section is-white"><div className="container split-heading"><SectionHeading eyebrow="Catalogue" title="Choisir une thématique" intro="Chaque programme est adapté aux objectifs, au niveau des participants et aux situations professionnelles de l’organisation." /></div><div className="container"><TrainingCatalog /></div></section></>; }
