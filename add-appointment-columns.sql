-- Check if the scheduled_date column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'scheduled_date'
  ) THEN
    ALTER TABLE appointments ADD COLUMN scheduled_date VARCHAR(50);
  END IF;
  
  -- Check if the scheduled_time column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'scheduled_time'
  ) THEN
    ALTER TABLE appointments ADD COLUMN scheduled_time VARCHAR(50);
  END IF;
  
  -- Check if the doctor_id column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'doctor_id'
  ) THEN
    ALTER TABLE appointments ADD COLUMN doctor_id INTEGER;
  END IF;
  
  -- Check if the notes column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'notes'
  ) THEN
    ALTER TABLE appointments ADD COLUMN notes TEXT;
  END IF;
  
  -- Check if the location column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'location'
  ) THEN
    ALTER TABLE appointments ADD COLUMN location VARCHAR(255);
  END IF;
END
$$;
