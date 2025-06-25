# Vercel Environment Variables Setup

## Stap 1: Ga naar Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Klik op je `minddumper-app` project
3. Ga naar **Settings** tab
4. Klik op **Environment Variables** in het linkermenu

## Stap 2: Voeg Environment Variables toe

Voeg deze 2 environment variables toe:

### Variable 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://lmmtwtmsrlgvtgkibbrl.supabase.co`
- **Environment:** Select all (Production, Preview, Development)

### Variable 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtbXR3dG1zcmxndnRna2liYnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ2NDcsImV4cCI6MjA2NjQ1MDY0N30.OU5EeFOi8wZmWChZ53TGEct03gesobmHhujUEwG5Ezk`
- **Environment:** Select all (Production, Preview, Development)

## Stap 3: Redeploy

1. Ga naar **Deployments** tab
2. Klik op de drie puntjes (...) van de laatste deployment
3. Klik **Redeploy**
4. Wacht 2-3 minuten

## Resultaat

Na redeployment zal je live app:
- ✅ Echte triggerwoorden laden uit je Supabase database (80+ woorden in 5 talen)
- ✅ Brain dumps kunnen opslaan (zodra authentication is toegevoegd)
- ✅ Werken als volledig functionele database-backed app

## Test het

Ga naar je live URL en test:
1. Kies een taal (bijv. Nederlands)
2. Je zou nu echte Nederlandse triggerwoorden moeten zien (Werk, Familie, Gezondheid, etc.) in plaats van Lorem Ipsum
3. De app laadt nu data rechtstreeks uit je Supabase database!

---

**Volgende stap:** Authentication toevoegen zodat gebruikers kunnen inloggen en hun brain dumps kunnen opslaan.