-- First, check if the appointments table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments'
  ) THEN
    -- Create the appointments table if it doesn't exist
    CREATE TABLE appointments (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(50),
      service_id INTEGER,
      doctor_id INTEGER,
      status VARCHAR(50) DEFAULT 'pending',
      scheduled_date VARCHAR(50),
      scheduled_time VARCHAR(50),
      notes TEXT,
      location VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  ELSE
    -- Add missing columns if the table exists but columns are missing
    
    -- Check if scheduled_date column exists, if not add it
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'appointments' 
      AND column_name = 'scheduled_date'
    ) THEN
      ALTER TABLE appointments ADD COLUMN scheduled_date VARCHAR(50);
    END IF;
    
    -- Check if scheduled_time column exists, if not add it
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'appointments' 
      AND column_name = 'scheduled_time'
    ) THEN
      ALTER TABLE appointments ADD COLUMN scheduled_time VARCHAR(50);
    END IF;
    
    -- Check if doctor_id column exists, if not add it
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'appointments' 
      AND column_name = 'doctor_id'
    ) THEN
      ALTER TABLE appointments ADD COLUMN doctor_id INTEGER;
    END IF;
    
    -- Check if notes column exists, if not add it
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'appointments' 
      AND column_name = 'notes'
    ) THEN
      ALTER TABLE appointments ADD COLUMN notes TEXT;
    END IF;
    
    -- Check if location column exists, if not add it
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'appointments' 
      AND column_name = 'location'
    ) THEN
      ALTER TABLE appointments ADD COLUMN location VARCHAR(255);
    END IF;
  END IF;
END
$$;

-- Add some sample appointments if the table is empty
INSERT INTO appointments (email, name, phone, service_id, status, scheduled_date, scheduled_time, notes, location)
SELECT 
  'test@example.com', 
  'Test Patient', 
  '555-123-4567', 
  (SELECT id FROM services ORDER BY id LIMIT 1), 
  'confirmed', 
  '2023-12-15', 
  '10:00 AM', 
  'Initial consultation', 
  'Main Clinic'
WHERE NOT EXISTS (SELECT 1 FROM appointments LIMIT 1);
