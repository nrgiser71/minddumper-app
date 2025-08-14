# Claude Quick Reference - MindDumper Staging Workflow

## 🚨 LEES DIT EERST BIJ ELKE NIEUWE SESSIE

### Staging Environment Status: ✅ 100% OPERATIONEEL

## Claude's Rol: MAXIMALE BEGELEIDING
- ✅ **Doe zoveel mogelijk zelf** - minimaliseer Jan's handmatige werk
- ✅ **Stap-voor-stap begeleiding** - nooit meer dan 1 stap tegelijk aan Jan
- ✅ **Branch safety enforcer** - controleer altijd huidige branch
- ✅ **Testing coordinator** - begeleid door elke staging test

## Current Setup (VOLLEDIG WERKEND):

### Git Branches:
- `develop` - Development werk (veilig voor experimenten)
- `staging` - Pre-productie testing (automatische Vercel preview)
- `main` - Productie (BEVEILIGD - alleen via PR)

### GitHub Protection:
- ✅ Main branch: Direct pushen ONMOGELIJK
- ✅ Pull requests verplicht voor productie
- ✅ Approval workflow actief

### Database Setup:
- **Productie:** Originele Supabase project
- **Staging:** Aparte `minddumper-staging` project
- **Isolatie:** 100% gescheiden data

### Vercel Configuration:
- **Production environment:** Productie database
- **Preview environment:** Staging database
- **Staging test URL:** `[preview-url]/staging-test.html`

## Claude's Workflow Checklist:

### Voor Elke Code Wijziging:
1. **Check branch:** `git branch` (moet develop zijn)
2. **Check status:** `git status` 
3. **Validate build:** `npm run build`
4. **Commit to develop:** Claude doet git commands
5. **Merge to staging:** Claude doet merge
6. **Test staging:** Begeleid Jan naar staging-test.html
7. **Create PR:** Begeleid Jan door GitHub PR proces
8. **Wait for approval:** "JA, DEPLOY NAAR PRODUCTIE"

### Emergency Hotfix Protocol:
1. **Hotfix branch van main:** `git checkout main && git checkout -b hotfix/beschrijving`
2. **Fix bug:** Claude maakt fixes
3. **Test op staging EERST:** Merge hotfix naar staging
4. **Staging test:** Verifieer fix werkt
5. **Ask permission:** "🚨 Hotfix getest - DEPLOY NAAR PRODUCTIE?"
6. **PR naar main:** Alleen na "JA, DEPLOY"

## Belangrijke Commands (Claude doet deze):

```bash
# Development workflow (Claude voert uit):
git checkout develop
git add .
git commit -m "Feature beschrijving"
git push origin develop

# Staging testing (Claude voert uit):
git checkout staging  
git merge develop --no-ff
git push origin staging
# → Jan test op staging preview URL

# Production (via GitHub PR):
# → Claude helpt Jan met PR maken
# → Wacht op "JA, DEPLOY NAAR PRODUCTIE"
```

## Jan's Minimale Acties:
1. **Beschrijf feature/fix** - Claude doet de rest
2. **Test staging URL** - Claude geeft exacte link
3. **Approve production** - "JA, DEPLOY NAAR PRODUCTIE"
4. **Emergency decisions** - Alleen bij kritieke bugs

## Staging Test Verification:
- **URL pattern:** `[unique-preview].vercel.app/staging-test.html`  
- **Expected:** Blauwe pagina met "✅ Staging Deployment Successful"
- **Checklist:** Alle groene vinkjes zichtbaar
- **Database:** Staging database connectivity working

## Safety Nets Active:
- ❌ **Direct main pushes:** IMPOSSIBLE (GitHub blocks)
- ✅ **Staging first:** MANDATORY voor alle changes
- ✅ **Database isolation:** Staging ≠ Production data
- ✅ **Preview testing:** Automatic Vercel staging deployments
- ✅ **Approval required:** Manual "JA, DEPLOY" voor productie

## Claude's Promise:
- **Maximum automation** - Jan doet minimaal werk
- **Step-by-step guidance** - Nooit overwhelming
- **Safety first** - Altijd staging testing
- **Production protection** - MindDumper gebruikers zijn veilig

---
**ONTHOUD: Bij elke nieuwe terminal sessie, lees dit document en begeleid Jan door de veilige staging workflow!**