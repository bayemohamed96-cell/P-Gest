# ERP Logistique Pétrolière - Afrique de l'Ouest

Système ERP-lite spécialisé pour la logistique pétrolière en Afrique de l'Ouest, développé avec NestJS, Prisma, PostgreSQL et React.

## 🚀 Fonctionnalités Principales

### Backend (NestJS + Prisma)
- **Authentification JWT** avec RBAC (Admin, Manager, Operator)
- **API REST complète** pour toutes les entités métier
- **Calculs P&L automatiques** pour les lots de transport
- **Gestion des reliquats** fournisseurs
- **Relevés clients** avec soldes courants
- **Service de sauvegarde** Google Drive (stub)

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

## 👤 Comptes de Démonstration

- **Admin** : admin@example.com / password
- **Manager** : manager@example.com / password
- **Operator** : operator@example.com / password

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

## 📦 Structure du Projet

```
petroleum-erp/
├── src/                    # Backend NestJS
│   ├── auth/              # Authentification JWT
│   ├── lots/              # Gestion des lots
│   ├── customers/         # Gestion clients
│   ├── suppliers/         # Gestion fournisseurs
│   ├── services/          # Services métier
│   └── ...
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   └── contexts/      # Contextes React
│   └── ...
├── prisma/                # Schéma et migrations
└── README.md
```

## 🔧 API Endpoints

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription

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

## 🔒 Sécurité

- **JWT** avec expiration configurable
- **RBAC** : Admin, Manager, Operator
- **Validation** des données d'entrée
- **Hashage** des mots de passe (bcrypt)

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