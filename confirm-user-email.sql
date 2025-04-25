-- This script manually confirms a user's email in the Supabase auth.users table
-- Replace 'user@example.com' with the actual email address you want to confirm

UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin@medicarehealth.com' AND email_confirmed_at IS NULL;
