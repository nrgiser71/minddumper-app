-- 🔍 STAP 1: TOON ALLE ACCOUNTS DIE VANDAAG ZIJN AANGEMAAKT
-- Voer deze query eerst uit om te controleren welke accounts vandaag zijn gemaakt

SELECT 
    id,
    email,
    full_name,
    payment_status,
    is_trial_user,
    trial_expires_at,
    created_at,
    updated_at
FROM profiles 
WHERE 
    DATE(created_at) = CURRENT_DATE
    AND email LIKE '%minddumpertrial%'
ORDER BY created_at DESC;

-- 📊 EXTRA INFO: Tel hoeveel test accounts er zijn
SELECT 
    COUNT(*) as total_test_accounts,
    payment_status,
    is_trial_user
FROM profiles 
WHERE 
    DATE(created_at) = CURRENT_DATE
    AND email LIKE '%minddumpertrial%'
GROUP BY payment_status, is_trial_user;

-- ⚠️ CONTROLEER EERST BOVENSTAANDE RESULTATEN VOORDAT JE VERDER GAAT
-- ===============================================================

-- 🗑️ STAP 2: VERWIJDER TEST ACCOUNTS (GOEDGEKEURD DOOR JAN)
-- Deze queries uitvoeren om de test accounts van vandaag te verwijderen

-- 1️⃣ EERST: Verwijder profiles uit de database
DELETE FROM profiles 
WHERE 
    DATE(created_at) = CURRENT_DATE
    AND email LIKE '%minddumpertrial%';

-- 2️⃣ DAARNA: Check hoeveel records zijn verwijderd
SELECT 
    COUNT(*) as remaining_test_accounts
FROM profiles 
WHERE 
    DATE(created_at) = CURRENT_DATE
    AND email LIKE '%minddumpertrial%';

-- Dit zou 0 moeten zijn na de delete

-- ⚠️ BELANGRIJK: AUTH USERS CLEANUP
-- De Supabase auth users worden NIET automatisch verwijderd via SQL
-- Deze moeten handmatig verwijderd worden via Supabase Dashboard:
-- 1. Ga naar Supabase Dashboard → Authentication → Users
-- 2. Filter op email containing "minddumpertrial"  
-- 3. Verwijder deze users handmatig
-- 
-- OF gebruik de Supabase Admin API (complexer maar geautomatiseerd)