import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";

export const metadata: Metadata = {
  title: "GEEF-SENEGAL | Études et ingénierie financières à Dakar",
  description:
    "GEEF-SENEGAL accompagne entreprises, institutions et investisseurs dans l’étude, la structuration et le financement de projets au Sénégal et en Afrique.",
  alternates: { canonical: "/", languages: { "fr-SN": "/", en: "/en", "x-default": "/" } },
};

export default function Home() {
  return <HomePage />;
}
