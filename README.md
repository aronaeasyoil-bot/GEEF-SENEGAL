# GEEF-SENEGAL SARL

Site institutionnel bilingue du Cabinet d’Études et d’Ingénierie Financières GEEF-SENEGAL, basé à Dakar.

## Contenu

- accueil institutionnel, expertises, secteurs, réalisations et publications ;
- équipe, formations, carrières, contact et version anglaise structurée ;
- formulaire confidentiel de soumission de projet en cinq étapes ;
- stockage privé des demandes et documents sur Vercel Blob ;
- tableau de bord protégé par session HTTP-only ;
- SEO, données structurées, sitemap, robots, Open Graph et pages juridiques ;
- guide PDF public sur la préparation d’une étude de faisabilité.

Les chiffres, références, biographies, partenaires et contenus signalés « à valider » ne doivent pas être présentés comme officiels avant approbation écrite du cabinet.

## Développement

Prérequis : Node.js 22.13 ou plus récent.

```bash
npm install
npm run dev
```

Contrôles :

```bash
npm run typecheck
npm test
npm run build:next
```

Le script `npm run build` conserve la sortie vinext/Cloudflare du projet Sites. Le déploiement Vercel utilise explicitement `next build` via `vercel.json`.

## Déploiement Vercel

1. Lier ou créer le projet : `vercel link`.
2. Créer un stockage privé : `vercel blob create-store geef-senegal-private --access private`.
3. Connecter ce stockage au projet afin que Vercel injecte automatiquement l’identité OIDC et `BLOB_STORE_ID`.
4. Ajouter `GEEF_ADMIN_PASSWORD_HASH` et `GEEF_ADMIN_SECRET` comme variables sensibles pour les environnements souhaités.
5. Déployer : `vercel --prod`.

Le mot de passe administrateur est stocké uniquement sous forme de SHA-256. Le secret de session doit contenir au moins 32 caractères. Les valeurs réelles ne doivent jamais être ajoutées au dépôt.

## Données et confidentialité

Les soumissions et pièces jointes sont enregistrées dans un Blob store privé. Les noms de fichiers ne servent jamais de clé de stockage. Les documents sont marqués `pending_scan` jusqu’à la connexion d’un service antivirus. L’accès administratif aux fichiers exige une session valide et impose `Cache-Control: private, no-store`.

Le stockage D1/R2 et les migrations Drizzle sont également conservés pour une éventuelle cible Cloudflare Sites. Sur Vercel, les routes publiques utilisent Vercel Blob.
