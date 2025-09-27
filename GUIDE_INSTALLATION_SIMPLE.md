# 🚀 GUIDE INSTALLATION SIMPLE - ERP PÉTROLIER

## ❌ PROBLÈME IDENTIFIÉ
Vous êtes dans le mauvais dossier ! Vous êtes dans `client` mais vous devez être dans le dossier racine.

## ✅ SOLUTION ÉTAPE PAR ÉTAPE

### ÉTAPE 1 : Aller dans le bon dossier
Dans votre terminal PowerShell, tapez :
```bash
cd ..
```
Vous devriez maintenant être dans : `C:\Users\hp\Desktop\Prog\project-bolt-sb1-jomcb5aj\project`

### ÉTAPE 2 : Vérifier que vous êtes au bon endroit
Tapez :
```bash
dir
```
Vous devriez voir ces dossiers/fichiers :
- client/
- src/
- prisma/
- package.json
- .env

### ÉTAPE 3 : Installer les dépendances
```bash
npm install
```

### ÉTAPE 4 : Aller dans client et installer ses dépendances
```bash
cd client
npm install
cd ..
```

### ÉTAPE 5 : Configurer la base de données
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### ÉTAPE 6 : Lancer l'application
Ouvrez 2 terminaux :

**Terminal 1 (Backend) :**
```bash
npm run start
```

**Terminal 2 (Frontend) :**
```bash
cd client
npm run dev
```

### ÉTAPE 7 : Ouvrir dans le navigateur
Allez à : http://localhost:5173

**Identifiants :**
- Email : admin@example.com
- Mot de passe : password

## 🆘 COMMANDES DE DÉPANNAGE

Si ça ne marche pas :

```bash
# Nettoyer et réinstaller
rmdir /s node_modules
rmdir /s client\node_modules
npm install
cd client && npm install && cd ..

# Recréer la base de données
del prisma\dev.db
npx prisma migrate dev --name init
npm run seed
```

## 📍 RAPPEL IMPORTANT
- Toujours être dans le dossier racine (pas dans client/)
- Le dossier racine contient package.json ET le dossier prisma/
- Les commandes prisma se lancent depuis la racine, pas depuis client/