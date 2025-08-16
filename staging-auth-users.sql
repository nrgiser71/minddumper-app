-- Create auth.users records for staging database
-- These correspond to the profiles we're importing
-- Note: Passwords won't work (we only have hashed versions) but structure will be correct

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token) VALUES

-- Stijn De Vos
('29b2dd14-71f5-4fd0-8d6e-761e3e217036', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'stijn@perazo.be', '$2a$10$dummy.encrypted.password.hash.for.staging', '2025-08-12 14:42:00.052508+00', '2025-08-12 14:42:00.052508+00', '2025-08-12 14:42:00.279+00', '2025-08-12 14:42:00.279+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '', '', '', ''),

-- Jan Buskens Test  
('50926163-4666-4e68-b9f8-145e6ed8e45b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jan@buskens.be', '$2a$10$dummy.encrypted.password.hash.for.staging', '2025-06-26 14:26:48.381343+00', '2025-06-26 14:26:48.381343+00', '2025-06-26 14:26:48.381343+00', '2025-06-26 14:26:48.381343+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '', '', '', ''),

-- Test User
('082c2917-23cd-4d87-8d45-5b699e1a4e3b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test@minddumper.com', '$2a$10$dummy.encrypted.password.hash.for.staging', '2025-07-16 17:32:27.807465+00', '2025-07-16 17:32:27.807465+00', '2025-07-16 17:32:27.807465+00', '2025-07-16 17:32:27.807465+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '', '', '', ''),

-- Jan Buskens
('334284f9-cb95-4d05-8492-dd7b87b52557', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'info@baasoverjetijd.be', '$2a$10$dummy.encrypted.password.hash.for.staging', '2025-06-26 07:04:29.242023+00', '2025-06-26 07:04:29.242023+00', '2025-06-26 07:04:29.242023+00', '2025-06-26 07:04:29.242023+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '', '', '', ''),

-- Sven Nys
('4defeb04-ff7d-4ed5-a34f-75f5f8f4b378', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sven.nys@ygrex.be', '$2a$10$dummy.encrypted.password.hash.for.staging', '2025-08-05 08:05:25.522453+00', '2025-08-05 08:05:25.522453+00', '2025-08-05 08:05:26.127+00', '2025-08-05 08:05:26.127+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '', '', '', ''),

-- Jan De Vresse
('c0a4dc8b-dd5c-4c5c-b9b5-5c419460d804', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jan.devresse@gmail.com', '$2a$10$dummy.encrypted.password.hash.for.staging', '2025-08-05 17:56:51.225111+00', '2025-08-05 17:56:51.225111+00', '2025-08-05 17:56:51.629+00', '2025-08-05 17:56:51.629+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '', '', '', ''),

-- Peter De Jonghe
('e6b3de5f-9231-4d7c-99d8-1f3711631746', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'peter.dejonghe@instructive.io', '$2a$10$dummy.encrypted.password.hash.for.staging', '2025-08-07 13:22:37.548304+00', '2025-08-07 13:22:37.548304+00', '2025-08-07 13:22:38.001+00', '2025-08-07 13:22:38.001+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '', '', '', '');

-- Note: These users will exist in the database but won't be able to login with their original passwords
-- This is only for staging/testing purposes where we need the foreign key relationships to work
-- For actual login testing, create new test accounts via the admin interface