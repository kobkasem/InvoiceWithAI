-- Simple SQL to add signature columns
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN

-- Step 1: Add the columns
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS received_by_signature VARCHAR(10) DEFAULT '';

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS delivered_by_signature VARCHAR(10) DEFAULT '';

-- Step 2: Update existing records (optional - sets default values)
UPDATE invoices 
SET received_by_signature = CASE 
  WHEN has_signatures = 'Yes' THEN 'Yes' 
  ELSE 'No' 
END
WHERE received_by_signature IS NULL OR received_by_signature = '';

UPDATE invoices 
SET delivered_by_signature = CASE 
  WHEN has_signatures = 'Yes' THEN 'Yes' 
  ELSE 'No' 
END
WHERE delivered_by_signature IS NULL OR delivered_by_signature = '';

-- Step 3: Verify (this should return success)
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'invoices' 
  AND column_name IN ('received_by_signature', 'delivered_by_signature');



