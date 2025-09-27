
# P-Gest

Guide rapide — setup local, variables d'environnement et déploiement

## Setup local

Pré-requis : Node.js LTS (18/20+), npm

1. Installer les dépendances (racine et client)

```powershell
# à la racine du projet
npm install

# côté client
cd client; npm install
```

2. Générer le client Prisma

```powershell
npx prisma generate
```

3. Appliquer les migrations et seed (SQLite local par défaut)

```powershell
npm run db:migrate
npm run seed
```

4. Démarrer les environnements de développement

```powershell
# API (depuis la racine)
npm run dev:api

# Frontend (nouveau terminal)
cd client
npm run dev
```

## Variables d'environnement (backend)

Créez un fichier `.env` à la racine (copiez `.env.example`) et ajustez :

```
DATABASE_URL="file:./prisma/dev.db" # local (sqlite) — en production utilisez Postgres
PORT=3000
CORS_ORIGIN=http://localhost:5173,https://TON-DOMAINE.vercel.app
```

Notes :
- `DATABASE_URL` en production devrait pointer vers une base Postgres (ex: `postgresql://USER:PASS@HOST:5432/DB`).
- `CORS_ORIGIN` peut contenir plusieurs origines séparées par des virgules.
- Authentification SUPPRIMÉE : aucun secret JWT n'est requis actuellement.

## Variables d'environnement (frontend)

Créez `client/.env` (copiez `client/.env.example`) et ajustez :

```
VITE_API_URL=http://localhost:3000
```

## Déploiement

- Frontend (Vercel)
	- Importez le repo dans Vercel, pointez la racine du projet sur le dossier `client`.
	- Build command : `npm run build`
	- Output directory : `dist`
	- Configurez la variable d'environnement `VITE_API_URL` vers l'URL de l'API en production.

- API (Railway ou autre PaaS)
	- Variables requises : `DATABASE_URL` (Postgres), `JWT_SECRET`, `CORS_ORIGIN`.
	- Build & start (exemple) :

```powershell
npm install && npx prisma generate && npm run build
npm run start:api
# Pour déployer les migrations (Railway) :
npx prisma migrate deploy
```

## Notes
- N'oubliez pas de régénérer le client Prisma après toute modification du `schema.prisma` : `npx prisma generate`.
- Le seed crée des données d'exemple (admin/password) pour développement local.

## 🚀 Fonctionnalités Principales

### Backend (NestJS + Prisma)
- **Authentification supprimée** pour accélérer le développement (toutes les routes sont publiques)
- **API REST complète** pour les entités métier
- **Calculs P&L automatiques** pour les lots de transport
- **Gestion des reliquats** fournisseurs
- **Relevés clients** avec soldes courants
- **Service de sauvegarde** Google Drive (stub / à implémenter)

### Frontend (React + TypeScript)
- **Interface d'administration** moderne et responsive
- **Éditeur de lots** avec calculs en temps réel
- **Tableaux de bord** avec métriques clés
- **Gestion des paiements** clients et fournisseurs
- **Export CSV/PDF** (préparé)

## 📊 Modèle de Données

### Entités Principales
- **Ressources** : Citernes, Tracteurs, Chauffeurs, Destinations
- **Partenaires** : Clients, Fournisseurs
- **Opérations** : Lots, Voyages, Commandes d'achat
- **Finance** : Factures, Paiements, Règles de tarification

### Calculs P&L
```
coût_achat = capacité_l × prix_achat_par_l
coût_fret = capacité_l × fret_par_l
manque_net = max(0, manque_l - tolérance_l)
qté_vendable = capacité_l - manque_net
recette = qté_vendable × prix_vente_par_l
taxes = transit_cfa + douane_cfa + divers_cfa
coût_total = coût_achat + coût_fret + taxes
marge = recette - coût_total
```

## 🛠️ Installation et Configuration

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Configuration
1. **Cloner le projet**
```bash
git clone <repository>
cd petroleum-erp
```

2. **Configurer la base de données**
```bash
# Créer une base PostgreSQL
createdb petroleum_erp

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

3. **Installer les dépendances**
```bash
# Backend
npm install

# Frontend
cd client && npm install
```

4. **Initialiser la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Peupler avec des données de test
npm run seed
```

### Démarrage

**Mode développement :**
```bash
# Backend (port 3000)
npm run start:dev

# Frontend (port 3001)
npm run client:dev
```

**Mode production :**
```bash
# Build
npm run build
npm run client:build

# Démarrage
npm run start:prod
```

## 👤 Comptes / Accès

L'authentification a été entièrement SUPPRIMÉE (code effacé). Aucune connexion ni token.

Pour réintroduire une sécurité minimale :
1. Recréer un module `auth` (controllers + service) avec endpoint `POST /auth/login`.
2. Réinstaller dépendances : `@nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs`.
3. Implémenter une stratégie JWT + guard appliqué aux contrôleurs sensibles.
4. Restaurer un `AuthContext` côté frontend, gestion des tokens (Authorization: Bearer).
5. Ajouter un middleware/guard pour restreindre l'écriture (POST/PUT/DELETE) si besoin rôle.
6. Mettre à jour README pour lister de nouveau les variables (`JWT_SECRET`).

## 📱 Utilisation

### Gestion des Lots
1. **Créer un lot** avec code unique et produit
2. **Ajouter des voyages** avec citernes, tracteurs, chauffeurs
3. **Saisir les données** : capacités, prix, frais, tolérances
4. **Calculer automatiquement** les marges et P&L
5. **Fermer le lot** pour verrouiller les totaux

### Suivi Financier
- **Relevés clients** : factures, paiements, soldes
- **Suivi fournisseurs** : commandes, réceptions, reliquats
- **Journal des paiements** : encaissements et décaissements

### Paramétrage
- **Règles de tarification** par destination
- **Règles de transport** (frais de fret)
- **Tolérances par défaut** (100L)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
```

## 📦 Structure du Projet (simplifiée)

```
project/
├── src/                    # Backend NestJS (sans auth)
│   ├── lots/
│   ├── customers/
│   ├── suppliers/
│   ├── destinations/
│   ├── drivers/
│   ├── truck-cisterns/
│   ├── truck-tractors/
│   ├── payments/
│   └── prisma/
├── client/                 # Frontend React
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── contexts/
└── prisma/                 # Schéma et migrations
```

## 🔧 API Endpoints

### (Authentification supprimée)
Endpoints /auth retirés.

### Lots
- `GET /lots` - Liste des lots
- `POST /lots` - Créer un lot
- `GET /lots/:id` - Détails d'un lot
- `POST /lots/:id/close` - Fermer un lot
- `GET /lots/:id/pnl` - Calcul P&L

### Clients
- `GET /customers` - Liste des clients
- `GET /customers/:id/statement` - Relevé client

### Fournisseurs
- `GET /suppliers` - Liste des fournisseurs
- `GET /suppliers/:id/statement` - Suivi fournisseur

## 🌍 Contexte Afrique de l'Ouest

- **Devise** : Franc CFA (XOF)
- **Produits** : Gasoil principalement
- **Destinations** : Ouagadougou, Bobo-Dioulasso, etc.
- **Réglementation** : Transit, douanes, taxes locales

## 🔒 Sécurité (actuelle vs future)

Actuel : AUCUNE protection (environnement de dev interne). Toutes les routes sont publiques.

Pour une version sécurisée envisagée :
- JWT avec expiration configurable
- RBAC basique (admin / opérateur)
- Validation d'entrée (déjà active via class-validator)
- Hashage des mots de passe (bcrypt) quand réintroduit

## 📈 Évolutions Futures

- **Application mobile** Flutter
- **Sauvegarde automatique** Google Drive
- **Rapports avancés** avec graphiques
- **Intégration comptable** externe
- **API webhooks** pour intégrations

## 🤝 Support

Pour toute question ou support technique, contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Licence** : Propriétaire  
**Développé pour** : Logistique pétrolière Afrique de l'Ouest