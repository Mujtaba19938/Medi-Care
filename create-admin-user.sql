-- Check if the admin user already exists
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@medicarehealth.com'
  ) INTO user_exists;

  IF NOT user_exists THEN
    -- Insert admin user into auth.users table
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@medicarehealth.com',
      -- This is a hashed password for 'admin123' - DO NOT USE IN PRODUCTION
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NULL,
      NOW(),
      '{"provider": "email", "providers": ["email"], "role": "admin"}',
      '{"name": "Admin User", "role": "admin"}',
      NOW(),
      NOW(),
      '',
      NULL,
      '',
      ''
    );
    
    RAISE NOTICE 'Admin user created successfully';
  ELSE
    RAISE NOTICE 'Admin user already exists';
  END IF;
END $$;

-- Add admin role to the user if it exists but doesn't have the role
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  raw_app_meta_data, 
  '{role}', 
  '"admin"'
)
WHERE email = 'admin@medicarehealth.com' 
AND (raw_app_meta_data->>'role') IS DISTINCT FROM 'admin';

-- Add admin role to user_metadata as well
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{role}', 
  '"admin"'
)
WHERE email = 'admin@medicarehealth.com' 
AND (raw_user_meta_data->>'role') IS DISTINCT FROM 'admin';

-- Output the admin credentials for reference
SELECT 'Admin Login Credentials:' as message;
SELECT 'Email: admin@medicarehealth.com' as email;
SELECT 'Password: admin123' as password;
SELECT 'IMPORTANT: Change this password in production!' as warning;
