# Datako Diagnostic - Data & IA Readiness Compass

Outil de diagnostic en ligne permettant aux organisations d'evaluer leur maturite data et IA. Developpe par Datako.

## Stack technique

- **Frontend** : React + TypeScript + Vite
- **UI** : shadcn/ui + Tailwind CSS
- **Backend** : Supabase (base de donnees, authentification)
- **Fonctions serverless** : Netlify Functions
- **Animations** : Framer Motion

## Installation

```sh
git clone <REPO_URL>
cd datak-readiness-compass
npm install
```

### Developpement avec Netlify CLI

Pour lancer le serveur de dev avec les fonctions Netlify :

```sh
npm install -g netlify-cli
netlify dev
```

Le serveur demarre sur `http://localhost:9999` (avec proxy vers Vite sur le port 8080).

### Developpement sans Netlify

```sh
npm run dev
```

Le serveur demarre sur `http://localhost:8080` (sans les fonctions Netlify).

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur Vite uniquement |
| `netlify dev` | Serveur Vite + fonctions Netlify |
| `npm run build` | Build de production |
| `npm run build:dev` | Build en mode developpement |
| `npm run preview` | Preview du build |
| `npm run lint` | Linting ESLint |

## Structure du projet

```
src/
  components/
    diagnostic/           # Composants du diagnostic (formulaires, resultats)
    admin/                # Composants d'administration
    ui/                   # Composants UI reutilisables (shadcn/ui)
  data/                   # Questions et donnees statiques
  hooks/                  # Hooks React (useDiagnostic)
  integrations/supabase/  # Client et types Supabase
  lib/                    # Utilitaires
  pages/                  # Pages de l'application (Index, Admin, NotFound)
  types/                  # Types TypeScript
netlify/
  functions/              # Fonctions serverless Netlify
supabase/
  migrations/             # Migrations SQL
```

## Variables d'environnement

Creer un fichier `.env` a la racine :

```
VITE_SUPABASE_URL=<votre_url_supabase>
VITE_SUPABASE_PROJECT_ID=<votre_project_id>
VITE_SUPABASE_PUBLISHABLE_KEY=<votre_cle_anon>
SUPABASE_SERVICE_ROLE_KEY=<votre_service_role_key>
ADMIN_PASSWORD=<mot_de_passe_admin>
```

## Deploiement

Le projet est configure pour un deploiement sur Netlify. La configuration se trouve dans `netlify.toml` :

- **Build** : `npm run build` → dossier `dist/`
- **Fonctions** : `netlify/functions/`
- **Redirects SPA** : geres via `public/_redirects`
