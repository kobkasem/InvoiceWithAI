-- Remove UNIQUE constraint from invoice_number to allow cancelled invoices to be re-entered
-- Run this SQL in Supabase SQL Editor

-- Drop the unique constraint on invoice_number
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_invoice_number_key;

-- Create a unique partial index that only enforces uniqueness for non-cancelled invoices
-- This allows multiple cancelled invoices with the same number, but prevents duplicates for active invoices
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_invoice_number_unique 
ON invoices(invoice_number) 
WHERE status != 'cancelled';

-- Note: This allows:
-- - Multiple cancelled invoices with the same invoice number
-- - Only one non-cancelled invoice per invoice number
-- - Re-entry of invoice numbers that were previously cancelled



