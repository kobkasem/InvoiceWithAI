# 🔧 Fix 500 Error - Missing Database Columns

## Problem Found

The 500 error is caused by **missing database columns**:
- `received_by_signature`
- `delivered_by_signature`

The database check shows:
```
❌ Database Error: column invoices.received_by_signature does not exist
```

---

## ✅ Solution: Run Database Migration

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left menu
4. Click **New Query**

### Step 2: Run This SQL

Copy and paste this SQL into the editor:

```sql
-- Add new signature columns
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS received_by_signature VARCHAR(10) DEFAULT '',
ADD COLUMN IF NOT EXISTS delivered_by_signature VARCHAR(10) DEFAULT '';

-- Update existing records: if has_signatures is "Yes", set both to "Yes"
UPDATE invoices 
SET received_by_signature = CASE WHEN has_signatures = 'Yes' THEN 'Yes' ELSE 'No' END,
    delivered_by_signature = CASE WHEN has_signatures = 'Yes' THEN 'Yes' ELSE 'No' END
WHERE received_by_signature = '' OR delivered_by_signature = '';
```

### Step 3: Click "Run" (or press Ctrl+Enter)

You should see:
```
Success. No rows returned
```

---

## Alternative: Use Migration File

You can also run the file `update_signature_fields.sql` which contains the same SQL.

---

## Step 4: Verify

After running the SQL, verify it worked:

```bash
node check-server-error.js
```

Should show:
```
✅ Database connection OK
✅ Table structure OK
```

---

## Step 5: Restart Server

After adding the columns, restart your server:

```bash
npm run dev
```

---

## Why This Happened

The application code was updated to use new signature fields, but the database schema wasn't updated yet. The columns need to be added to the database.

---

## After Fix

Once the columns are added:
- ✅ Manual entry will work
- ✅ Invoice upload will work
- ✅ Invoice update will work
- ✅ No more 500 errors!

---

**Run the SQL migration now and the 500 error will be fixed!** 🎉



