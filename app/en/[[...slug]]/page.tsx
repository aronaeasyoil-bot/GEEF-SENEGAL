import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/Primitives";

type EnglishPage = {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  sections: { title: string; text: string; items?: string[] }[];
};

const brochureUrl = "/documents/brochure-institutionnelle-geef-senegal-2026.pdf";

const pages: Record<string, EnglishPage> = {
  home: {
    eyebrow: "Economic Studies & Financial Engineering",
    title: "Turning ambitious projects into sound, sustainable investments.",
    intro: "GEEF-SENEGAL supports companies, public institutions, investors and development partners in assessing, structuring, financing and delivering projects in Senegal and across Africa.",
    image: "/images/hero-team.webp",
    sections: [
      { title: "Financial expertise serving your ambitions", text: "We deliver reliable studies, design appropriate financing structures and guide decision-makers through complex strategic choices.", items: ["Economic and financial studies", "Financial engineering", "Strategic advisory", "Training and technical assistance"] },
      { title: "A rigorous, decision-focused method", text: "Every assignment starts with a clear decision, explicit assumptions and practical deliverables.", items: ["Understand the project", "Collect and analyse data", "Assess scenarios", "Structure the financial solution", "Support implementation"] },
      { title: "Local insight, international reach", text: "Our Dakar-based team combines knowledge of African markets with international financial standards and a strong network of partners in Africa and the Gulf." },
    ],
  },
  about: {
    eyebrow: "About GEEF-SENEGAL",
    title: "Local insight. Structured thinking. International outlook.",
    intro: "An independent financial advisory firm committed to clarity, integrity and sustainable economic impact.",
    sections: [
      { title: "Our mission", text: "Help public and private decision-makers transform ideas into viable, financeable and implementable projects." },
      { title: "Our vision", text: "Become a trusted African reference for economic studies, investment structuring and strategic financial advisory." },
      { title: "Our values", text: "Professional integrity guides every engagement. Our recommendations remain independent, evidence-based and focused on the client’s long-term interests.", items: ["Integrity", "Excellence", "Confidentiality", "Innovation", "Measurable impact"] },
    ],
  },
  expertise: {
    eyebrow: "Our Expertise",
    title: "From feasibility assessment to financial structuring.",
    intro: "Four complementary areas of expertise to secure each key decision throughout the project lifecycle.",
    sections: [
      { title: "Economic and financial studies", text: "Market studies, feasibility assessments, business plans, financial modelling and cost-benefit analysis designed to test project viability." },
      { title: "Financial engineering", text: "Financing strategies, capital structures, debt capacity analysis and preparation of investor-ready documentation." },
      { title: "Strategic advisory", text: "Independent diagnostics, investment appraisal, valuation, restructuring and growth strategy." },
      { title: "Training and technical assistance", text: "Practical programmes and hands-on support built around the real operational needs of teams and institutions." },
    ],
  },
  sectors: {
    eyebrow: "Our Sectors",
    title: "Sector knowledge makes financial analysis more relevant.",
    intro: "We connect market, operational, regulatory and financial perspectives across priority sectors.",
    sections: [
      { title: "Priority sectors", text: "Our multidisciplinary approach adapts to the economics and risk profile of every industry.", items: ["Banking, finance and microfinance", "Energy and natural resources", "Real estate and construction", "Agriculture and agribusiness", "Infrastructure and public-private partnerships", "Public institutions and development programmes"] },
      { title: "A tailored analytical framework", text: "For every sector, we examine demand, competition, operating assumptions, regulation, investment requirements, risks and financing capacity." },
    ],
  },
  "case-studies": {
    eyebrow: "Track Record",
    title: "Practical solutions for high-impact projects.",
    intro: "Representative assignment formats presented with strict respect for client confidentiality.",
    sections: [
      { title: "Feasibility and investment studies", text: "Assessment of market potential, technical assumptions, operating models, financial projections and key risk factors." },
      { title: "Financing and restructuring", text: "Review of funding requirements, cash-flow capacity and financing options to support sustainable development." },
      { title: "Institutional support", text: "Strategic diagnostics, capacity building, operational road maps and monitoring frameworks for public and private organisations." },
    ],
  },
  insights: {
    eyebrow: "Insights & Publications",
    title: "Useful perspectives for informed decisions.",
    intro: "Economic notes, sector analyses, practical guides and firm news for decision-makers and project teams.",
    sections: [
      { title: "Economic and financial analysis", text: "Clear, evidence-based perspectives on markets, investment conditions and financing trends affecting Senegal and Africa." },
      { title: "Practical resources", text: "Guides designed to help project sponsors prepare feasibility studies, financing applications and investor presentations." },
      { title: "GEEF-SENEGAL news", text: "Updates on partnerships, training programmes, institutional activities and the development of our international network." },
    ],
  },
  "our-team": {
    eyebrow: "Our Team",
    title: "Multidisciplinary expertise for complex decisions.",
    intro: "Finance, economics, project engineering, law and taxation are combined according to each assignment.",
    sections: [
      { title: "Executive leadership", text: "Seybanou Ly Mbacké, Chief Executive Officer of GEEF-SENEGAL, brings cross-functional experience in banking, international finance, investment, guarantees, microfinance and institutional advisory." },
      { title: "A flexible expert network", text: "Our assignments mobilise experienced consultants and specialised partners according to the sector, technical requirements and geographic scope of each project." },
      { title: "International cooperation", text: "GEEF-SENEGAL works with the Gulf Africa Investment Chamber to connect African opportunities with investment and financing networks in the Gulf region." },
    ],
  },
  training: {
    eyebrow: "Training",
    title: "Practical skills for stronger financial decisions.",
    intro: "In-person, online, in-company and tailored programmes built around real professional situations.",
    sections: [
      { title: "Core programmes", text: "Training modules combine concise theory, practical tools, case studies and exercises.", items: ["Financial analysis", "Business planning", "Project finance", "Investment appraisal", "Risk management", "Financial modelling"] },
      { title: "Tailored delivery", text: "Content, duration and learning outcomes are adapted to the participants’ roles, experience and organisational priorities." },
      { title: "Technical assistance", text: "Training can be extended through coaching, implementation support and the development of internal tools and procedures." },
    ],
  },
  careers: {
    eyebrow: "Careers",
    title: "Bring your expertise to meaningful projects.",
    intro: "We welcome applications from professionals, consultants, interns and technical partners who share our standards.",
    sections: [
      { title: "What we value", text: "Analytical rigour, professional integrity, clear communication, teamwork and a genuine interest in African economic development." },
      { title: "Ways to collaborate", text: "Depending on current needs, GEEF-SENEGAL may engage permanent staff, interns, independent consultants and sector specialists." },
      { title: "Submit an application", text: "Send a concise profile, your areas of expertise and relevant experience to contact@geefsenegal.com." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Start with a clear conversation.",
    intro: "Tell us about your context, the decision you need to make and your project timeline.",
    sections: [
      { title: "GEEF-SENEGAL SARL", text: "Dakar, Senegal · contact@geefsenegal.com · +221 77 400 00 82" },
      { title: "Request a meeting", text: "Our team will review your request and guide you towards the most appropriate expertise and next step." },
      { title: "Confidentiality", text: "Please avoid sending sensitive documents by ordinary email before an appropriate confidential exchange channel has been agreed." },
    ],
  },
  "submit-a-project": {
    eyebrow: "Submit a Project",
    title: "Give us the information needed to understand your ambition.",
    intro: "A structured and confidential first step to assess your needs and identify the right support.",
    sections: [
      { title: "Prepare your submission", text: "Describe the project, its location, current stage, target market, estimated investment and the decision for which you need support." },
      { title: "Our review", text: "The team examines the strategic, market and financial context before proposing an appropriate scope of work." },
      { title: "Start securely", text: "Use our project submission page in French or contact our team in English. Confidential documents will only be requested through an appropriate channel." },
    ],
  },
  brochure: {
    eyebrow: "GEEF-SENEGAL · 2026 Edition",
    title: "Our corporate brochure",
    intro: "Explore our firm, expertise, methodology and commitment to sound, sustainable projects.",
    sections: [],
  },
};

const aliases: Record<string, string> = {
  expertises: "expertise", réalisations: "case-studies", realisations: "case-studies",
  publications: "insights", team: "our-team", equipe: "our-team", formations: "training",
  carrieres: "careers", "soumettre-un-projet": "submit-a-project",
};

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const requested = slug?.[0] ?? "home";
  const key = aliases[requested] ?? requested;
  const page = pages[key] ?? pages.home;
  const path = key === "home" ? "/en" : `/en/${key}`;
  return { title: page.title, description: page.intro, alternates: { canonical: path, languages: { "fr-SN": "/", en: path } } };
}

function EnglishProjectCta() {
  return (
    <section className="project-cta is-compact">
      <div className="container project-cta-inner">
        <div><span className="eyebrow eyebrow-light">Let’s discuss your ambition</span><h2>Do you have a project to structure or finance?</h2><p>Share your objectives with us. Our experts will review your needs and propose an appropriate approach.</p></div>
        <div className="cta-actions"><Link className="button button-project" href="/en/submit-a-project">Submit your project</Link><Link className="button button-light-outline" href="/en/contact">Contact our team</Link></div>
      </div>
    </section>
  );
}

export default async function EnglishPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const requested = slug?.[0] ?? "home";
  const key = aliases[requested] ?? requested;
  const page = pages[key] ?? pages.home;

  if (key === "brochure") {
    return (
      <>
        <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro}><a className="button button-project" href={brochureUrl} download="GEEF-SENEGAL-Corporate-Brochure-2026.pdf">Download the brochure ↓</a></PageHero>
        <section className="section brochure-section"><div className="container"><div className="brochure-toolbar"><div><span className="eyebrow">Online reading</span><h2>Read the brochure without leaving our website</h2></div><div><a className="button button-primary" href={brochureUrl} download="GEEF-SENEGAL-Corporate-Brochure-2026.pdf">Download the PDF</a><Link className="button button-outline" href="/en/contact">Contact us</Link></div></div><div className="brochure-viewer"><iframe src={`${brochureUrl}#view=FitH&toolbar=1&navpanes=0`} title="GEEF-SENEGAL corporate brochure 2026" /></div><p className="brochure-fallback">If the document is not displayed by your browser, <a href={brochureUrl} download="GEEF-SENEGAL-Corporate-Brochure-2026.pdf">download the brochure directly</a>.</p></div></section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} image={page.image} alt={page.image ? "Professional team collaborating around a conference table." : undefined}>
        <Link className="button button-project" href="/en/contact">Contact GEEF-SENEGAL</Link>
        {key === "home" && <Link className="button button-light-outline" href="/en/brochure">View our corporate brochure</Link>}
      </PageHero>
      <section className="section english-content-section">
        <div className="container english-content-grid">
          {page.sections.map((section, index) => (
            <article key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
            </article>
          ))}
        </div>
      </section>
      <EnglishProjectCta />
    </>
  );
}
