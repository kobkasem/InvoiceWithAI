# 🚨 Quick Fix for 500 Error

## The Problem

Your database is missing these columns:
- `received_by_signature`
- `delivered_by_signature`

## ✅ Quick Fix (3 Steps)

### Step 1: Open Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Copy This SQL

Copy **ALL** of this SQL:

```sql
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS received_by_signature VARCHAR(10) DEFAULT '';

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS delivered_by_signature VARCHAR(10) DEFAULT '';

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
```

### Step 3: Run It

1. Paste the SQL into the editor
2. Click **RUN** button (or press Ctrl+Enter)
3. Wait for "Success" message

### Step 4: Verify

Run this command:
```bash
node check-server-error.js
```

Should show:
```
✅ Database connection OK
✅ Table structure OK
```

### Step 5: Restart Server

```bash
npm run dev
```

---

## Still Not Working?

### Check 1: Did you run the SQL?
- Look in Supabase SQL Editor → History
- Should see your query there

### Check 2: Check for errors
- Look at the SQL Editor output
- If there's a red error message, share it

### Check 3: Verify columns exist
Run this in Supabase SQL Editor:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'invoices' 
  AND column_name IN ('received_by_signature', 'delivered_by_signature');
```

Should return 2 rows.

---

## Alternative: Use Migration File

The file `ADD_SIGNATURE_COLUMNS.sql` contains the same SQL - you can copy from there.

---

**After running the SQL, restart your server and try again!** 🎉



