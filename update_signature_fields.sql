-- Update invoices table to add separate signature fields
-- Run this SQL in Supabase SQL Editor

-- Add new signature columns
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS received_by_signature VARCHAR(10) DEFAULT '',
ADD COLUMN IF NOT EXISTS delivered_by_signature VARCHAR(10) DEFAULT '';

-- Update existing records: if has_signatures is "Yes", set both to "Yes"
UPDATE invoices 
SET received_by_signature = CASE WHEN has_signatures = 'Yes' THEN 'Yes' ELSE 'No' END,
    delivered_by_signature = CASE WHEN has_signatures = 'Yes' THEN 'Yes' ELSE 'No' END
WHERE received_by_signature = '' OR delivered_by_signature = '';

-- Note: The has_signatures field will be computed from these two fields
-- If either received_by_signature OR delivered_by_signature is "Yes", then has_signatures = "Yes"



