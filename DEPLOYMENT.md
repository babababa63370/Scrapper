# Deployment Guide

## Replit Deployment (Recommended)

### Step 1: Push to Git (Optional)
```bash
git add .
git commit -m "Prepare for deployment"
git push
```

### Step 2: Click "Publish" in Replit
1. Open your Replit project
2. Click the **Publish** button (top right)
3. Replit will build and deploy your app
4. You'll get a URL: `https://my-scraper.replit.dev`

### Step 3: Configure Extension
1. Update Firefox extension settings with your Replit URL
2. Test by scraping a page

## Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install deps
RUN npm install

# Copy source
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "run", "start"]
```

Build and run:

```bash
docker build -t web-scraper .
docker run -p 5000:5000 \
  -e DATABASE_URL=postgresql://... \
  -e NODE_ENV=production \
  web-scraper
```

## Render Deployment

Render est une plateforme moderne et facile à utiliser. Meilleure que Heroku pour les nouveaux projets.

### Étape 1 : Créer une Base de Données PostgreSQL

1. Allez sur [render.com](https://render.com)
2. Connectez-vous ou créez un compte
3. **New +** → **PostgreSQL**
   - **Name**: `web-scraper-db`
   - **Database**: `scraper`
   - **User**: `scraper_user`
   - **Region**: Sélectionnez le plus proche
   - **PostgreSQL Version**: 15
4. Cliquez **Create Database**
5. **Attendez** quelques minutes (la DB se crée)
6. Copiez la **External Database URL** (vous en aurez besoin)

### Étape 2 : Créer un Service Web

1. **New +** → **Web Service**
2. **Connectez votre dépôt Git**:
   - Si vous avez un dépôt GitHub: Connectez-le
   - Sinon: Utilisez le bouton **Deploy from Git** avec l'URL d'un nouveau dépôt
3. Configurez le service:
   - **Name**: `web-scraper`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Commencez avec Free (sinon Paid si vous avez besoin de plus)
4. Cliquez **Create Web Service**

### Étape 3 : Ajouter les Variables d'Environnement

Dans le dashboard du Service Web:

1. Allez à **Environment**
2. Ajoutez ces variables:

```
DATABASE_URL = [Copiez l'External Database URL de PostgreSQL ci-dessus]
NODE_ENV = production
PORT = 5000
```

3. Cliquez **Save**
4. Le service redéploie automatiquement

### Étape 4 : Initialiser la Base de Données

Une fois déployé, exécutez les migrations:

1. Dans le dashboard Render, allez à **Web Service** > **Shell**
2. Exécutez:

```bash
npm run db:push
```

Attendez que les migrations se terminent.

### Étape 5 : Tester

1. Visitez l'URL générée par Render (ex: `https://web-scraper-xxxxx.onrender.com`)
2. Vous devriez voir le dashboard
3. Testez l'endpoint: `https://web-scraper-xxxxx.onrender.com/health`
   - Réponse attendue: `{"status":"ok"}`

### Étape 6 : Configurer l'Extension Firefox

1. Installer l'extension Firefox (dossier `extension/`)
2. Cliquer l'icône de l'extension
3. **Server URL**: `https://web-scraper-xxxxx.onrender.com`
4. Cliquez **Save**
5. Testez en scrapant une page!

### Redéployer après des changements

**Automatique**: Si vous poussez vers Git, Render redéploie automatiquement

**Manuel**: Dashboard → Web Service → **Manual Deploy** → **Deploy latest commit**

### Conseils Render

**Gratuit**: Le plan Free fonctionne mais l'app s'éteint après 15 min d'inactivité
- Parfait pour tester!
- Upgrade vers Paid si vous avez besoin de 24/7

**Logs**: Dashboard → **Logs** pour déboguer

**Base de données**: PostgreSQL est toujours payante (~$7/mois)

**Domaine personnalisé**: Settings → **Custom Domain** → Suivez les instructions

### Troubleshooting Render

**"Deployment failed"**
```bash
# Vérifiez la compilation locale:
npm run build

# Vérifiez les logs:
# Dashboard → Logs
```

**"Database connection error"**
```
- Vérifiez DATABASE_URL dans Environment
- Relancez les migrations: npm run db:push
- Attendez que la DB soit prête (quelques minutes)
```

**App démarre puis crash**
```
- Vérifiez NODE_ENV=production
- Vérifiez PORT=5000
- Consultez les logs
```

---

## Railway / Heroku / Other PaaS

### Environment Variables

Set these in your platform's dashboard:

```
DATABASE_URL = postgresql://user:pass@host:port/db
PORT = 5000
NODE_ENV = production
```

### Build Commands

```bash
# Build
npm run build

# Start
npm run start
```

## Self-Hosted (VPS)

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm

### Installation

```bash
# Clone repo
git clone <your-repo>
cd web-scraper

# Install dependencies
npm install

# Setup database
createdb web_scraper

# Create .env
cat > .env << EOF
DATABASE_URL=postgresql://localhost/web_scraper
PORT=5000
NODE_ENV=production
EOF

# Build
npm run build

# Run
npm run start
```

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start app
pm2 start dist/index.cjs --name "web-scraper"

# Save PM2 config
pm2 save

# Enable on reboot
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name scraper.example.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo systemctl enable nginx
sudo systemctl restart nginx
```

## Database Migrations

When deploying to production, ensure database is up-to-date:

```bash
npm run db:push
```

This syncs your Drizzle schema with the database.

## Monitoring

### Health Check
```bash
curl https://your-app.com/health
```

Should return:
```json
{"status":"ok"}
```

### Logs

**Replit:** View in the "Output" tab

**Self-hosted:**
```bash
pm2 logs web-scraper
```

## Backup

### Database Backup (PostgreSQL)

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Backup Strategy
- Daily automatic backups
- Keep 7-14 days of backups
- Test restore process monthly

## Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `DATABASE_URL` credentials
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Update dependencies regularly (`npm audit fix`)
- [ ] Set up firewall rules
- [ ] Monitor logs for errors
- [ ] Backup database regularly
- [ ] Use strong passwords for admin accounts

## Troubleshooting

**Database connection error:**
```
Error: DATABASE_URL must be set
```
Set the environment variable:
```bash
export DATABASE_URL=postgresql://...
```

**Port already in use:**
```bash
# Use different port
PORT=3000 npm run start

# Or kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

**Build fails:**
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Support

For issues with deployment:
1. Check logs (`pm2 logs` or Replit output)
2. Verify environment variables are set
3. Test database connection: `psql $DATABASE_URL`
4. Check if port is accessible

## Next Steps

1. Deploy your app
2. Test extension with your production URL
3. Share dashboard with others (read-only by default)
4. Monitor for errors in logs
