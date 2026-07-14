import Link from "next/link";
import { ReactNode } from "react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          {index < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  alt,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  alt?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`page-hero ${image ? "has-image" : ""}`}>
      {image && <img className="page-hero-image" src={image} alt={alt ?? ""} />}
      <div className="page-hero-overlay" aria-hidden="true" />
      <div className="flow-lines" aria-hidden="true"><i /><i /><i /></div>
      <div className="container page-hero-inner">
        <span className="eyebrow eyebrow-light">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading ${light ? "is-light" : ""} ${align === "center" ? "is-centered" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export function ProjectCTA({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`project-cta ${compact ? "is-compact" : ""}`}>
      <div className="cta-orb cta-orb-one" aria-hidden="true" />
      <div className="cta-orb cta-orb-two" aria-hidden="true" />
      <div className="container project-cta-inner">
        <div>
          <span className="eyebrow eyebrow-light">Parlons de votre ambition</span>
          <h2>Vous avez un projet à structurer ou à financer ?</h2>
          <p>Présentez-nous votre projet. Nos experts analyseront vos besoins et vous proposeront une démarche adaptée à vos objectifs.</p>
        </div>
        <div className="cta-actions">
          <Link className="button button-project" href="/soumettre-un-projet">Soumettre mon projet</Link>
          <Link className="button button-light-outline" href="/contact?demande=rendez-vous">Prendre rendez-vous</Link>
        </div>
      </div>
    </section>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="arrow-link" href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}
