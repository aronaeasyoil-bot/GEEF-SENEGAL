export type Expertise = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  image: string;
  alt: string;
  intro: string;
  description: string;
  services: string[];
  challenges: string[];
  beneficiaries: string[];
  methodology: string[];
  faqs: { question: string; answer: string }[];
};

export type Sector = {
  slug: string;
  title: string;
  shortTitle: string;
  image: string;
  alt: string;
  intro: string;
  services: string[];
  stakes: string[];
};

export const contact = {
  company: "GEEF-SENEGAL SARL",
  addressLine1: "Immeuble Serigne Saliou Mbacké, 7C",
  addressLine2: "VDN Sud Foire, Dakar, Sénégal",
  phones: ["+221 77 400 00 82", "+221 33 843 54 05"],
  email: "Geef-Senegal@geef.pro",
};

export const expertises: Expertise[] = [
  {
    slug: "etudes-economiques-financieres",
    title: "Études économiques et financières",
    shortTitle: "Études & faisabilité",
    eyebrow: "Éclairer la décision",
    image: "/images/finance-analysis.webp",
    alt: "Équipe de conseil analysant des données financières et économiques.",
    intro:
      "Des analyses structurées pour comprendre un marché, tester la viabilité d’un projet et sécuriser les décisions d’investissement.",
    description:
      "Nous combinons recherche documentaire, collecte de données, analyse sectorielle et projections financières afin de produire des études directement utilisables par les décideurs.",
    services: [
      "Études de marché",
      "Études sectorielles",
      "Études de faisabilité",
      "Analyses coûts-bénéfices",
      "Business plans",
      "Plans stratégiques",
      "Prévisions financières",
      "Analyses économiques",
    ],
    challenges: [
      "Valider l’existence d’un marché et ses conditions d’accès",
      "Comparer des scénarios techniques, commerciaux et financiers",
      "Documenter une décision d’investissement ou de financement",
      "Transformer des données dispersées en recommandations claires",
    ],
    beneficiaries: ["Entreprises et PME", "Institutions publiques", "Investisseurs", "Partenaires au développement"],
    methodology: ["Cadrage", "Collecte", "Analyse", "Modélisation", "Recommandations"],
    faqs: [
      {
        question: "Que contient une étude de faisabilité ?",
        answer:
          "Le périmètre est adapté au projet. Il peut couvrir le marché, les options techniques, l’organisation, le cadre réglementaire, les impacts et le modèle financier.",
      },
      {
        question: "Pouvez-vous travailler à partir d’une étude existante ?",
        answer:
          "Oui. Une revue critique peut identifier les hypothèses à actualiser, les données manquantes et les analyses à approfondir.",
      },
    ],
  },
  {
    slug: "ingenierie-financiere",
    title: "Ingénierie financière",
    shortTitle: "Ingénierie financière",
    eyebrow: "Structurer le financement",
    image: "/images/infrastructure.webp",
    alt: "Infrastructure moderne illustrant le financement de projets structurants.",
    intro:
      "Des schémas de financement cohérents avec les besoins du projet, sa capacité de remboursement et les attentes des financeurs.",
    description:
      "GEEF-SENEGAL construit des modèles financiers, teste les équilibres de financement et prépare les dossiers utiles aux échanges avec les banques, investisseurs et partenaires.",
    services: [
      "Montage financier",
      "Structuration de financements",
      "Financement de projets",
      "Financements structurés",
      "Levée de fonds",
      "Dette et fonds propres",
      "Capital-investissement",
      "Partenariats public-privé",
      "Modélisation financière",
      "Optimisation des plans de financement",
    ],
    challenges: [
      "Déterminer le besoin de financement réel",
      "Choisir une combinaison dette-fonds propres adaptée",
      "Tester la résilience du projet face aux risques",
      "Préparer une information financière lisible et traçable",
    ],
    beneficiaries: ["Promoteurs de projets", "Directions financières", "Investisseurs", "Institutions financières"],
    methodology: ["Diagnostic", "Hypothèses", "Modèle", "Scénarios", "Structuration"],
    faqs: [
      {
        question: "La levée de fonds est-elle garantie ?",
        answer:
          "Non. Le cabinet structure la démarche et prépare les éléments de décision. Toute décision de financement appartient aux financeurs sollicités.",
      },
      {
        question: "Comment protégez-vous les informations du projet ?",
        answer:
          "Le périmètre de confidentialité est défini au démarrage. Les accès, documents transmis et livrables sont limités aux personnes autorisées.",
      },
    ],
  },
  {
    slug: "conseil-strategique",
    title: "Conseil stratégique",
    shortTitle: "Conseil stratégique",
    eyebrow: "Arbitrer avec méthode",
    image: "/images/partnership.webp",
    alt: "Partenaires réunis pour définir une stratégie et prendre une décision.",
    intro:
      "Des diagnostics indépendants pour évaluer une option d’investissement, une entreprise ou une trajectoire de croissance.",
    description:
      "Nos missions relient les enjeux économiques, financiers et opérationnels afin d’aider les dirigeants et institutions à prendre des décisions documentées.",
    services: [
      "Conseil en investissement",
      "Évaluation d’entreprises",
      "Évaluation d’actifs",
      "Restructuration",
      "Accompagnement à la décision",
      "Audit financier et économique",
      "Analyse de rentabilité",
      "Due diligence",
      "Stratégie de croissance",
    ],
    challenges: [
      "Objectiver la valeur et les risques d’une opération",
      "Prioriser les options de croissance",
      "Rétablir des équilibres financiers durables",
      "Outiller une gouvernance ou un comité d’investissement",
    ],
    beneficiaries: ["Dirigeants", "Conseils d’administration", "Investisseurs", "Institutions"],
    methodology: ["Question stratégique", "Diagnostic", "Options", "Arbitrage", "Feuille de route"],
    faqs: [
      {
        question: "Vos recommandations remplacent-elles la décision du client ?",
        answer:
          "Non. Elles apportent une base d’analyse indépendante. La décision finale reste de la responsabilité du client et de ses organes de gouvernance.",
      },
      {
        question: "Intervenez-vous sur des missions ponctuelles ?",
        answer:
          "Oui. Le mandat peut porter sur une question précise ou s’inscrire dans un accompagnement plus long, selon les besoins validés.",
      },
    ],
  },
  {
    slug: "formation-assistance-technique",
    title: "Formation et assistance technique",
    shortTitle: "Formation & assistance",
    eyebrow: "Renforcer les capacités",
    image: "/images/hero-team.webp",
    alt: "Équipe professionnelle participant à une séance de travail et de formation.",
    intro:
      "Des formations pratiques et des dispositifs d’assistance conçus autour des situations réelles des équipes.",
    description:
      "Les contenus associent concepts, cas pratiques, outils réutilisables et accompagnement à la mise en application.",
    services: [
      "Ingénierie financière",
      "Élaboration de business plans",
      "Modélisation financière",
      "Analyse de projets",
      "Financement des PME",
      "Partenariats public-privé",
      "Renforcement des capacités institutionnelles",
      "Ateliers sur mesure",
    ],
    challenges: [
      "Harmoniser les méthodes au sein d’une équipe",
      "Rendre les outils financiers plus opérationnels",
      "Accompagner l’adoption de nouveaux processus",
      "Capitaliser sur les connaissances internes",
    ],
    beneficiaries: ["Entreprises", "Institutions publiques", "Associations professionnelles", "Équipes projet"],
    methodology: ["Diagnostic pédagogique", "Programme", "Cas pratiques", "Évaluation", "Suivi"],
    faqs: [
      {
        question: "Les programmes sont-ils personnalisables ?",
        answer:
          "Oui. Les objectifs, études de cas, durée et modalité sont définis avec l’organisation commanditaire.",
      },
      {
        question: "Proposez-vous des formations en entreprise ?",
        answer:
          "Oui, en présentiel, à distance ou dans un format hybride, sous réserve de validation du calendrier et des intervenants.",
      },
    ],
  },
];

export const sectors: Sector[] = [
  {
    slug: "banques-services-financiers",
    title: "Banques et services financiers",
    shortTitle: "Finance",
    image: "/images/finance-analysis.webp",
    alt: "Consultants analysant des graphiques financiers dans un espace professionnel.",
    intro: "Des analyses économiques et financières utiles à la rentabilité, au risque et au développement de nouvelles offres.",
    services: ["Études de rentabilité", "Développement de produits", "Analyse des risques", "Restructuration", "Modélisation", "Conseil stratégique"],
    stakes: ["Transformation des usages", "Maîtrise du risque", "Inclusion financière", "Solidité des modèles économiques"],
  },
  {
    slug: "energie",
    title: "Énergie",
    shortTitle: "Énergie",
    image: "/images/energy-solar.webp",
    alt: "Ingénieur inspectant une installation de panneaux solaires.",
    intro: "Une lecture intégrée des dimensions techniques, contractuelles, financières et environnementales des projets énergétiques.",
    services: ["Énergies renouvelables", "Électricité et hydrocarbures", "Études de faisabilité", "Contrats PPA", "Financement de projets", "Analyse environnementale et sociale"],
    stakes: ["Accès à l’énergie", "Bancabilité", "Risque contractuel", "Transition énergétique"],
  },
  {
    slug: "immobilier-hotellerie",
    title: "Immobilier et hôtellerie",
    shortTitle: "Immobilier",
    image: "/images/construction.webp",
    alt: "Professionnel sur le chantier d’un bâtiment en construction.",
    intro: "Des études de marché et des modèles de rentabilité pour éclairer les décisions immobilières et hôtelières.",
    services: ["Études de marché", "Analyse foncière et réglementaire", "Plan d’investissement", "Prévisions de revenus", "Analyse de rentabilité", "Structuration bancaire"],
    stakes: ["Demande solvable", "Coûts de développement", "Phasage", "Structure de financement"],
  },
  {
    slug: "agriculture-agro-industrie",
    title: "Agriculture et agro-industrie",
    shortTitle: "Agro-industrie",
    image: "/images/agriculture.webp",
    alt: "Agriculteur observant ses cultures dans un champ verdoyant.",
    intro: "Une approche de chaîne de valeur, de l’approvisionnement au marché, pour structurer des projets agro-industriels viables.",
    services: ["Chaînes de valeur", "Transformation agroalimentaire", "Études de marché", "Analyse des approvisionnements", "Financement des équipements", "Développement des exportations"],
    stakes: ["Sécurisation des intrants", "Transformation locale", "Accès au marché", "Résilience climatique"],
  },
  {
    slug: "infrastructures",
    title: "Infrastructures",
    shortTitle: "Infrastructures",
    image: "/images/infrastructure.webp",
    alt: "Vue aérienne d’un pont reliant un paysage urbain ouest-africain.",
    intro: "Des modèles économiques et financiers pour des équipements structurants, dans une logique de performance et de service public.",
    services: ["Transport et logistique", "Eau et assainissement", "Équipements publics", "Études de rentabilité", "Financement structuré", "Partenariats public-privé"],
    stakes: ["Besoin de long terme", "Allocation des risques", "Qualité du service", "Soutenabilité budgétaire"],
  },
  {
    slug: "institutions-publiques",
    title: "Secteur public et institutions",
    shortTitle: "Institutions",
    image: "/images/dakar.webp",
    alt: "Panorama contemporain de Dakar sous un ciel dégagé.",
    intro: "Une assistance à la décision et à la structuration de projets publics, ancrée dans les réalités économiques et institutionnelles.",
    services: ["Assistance technique", "Études socio-économiques", "Évaluation de politiques", "Structuration de projets publics", "Renforcement des capacités", "Appui à la décision"],
    stakes: ["Impact socio-économique", "Cadre institutionnel", "Financement public", "Redevabilité"],
  },
];

export const caseStudies = [
  { title: "Projet immobilier : faisabilité et montage financier", sector: "Immobilier", client: "Investisseur privé — identité confidentielle", image: "/images/construction.webp", mission: "Étude de faisabilité et structuration du plan de financement.", status: "Référence à valider" },
  { title: "Unité de transformation de mangues", sector: "Agro-industrie", client: "PME agroalimentaire sénégalaise", image: "/images/agriculture.webp", mission: "Analyse du marché, des approvisionnements et du modèle économique.", status: "Référence à valider" },
  { title: "Centrale solaire photovoltaïque", sector: "Énergie", client: "Investisseur privé du secteur énergétique", image: "/images/energy-solar.webp", mission: "Étude de rentabilité et analyse de scénarios de financement.", status: "Référence à valider" },
  { title: "Projet hôtelier : faisabilité économique", sector: "Immobilier", client: "Promoteur privé — identité confidentielle", image: "/images/partnership.webp", mission: "Étude de marché, scénarios d’exploitation et prévisions financières.", status: "Référence à valider" },
  { title: "Levée de fonds d’une PME agroalimentaire", sector: "Agro-industrie", client: "PME agroalimentaire sénégalaise", image: "/images/cabinet-africa.webp", mission: "Préparation du dossier investisseur et structuration de la démarche.", status: "Référence à valider" },
  { title: "Projet d’infrastructures et de PPP", sector: "Institutions", client: "Institution publique ouest-africaine", image: "/images/infrastructure.webp", mission: "Appui technique à la structuration économique et financière.", status: "Référence à valider" },
];

export const publications = [
  {
    slug: "preparer-etude-faisabilite",
    category: "Guide pratique",
    title: "Préparer une étude de faisabilité : 7 questions structurantes",
    summary: "Un cadre simple pour clarifier le marché, les hypothèses, les risques et le besoin de financement avant de lancer l’étude.",
    date: "À paraître",
    readTime: "6 min",
    image: "/images/finance-analysis.webp",
    status: "Contenu éditorial provisoire",
  },
  {
    slug: "financement-pme-afrique-ouest",
    category: "Décryptage financier",
    title: "Financement des PME : rendre un dossier plus lisible pour les partenaires",
    summary: "Les informations clés qui permettent d’ouvrir une discussion structurée avec une banque ou un investisseur.",
    date: "À paraître",
    readTime: "5 min",
    image: "/images/cabinet-africa.webp",
    status: "Contenu éditorial provisoire",
  },
  {
    slug: "risques-projet-solaire",
    category: "Analyse sectorielle",
    title: "Projet solaire : cartographier les risques avant la modélisation financière",
    summary: "Une lecture des principaux risques techniques, contractuels, commerciaux et financiers à intégrer dans les scénarios.",
    date: "À paraître",
    readTime: "7 min",
    image: "/images/energy-solar.webp",
    status: "Contenu éditorial provisoire",
  },
];

export const trainings = [
  "Ingénierie financière",
  "Études de faisabilité",
  "Business plan",
  "Modélisation financière",
  "Levée de fonds",
  "Évaluation d’entreprise",
  "Financement de projets",
  "Partenariats public-privé",
  "Gestion financière des PME",
  "Analyse des investissements",
].map((title, index) => ({
  title,
  format: ["Présentiel", "En ligne", "En entreprise", "Sur mesure"][index % 4],
  duration: "Durée à définir selon les objectifs",
  audience: index % 2 === 0 ? "Dirigeants, cadres financiers et équipes projet" : "Institutions, PME et professionnels de l’investissement",
  status: "Programme et intervenant à confirmer",
}));

export const mainNav = [
  { label: "Accueil", href: "/" },
  { label: "Le Cabinet", href: "/cabinet" },
  { label: "Nos Expertises", href: "/expertises" },
  { label: "Secteurs", href: "/secteurs" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Publications", href: "/publications" },
  { label: "Notre Équipe", href: "/equipe" },
  { label: "Formations", href: "/formations" },
  { label: "Carrières", href: "/carrieres" },
  { label: "Contact", href: "/contact" },
];

export const searchableLinks = [
  ...mainNav,
  ...expertises.map((item) => ({ label: item.title, href: `/expertises/${item.slug}` })),
  ...sectors.map((item) => ({ label: item.title, href: `/secteurs/${item.slug}` })),
  { label: "Soumettre un projet", href: "/soumettre-un-projet" },
  { label: "Prendre rendez-vous", href: "/contact?demande=rendez-vous" },
];

export const imageCredits = [
  { label: "Réunion professionnelle", href: "https://unsplash.com/photos/faEfWCdOKIg" },
  { label: "Professionnels africains", href: "https://unsplash.com/photos/M7ALc3UuX_g" },
  { label: "Énergie solaire", href: "https://unsplash.com/photos/dnUPzv-eytA" },
  { label: "Dakar", href: "https://unsplash.com/photos/rVUskjd0WRk" },
  { label: "Infrastructures", href: "https://unsplash.com/photos/xjqrUuUNs7o" },
  { label: "Agriculture", href: "https://unsplash.com/photos/1AoGjqdyDLU" },
];
