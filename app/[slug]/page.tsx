import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "../components/Primitives";

const legalPages: Record<string, { title: string; intro: string; sections: { title: string; body: string }[] }> = {
  "mentions-legales": {
    title: "Mentions légales",
    intro: "Informations relatives à l’éditeur et à l’utilisation du site.",
    sections: [
      { title: "Éditeur", body: "GEEF-SENEGAL SARL, Cabinet d’Études et d’Ingénierie Financières, Immeuble Serigne Saliou Mbacké, 7C, VDN Sud Foire, Dakar, Sénégal. E-mail : Geef-Senegal@geef.pro." },
      { title: "Responsable de publication", body: "Le nom du responsable de publication, les données d’immatriculation et le capital social doivent être complétés et validés avant mise en ligne définitive." },
      { title: "Hébergement", body: "Les coordonnées de l’hébergeur et les informations techniques définitives seront insérées lors du déploiement de production." },
      { title: "Propriété intellectuelle", body: "Les textes, éléments graphiques, documents et marques restent la propriété de leurs titulaires. Toute reproduction nécessite une autorisation préalable, sauf disposition légale contraire." },
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    intro: "Principes applicables aux données transmises par les visiteurs.",
    sections: [
      { title: "Données collectées", body: "Les formulaires peuvent recueillir des coordonnées professionnelles, des informations sur un projet, une candidature, une inscription ou une demande de contact, ainsi que les documents volontairement transmis." },
      { title: "Finalités", body: "Ces données sont utilisées pour examiner la demande, répondre au visiteur, organiser un rendez-vous, gérer une inscription ou instruire une candidature. Elles ne sont pas publiées." },
      { title: "Accès et sécurité", body: "L’accès est limité aux personnes autorisées. Les fichiers sont conservés dans un espace privé et restent en attente de contrôle avant ouverture." },
      { title: "Durée et droits", body: "Les durées de conservation, le fondement juridique et la procédure d’exercice des droits doivent être confirmés avec le conseil juridique du cabinet. Les demandes peuvent être adressées à Geef-Senegal@geef.pro." },
    ],
  },
  cookies: {
    title: "Politique des cookies",
    intro: "Choisir les traceurs autorisés sur ce site.",
    sections: [
      { title: "Cookies essentiels", body: "Ils permettent le fonctionnement, la sécurité et la mémorisation du choix de consentement. Ils ne peuvent pas être désactivés depuis le bandeau." },
      { title: "Mesure d’audience", body: "Aucun outil de mesure d’audience n’est activé tant que la solution, les paramètres et le consentement n’ont pas été validés." },
      { title: "Votre choix", body: "Le bandeau permet d’accepter, de refuser ou de paramétrer les cookies. Le choix est enregistré localement sur l’appareil." },
    ],
  },
  "conditions-utilisation": {
    title: "Conditions d’utilisation",
    intro: "Cadre d’utilisation des informations et documents publics du site.",
    sections: [
      { title: "Nature des informations", body: "Les informations publiées ont une vocation générale et institutionnelle. Elles ne constituent pas un conseil financier, juridique, fiscal ou d’investissement personnalisé." },
      { title: "Absence d’offre", body: "Aucun contenu du site ne constitue une offre de financement, une sollicitation d’investissement ou une garantie de résultat." },
      { title: "Documents transmis", body: "L’envoi d’un projet ou d’un document ne crée pas automatiquement une relation contractuelle. Les conditions de confidentialité et de mission sont précisées séparément lorsque le cabinet accepte d’étudier un mandat." },
      { title: "Liens externes", body: "Les liens externes sont fournis pour faciliter la navigation. GEEF-SENEGAL n’exerce pas de contrôle sur les contenus ou pratiques de ces services." },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const page = legalPages[slug]; return page ? { title: page.title, description: page.intro, robots: { index: true, follow: true } } : {}; }
export function generateStaticParams() { return Object.keys(legalPages).map((slug) => ({ slug })); }
export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = legalPages[slug]; if (!page) notFound(); return <><PageHero eyebrow="Informations juridiques" title={page.title} intro={page.intro} /><section className="content-section is-white"><div className="container legal-layout"><aside><strong>Dernière mise à jour</strong><p>Juillet 2026</p></aside><div>{page.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div></div></section></>; }
