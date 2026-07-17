import type { Metadata } from "next";
import Link from "next/link";
import { adminAuthConfigured, verifyAdminSession } from "../../lib/admin-auth";
import { getRecordCounts } from "../../lib/private-store";
import { AdminCms } from "../components/AdminCms";
import { AdminFinancialPartners } from "../components/AdminFinancialPartners";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

function Gate({ configured, error }: { configured: boolean; error?: boolean }) {
  return (
    <section className="admin-gate">
      <div className="admin-gate-card">
        <span className="admin-logo">G•</span>
        <span className="eyebrow">Espace sécurisé</span>
        <h1>Administration GEEF-SENEGAL</h1>
        {configured ? (
          <>
            <p>La gestion des contenus, demandes et documents est réservée aux personnes autorisées.</p>
            {error && <p className="form-error" role="alert">Le mot de passe est incorrect ou la session a expiré.</p>}
            <form className="admin-login-form" action="/api/admin/session" method="post">
              <label><span>Mot de passe administrateur</span><input name="password" type="password" autoComplete="current-password" required /></label>
              <button className="button button-primary" type="submit">Accéder au tableau de bord</button>
            </form>
            <small>La session est protégée par un cookie chiffré, HTTP-only et limité à douze heures.</small>
          </>
        ) : (
          <>
            <p>L’accès administratif est désactivé dans cet environnement. Il sera activé au déploiement avec des secrets qui ne sont jamais stockés dans le code source.</p>
            <Link className="button button-outline" href="/">Retour au site public</Link>
          </>
        )}
      </div>
    </section>
  );
}

export default async function AdministrationPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const configured = adminAuthConfigured();
  const authenticated = configured && await verifyAdminSession();
  const query = await searchParams;
  if (!authenticated) return <Gate configured={configured} error={query.erreur === "identifiants"} />;

  let totals = { contacts: 0, projects: 0, subscribers: 0, connected: false };
  try { totals = await getRecordCounts(); } catch { /* Surface the disconnected state without exposing the storage error. */ }
  return (
    <section className="admin-page">
      <div className="admin-topbar">
        <div><span className="admin-logo">G•</span><div><strong>GEEF-SENEGAL</strong><small>Centre d’administration</small></div></div>
        <div><span>Session administrateur</span><form action="/api/admin/session/logout" method="post"><button type="submit">Se déconnecter</button></form></div>
      </div>
      <div className="admin-layout">
        <aside><nav><a className="active" href="#vue-ensemble">Vue d’ensemble</a><a href="#partenaires-financiers">Partenaires financiers</a><a href="#editeur">Éditeur du site</a><a href="#demandes">Demandes reçues</a><Link href="/">Voir le site public ↗</Link></nav><div><strong>Accès privé</strong><span>Administrateur</span><small>La connexion et chaque modification sont vérifiées côté serveur.</small></div></aside>
        <main>
          <header id="vue-ensemble"><span className="eyebrow">Tableau de bord privé</span><h1>Pilotez votre site.</h1><p>Modifiez chaque section, ajoutez vos images, prévisualisez et publiez quand vous êtes prêt.</p></header>
          {!totals.connected && <div className="admin-warning">Le stockage privé n’est pas connecté dans cet environnement. Les compteurs locaux ne sont pas persistants.</div>}
          <section id="demandes" className="admin-stat-grid"><article><span>Contacts</span><strong>{totals.contacts}</strong><small>Demandes enregistrées</small></article><article><span>Projets</span><strong>{totals.projects}</strong><small>Soumissions confidentielles</small></article><article><span>Newsletter</span><strong>{totals.subscribers}</strong><small>Inscriptions</small></article><article><span>Mode éditorial</span><strong>Privé</strong><small>Brouillons invisibles au public</small></article></section>
          <AdminFinancialPartners />
          <AdminCms />
          <section className="admin-security-note"><div><span aria-hidden="true">✓</span><div><strong>Administration non publique</strong><p>Aucun lien n’est affiché sur le site, la page est exclue des moteurs de recherche et les données d’édition ne sont accessibles qu’après authentification.</p></div></div></section>
        </main>
      </div>
    </section>
  );
}
