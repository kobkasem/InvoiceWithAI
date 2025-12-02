# 🔍 Verify Railway Environment Variables - Step by Step

## Problem
Deployment still shows: "⚠️ Missing Supabase configuration"

This means Railway **is not reading** your environment variables.

---

## ✅ Step-by-Step: Verify Variables Are Set Correctly

### Step 1: Open Railway Dashboard

1. Go to: **https://railway.app**
2. **Login** to your account
3. **Click** on your project name

### Step 2: Check Service Level (IMPORTANT!)

**Railway has TWO levels for variables:**

1. **Project Level** - Shared across all services
2. **Service Level** - Specific to one service ← **YOU NEED THIS!**

**Check:**
1. In your project, do you see a **service** or **app** listed?
2. **Click on the service/app** (not just the project)
3. **Then** go to Variables tab

**Why:** Variables must be at the **SERVICE level**, not project level!

### Step 3: Verify Variables Tab

1. **Click "Variables"** tab (left sidebar)
2. **Do you see a list of variables?**

**If you see variables:**
- Continue to Step 4

**If Variables tab is empty:**
- Variables aren't set
- Go to Step 5 to add them

### Step 4: Check Variable Names (EXACT Spelling!)

**Look at your variables list. Check:**

**Variable 1:**
- ✅ Name should be EXACTLY: `SUPABASE_URL`
- ❌ NOT: `supabase_url` (lowercase)
- ❌ NOT: `SUPABASEURL` (no underscore)
- ❌ NOT: `SUPABASE_URL ` (trailing space)

**Variable 2:**
- ✅ Name should be EXACTLY: `SUPABASE_ANON_KEY`
- ❌ NOT: `SUPABASE_ANON` (missing _KEY)
- ❌ NOT: `supabase_anon_key` (lowercase)
- ❌ NOT: `SUPABASE_ANON_KEY ` (trailing space)

**If names are wrong:**
1. **Delete** the wrong variable
2. **Add** again with correct name

### Step 5: Add Variables (If Missing or Wrong)

**Click "New Variable" button:**

**Variable 1:**
```
Variable Name: SUPABASE_URL
Value: https://gmhzouyrfbdasvestkvu.supabase.co
```
- **IMPORTANT:** Copy name EXACTLY: `SUPABASE_URL`
- **IMPORTANT:** No spaces before/after name or value
- Click **"Add"** or **"Save"**

**Variable 2:**
```
Variable Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHpvdXlyZmJkYXN2ZXN0a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk2NzYsImV4cCI6MjA3OTg4NTY3Nn0.e625U0XC94FMFWCj3fdC1nSHyaBRRjZoDXP_b_uwcbw
```
- **IMPORTANT:** Copy name EXACTLY: `SUPABASE_ANON_KEY`
- **IMPORTANT:** Value is very long - copy the ENTIRE string
- **IMPORTANT:** No spaces before/after
- Click **"Add"** or **"Save"**

### Step 6: Verify Variables Are Saved

**After adding:**
1. **Refresh the page** (F5)
2. **Check Variables tab again**
3. **Verify both variables are still there**

**If they disappeared:**
- They weren't saved properly
- Add them again
- Make sure to click "Add" or "Save"

### Step 7: Check Variable Values

**Click on each variable to edit:**

**SUPABASE_URL:**
- ✅ Should be: `https://gmhzouyrfbdasvestkvu.supabase.co`
- ❌ Should NOT have spaces before/after
- ❌ Should NOT be empty

**SUPABASE_ANON_KEY:**
- ✅ Should be a very long string starting with `eyJ...`
- ✅ Should end with `...uwcbw`
- ❌ Should NOT be truncated
- ❌ Should NOT have spaces

### Step 8: Redeploy (CRITICAL!)

**After adding/verifying variables:**

1. **Go to "Deployments" tab**
2. **Click "Redeploy"** button
3. **Wait 2-5 minutes** for deployment
4. **Check logs** - should see variables are loaded

**IMPORTANT:** Railway only reads variables when deploying/starting!

---

## 🔍 Diagnostic: Check What Railway Sees

### Method 1: Check Deployment Logs

After redeploy, check logs for:

**✅ Success:**
```
✅ Supabase client initialized successfully
✅ Client build folder found
Server running on port 5000
```

**❌ Still Error:**
```
⚠️  Missing Supabase configuration
Current SUPABASE_URL: NOT SET
```

**If still "NOT SET":**
- Variables aren't being read
- Check Step 2 (Service level)
- Check Step 4 (Variable names)

### Method 2: Add Debug Logging

I've updated the code to show what Railway sees. After redeploy, logs will show:
```
Current SUPABASE_URL: Set  ← Should say "Set"
Current SUPABASE_ANON_KEY: Set  ← Should say "Set"
```

**If it says "NOT SET":**
- Variables aren't configured correctly
- Follow steps above

---

## 🛠️ Common Issues & Fixes

### Issue 1: Variables at Project Level Instead of Service Level

**Symptom:** Variables exist but app can't read them

**Fix:**
1. Click on your **service/app** (not project)
2. Go to Variables tab for that service
3. Add variables there

### Issue 2: Variable Names Have Typos

**Symptom:** Variables exist but names don't match

**Fix:**
- Delete variables
- Add again with EXACT names:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

### Issue 3: Variables Not Saved

**Symptom:** Added variables but they disappeared

**Fix:**
- Make sure to click "Add" or "Save" button
- Don't just type and close
- Refresh page to verify they're saved

### Issue 4: Didn't Redeploy After Adding

**Symptom:** Added variables but still getting error

**Fix:**
- **MUST redeploy** after adding variables
- Go to Deployments → Redeploy
- Wait for deployment to complete

---

## 📋 Complete Verification Checklist

Before redeploying, verify:

- [ ] Opened Railway Dashboard
- [ ] Clicked on **SERVICE** (not just project)
- [ ] Went to Variables tab for that service
- [ ] `SUPABASE_URL` exists in list
- [ ] `SUPABASE_ANON_KEY` exists in list
- [ ] Variable names are EXACTLY correct (case-sensitive)
- [ ] Variable values are complete (no truncation)
- [ ] No spaces in variable names or values
- [ ] Variables are saved (still visible after refresh)
- [ ] Ready to redeploy

After redeploying:

- [ ] Deployment shows "Active" status
- [ ] Logs show "Supabase client initialized successfully"
- [ ] Logs show "Server running on port"
- [ ] No "NOT SET" errors in logs

---

## 🎯 Quick Test

**After adding variables and redeploying:**

1. **Check logs** - Should see:
   ```
   ✅ Supabase client initialized successfully
   ```

2. **Visit:** `https://invoicewithai.railway.app/api/health`
   - Should return: `{"status":"OK"}`

3. **Visit:** `https://invoicewithai.railway.app/`
   - Should see login page (not Railway default page)

---

## 🆘 Still Not Working?

### Check These:

1. **Are you in the SERVICE level?**
   - Not project level
   - Click on your service/app first

2. **Are variable names EXACT?**
   - `SUPABASE_URL` (all caps, underscore)
   - `SUPABASE_ANON_KEY` (all caps, underscores)

3. **Did you redeploy?**
   - Must redeploy after adding variables
   - Check Deployments tab

4. **Are variables saved?**
   - Refresh page
   - Check if they're still in list

---

**The most common issue: Variables are at PROJECT level instead of SERVICE level!**

**Fix: Click on your service/app → Variables → Add variables there!** 🎯

