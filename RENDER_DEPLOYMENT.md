# Déploiement sur Render

Ce guide explique comment déployer l'application Web Scraper sur Render avec une base de données PostgreSQL persistante.

## Configuration automatique

Le fichier `render.yaml` configure automatiquement :
- **Service web** : Application Node.js
- **Base de données PostgreSQL** : Stockage persistant pour les pages scrapées
- **Variables d'environnement** : Lien automatique entre le service et la BD

## Étapes de déploiement

### 1. Préparer le code
```bash
git add .
git commit -m "Ready for Render deployment"
git push
```

### 2. Créer un compte Render
- Aller sur [render.com](https://render.com)
- S'inscrire avec GitHub
- Autoriser Render à accéder à ton repo

### 3. Créer le service
- Cliquer sur **"New +"** → **"Blueprint"**
- Sélectionner ton repository
- Render va détecter `render.yaml` automatiquement
- Cliquer sur **"Create Blueprint"**

### 4. Déploiement automatique
Render va automatiquement :
1. ✅ Créer une base de données PostgreSQL
2. ✅ Déployer l'application Node.js
3. ✅ Configurer la `DATABASE_URL` automatiquement
4. ✅ Lancer les migrations du schéma
5. ✅ Générer une URL publique

### 5. Migrations du schéma (première fois)
Si la base de données est vide, les tables seront créées automatiquement par Drizzle au premier démarrage.

Pour forcer une synchronisation du schéma :
```bash
npm run db:push
```

## URL de l'application
Après le déploiement, tu auras une URL publique comme :
```
https://web-scraper.onrender.com
```

## Configurer l'extension Firefox
Dans les paramètres de l'extension, utilise cette URL comme "Server URL".

## Logs et debugging
- Dans le dashboard Render, accéder au service "web-scraper"
- Cliquer sur **"Logs"** pour voir les logs en temps réel

## Stockage
La base de données PostgreSQL persiste les données entre redémarrages.
Stockage gratuit : 100 MB maximum sur le plan free.

## Variables d'environnement
Si tu as besoin d'ajouter d'autres variables (secrets, API keys, etc.) :
1. Aller dans **Settings** du service
2. Ajouter sous **"Environment Variables"**

## Coûts
- Web Service : Gratuit (pause après 15 min d'inactivité sur plan free)
- PostgreSQL : Gratuit (100 MB, 1 mois de stockage)

## Notes
- Le plan free de Render pause l'application après inactivité (redémarrage au prochain accès)
- Pour une app toujours active, passer au plan payant
- Les logs sont conservés pendant 24h
