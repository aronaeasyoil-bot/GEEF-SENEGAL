import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, ProjectCTA, SectionHeading, ValidationNotice } from "../components/Primitives";

export const metadata: Metadata = {
  title: "Le Cabinet",
  description: "Découvrez la vision, la mission, les valeurs et la méthodologie de GEEF-SENEGAL, cabinet d’ingénierie financière à Dakar.",
};

export default function CabinetPage() {
  return (
    <>
      <PageHero eyebrow="Le Cabinet" title="Une expertise ancrée à Dakar, tournée vers les projets qui transforment." intro="GEEF-SENEGAL réunit études économiques, ingénierie financière et conseil stratégique pour accompagner des décisions d’investissement exigeantes." image="/images/dakar.webp" alt="Panorama contemporain de Dakar avec la ville à l’horizon." />

      <section className="content-section is-white">
        <div className="container content-grid">
          <div>
            <SectionHeading eyebrow="Notre raison d’être" title="Rendre les projets plus lisibles, plus solides et mieux structurés." />
          </div>
          <div className="content-copy">
            <p className="lead">GEEF-SENEGAL SARL est un Cabinet d’Études et d’Ingénierie Financières. Il intervient auprès des entreprises, institutions publiques, investisseurs et partenaires au développement.</p>
            <p>Le cabinet transforme des problématiques complexes en analyses structurées, modèles transparents et feuilles de route opérationnelles. Les missions sont conduites avec rigueur, confidentialité et attention portée aux réalités économiques africaines.</p>
            <ValidationNotice>L’historique détaillé du cabinet, sa date de création et les jalons institutionnels seront intégrés dès validation des informations officielles.</ValidationNotice>
          </div>
        </div>
      </section>

      <section className="content-section is-mist">
        <div className="container value-grid">
          {[
            ["01", "Vision", "Devenir un acteur de référence en ingénierie financière dans la région et à l’international."],
            ["02", "Mission", "Fournir des études de faisabilité, structurer des financements et conseiller les entreprises et les institutions dans leurs décisions d’investissement."],
            ["03", "Objectif", "Accompagner les décisions stratégiques grâce à des études fiables et des solutions financières adaptées."],
            ["04", "Ambition", "Contribuer à des projets viables, utiles et durables au Sénégal, en Afrique et dans les partenariats internationaux."],
          ].map(([number, title, text]) => <article className="value-card" key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="content-section is-white">
        <div className="container content-grid reverse">
          <div className="image-frame"><img src="/images/cabinet-africa.webp" alt="Groupe de professionnels africains échangeant autour d’un ordinateur portable." /><small>Photographie illustrative</small></div>
          <div className="content-copy">
            <span className="eyebrow">Nos valeurs</span>
            <h2>La confiance se construit dans la méthode.</h2>
            <ol className="numbered-list">
              <li><div><strong>Rigueur et professionnalisme</strong><p>Des hypothèses explicites, des sources documentées et des livrables relus.</p></div></li>
              <li><div><strong>Confidentialité et éthique</strong><p>Des accès maîtrisés et une attention constante à la sensibilité des informations.</p></div></li>
              <li><div><strong>Innovation et adaptabilité</strong><p>Des outils adaptés au contexte, à la maturité et aux contraintes de chaque projet.</p></div></li>
              <li><div><strong>Orientation client</strong><p>Une mission structurée autour de la décision à prendre et de l’usage des résultats.</p></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="content-section is-mist">
        <div className="container split-heading">
          <SectionHeading eyebrow="Avantages compétitifs" title="Une approche à la fois locale, financière et opérationnelle" intro="La proposition de valeur repose sur la combinaison de compétences complémentaires et sur une forte discipline de mission." />
        </div>
        <div className="container feature-grid">
          {[
            ["01", "Compréhension du contexte", "Lecture des marchés, institutions, chaînes de valeur et contraintes locales."],
            ["02", "Standards de décision", "Modèles, scénarios, indicateurs et synthèses conçus pour les comités de décision."],
            ["03", "Approche participative", "Échanges réguliers avec les parties prenantes et validation progressive des hypothèses."],
            ["04", "Continuité de l’appui", "Passage possible de l’étude à la structuration, puis au suivi de la mise en œuvre."],
          ].map(([number, title, text]) => <article className="feature-card" key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="content-section is-white">
        <div className="container content-grid">
          <div className="quote-panel"><blockquote>« Une expertise avérée au service du développement durable »</blockquote><p>Le développement durable est intégré dans la lecture des risques, des impacts, de la résilience et de la création de valeur à long terme.</p></div>
          <div className="content-copy">
            <span className="eyebrow">Gouvernance & qualité</span>
            <h2>Des missions cadrées, suivies et documentées.</h2>
            <p>Chaque intervention commence par un cadrage des objectifs, des responsabilités, des données nécessaires et des règles de confidentialité. Des points de contrôle sont prévus jusqu’à la remise finale.</p>
            <div className="tag-list"><span>Cadrage</span><span>Comité de suivi</span><span>Contrôle qualité</span><span>Traçabilité</span><span>Confidentialité</span><span>Reporting</span></div>
            <Link className="button button-outline" href="/contact">Échanger avec le cabinet</Link>
          </div>
        </div>
      </section>

      <ProjectCTA compact />
    </>
  );
}
