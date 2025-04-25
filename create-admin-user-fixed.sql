-- Create a more reliable admin user creation script
-- This script uses Supabase's auth.users table structure

-- First, check if the admin user already exists
DO $$
DECLARE
  user_exists BOOLEAN;
  user_id UUID;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@medicarehealth.com'
  ) INTO user_exists;

  IF NOT user_exists THEN
    -- Generate a UUID for the new user
    user_id := gen_random_uuid();
    
    -- Insert admin user into auth.users table
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role
    )
    VALUES (
      user_id,
      'admin@medicarehealth.com',
      -- This is a hashed password for 'admin123' using Supabase's format
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
      '{"name": "Admin User", "role": "admin"}'::jsonb,
      'authenticated',
      'authenticated'
    );
    
    -- Insert into auth.identities table which is required for Supabase Auth
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      created_at,
      updated_at
    )
    VALUES (
      user_id,
      user_id,
      jsonb_build_object('sub', user_id, 'email', 'admin@medicarehealth.com'),
      'email',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Admin user created successfully with ID: %', user_id;
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;

-- Output the admin credentials for reference
SELECT 'Admin Login Credentials:' as message;
SELECT 'Email: admin@medicarehealth.com' as email;
SELECT 'Password: admin123' as password;
SELECT 'IMPORTANT: Change this password in production!' as warning;
