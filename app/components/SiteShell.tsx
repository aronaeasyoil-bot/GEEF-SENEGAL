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

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand ${light ? "brand-light" : ""}`} href="/" aria-label="GEEF-SENEGAL, accueil">
      <span className="brand-logo-frame">
        <img src="/images/logo-geef-senegal.jpeg" alt="GEEF Sénégal — Études et ingénierie financières" />
      </span>
    </Link>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    if (!normalized) return searchableLinks.slice(0, 8);
    return searchableLinks
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
      <button className="modal-scrim" type="button" onClick={onClose} aria-label="Fermer la recherche" />
      <div className="search-panel">
        <div className="modal-head">
          <div>
            <span className="eyebrow">Recherche interne</span>
            <h2 id="search-title">Que recherchez-vous ?</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <label className="search-field">
          <span className="sr-only">Rechercher dans le site</span>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Expertise, secteur, publication…"
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
            <p>Aucun résultat. Essayez un terme plus général.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CookieBanner() {
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
    <aside className="cookie-banner" aria-label="Gestion des cookies">
      <div>
        <strong>Votre confidentialité compte.</strong>
        <p>
          Le site utilise des cookies essentiels. Les outils de mesure d’audience ne seront activés qu’avec votre accord.
        </p>
        {details && (
          <p className="cookie-detail">
            Essentiels : fonctionnement et sécurité. Mesure d’audience : statistiques anonymisées, sous réserve de configuration et de consentement.
          </p>
        )}
      </div>
      <div className="cookie-actions">
        <button type="button" className="button button-ghost" onClick={() => setDetails((value) => !value)}>
          Paramétrer
        </button>
        <button type="button" className="button button-outline" onClick={() => choose("essential")}>
          Refuser
        </button>
        <button type="button" className="button button-primary" onClick={() => choose("all")}>
          Accepter
        </button>
      </div>
    </aside>
  );
}

function Assistant() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`site-assistant ${open ? "is-open" : ""}`}>
      {open && (
        <div className="assistant-panel" role="dialog" aria-label="Assistant d’orientation">
          <div className="assistant-head">
            <span aria-hidden="true">G•</span>
            <div>
              <strong>Comment vous orienter ?</strong>
              <small>Informations publiques uniquement</small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer l’assistant">×</button>
          </div>
          <p>Je peux vous conduire vers une expertise, un secteur ou le bon formulaire.</p>
          <div className="assistant-links">
            <Link href="/expertises">Explorer les expertises</Link>
            <Link href="/soumettre-un-projet">Présenter un projet</Link>
            <Link href="/contact?demande=rendez-vous">Prendre rendez-vous</Link>
          </div>
          <small className="assistant-note">
            Cet assistant ne fournit aucun conseil financier personnalisé et ne recueille aucune donnée confidentielle.
          </small>
        </div>
      )}
      <button
        className="assistant-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Ouvrir l’assistant d’orientation"
      >
        <span aria-hidden="true">G•</span>
        <span>Besoin d’aide ?</span>
      </button>
    </div>
  );
}

function NewsletterMini() {
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
      <label htmlFor="footer-email">Recevez nos futures analyses</label>
      <div>
        <input id="footer-email" name="email" type="email" placeholder="votre@email.com" required />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
        <button type="submit" aria-label="S’inscrire" disabled={state === "sending"}>→</button>
      </div>
      <label className="mini-consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>J’accepte la politique de confidentialité.</span>
      </label>
      <small aria-live="polite">
        {state === "sent" && "Inscription enregistrée. Merci."}
        {state === "error" && "L’inscription n’a pas abouti. Réessayez plus tard."}
      </small>
    </form>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isHome = pathname === "/";
  const isAdministration = pathname.startsWith("/administration");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const darkHeader = isHome && !scrolled && !mobileOpen;
  const primaryNav = mainNav.slice(0, 6);
  const secondaryNav = mainNav.slice(6);

  if (isAdministration) return <main id="contenu-principal" className="admin-shell-main">{children}</main>;

  return (
    <>
      <a className="skip-link" href="#contenu-principal">Aller au contenu</a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${darkHeader ? "is-over-hero" : ""}`}>
        <div className="utility-bar">
          <div className="container utility-inner">
            <span>Dakar, Sénégal</span>
            <div>
              <a href={`tel:${contact.phones[0].replaceAll(" ", "")}`}>{contact.phones[0]}</a>
              <button type="button" onClick={() => setSearchOpen(true)}>Rechercher</button>
              <Link href="/">FR</Link><span aria-hidden="true">|</span><Link href="/en">EN</Link>
              <Link href="/contact?demande=rendez-vous">Prendre rendez-vous</Link>
            </div>
          </div>
        </div>
        <div className="container nav-bar">
          <Brand light={darkHeader} />
          <nav className="desktop-nav" aria-label="Navigation principale">
            {primaryNav.map((item) => {
              if (item.href === "/expertises") {
                return (
                  <details className="nav-details" key={item.href}>
                    <summary>Nos Expertises <span aria-hidden="true">⌄</span></summary>
                    <div className="mega-menu mega-expertises">
                      <div className="mega-intro">
                        <span className="eyebrow">Expertises</span>
                        <h2>De l’étude à la structuration.</h2>
                        <p>Quatre pôles complémentaires pour sécuriser chaque décision clé.</p>
                        <Link href="/expertises">Toutes nos expertises →</Link>
                      </div>
                      <div className="mega-grid">
                        {expertises.map((expertise, index) => (
                          <Link href={`/expertises/${expertise.slug}`} key={expertise.slug}>
                            <span>0{index + 1}</span>
                            <strong>{expertise.shortTitle}</strong>
                            <small>{expertise.eyebrow}</small>
                          </Link>
                        ))}
                      </div>
                      <div className="mega-cta">
                        <strong>Un besoin spécifique ?</strong>
                        <p>Présentez le contexte et le niveau d’avancement de votre projet.</p>
                        <Link className="button button-project" href="/soumettre-un-projet">Soumettre un projet</Link>
                      </div>
                    </div>
                  </details>
                );
              }
              if (item.href === "/secteurs") {
                return (
                  <details className="nav-details" key={item.href}>
                    <summary>Secteurs <span aria-hidden="true">⌄</span></summary>
                    <div className="mega-menu mega-sectors">
                      <div className="mega-intro">
                        <span className="eyebrow">Secteurs</span>
                        <h2>Comprendre les réalités de chaque projet.</h2>
                        <Link href="/secteurs">Explorer les secteurs →</Link>
                      </div>
                      <div className="sector-link-grid">
                        {sectors.map((sector) => (
                          <Link href={`/secteurs/${sector.slug}`} key={sector.slug}>
                            <span>{sector.shortTitle}</span><span aria-hidden="true">↗</span>
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
              <summary>Plus <span aria-hidden="true">⌄</span></summary>
              <div className="small-menu">
                {secondaryNav.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden="true">↗</span></Link>)}
              </div>
            </details>
          </nav>
          <Link className="button button-project header-project" href="/soumettre-un-projet">Présentez votre projet</Link>
          <div className="mobile-header-actions">
            <div className="mobile-lang-switch" aria-label="Choisir la langue">
              <Link className={!pathname.startsWith("/en") ? "is-active" : ""} aria-current={!pathname.startsWith("/en") ? "page" : undefined} href="/">FR</Link>
              <Link className={pathname.startsWith("/en") ? "is-active" : ""} aria-current={pathname.startsWith("/en") ? "page" : undefined} href="/en">EN</Link>
            </div>
            <button className="mobile-menu-button" type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}>
              <span /> <span />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-drawer" aria-label="Navigation mobile">
            <button className="mobile-search" type="button" onClick={() => setSearchOpen(true)}>⌕ Rechercher dans le site</button>
            <div className="mobile-links">
              {mainNav.map((item, index) => <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>)}
            </div>
            <div className="mobile-actions">
              <Link className="button button-project" href="/soumettre-un-projet">Présentez votre projet</Link>
              <Link className="button button-outline" href="/contact?demande=rendez-vous">Prendre rendez-vous</Link>
            </div>
          </nav>
        )}
      </header>

      <CmsRuntime />
      <main id="contenu-principal">{children}</main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand-block">
            <Brand light />
            <p>Cabinet d’Études et d’Ingénierie Financières basé à Dakar.</p>
            <blockquote>« Une expertise avérée au service du développement durable »</blockquote>
          </div>
          <div className="footer-column">
            <strong>Navigation</strong>
            {mainNav.slice(1, 6).map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </div>
          <div className="footer-column">
            <strong>Expertises</strong>
            {expertises.map((item) => <Link href={`/expertises/${item.slug}`} key={item.slug}>{item.shortTitle}</Link>)}
          </div>
          <div className="footer-column footer-contact">
            <strong>Nous contacter</strong>
            <address>{contact.addressLine1}<br />{contact.addressLine2}</address>
            <a href={`tel:${contact.phones[0].replaceAll(" ", "")}`}>{contact.phones[0]}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <NewsletterMini />
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} GEEF-SENEGAL SARL</span>
          <div>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/conditions-utilisation">Conditions d’utilisation</Link>
          </div>
          <div className="photo-credits">
            <details>
              <summary>Crédits photos</summary>
              <div>{imageCredits.map((credit) => <a key={credit.href} href={credit.href} target="_blank" rel="noreferrer">{credit.label}</a>)}</div>
            </details>
          </div>
        </div>
      </footer>

      <a className="whatsapp-button" href="https://wa.me/221774000082" target="_blank" rel="noreferrer" aria-label="Contacter GEEF-SENEGAL sur WhatsApp">WA</a>
      <button className={`back-to-top ${scrolled ? "is-visible" : ""}`} type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Retour en haut">↑</button>
      <Assistant />
      <CookieBanner />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
