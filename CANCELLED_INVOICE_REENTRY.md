# ✅ Allow Re-entry of Cancelled Invoices

## What Changed

The application now allows you to **re-enter invoices with the same invoice number** if the previous invoice was **cancelled**.

---

## How It Works

### Before:
- ❌ Invoice number must be unique (no duplicates allowed)
- ❌ Could not re-enter cancelled invoices with same number

### After:
- ✅ Invoice number must be unique **only for non-cancelled invoices**
- ✅ Can re-enter cancelled invoices with the same invoice number
- ✅ Multiple cancelled invoices can have the same number
- ✅ Only one non-cancelled invoice per invoice number

---

## Database Changes Required

**IMPORTANT**: Run this SQL in Supabase SQL Editor:

```sql
-- Remove UNIQUE constraint from invoice_number
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_invoice_number_key;

-- Create unique partial index: only enforce uniqueness for non-cancelled invoices
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_invoice_number_unique 
ON invoices(invoice_number) 
WHERE status != 'cancelled';
```

**OR** run the file: `remove_invoice_number_unique.sql`

---

## Behavior

### Scenario 1: New Invoice
- ✅ Can create invoice with any number (if not exists)
- ✅ If number exists and status is NOT cancelled → Error
- ✅ If number exists and status IS cancelled → Allow (create new invoice)

### Scenario 2: Update Invoice Number
- ✅ Can change invoice number to a new one
- ✅ If new number exists and status is NOT cancelled → Error
- ✅ If new number exists and status IS cancelled → Allow

### Scenario 3: Cancelled Invoice
- ✅ Can create new invoice with same number as cancelled invoice
- ✅ Multiple cancelled invoices can share the same number

---

## Updated Routes

1. **POST /api/invoices/manual** - Manual entry
   - Checks if invoice number exists
   - Allows if existing invoice is cancelled

2. **POST /api/invoices/upload** - File upload
   - Checks if invoice number exists
   - Allows if existing invoice is cancelled

3. **PUT /api/invoices/:id** - Update invoice
   - Checks if new invoice number exists (if changed)
   - Allows if existing invoice is cancelled

---

## Example

**Step 1**: Create invoice INV-001
- Status: pending
- ✅ Created successfully

**Step 2**: Cancel invoice INV-001
- Status: cancelled
- ✅ Cancelled successfully

**Step 3**: Create new invoice INV-001
- ✅ Allowed! (previous one was cancelled)
- New invoice created with same number

**Step 4**: Try to create another INV-001
- ❌ Error! (already exists with status: pending)

---

## Files Updated

- ✅ `server/routes/invoices.js` - Updated validation logic
- ✅ `supabase_schema.sql` - Removed UNIQUE constraint, added partial index
- ✅ `remove_invoice_number_unique.sql` - Migration script

---

## Next Steps

1. ✅ Run the database migration SQL
2. ✅ Restart server: `npm run dev`
3. ✅ Test: Cancel an invoice, then re-enter with same number

Done! 🎉



