-- Create a function to confirm a user's email
CREATE OR REPLACE FUNCTION confirm_user_email(email_to_confirm TEXT)
RETURNS VOID AS $$
BEGIN
  -- Update the email_confirmed_at field to the current timestamp
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE email = email_to_confirm AND email_confirmed_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the authenticated role
GRANT EXECUTE ON FUNCTION confirm_user_email TO service_role;
