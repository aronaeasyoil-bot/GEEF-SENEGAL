import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { SiteShell } from "./components/SiteShell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "geef-senegal.example";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/images/geef-social-preview-2026.jpeg", base).toString();
  return {
    metadataBase: base,
    title: { default: "GEEF-SENEGAL | Cabinet d’Études et d’Ingénierie Financières", template: "%s | GEEF-SENEGAL" },
    description: "Études économiques, ingénierie financière, structuration de financements et conseil stratégique à Dakar.",
    keywords: ["cabinet ingénierie financière Sénégal", "étude de faisabilité Dakar", "business plan Sénégal", "structuration financière Afrique", "financement de projets Sénégal"],
    openGraph: { type: "website", locale: "fr_SN", siteName: "GEEF-SENEGAL SARL", title: "GEEF-SENEGAL — Transformer les projets ambitieux en investissements solides", description: "Études, ingénierie financière et conseil stratégique au service de projets durables.", images: [{ url: socialImage, width: 1536, height: 1024, alt: "Accueil institutionnel de GEEF-SENEGAL — Études et ingénierie financières" }] },
    twitter: { card: "summary_large_image", title: "GEEF-SENEGAL", description: "Études et ingénierie financières à Dakar.", images: [socialImage] },
    robots: { index: true, follow: true },
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GEEF-SENEGAL SARL",
  description: "Cabinet d’Études et d’Ingénierie Financières",
  email: "Geef-Senegal@geef.pro",
  telephone: "+221774000082",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Immeuble Serigne Saliou Mbacké, 7C, VDN Sud Foire",
    addressLocality: "Dakar",
    addressCountry: "SN",
  },
  areaServed: ["Sénégal", "Afrique"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${manrope.variable} ${sourceSerif.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
