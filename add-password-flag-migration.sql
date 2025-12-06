-- ✅ ADD PASSWORD FLAG MIGRATION
-- Deze migration voegt een has_set_password flag toe aan profiles table
-- voor het tracken of trial users hun password hebben ingesteld

-- 1️⃣ Voeg has_set_password kolom toe
ALTER TABLE profiles 
ADD COLUMN has_set_password BOOLEAN DEFAULT FALSE;

-- 2️⃣ Zet bestaande betaalde users op TRUE (zij hebben wel een password)
UPDATE profiles 
SET has_set_password = TRUE 
WHERE payment_status = 'paid';

-- 3️⃣ Zet bestaande trial users op FALSE (zij moeten password nog instellen)
UPDATE profiles 
SET has_set_password = FALSE 
WHERE payment_status = 'trial';

-- 4️⃣ Voeg comment toe voor documentatie
COMMENT ON COLUMN profiles.has_set_password IS 'Tracks whether user has set a password (especially for trial users who auto-login via magic link)';

-- 5️⃣ Controleer resultaat
SELECT 
    payment_status,
    has_set_password,
    COUNT(*) as count
FROM profiles 
GROUP BY payment_status, has_set_password
ORDER BY payment_status, has_set_password;