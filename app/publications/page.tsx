import type { Metadata } from "next";
import { PublicationListing } from "../components/Listings";
import { PageHero, SectionHeading } from "../components/Primitives";

export const metadata: Metadata = { title: "Publications", description: "Centre de ressources : analyses économiques, études, guides et décryptages financiers." };
export default function PublicationsPage() { return <><PageHero eyebrow="Analyses & perspectives" title="Des ressources pour mieux comprendre les décisions financières." intro="Notes économiques, analyses sectorielles, guides pratiques et actualités du cabinet réunis dans un centre de ressources structuré." image="/images/finance-analysis.webp" alt="Consultants examinant des graphiques financiers." /><section className="content-section is-white"><div className="container split-heading"><SectionHeading eyebrow="Centre de ressources" title="Explorer les publications" intro="Des contenus conçus pour éclairer les enjeux économiques, financiers et sectoriels des décideurs." /></div><div className="container"><PublicationListing /></div></section></>; }
