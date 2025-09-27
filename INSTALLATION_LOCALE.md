# 🚀 Guide d'Installation Locale - ERP Logistique Pétrolière

## 📋 PRÉREQUIS

Avant de commencer, vous devez installer :

### 1. Node.js (obligatoire)
- Allez sur : https://nodejs.org
- Téléchargez la version LTS (recommandée)
- Installez en suivant les instructions
- **Vérifiez l'installation :** Ouvrez un terminal et tapez `node --version`

### 2. Git (optionnel mais recommandé)
- Allez sur : https://git-scm.com
- Téléchargez et installez

## 📁 ÉTAPE 1 : OUVRIR LE PROJET

### Sur Windows :
1. **Ouvrez l'Explorateur de fichiers**
2. **Naviguez** vers le dossier où vous avez extrait le projet
3. **Clic droit** dans le dossier (pas sur un fichier)
4. **Choisissez** "Ouvrir dans le terminal" ou "PowerShell ici"

### Alternative avec VS Code :
1. **Téléchargez VS Code** : https://code.visualstudio.com
2. **Installez-le**
3. **Ouvrez VS Code**
4. **Menu Fichier → Ouvrir le dossier**
5. **Sélectionnez** votre dossier projet
6. **Menu Terminal → Nouveau Terminal**

## 🔧 ÉTAPE 2 : INSTALLATION DES DÉPENDANCES

Dans le terminal, tapez ces commandes **une par une** :

```bash
# Vérifier que Node.js est installé
node --version
npm --version

# Installer les dépendances du serveur
npm install

# Aller dans le dossier client et installer ses dépendances
cd client
npm install
cd ..
```

## 🗄️ ÉTAPE 3 : CONFIGURATION DE LA BASE DE DONNÉES

```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et appliquer les migrations
npx prisma migrate dev --name init

# Peupler avec des données de test
npm run seed
```

## 🚀 ÉTAPE 4 : LANCER L'APPLICATION

### Méthode 1 : Commande unique (recommandée)
```bash
npm run dev
```

### Méthode 2 : Deux terminaux séparés
**Terminal 1 (Backend) :**
```bash
npm run backend:start
```

**Terminal 2 (Frontend) :**
```bash
cd client
npm run dev
```

## 🌐 ÉTAPE 5 : ACCÉDER À L'APPLICATION

1. **Ouvrez votre navigateur**
2. **Allez à :** http://localhost:5173
3. **Connectez-vous avec :**
   - Email : admin@example.com
   - Mot de passe : password

## ❌ RÉSOLUTION DES PROBLÈMES COURANTS

### Erreur "node n'est pas reconnu"
- Node.js n'est pas installé ou pas dans le PATH
- Réinstallez Node.js depuis nodejs.org

### Erreur "port déjà utilisé"
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173
# Tuez le processus avec son PID

# Ou utilisez ces commandes
npx kill-port 3000
npx kill-port 5173
```

### Erreur "module non trouvé"
```bash
# Supprimez les dossiers node_modules et réinstallez
rmdir /s node_modules
rmdir /s client\node_modules
npm install
cd client && npm install && cd ..
```

### Erreur de base de données
```bash
# Supprimez la base et recréez
del prisma\dev.db
npx prisma migrate dev --name init
npm run seed
```

### Erreur "prisma command not found"
```bash
# Installez Prisma globalement
npm install -g prisma
# Ou utilisez npx
npx prisma generate
```

## 📱 VÉRIFICATION QUE TOUT FONCTIONNE

Vous devriez voir :
1. **Page de connexion** avec logo camion
2. **Tableau de bord** après connexion
3. **Menu latéral** avec toutes les sections
4. **Données de démonstration** déjà présentes

## 🆘 AIDE SUPPLÉMENTAIRE

Si vous rencontrez des problèmes :
1. **Vérifiez** que vous êtes dans le bon dossier
2. **Assurez-vous** que Node.js est installé
3. **Redémarrez** votre terminal
4. **Suivez les étapes** dans l'ordre exact

## 📞 COMMANDES UTILES

```bash
# Voir les scripts disponibles
npm run

# Nettoyer et réinstaller tout
npm run clean-install

# Voir les logs détaillés
npm run dev --verbose

# Arrêter tous les processus Node
taskkill /f /im node.exe
```

---

**🎯 Objectif :** Avoir votre ERP fonctionnel sur http://localhost:5173