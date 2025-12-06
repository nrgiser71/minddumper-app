# 🧪 Trial Expiration Testing Guide

## Handmatige Test Stappen voor Jan

### Stap 1: Maak Test Trial Account
1. Ga naar `http://localhost:3000/try-free`
2. Gebruik email: `expire-test@example.com`
3. Vul naam in: `Expire Test User`
4. Klik "Start gratis proefperiode"
5. Check email en klik magic link
6. **Verwacht gedrag:** Wordt doorgestuurd naar password reset pagina
7. Stel wachtwoord in (bijvoorbeeld: `testpass123`)
8. **Verwacht gedrag:** Wordt doorgestuurd naar `/app`
9. Verifieer dat je toegang hebt tot de app

### Stap 2: Expire de Trial Account (SQL)
Voer deze query uit in Supabase:

```sql
-- Maak trial account expired (1 uur geleden)
UPDATE profiles 
SET 
    trial_expires_at = NOW() - INTERVAL '1 hour',
    updated_at = NOW()
WHERE 
    email = 'expire-test@example.com'
    AND payment_status = 'trial';
```

Verifieer dat het gewerkt heeft:
```sql
SELECT 
    email,
    trial_expires_at,
    trial_expires_at < NOW() as is_expired,
    payment_status
FROM profiles 
WHERE email = 'expire-test@example.com';
```

### Stap 3: Test Expired Trial Login
1. Log uit uit de app (ga naar `/auth/logout`)
2. Ga naar `http://localhost:3000/auth/login`
3. Log in met `expire-test@example.com` en het wachtwoord
4. **Verwacht gedrag:** Automatisch doorgestuurd naar `/upgrade` pagina
5. **Controleer:** Pagina toont "Je trial is verlopen" boodschap

### Stap 4: Test Upgrade Pagina Functionaliteit
Op de `/upgrade` pagina:
1. **Controleer:** "Je trial is verlopen" header met ⏰ icoon
2. **Controleer:** Boodschap "Je 14-dagen trial is afgelopen"
3. **Controleer:** "Upgrade Nu voor €49 →" knop
4. **Test:** Klik upgrade knop
5. **Verwacht gedrag:** Doorsturen naar PlugAndPay met email pre-filled
6. **URL check:** Moet zijn: `https://pay.baasoverjetijd.be/checkout/minddumper?email=expire-test%40example.com`

### Stap 5: Test Discount Functionaliteit
1. Ga naar `/upgrade?discount=LASTCHANCE10`
2. **Controleer:** Discount banner wordt getoond
3. **Controleer:** "€44,10" prijs wordt getoond in plaats van €49
4. **Test:** Upgrade knop 
5. **URL check:** Moet discount parameter bevatten

### Stap 6: Test App Toegang Blocked
1. Probeer direct naar `/app` te gaan
2. **Verwacht gedrag:** Automatisch doorgestuurd naar `/upgrade`
3. **Test verschillende routes:**
   - `/app/brain-dump` → `/upgrade`
   - `/app/configuration` → `/upgrade`

### Stap 7: Test Cron Job Reminder Logic
Voer deze queries uit om te zien welke users reminders zouden krijgen:

```sql
-- Users die 3-day reminder moeten krijgen
SELECT 
    'SHOULD GET 3-DAY REMINDER' as action,
    email,
    trial_expires_at,
    trial_expires_at - NOW() as time_remaining
FROM profiles 
WHERE 
    payment_status = 'trial' 
    AND is_trial_user = true
    AND trial_expires_at > NOW()
    AND trial_expires_at <= NOW() + INTERVAL '3 days'
    AND trial_reminder_sent_3day = false;

-- Users die 1-day reminder moeten krijgen  
SELECT 
    'SHOULD GET 1-DAY REMINDER' as action,
    email,
    trial_expires_at,
    trial_expires_at - NOW() as time_remaining
FROM profiles 
WHERE 
    payment_status = 'trial' 
    AND is_trial_user = true
    AND trial_expires_at > NOW()
    AND trial_expires_at <= NOW() + INTERVAL '1 day'
    AND trial_reminder_sent_1day = false;

-- Users die expiry reminder moeten krijgen
SELECT 
    'SHOULD GET EXPIRY REMINDER' as action,
    email,
    trial_expires_at,
    NOW() - trial_expires_at as time_since_expiry
FROM profiles 
WHERE 
    payment_status = 'trial' 
    AND is_trial_user = true
    AND trial_expires_at <= NOW()
    AND trial_reminder_sent_expired = false;
```

### Stap 8: Test Verschillende Trial States
Maak verschillende test accounts voor verschillende scenarios:

**A. Trial die over 2 dagen verloopt:**
```sql
UPDATE profiles 
SET trial_expires_at = NOW() + INTERVAL '2 days'
WHERE email = 'expire-test@example.com';
```
**Verwacht:** `/upgrade` pagina toont "Nog 2 dagen trial"

**B. Trial die vandaag verloopt:**
```sql
UPDATE profiles 
SET trial_expires_at = NOW() + INTERVAL '2 hours'
WHERE email = 'expire-test@example.com';
```
**Verwacht:** `/upgrade` pagina toont "Nog 1 dag trial" (wordt afgerond)

### Stap 9: Cleanup Test Data
```sql
-- Verwijder test account na testing
DELETE FROM profiles 
WHERE email = 'expire-test@example.com';
```

## ✅ Checklist: Wat Moet Werken

- [ ] Trial signup flow + password setup werkt
- [ ] Expired trial wordt geblokkeerd van `/app` toegang
- [ ] Redirect naar `/upgrade` pagina werkt automatisch
- [ ] Upgrade pagina toont juiste "expired" boodschap
- [ ] Upgrade knop redirect naar PlugAndPay met juiste email
- [ ] Discount code functionaliteit werkt (`?discount=LASTCHANCE10`)
- [ ] Verschillende trial states tonen juiste berichten
- [ ] Cron job queries identificeren juiste users voor reminders

## 🐛 Mogelijke Issues om Op te Letten

- **ProtectedRoute loop:** Als redirect niet werkt, check browser console voor errors
- **Email pre-fill:** Verify dat email correct encoded is in PlugAndPay URL
- **Discount logic:** Check dat discount alleen werkt met `LASTCHANCE10` code
- **Trial state calculation:** Check dat dagen correct berekend worden
- **Password flag:** Verify dat `has_set_password = true` na password setup