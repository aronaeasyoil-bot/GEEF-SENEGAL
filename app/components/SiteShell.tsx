"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  contact,
  expertises,
  imageCredits,
  mainNav,
  searchableLinks,
  sectors,
} from "../../lib/site-data";
import { CmsRuntime } from "./CmsRuntime";

const englishNav = [
  { href: "/en", label: "Home" },
  { href: "/en/about", label: "About" },
  { href: "/en/expertise", label: "Expertise" },
  { href: "/en/sectors", label: "Sectors" },
  { href: "/en/case-studies", label: "Case Studies" },
  { href: "/en/insights", label: "Insights" },
  { href: "/en/our-team", label: "Our Team" },
  { href: "/en/training", label: "Training" },
  { href: "/en/careers", label: "Careers" },
  { href: "/en/contact", label: "Contact" },
];

function Brand({ light = false, english = false }: { light?: boolean; english?: boolean }) {
  return (
    <Link className={`brand ${light ? "brand-light" : ""}`} href={english ? "/en" : "/"} aria-label={english ? "GEEF-SENEGAL, home" : "GEEF-SENEGAL, accueil"}>
      <span className="brand-logo-frame">
        <img src="/images/logo-geef-senegal.jpeg" alt={english ? "GEEF-SENEGAL — Economic Studies and Financial Engineering" : "GEEF Sénégal — Études et ingénierie financières"} />
      </span>
    </Link>
  );
}

function SearchOverlay({ onClose, english = false }: { onClose: () => void; english?: boolean }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    const source = english ? englishNav : searchableLinks;
    if (!normalized) return source.slice(0, 8);
    return source
      .filter((item) => item.label.toLocaleLowerCase("fr").includes(normalized))
      .slice(0, 10);
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <button className="modal-scrim" type="button" onClick={onClose} aria-label={english ? "Close search" : "Fermer la recherche"} />
      <div className="search-panel">
        <div className="modal-head">
          <div>
            <span className="eyebrow">{english ? "Website search" : "Recherche interne"}</span>
            <h2 id="search-title">{english ? "What are you looking for?" : "Que recherchez-vous ?"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={english ? "Close" : "Fermer"}>
            ×
          </button>
        </div>
        <label className="search-field">
          <span className="sr-only">{english ? "Search the website" : "Rechercher dans le site"}</span>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={english ? "Expertise, sector, publication…" : "Expertise, secteur, publication…"}
          />
          <span aria-hidden="true">⌕</span>
        </label>
        <div className="search-results" aria-live="polite">
          {results.length ? (
            results.map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} onClick={onClose}>
                <span>{item.label}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))
          ) : (
            <p>{english ? "No results. Try a broader term." : "Aucun résultat. Essayez un terme plus général."}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CookieBanner({ english = false }: { english?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem("geef-cookie-choice"));
  }, []);

  function choose(choice: "essential" | "all") {
    window.localStorage.setItem("geef-cookie-choice", choice);
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <aside className="cookie-banner" aria-label={english ? "Cookie settings" : "Gestion des cookies"}>
      <div>
        <strong>{english ? "Your privacy matters." : "Votre confidentialité compte."}</strong>
        <p>
          {english ? "This website uses essential cookies. Audience measurement tools will only be enabled with your consent." : "Le site utilise des cookies essentiels. Les outils de mesure d’audience ne seront activés qu’avec votre accord."}
        </p>
        {details && (
          <p className="cookie-detail">
            {english ? "Essential: operation and security. Audience measurement: anonymised statistics, subject to configuration and consent." : "Essentiels : fonctionnement et sécurité. Mesure d’audience : statistiques anonymisées, sous réserve de configuration et de consentement."}
          </p>
        )}
      </div>
      <div className="cookie-actions">
        <button type="button" className="button button-ghost" onClick={() => setDetails((value) => !value)}>
          {english ? "Settings" : "Paramétrer"}
        </button>
        <button type="button" className="button button-outline" onClick={() => choose("essential")}>
          {english ? "Reject" : "Refuser"}
        </button>
        <button type="button" className="button button-primary" onClick={() => choose("all")}>
          {english ? "Accept" : "Accepter"}
        </button>
      </div>
    </aside>
  );
}

function Assistant({ english = false }: { english?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`site-assistant ${open ? "is-open" : ""}`}>
      {open && (
        <div className="assistant-panel" role="dialog" aria-label={english ? "Navigation assistant" : "Assistant d’orientation"}>
          <div className="assistant-head">
            <span aria-hidden="true">G•</span>
            <div>
              <strong>{english ? "How can we guide you?" : "Comment vous orienter ?"}</strong>
              <small>{english ? "Public information only" : "Informations publiques uniquement"}</small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={english ? "Close assistant" : "Fermer l’assistant"}>×</button>
          </div>
          <p>{english ? "I can guide you to the right expertise, sector or contact page." : "Je peux vous conduire vers une expertise, un secteur ou le bon formulaire."}</p>
          <div className="assistant-links">
            <Link href={english ? "/en/expertise" : "/expertises"}>{english ? "Explore our expertise" : "Explorer les expertises"}</Link>
            <Link href={english ? "/en/submit-a-project" : "/soumettre-un-projet"}>{english ? "Submit a project" : "Présenter un projet"}</Link>
            <Link href={english ? "/en/contact" : "/contact?demande=rendez-vous"}>{english ? "Request a meeting" : "Prendre rendez-vous"}</Link>
          </div>
          <small className="assistant-note">
            {english ? "This assistant does not provide personalised financial advice and does not collect confidential data." : "Cet assistant ne fournit aucun conseil financier personnalisé et ne recueille aucune donnée confidentielle."}
          </small>
        </div>
      )}
      <button
        className="assistant-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={english ? "Open navigation assistant" : "Ouvrir l’assistant d’orientation"}
      >
        <span aria-hidden="true">G•</span>
        <span>{english ? "Need help?" : "Besoin d’aide ?"}</span>
      </button>
    </div>
  );
}

function NewsletterMini({ english = false }: { english?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", body: new FormData(form) });
      if (!response.ok) throw new Error("request failed");
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }
  return (
    <form className="footer-newsletter" onSubmit={submit}>
      <label htmlFor="footer-email">{english ? "Receive our insights" : "Recevez nos analyses"}</label>
      <div>
        <input id="footer-email" name="email" type="email" placeholder={english ? "your@email.com" : "votre@email.com"} required />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
        <button type="submit" aria-label={english ? "Subscribe" : "S’inscrire"} disabled={state === "sending"}>→</button>
      </div>
      <label className="mini-consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>{english ? "I accept the privacy policy." : "J’accepte la politique de confidentialité."}</span>
      </label>
      <small aria-live="polite">
        {state === "sent" && (english ? "Subscription confirmed. Thank you." : "Inscription enregistrée. Merci.")}
        {state === "error" && (english ? "Subscription failed. Please try again later." : "L’inscription n’a pas abouti. Réessayez plus tard.")}
      </small>
    </form>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isEnglish = pathname.startsWith("/en");
  const isHome = pathname === "/" || pathname === "/en";
  const isAdministration = pathname.startsWith("/administration");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const darkHeader = isHome && !scrolled && !mobileOpen;
  const localizedNav = isEnglish ? englishNav : mainNav;
  const primaryNav = localizedNav.slice(0, 6);
  const secondaryNav = localizedNav.slice(6);

  if (isAdministration) return <main id="contenu-principal" className="admin-shell-main">{children}</main>;

  return (
    <>
      <a className="skip-link" href="#contenu-principal">{isEnglish ? "Skip to content" : "Aller au contenu"}</a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${darkHeader ? "is-over-hero" : ""}`}>
        <div className="utility-bar">
          <div className="container utility-inner">
            <span>Dakar, {isEnglish ? "Senegal" : "Sénégal"}</span>
            <div>
              <a href={`tel:${contact.phones[0].replaceAll(" ", "")}`}>{contact.phones[0]}</a>
              <button type="button" onClick={() => setSearchOpen(true)}>{isEnglish ? "Search" : "Rechercher"}</button>
              <Link href="/">FR</Link><span aria-hidden="true">|</span><Link href="/en">EN</Link>
              <Link href={isEnglish ? "/en/contact" : "/contact?demande=rendez-vous"}>{isEnglish ? "Request a meeting" : "Prendre rendez-vous"}</Link>
            </div>
          </div>
        </div>
        <div className="container nav-bar">
          <Brand light={darkHeader} english={isEnglish} />
          <nav className="desktop-nav" aria-label={isEnglish ? "Main navigation" : "Navigation principale"}>
            {primaryNav.map((item) => {
              if (item.href === "/expertises" || item.href === "/en/expertise") {
                return (
                  <details className="nav-details" key={item.href}>
                    <summary>{isEnglish ? "Our Expertise" : "Nos Expertises"} <span aria-hidden="true">⌄</span></summary>
                    <div className="mega-menu mega-expertises">
                      <div className="mega-intro">
                        <span className="eyebrow">{isEnglish ? "Expertise" : "Expertises"}</span>
                        <h2>{isEnglish ? "From assessment to structuring." : "De l’étude à la structuration."}</h2>
                        <p>{isEnglish ? "Four complementary capabilities to secure every key decision." : "Quatre pôles complémentaires pour sécuriser chaque décision clé."}</p>
                        <Link href={isEnglish ? "/en/expertise" : "/expertises"}>{isEnglish ? "Explore all expertise →" : "Toutes nos expertises →"}</Link>
                      </div>
                      <div className="mega-grid">
                        {expertises.map((expertise, index) => (
                          <Link href={isEnglish ? "/en/expertise" : `/expertises/${expertise.slug}`} key={expertise.slug}>
                            <span>0{index + 1}</span>
                            <strong>{isEnglish ? ["Studies & Feasibility", "Financial Engineering", "Strategic Advisory", "Training & Assistance"][index] : expertise.shortTitle}</strong>
                            <small>{isEnglish ? ["Informed decisions", "Financing structures", "Independent guidance", "Capacity building"][index] : expertise.eyebrow}</small>
                          </Link>
                        ))}
                      </div>
                      <div className="mega-cta">
                        <strong>{isEnglish ? "A specific need?" : "Un besoin spécifique ?"}</strong>
                        <p>{isEnglish ? "Tell us about your project context and current stage." : "Présentez le contexte et le niveau d’avancement de votre projet."}</p>
                        <Link className="button button-project" href={isEnglish ? "/en/submit-a-project" : "/soumettre-un-projet"}>{isEnglish ? "Submit a project" : "Soumettre un projet"}</Link>
                      </div>
                    </div>
                  </details>
                );
              }
              if (item.href === "/secteurs" || item.href === "/en/sectors") {
                return (
                  <details className="nav-details" key={item.href}>
                    <summary>{isEnglish ? "Sectors" : "Secteurs"} <span aria-hidden="true">⌄</span></summary>
                    <div className="mega-menu mega-sectors">
                      <div className="mega-intro">
                        <span className="eyebrow">{isEnglish ? "Sectors" : "Secteurs"}</span>
                        <h2>{isEnglish ? "Understand the realities of every project." : "Comprendre les réalités de chaque projet."}</h2>
                        <Link href={isEnglish ? "/en/sectors" : "/secteurs"}>{isEnglish ? "Explore sectors →" : "Explorer les secteurs →"}</Link>
                      </div>
                      <div className="sector-link-grid">
                        {sectors.map((sector) => (
                          <Link href={isEnglish ? "/en/sectors" : `/secteurs/${sector.slug}`} key={sector.slug}>
                            <span>{isEnglish ? ["Finance", "Energy", "Real Estate", "Agribusiness", "Infrastructure", "Public Sector"][sectors.indexOf(sector)] : sector.shortTitle}</span><span aria-hidden="true">↗</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              }
              return <Link className={pathname === item.href ? "active" : ""} href={item.href} key={item.href}>{item.label}</Link>;
            })}
            <details className="nav-details more-menu">
              <summary>{isEnglish ? "More" : "Plus"} <span aria-hidden="true">⌄</span></summary>
              <div className="small-menu">
                {secondaryNav.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden="true">↗</span></Link>)}
              </div>
            </details>
          </nav>
          <Link className="button button-project header-project" href={isEnglish ? "/en/submit-a-project" : "/soumettre-un-projet"}>{isEnglish ? "Submit your project" : "Présentez votre projet"}</Link>
          <div className="mobile-header-actions">
            <div className="mobile-lang-switch" aria-label={isEnglish ? "Choose language" : "Choisir la langue"}>
              <Link className={!pathname.startsWith("/en") ? "is-active" : ""} aria-current={!pathname.startsWith("/en") ? "page" : undefined} href="/">FR</Link>
              <Link className={pathname.startsWith("/en") ? "is-active" : ""} aria-current={pathname.startsWith("/en") ? "page" : undefined} href="/en">EN</Link>
            </div>
            <button className="mobile-menu-button" type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-label={mobileOpen ? (isEnglish ? "Close menu" : "Fermer le menu") : (isEnglish ? "Open menu" : "Ouvrir le menu")}>
              <span /> <span />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-drawer" aria-label={isEnglish ? "Mobile navigation" : "Navigation mobile"}>
            <button className="mobile-search" type="button" onClick={() => setSearchOpen(true)}>⌕ {isEnglish ? "Search the website" : "Rechercher dans le site"}</button>
            <div className="mobile-links">
              {localizedNav.map((item, index) => <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>)}
            </div>
            <div className="mobile-actions">
              <Link className="button button-project" href={isEnglish ? "/en/submit-a-project" : "/soumettre-un-projet"}>{isEnglish ? "Submit your project" : "Présentez votre projet"}</Link>
              <Link className="button button-outline" href={isEnglish ? "/en/contact" : "/contact?demande=rendez-vous"}>{isEnglish ? "Request a meeting" : "Prendre rendez-vous"}</Link>
            </div>
          </nav>
        )}
      </header>

      <CmsRuntime />
      <main id="contenu-principal">{children}</main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand-block">
            <Brand light english={isEnglish} />
            <p>{isEnglish ? "Economic Studies and Financial Engineering Firm based in Dakar." : "Cabinet d’Études et d’Ingénierie Financières basé à Dakar."}</p>
            <blockquote>{isEnglish ? "“Proven expertise serving sustainable development”" : "« Une expertise avérée au service du développement durable »"}</blockquote>
          </div>
          <div className="footer-column">
            <strong>{isEnglish ? "Navigation" : "Navigation"}</strong>
            {localizedNav.slice(1, 6).map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </div>
          <div className="footer-column">
            <strong>{isEnglish ? "Expertise" : "Expertises"}</strong>
            {expertises.map((item, index) => <Link href={isEnglish ? "/en/expertise" : `/expertises/${item.slug}`} key={item.slug}>{isEnglish ? ["Studies & Feasibility", "Financial Engineering", "Strategic Advisory", "Training & Assistance"][index] : item.shortTitle}</Link>)}
          </div>
          <div className="footer-column footer-contact">
            <strong>{isEnglish ? "Contact us" : "Nous contacter"}</strong>
            <address>{contact.addressLine1}<br />{contact.addressLine2}</address>
            <a href={`tel:${contact.phones[0].replaceAll(" ", "")}`}>{contact.phones[0]}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <NewsletterMini english={isEnglish} />
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} GEEF-SENEGAL SARL</span>
          <div>
            <Link href={isEnglish ? "/en/about" : "/mentions-legales"}>{isEnglish ? "Legal information" : "Mentions légales"}</Link>
            <Link href={isEnglish ? "/en/about" : "/confidentialite"}>{isEnglish ? "Privacy" : "Confidentialité"}</Link>
            <Link href={isEnglish ? "/en/about" : "/cookies"}>Cookies</Link>
            <Link href={isEnglish ? "/en/about" : "/conditions-utilisation"}>{isEnglish ? "Terms of use" : "Conditions d’utilisation"}</Link>
          </div>
          <div className="photo-credits">
            <details>
              <summary>{isEnglish ? "Photo credits" : "Crédits photos"}</summary>
              <div>{imageCredits.map((credit) => <a key={credit.href} href={credit.href} target="_blank" rel="noreferrer">{credit.label}</a>)}</div>
            </details>
          </div>
        </div>
      </footer>

      <a className="whatsapp-button" href="https://wa.me/221774000082" target="_blank" rel="noreferrer" aria-label={isEnglish ? "Contact GEEF-SENEGAL on WhatsApp" : "Contacter GEEF-SENEGAL sur WhatsApp"}>WA</a>
      <button className={`back-to-top ${scrolled ? "is-visible" : ""}`} type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={isEnglish ? "Back to top" : "Retour en haut"}>↑</button>
      <Assistant english={isEnglish} />
      <CookieBanner english={isEnglish} />
      {searchOpen && <SearchOverlay english={isEnglish} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
