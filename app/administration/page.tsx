import type { Metadata } from "next";
import Link from "next/link";
import { adminAuthConfigured, verifyAdminSession } from "../../lib/admin-auth";
import { getRecordCounts } from "../../lib/private-store";

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
  const modules = [
    ["Pages", "Contenus institutionnels et traductions", "12 modèles"], ["Expertises", "Services, FAQ et exemples de missions", "4 pôles"], ["Secteurs", "Enjeux et prestations sectorielles", "6 secteurs"], ["Profils", "Direction et consultants autorisés", "Validation requise"], ["Réalisations", "Portfolio, filtres et confidentialité", "Brouillons"], ["Publications", "Articles, rapports et téléchargements", "3 brouillons"], ["Formations", "Catalogue, programmes et sessions", "10 thèmes"], ["Carrières", "Offres, stages et candidatures", "Aucune offre active"], ["Médias", "Images et documents privés", "Stockage privé"], ["Référencement", "Titres, descriptions et redirections", "À compléter"], ["Traductions", "Flux français / anglais", "Structure prête"], ["Utilisateurs", "Rôles et autorisations", "6 rôles"],
  ];
  return (
    <section className="admin-page">
      <div className="admin-topbar">
        <div><span className="admin-logo">G•</span><div><strong>GEEF-SENEGAL</strong><small>Centre d’administration</small></div></div>
        <div><span>Session administrateur</span><form action="/api/admin/session/logout" method="post"><button type="submit">Se déconnecter</button></form></div>
      </div>
      <div className="admin-layout">
        <aside><nav><a className="active" href="#vue-ensemble">Vue d’ensemble</a><a href="#contenus">Contenus</a><a href="#demandes">Demandes</a><a href="#medias">Médias</a><a href="#utilisateurs">Utilisateurs</a><Link href="/">Voir le site public ↗</Link></nav><div><strong>Rôle actif</strong><span>Administrateur</span><small>Les autorisations détaillées sont contrôlées côté serveur.</small></div></aside>
        <main>
          <header id="vue-ensemble"><span className="eyebrow">Tableau de bord</span><h1>Vue d’ensemble.</h1><p>Suivez les contenus à valider et les demandes reçues.</p></header>
          {!totals.connected && <div className="admin-warning">Le stockage privé n’est pas connecté dans cet environnement. Les compteurs locaux ne sont pas persistants.</div>}
          <section id="demandes" className="admin-stat-grid"><article><span>Contacts</span><strong>{totals.contacts}</strong><small>Demandes enregistrées</small></article><article><span>Projets</span><strong>{totals.projects}</strong><small>Soumissions confidentielles</small></article><article><span>Newsletter</span><strong>{totals.subscribers}</strong><small>Inscriptions</small></article><article><span>À valider</span><strong>—</strong><small>File éditoriale à configurer</small></article></section>
          <section id="contenus" className="admin-section"><div className="admin-section-head"><div><h2>Gestion du site</h2><p>Modules prévus pour le CMS éditorial.</p></div><button type="button" className="button button-primary" disabled>Créer un contenu</button></div><div className="admin-module-grid">{modules.map(([title, description, status]) => <article key={title}><span aria-hidden="true">◇</span><div><h3>{title}</h3><p>{description}</p></div><strong>{status}</strong></article>)}</div></section>
          <section id="utilisateurs" className="admin-section"><h2>Rôles prévus</h2><div className="role-grid">{[["Super administrateur", "Tous les droits"], ["Administrateur", "Paramètres et contenus"], ["Éditeur", "Validation éditoriale"], ["Auteur", "Création de brouillons"], ["Responsable des demandes", "Contacts et projets"], ["Traducteur", "Versions linguistiques"]].map(([role, scope]) => <div key={role}><strong>{role}</strong><span>{scope}</span></div>)}</div></section>
        </main>
      </div>
    </section>
  );
}
