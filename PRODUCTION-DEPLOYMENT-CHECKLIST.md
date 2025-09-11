# 🚀 Production Deployment Checklist - Trial System

## 📋 **Configuraties die aangepast moeten worden voor productie**

### 1. **Supabase Production Project Configuratie**
- [ ] **Authentication → URL Configuration**
  - [ ] Site URLs: `https://minddumper.com` toevoegen
  - [ ] Redirect URLs: `https://minddumper.com/auth/callback` toevoegen
  - [ ] Localhost URLs verwijderen uit production config

### 2. **Vercel Environment Variables (Production)**
- [ ] **NEXT_PUBLIC_SITE_URL** = `https://minddumper.com`
  - Huidige staging: `https://minddumper-app-git-staging-nrgiser71s-projects.vercel.app/`
  - Production: `https://minddumper.com`
- [ ] **Supabase URLs/Keys** controleren - zijn deze al production keys?
  - NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY

### 3. **Mailgun Configuratie** ✅
- [x] API Key (al geconfigureerd met EU region)
- [x] Domain: mg.minddumper.com 
- [x] From Email: hello@minddumper.com
- [x] From Name: MindDumper
- **Note:** Deze zijn al correct voor productie

### 4. **Database Migratie naar Production** 🚨 KRITIEK
- [ ] **Volledige trial functionality migratie uitvoeren** op production Supabase:
  ```sql
  -- STAP 1: Voeg alle trial kolommen toe (indien nog niet aanwezig)
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMP WITH TIME ZONE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_trial_user BOOLEAN DEFAULT FALSE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_3day BOOLEAN DEFAULT FALSE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_1day BOOLEAN DEFAULT FALSE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_expired BOOLEAN DEFAULT FALSE;
  
  -- STAP 2: ⚠️ NIEUWE KOLOM - Password Flag (DEFINITIEVE FIX)
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_set_password BOOLEAN DEFAULT FALSE;
  
  -- STAP 3: Zet bestaande betaalde users op TRUE (zij hebben al een password)
  UPDATE profiles 
  SET has_set_password = TRUE 
  WHERE payment_status = 'paid';
  
  -- STAP 4: Zet eventuele bestaande trial users op FALSE (zij moeten password instellen)
  UPDATE profiles 
  SET has_set_password = FALSE 
  WHERE payment_status = 'trial';
  
  -- STAP 5: Verify resultaat
  SELECT 
      payment_status,
      has_set_password,
      COUNT(*) as count
  FROM profiles 
  GROUP BY payment_status, has_set_password
  ORDER BY payment_status, has_set_password;
  ```

- [ ] **⚠️ BELANGRIJK**: De `has_set_password` kolom is de definitieve fix voor trial user password flow

### 5. **Vercel Project Settings**
- [ ] **Branch Deployment:**
  - Main branch → Production domain (minddumper.com)
  - Staging branch → Preview URL (voor testen)
- [ ] **Environment Variables scope:**
  - Production variables alleen op main branch
  - Preview variables voor staging branch

### 6. **PlugAndPay Webhook Configuration**
- [ ] **Webhook URL updaten** naar production:
  - Van: `https://minddumper-app-git-staging-nrgiser71s-projects.vercel.app/api/plugandpay/webhook`
  - Naar: `https://minddumper.com/api/plugandpay/webhook`

### 7. **Email Template URLs**
- [ ] **Mailgun templates controleren** - gebruiken deze NEXT_PUBLIC_SITE_URL?
  - Trial welcome email
  - Trial reminder emails
  - Password reset emails
  - Upgrade confirmation emails

### 8. **Testing na Production Deployment** 
- [ ] **Trial Password Flow (DEFINITIEVE FIX):**
  - [ ] Maak nieuwe trial account aan
  - [ ] Klik magic link in email
  - [ ] ✅ Moet automatisch redirecten naar `/auth/reset-password?welcome=true&trial=true`  
  - [ ] ✅ Moet "Welkom bij je gratis proefperiode!" tonen
  - [ ] Stel wachtwoord in
  - [ ] ✅ Moet `has_set_password = true` zetten in database
  - [ ] ✅ Moet doorsturen naar `/app` na password setup
  - [ ] Test volgende login met email + wachtwoord
- [ ] **Logout Functionaliteit (NIEUW):**
  - [ ] Test logout via `/auth/logout` route
  - [ ] ✅ Moet redirecten naar homepage
  - [ ] ✅ Moet session cookies clearen
  - [ ] ✅ Bij bezoek aan `/app` na logout → redirect naar login pagina
- [ ] **Trial Expiration Flow:**
  - [ ] Gebruik SQL om trial account te expiren (zie `TRIAL-EXPIRATION-TEST-GUIDE.md`)
  - [ ] ✅ Login met expired trial → automatisch naar `/upgrade` pagina
  - [ ] ✅ Upgrade pagina toont "Je trial is verlopen" boodschap
  - [ ] ✅ Upgrade button redirect naar PlugAndPay met email pre-filled
  - [ ] Test discount code: `/upgrade?discount=LASTCHANCE10` toont €44,10
- [ ] **Bestaande Trial Users:**
  - [ ] Als er bestaande trial users zijn, moeten zij bij `/app` bezoek redirected worden naar password setup
- [ ] **Regular Flows:**
  - [ ] Test magic link redirect voor nieuwe trial users  
  - [ ] Test welcome email ontvangst
  - [ ] Test trial expiration reminders (via cron job)
  - [ ] Test upgrade flow van trial naar paid (ECHTE BETALING - voorzie refund!)
  - [ ] Test bestaande paid users (geen impact)

### 9. **Monitoring & Debugging**
- [ ] **Debug endpoints uitschakelen** of beveiligen voor productie:
  - /api/debug/trial-debug
  - /api/debug/test-mailgun
  - /api/debug/env-check
- [ ] **Console logging minimaliseren** in production

### 10. **Cron Jobs & Scheduled Tasks**
- [ ] **Vercel Cron Jobs** geconfigureerd in `vercel.json`:
  - Trial reminder cron job: `0 10 * * *` (dagelijks om 10:00 UTC)
  - Path: `/api/cron/trial-reminders`
- [ ] **Test cron job** na deployment via manual trigger of wacht tot volgende uitvoering

### 11. **DNS & Domain Settings**
- [ ] **Vercel domain** correct gekoppeld aan minddumper.com
- [ ] **SSL certificaat** automatisch gegenereerd voor minddumper.com

---

## 🔄 **Staging → Production Workflow (KRITIEKE VOLGORDE)**

### **1. PRE-DEPLOYMENT CHECKS:**
   - [ ] Alle bovenstaande items ✅
   - [ ] Staging volledig getest
   - [ ] Database migratie script klaar
   - [ ] **Database backup gemaakt van productie**

### **2. DEPLOYMENT VOLGORDE (BELANGRIJK!):**
   **A. Database Migratie EERST:**
   - [ ] Voer `has_set_password` migratie uit op PRODUCTIE Supabase
   - [ ] Verifieer migratie succesvol met SELECT query
   
   **B. Code Deployment:**
   - [ ] Merge staging → main via PR
   - [ ] Vercel deployment compleet wachten
   - [ ] Environment variables controleren op main branch
   
   **C. External Services:**
   - [ ] Supabase Auth URLs updaten naar `https://minddumper.com`
   - [ ] PlugAndPay webhook URL updaten naar productie
   
### **3. POST-DEPLOYMENT CHECKS:**
   - [ ] Trial signup flow testen
   - [ ] Email delivery verifiëren  
   - [ ] Magic links testen
   - [ ] Logout functionaliteit testen
   - [ ] Bestaande users testen (GEEN IMPACT verwacht)

---

## 📝 **Huidige Status** (September 11, 2025)
- **Staging:** ✅ Trial system volledig werkend
- **Password Flow:** ✅ DEFINITIEVE FIX geïmplementeerd en getest
- **Database:** ✅ `has_set_password` kolom toegevoegd op staging
- **ProtectedRoute:** ✅ Trial users worden correct doorgestuurd naar password setup
- **Mailgun:** ✅ EU region, emails werken
- **Magic Links:** ✅ Supabase redirect URLs correct geconfigureerd
- **Testing:** ✅ Volledige trial flow getest op staging - WERKT PERFECT

## 🔧 **Technische Details: Password Flag Fix**

### **Het Probleem (Opgelost)**
- Trial users loggen automatisch in via magic links zonder password te kennen
- Bij volgende bezoeken kunnen ze niet inloggen (geen password ingesteld)
- ProtectedRoute liet trial users door naar app zonder password check

### **De Oplossing: has_set_password Flag** ✅
- **Database**: Nieuwe `has_set_password` boolean kolom in profiles table
- **ProtectedRoute**: Checkt voor trial users of password is ingesteld
- **Password Reset**: Zet flag op `true` na succesvolle password setup
- **Start-trial API**: Nieuwe trial users krijgen `has_set_password = false`

### **Technische Flow:**
1. **Trial signup** → `has_set_password = false` in database
2. **Magic link login** → User automatisch ingelogd 
3. **Navigate naar /app** → ProtectedRoute intercepteert
4. **Check**: `payment_status = 'trial' AND has_set_password = false`
5. **Redirect**: `/auth/reset-password?welcome=true&trial=true`
6. **Password setup** → `has_set_password = true` + forward naar app
7. **Future logins** → Normaal email + password

### **Waarom Deze Fix Definitief Is:**
- ✅ Werkt ongeacht Supabase auth flow (magic link vs code exchange)
- ✅ App-level check vangt alle scenarios
- ✅ Expliciete database tracking van password status
- ✅ Geen afhankelijkheid van metadata of auth callbacks
- ✅ Robuust tegen alle edge cases

---

---

## ⚠️ **BEKENDE ISSUES & WAARSCHUWINGEN**

### **1. Login 500 Error = User bestaat niet**
- **Symptoom**: `500 Internal Server Error` bij `signInWithPassword`
- **Oorzaak**: User bestaat niet in die Supabase omgeving
- **Oplossing**: Maak nieuw account aan of gebruik bestaande test account

### **2. Staging vs Productie Databases**
- **BELANGRIJK**: Staging en productie hebben **APARTE** Supabase databases
- **Gebruikers**: Bestaan NIET in beide omgevingen automatisch
- **Data**: Wordt NIET gesynchroniseerd tussen staging/productie

### **3. 🚨 BETALING OP STAGING - GEVAARLIJK!**
- **WAARSCHUWING**: PlugAndPay checkout is ECHTE betaling (€49)
- **Probleem**: Betaling update alleen staging database
- **Resultaat**: Geld kwijt, alleen staging toegang
- **Oplossing**: ALLEEN testen op productie met refund optie

### **4. Session/Cookie Issues**
- **Logout**: Vereist zowel `supabase.auth.signOut()` als cookie clearing
- **Server-side**: Gebruik service role key voor server operations
- **Client-side**: Gebruik anon key voor client operations

---

## 🚨 **Kritieke Punten**
- **Geen impact op bestaande users** - trial system is volledig geïsoleerd
- **Database backup** maken voor productie migratie
- **Rollback plan** - trial system kan eenvoudig uitgeschakeld worden
- **⚠️ has_set_password migratie is VERPLICHT** - anders werkt trial password flow niet
- **⚠️ DEPLOYMENT VOLGORDE**: Database EERST, dan code, dan external services