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

### 4. **Database Migratie naar Production**
- [ ] **Trial functionality migratie uitvoeren** op production Supabase:
  ```sql
  -- Voer uit op production database
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMP WITH TIME ZONE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_trial_user BOOLEAN DEFAULT FALSE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_3day BOOLEAN DEFAULT FALSE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_1day BOOLEAN DEFAULT FALSE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_reminder_sent_expired BOOLEAN DEFAULT FALSE;
  ```

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
- [ ] Test trial signup flow volledig
- [ ] Test magic link redirect (moet naar minddumper.com/app gaan)
- [ ] Test welcome email ontvangst
- [ ] Test trial expiration reminders (via cron job)
- [ ] Test upgrade flow van trial naar paid
- [ ] Test bestaande paid users (geen impact)

### 9. **Monitoring & Debugging**
- [ ] **Debug endpoints uitschakelen** of beveiligen voor productie:
  - /api/debug/trial-debug
  - /api/debug/test-mailgun
  - /api/debug/env-check
- [ ] **Console logging minimaliseren** in production

### 10. **DNS & Domain Settings**
- [ ] **Vercel domain** correct gekoppeld aan minddumper.com
- [ ] **SSL certificaat** automatisch gegenereerd voor minddumper.com

---

## 🔄 **Staging → Production Workflow**

1. **Pre-deployment checks:**
   - Alle bovenstaande items ✅
   - Staging volledig getest
   - Database migratie script klaar

2. **Deployment:**
   - Merge staging → main via PR
   - Database migratie uitvoeren
   - Environment variables controleren
   - Supabase redirects updaten

3. **Post-deployment checks:**
   - Trial signup flow testen
   - Email delivery verifiëren  
   - Magic links testen
   - Bestaande users testen

---

## 📝 **Huidige Status**
- **Staging:** ✅ Trial system volledig werkend
- **Mailgun:** ✅ EU region, emails werken
- **Database:** ✅ Migratie toegepast op staging
- **Magic Links:** 🔄 Supabase redirect URLs aangepast

## 🚨 **Kritieke Punten**
- **Geen impact op bestaande users** - trial system is volledig geïsoleerd
- **Database backup** maken voor productie migratie
- **Rollback plan** - trial system kan eenvoudig uitgeschakeld worden