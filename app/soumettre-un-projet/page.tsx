import type { Metadata } from "next";
import { ProjectForm } from "../components/PublicForms";
import { PageHero } from "../components/Primitives";

export const metadata: Metadata = { title: "Soumettre un projet", description: "Présentez votre projet à GEEF-SENEGAL au moyen d’un formulaire confidentiel en cinq étapes." };
export default function SubmitProjectPage() { return <><PageHero eyebrow="Soumettre un projet" title="Donnez-nous les éléments pour comprendre votre ambition." intro="Un parcours confidentiel en cinq étapes. Vous pourrez joindre les informations et documents utiles à un premier examen." /><section className="wizard-section"><div className="container"><div className="wizard-intro"><div><span className="eyebrow">Parcours sécurisé</span><h2>Votre projet, étape par étape.</h2></div><p>Prévoyez environ 8 minutes. Vous pouvez transmettre un dossier incomplet : indiquez simplement ce qui reste à préciser.</p></div><ProjectForm /></div></section></>; }
