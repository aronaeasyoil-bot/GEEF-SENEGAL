export type FinancialPartner = {
  id: string;
  name: string;
  role: string;
  country: string;
  description: string;
  image: string;
  alt: string;
};

export const financialPartnersCmsPath = "/__financial-partners__";
export const financialPartnersCmsKey = "financial.partners.collection";

export const defaultFinancialPartners: FinancialPartner[] = [
  {
    id: "rashid-al-shaibani",
    name: "Sheikh Rashid Al-Shaibani",
    role: "Partenaire financier",
    country: "Émirats arabes unis",
    description: "Partenaire engagé dans le développement de connexions d’investissement entre les marchés du Golfe et les projets africains.",
    image: "/images/financial-partner-rashid-al-shaibani.jpeg",
    alt: "Portrait de Sheikh Rashid Al-Shaibani.",
  },
  {
    id: "obaid-khalifa-qatami-alsuwaidi",
    name: "Sheikh Obaid Khalifa Qatami Alsuwaidi",
    role: "Partenaire financier",
    country: "Émirats arabes unis",
    description: "Partenaire contribuant au rapprochement des réseaux économiques et au développement d’opportunités de financement entre le Golfe et l’Afrique.",
    image: "/images/financial-partner-obaid-khalifa-qatami-alsuwaidi.jpeg",
    alt: "Portrait de Sheikh Obaid Khalifa Qatami Alsuwaidi.",
  },
  {
    id: "ali-al-khawlani",
    name: "Sheikh Ali Al Khawlani",
    role: "Partenaire financier",
    country: "Émirats arabes unis",
    description: "Partenaire mobilisé autour de la coopération économique, des réseaux d’affaires et de la mise en relation avec des investisseurs du Golfe.",
    image: "/images/financial-partner-ali-al-khawlani.jpeg",
    alt: "Portrait de Sheikh Ali Al Khawlani.",
  },
  {
    id: "dr-farooq",
    name: "Dr Farooq",
    role: "Partenaire financier",
    country: "Émirats arabes unis",
    description: "Partenaire accompagnant la structuration de relations d’affaires et d’opportunités d’investissement à dimension internationale.",
    image: "/images/financial-partner-dr-farooq.jpeg",
    alt: "Portrait de Dr Farooq.",
  },
];

export function parseFinancialPartners(value: unknown, fallback = defaultFinancialPartners): FinancialPartner[] {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return fallback;
    return parsed.filter((item): item is FinancialPartner =>
      Boolean(item && typeof item.id === "string" && typeof item.name === "string" && typeof item.image === "string"),
    ).map((item) => ({
      id: item.id,
      name: item.name,
      role: typeof item.role === "string" ? item.role : "Partenaire financier",
      country: typeof item.country === "string" ? item.country : "Émirats arabes unis",
      description: typeof item.description === "string" ? item.description : "",
      image: item.image,
      alt: typeof item.alt === "string" ? item.alt : `Portrait de ${item.name}.`,
    }));
  } catch {
    return fallback;
  }
}
