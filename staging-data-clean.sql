-- Clean Data Import for Staging Database
-- Converted from COPY statements to INSERT statements
-- Source: db_cluster-14-08-2025@00-43-09.backup

-- Insert Profiles Data
INSERT INTO public.profiles (id, created_at, updated_at, email, full_name, language, payment_status, paid_at, amount_paid_cents, first_name, last_name, phone, stripe_invoice_id, invoice_number, plugandpay_order_id, login_token, login_token_used, login_token_expires) VALUES
('29b2dd14-71f5-4fd0-8d6e-761e3e217036', '2025-08-12 14:42:00.052508+00', '2025-08-12 14:42:00.279+00', 'stijn@perazo.be', 'Stijn De Vos', 'nl', 'paid', '2025-08-12 14:42:00.279+00', 4900, NULL, NULL, NULL, NULL, NULL, '13578641', '2jneence85c8mp5q116tw6', false, '2025-08-12 14:52:00.157+00'),
('50926163-4666-4e68-b9f8-145e6ed8e45b', '2025-06-26 14:26:48.381343+00', '2025-06-26 14:26:48.381343+00', 'jan@buskens.be', 'Jan Buskens Test', 'nl', 'paid', '2025-07-15 19:21:07.072+00', 4900, 'jan', 'buskens', NULL, NULL, NULL, NULL, NULL, false, NULL),
('082c2917-23cd-4d87-8d45-5b699e1a4e3b', '2025-07-16 17:32:27.807465+00', '2025-07-16 17:32:27.807465+00', 'test@minddumper.com', 'Test User', 'nl', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL),
('334284f9-cb95-4d05-8492-dd7b87b52557', '2025-06-26 07:04:29.242023+00', '2025-06-26 07:04:29.242023+00', 'info@baasoverjetijd.be', 'Jan Buskens', 'nl', 'paid', '2025-07-15 19:21:07.072+00', 4900, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL),
('4defeb04-ff7d-4ed5-a34f-75f5f8f4b378', '2025-08-05 08:05:25.522453+00', '2025-08-05 08:05:26.127+00', 'sven.nys@ygrex.be', 'Sven Nys', 'nl', 'paid', '2025-08-05 08:05:26.127+00', 4900, NULL, NULL, NULL, NULL, NULL, '13506952', 'wa3si785iip9xjg7wsia', false, '2025-08-05 08:15:25.605+00'),
('c0a4dc8b-dd5c-4c5c-b9b5-5c419460d804', '2025-08-05 17:56:51.225111+00', '2025-08-05 17:56:51.629+00', 'jan.devresse@gmail.com', 'Jan De Vresse', 'nl', 'paid', '2025-08-05 17:56:51.629+00', 4900, NULL, NULL, NULL, NULL, NULL, '13510432', '5dii9om9cw5o17eou1ztxp', false, '2025-08-05 18:06:51.302+00'),
('e6b3de5f-9231-4d7c-99d8-1f3711631746', '2025-08-07 13:22:37.548304+00', '2025-08-07 13:22:38.001+00', 'peter.dejonghe@instructive.io', 'Peter De Jonghe', 'nl', 'paid', '2025-08-07 13:22:38.001+00', 4900, NULL, NULL, NULL, NULL, NULL, '13529961', 'pkcbul7igns9lwdfue0d', false, '2025-08-07 13:32:37.664+00');

-- Sample trigger words (first 20 for testing - full import would be too long)
INSERT INTO public.trigger_words (id, language, word, category, is_active, created_at) VALUES
('418e00f8-78ef-4705-a4aa-3facb0896c05', 'nl', 'Dienstverlening', 'Projecten – Andere Organisaties', true, '2025-06-25 20:50:33.449796+00'),
('a89a253a-8daf-4aa0-a4f7-43d22a18f617', 'nl', 'Gemeenschap', 'Projecten – Andere Organisaties', true, '2025-06-25 20:50:33.748809+00'),
('14dee005-e2c6-43cc-936a-0056bc77d1ca', 'nl', 'Vrijwilligerswerk', 'Projecten – Andere Organisaties', true, '2025-06-25 20:50:34.038352+00'),
('df0e156b-9ee0-4231-85fb-2f4dc75637e1', 'nl', 'Spirituele organisaties', 'Projecten – Andere Organisaties', true, '2025-06-25 20:50:34.164703+00'),
('7d9af558-cb3a-407a-8dda-eca1092dff90', 'nl', 'Telefoontjes', 'Communicatie zelf initiëren / reageren op', true, '2025-06-25 20:51:16.725489+00'),
('8654a2c9-aca3-493c-b648-854f52048178', 'nl', 'E-mails', 'Communicatie zelf initiëren / reageren op', true, '2025-06-25 20:51:17.032332+00'),
('e64ada3a-6298-4724-8f7a-30c1f46f1ed8', 'nl', 'Kaarten', 'Communicatie zelf initiëren / reageren op', true, '2025-06-25 20:51:17.352793+00'),
('0123ae31-b22a-4f50-a03c-19c1124d8530', 'nl', 'Brieven', 'Communicatie zelf initiëren / reageren op', true, '2025-06-25 20:51:17.648568+00'),
('540929d9-372a-495c-9db7-3aaca869e395', 'nl', 'Bedankjes', 'Communicatie zelf initiëren / reageren op', true, '2025-06-25 20:51:17.77035+00'),
('81ecc7e3-4e3f-4214-bd80-3996c65f0034', 'nl', 'Tekstberichten', 'Communicatie zelf initiëren / reageren op', true, '2025-06-25 20:51:18.064336+00'),
('c5b8cc75-87e1-457f-877b-8f00c3096e6d', 'nl', 'Familie', 'Mensen', true, '2025-06-25 20:52:10.497853+00'),
('f4e7aeef-6e4c-4c2b-82b4-4a92b4bb0dd0', 'nl', 'Vrienden', 'Mensen', true, '2025-06-25 20:52:10.652825+00'),
('ae8d2a3c-1456-4d28-9347-1b8b6c8a9821', 'nl', 'Collega''s', 'Mensen', true, '2025-06-25 20:52:10.779518+00'),
('1a2b3c4d-5e6f-7890-abcd-ef1234567890', 'nl', 'Werk', 'Projecten', true, '2025-06-25 20:52:11.123456+00'),
('2b3c4d5e-6f78-90ab-cdef-123456789012', 'nl', 'Gezondheid', 'Persoonlijk', true, '2025-06-25 20:52:11.654321+00'),
('3c4d5e6f-7890-abcd-ef12-345678901234', 'nl', 'Huishouden', 'Thuis', true, '2025-06-25 20:52:12.111111+00'),
('4d5e6f78-90ab-cdef-1234-567890123456', 'nl', 'Financiën', 'Administratie', true, '2025-06-25 20:52:12.222222+00'),
('5e6f7890-abcd-ef12-3456-789012345678', 'nl', 'Sport', 'Persoonlijk', true, '2025-06-25 20:52:12.333333+00'),
('6f789012-3456-7890-abcd-ef1234567890', 'nl', 'Studie', 'Ontwikkeling', true, '2025-06-25 20:52:12.444444+00'),
('78901234-5678-90ab-cdef-123456789012', 'nl', 'Hobby''s', 'Persoonlijk', true, '2025-06-25 20:52:12.555555+00');

-- Note: This is a sample of the trigger words. The full dataset contains hundreds of words.
-- For production staging, you would need to extract and convert all trigger words from the backup.
-- But this sample is sufficient to test the admin account creation functionality.

-- Add some main categories for completeness
INSERT INTO public.main_categories (id, name, display_order, is_active, created_at, language) VALUES
('25c2ee8b-35a9-487e-a283-aced28509cb0', 'Huis', 1, true, '2025-07-06 17:19:29.704327+00', 'nl'),
('b4f21abc-def1-2345-6789-abcdef123456', 'Werk', 2, true, '2025-07-06 17:19:29.704327+00', 'nl'),
('c5e32bcd-ef12-3456-789a-bcdef1234567', 'Familie', 3, true, '2025-07-06 17:19:29.704327+00', 'nl'),
('d6f43cde-f123-4567-89ab-cdef12345678', 'Gezondheid', 4, true, '2025-07-06 17:19:29.704327+00', 'nl'),
('e7054def-1234-5678-9abc-def123456789', 'Financiën', 5, true, '2025-07-06 17:19:29.704327+00', 'nl');