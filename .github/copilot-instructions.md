## Contexte rapide

Monorepo full‑stack : backend NestJS (TypeScript) dans `src/`, client React + Vite dans `client/`, et Prisma dans `prisma/` (client & migrations). L'application gère des "lots" de transport, facturation et paiements.

## Architecture et flux importants

- Backend (NestJS) : modules en `src/<resource>/*` (ex : `src/lots/`, `src/auth/`). Fichiers clés : `src/app.module.ts`, `src/auth/jwt-auth.guard.ts`, `src/auth/jwt.strategy.ts`.
- Base de données : `prisma/schema.prisma` (modèles, enums comme `Role`, `TripStatus`, `POStatus`, etc.). Le fichier mappe les tables via `@@map`.
- Client : `client/src/` contient pages, composants et services. Les appels HTTP passent par `client/src/services/apiService.ts`. L'authentification côté client est gérée par `client/src/contexts/AuthContext.tsx`.

Flux typique : le client appelle les endpoints REST exposés par les controllers NestJS (`src/*/*.controller.ts`) ; la logique métier est dans `*.service.ts` ; la persistance est orchestrée via `PrismaService` (voir `src/prisma/`).

## Commandes et workflows réels (exemples observés)

- Installer et setup initial (root) :
  - `npm install`
  - `cd client && npm install`
  - `npx prisma generate`
  - `npx prisma migrate dev --name init` (vérifier `DATABASE_URL`)
  - `npm run seed` ou `npx tsx prisma/seed.ts`
- Développement :
  - Backend dev : `npm run start:dev` (ou `npm run backend:dev` selon contexte)
  - Frontend dev : `npm run dev` (remote to `client` script via root `dev`) -> runs `vite`
- Build / production :
  - `npm run build` (backend tsc + client vite build via `client:build`)
  - `npm run start` to run built backend (`node dist/main.js`)

Note : le README suggère PostgreSQL mais `prisma/schema.prisma` utilise `provider = "sqlite"` by default — toujours vérifier `prisma/schema.prisma` et la variable `DATABASE_URL` avant d'exécuter des migrations.

## Conventions projet (à suivre lors de contributions)

- Structure NestJS : `<resource>.controller.ts` (API surface), `<resource>.service.ts` (logique), `<resource>.module.ts` (exports/imports). DTOs sont sous `dto/` (ex: `src/lots/dto/lot.dto.ts`).
- Prisma : utilisez `prisma/schema.prisma` pour modifier le schéma, puis `npx prisma migrate dev --name <desc>` + `npx prisma generate`. Gardez les migrations dans `prisma/migrations/`.
- Enums et mapping : les enums (Role, Product, POStatus...) dictent les états métier ; tables peuvent avoir `@@map` — respecter les noms existants pour éviter incohérences SQL.
- Seed : le script de peuplement est `prisma/seed.ts` et peut être lancé via `npm run seed` (root) ou `npx tsx prisma/seed.ts`.

## Points de vigilance spécifiques

- Auth & RBAC : JWT + rôles (ADMIN, MANAGER, OPERATOR). Contrôles d'accès se trouvent dans `src/auth/*` (gardes et strategy). Modifier les règles d'accès en ciblant `jwt-auth.guard.ts` et les décorateurs dans les controllers.
- Calculs P&L et business logic : répartis dans `src/lots/` (services). Eviter de dupliquer la logique dans le client ; le serveur est la source de vérité.
- Mismatch docs vs code : README mentionne PostgreSQL et scripts de test (`npm run test`) ; vérifiez `package.json` et `prisma/schema.prisma` avant d'exécuter.

## Exemples rapides pour l'IA

- Pour ajouter un endpoint de lecture de soldes clients :
  - Backend : ajouter `customers.controller.ts` (GET `/customers/:id/statement`) -> appeler `customers.service.ts` -> requête Prisma sur `Invoice` + `PaymentIn`.
  - Client : ajouter `client/src/pages/CustomerStatementPage.tsx` et utiliser `client/src/services/apiService.ts` pour fetch.
- Pour une migration de schéma : modifier `prisma/schema.prisma`, puis exécuter `npx prisma migrate dev --name add-xxx` et commit `prisma/migrations/`.

## Où regarder en priorité

- `src/app.module.ts` (liste des modules importés)
- `prisma/schema.prisma` (modèle de données, enums)
- `prisma/seed.ts` (données de départ)
- `client/src/services/apiService.ts` et `client/src/contexts/AuthContext.tsx` (modèle d'intégration client->API)
- `package.json` (scripts utiles: `start:dev`, `dev`, `setup`, `seed`, `build`, `client:build`)

Si une section est ambiguë ou si vous voulez que j'ajoute des snippets précis (exemples de guards, d'API ou de migrations), dites‑moi lesquelles et j'itérerai.
