# Deployment Instructies voor MindDumper

## Optie 1: Via Vercel Dashboard (Makkelijkste)

1. **Ga naar Vercel Dashboard**
   - Open https://vercel.com/dashboard
   - Log in met je account

2. **Upload Project Folder**
   - Klik op "Add New..." → "Project"
   - Kies "Upload Folder"
   - Sleep de `minddumper-app` folder naar de upload zone
   - Vercel detecteert automatisch dat het een Next.js project is

3. **Deploy**
   - Klik op "Deploy"
   - Wacht 2-3 minuten
   - Je krijgt een URL zoals: `minddumper-app.vercel.app`

## Optie 2: Via GitHub (Voor automatische updates)

1. **GitHub Login** (eenmalig)
   ```bash
   gh auth login
   ```
   - Kies "GitHub.com"
   - Kies "Login with a web browser"
   - Volg de instructies

2. **Create & Push Repository**
   ```bash
   cd "/Users/janbuskens/Library/CloudStorage/Dropbox/To Backup/Baas Over Je Tijd/Software/Minddumper/minddumper-app"
   gh repo create minddumper-app --public --source=. --remote=origin --push
   ```

3. **Connect to Vercel**
   - Ga naar https://vercel.com/dashboard
   - Klik "Import Git Repository"
   - Selecteer je nieuwe `minddumper-app` repo
   - Deploy!

## Optie 3: Via Vercel CLI

1. **Login** (eenmalig)
   ```bash
   npx vercel login
   ```

2. **Deploy**
   ```bash
   cd "/Users/janbuskens/Library/CloudStorage/Dropbox/To Backup/Baas Over Je Tijd/Software/Minddumper/minddumper-app"
   npx vercel
   ```

3. **Production Deploy**
   ```bash
   npx vercel --prod
   ```

## Na Deployment

- **Live URL**: Je krijgt een URL zoals `minddumper-app.vercel.app`
- **Custom Domain**: Later kun je `minddumper.com` toevoegen in Vercel settings
- **Environment Variables**: Voeg later Supabase keys toe in Vercel dashboard

## Volgende Stappen

1. ✅ Deploy naar Vercel
2. 🔲 Supabase account aanmaken
3. 🔲 Database schema opzetten
4. 🔲 Authentication implementeren