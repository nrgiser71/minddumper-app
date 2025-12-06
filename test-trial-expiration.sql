-- 🧪 TEST TRIAL EXPIRATION FLOW
-- Deze queries helpen om de trial expiration flow te testen

-- 1️⃣ MAAK EEN TEST TRIAL ACCOUNT EXPIRED
-- Voer eerst een normale trial signup uit op staging, gebruik dan deze query:

-- Update een bestaande trial user om expired te maken
-- VERVANG 'test-email@example.com' met het echte test email
/*
UPDATE profiles 
SET 
    trial_expires_at = NOW() - INTERVAL '1 hour',  -- 1 uur geleden expired
    updated_at = NOW()
WHERE 
    email = 'jouw-test-email@example.com'  -- VERVANG DIT
    AND payment_status = 'trial';
*/

-- 2️⃣ CONTROLEER EXPIRED STATUS
SELECT 
    id,
    email,
    full_name,
    payment_status,
    is_trial_user,
    trial_expires_at,
    trial_expires_at < NOW() as is_expired,
    trial_reminder_sent_expired,
    created_at
FROM profiles 
WHERE 
    payment_status = 'trial'
    AND email LIKE '%test%'  -- of je specifieke test email
ORDER BY created_at DESC;

-- 3️⃣ TEST CRON JOB LOGIC (SIMULATIE)
-- Deze query toont welke accounts reminders zouden krijgen

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

-- 4️⃣ RESET TRIAL VOOR HERTEST (optioneel)
-- Als je de test wilt herhalen:
/*
UPDATE profiles 
SET 
    trial_expires_at = NOW() + INTERVAL '14 days',  -- Reset naar 14 dagen
    trial_reminder_sent_3day = false,
    trial_reminder_sent_1day = false,
    trial_reminder_sent_expired = false,
    updated_at = NOW()
WHERE 
    email = 'jouw-test-email@example.com'  -- VERVANG DIT
    AND payment_status = 'trial';
*/