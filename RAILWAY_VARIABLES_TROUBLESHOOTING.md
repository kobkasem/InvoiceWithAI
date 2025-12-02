# 🔍 Troubleshooting: Railway Variables Not Working

## Problem
You've added variables in Railway, but still getting:
```
Current SUPABASE_URL: NOT SET
Current SUPABASE_ANON_KEY: NOT SET
```

---

## 🔍 Diagnostic Steps

### Step 1: Verify Variables Are Actually Set

1. **Railway Dashboard** → Your Project
2. **Click "Variables" tab**
3. **Check the list** - Do you see:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

**If you DON'T see them:**
- They weren't saved properly
- Add them again (see Step 2)

**If you DO see them:**
- Continue to Step 2

---

### Step 2: Check Variable Names (Case-Sensitive!)

**Variable names must be EXACTLY:**

✅ **CORRECT:**
- `SUPABASE_URL` (all uppercase, underscore)
- `SUPABASE_ANON_KEY` (all uppercase, underscores)

❌ **WRONG:**
- `supabase_url` (lowercase)
- `SUPABASEURL` (no underscore)
- `SUPABASE_URL ` (trailing space)
- ` SUPABASE_URL` (leading space)
- `Supabase_Url` (mixed case)

**Action:**
1. Click on each variable to edit
2. Check the name is EXACTLY correct
3. If wrong, delete and recreate with correct name

---

### Step 3: Check Variable Values

**SUPABASE_URL should be:**
- ✅ Starts with `https://`
- ✅ Ends with `.supabase.co`
- ✅ No spaces before/after
- ✅ Example: `https://gmhzouyrfbdasvestkvu.supabase.co`

**SUPABASE_ANON_KEY should be:**
- ✅ Very long string (JWT token)
- ✅ Starts with `eyJ...`
- ✅ No spaces before/after
- ✅ Complete (not truncated)

**Action:**
1. Click on each variable to edit
2. Verify values are complete and correct
3. Remove any spaces

---

### Step 4: Check Variable Level (Project vs Service)

**Important:** Variables must be set at the **SERVICE level**, not project level!

1. **Railway Dashboard** → Your Project
2. Look for **services** or **apps** listed
3. **Click on your service/app** (not just the project)
4. **Go to Variables tab** for that service
5. **Add variables there** if not already added

**Why:** Railway can have variables at:
- Project level (shared)
- Service level (specific to service) ← **This is what you need!**

---

### Step 5: Verify Variables Are Saved

After adding/editing variables:

1. **Refresh the page**
2. **Check Variables tab again**
3. **Verify variables are still there**
4. If they disappeared, they weren't saved properly

---

### Step 6: Force Redeploy

**After verifying variables:**

1. **Go to "Deployments" tab**
2. **Click "Redeploy"** (or three dots → Redeploy)
3. **Wait for deployment to complete** (2-5 minutes)
4. **Check logs** - should see variables are loaded

**Important:** Railway only reads variables when deploying/starting!

---

### Step 7: Check Deployment Logs

1. **Deployments** tab → Latest deployment
2. **Click "View Logs"**
3. **Look for:**
   - ✅ "Database initialized successfully"
   - ✅ "Server running on port 5000"
   - ❌ Should NOT see "NOT SET" errors

**If still seeing "NOT SET":**
- Variables aren't being read
- Continue troubleshooting

---

## 🛠️ Common Issues & Fixes

### Issue 1: Variables Added But Not Saved

**Symptom:** Added variables but they don't appear in list

**Fix:**
1. Make sure to click **"Add"** or **"Save"** button
2. Don't just type and close
3. Verify they appear in the list after adding

---

### Issue 2: Variables at Wrong Level

**Symptom:** Variables exist but app can't read them

**Fix:**
1. Check if you're in **Project** or **Service** level
2. Variables should be at **Service** level
3. Click on your service/app → Variables → Add there

---

### Issue 3: Variable Names Have Spaces

**Symptom:** Variables exist but not being read

**Fix:**
1. Edit each variable
2. Check for spaces before/after name
3. Remove any spaces
4. Save again

---

### Issue 4: Deployment Didn't Pick Up Variables

**Symptom:** Added variables but old deployment still running

**Fix:**
1. **Must redeploy** after adding variables
2. Go to Deployments → Redeploy
3. Wait for new deployment
4. Check logs of NEW deployment

---

### Issue 5: Multiple Services/Apps

**Symptom:** Variables added but wrong service using them

**Fix:**
1. Check how many services/apps you have
2. Make sure variables are in the **correct service**
3. The service running your app needs the variables

---

## 🔧 Step-by-Step Fix

### Option A: Delete and Re-add Variables

1. **Variables** tab → Find `SUPABASE_URL`
2. **Delete** it (trash icon or delete button)
3. **Delete** `SUPABASE_ANON_KEY`
4. **Add them again** with exact names:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. **Verify** they appear in list
6. **Redeploy**

### Option B: Verify and Edit Existing Variables

1. **Variables** tab → Click on `SUPABASE_URL`
2. **Edit** → Check name is exactly `SUPABASE_URL`
3. **Check value** is correct (no spaces)
4. **Save**
5. **Repeat** for `SUPABASE_ANON_KEY`
6. **Redeploy**

---

## 🧪 Test: Verify Variables Are Being Read

### Method 1: Check Railway Logs

After redeploy, check logs for:
```
Current SUPABASE_URL: Set  ← Should say "Set", not "NOT SET"
Current SUPABASE_ANON_KEY: Set  ← Should say "Set", not "NOT SET"
```

### Method 2: Add Debug Variable

1. **Add a test variable:**
   - Name: `TEST_VAR`
   - Value: `test123`
2. **Redeploy**
3. **Check logs** - if TEST_VAR works, others should too

---

## 📋 Complete Checklist

Before contacting support, verify:

- [ ] Variables are in **Variables** tab
- [ ] Variable names are EXACTLY: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- [ ] No spaces in variable names
- [ ] Values are complete (not truncated)
- [ ] Variables are at **Service** level (not just Project level)
- [ ] Clicked "Add" or "Save" after adding
- [ ] Variables appear in list after adding
- [ ] **Redeployed** after adding variables
- [ ] Checked logs of **NEW** deployment
- [ ] Still seeing "NOT SET" in logs

---

## 🆘 Still Not Working?

### Contact Railway Support

If variables are set correctly but still not working:

1. **Railway Dashboard** → Help/Support
2. **Provide:**
   - Screenshot of Variables tab
   - Deployment logs showing error
   - Variable names you're using

### Alternative: Check Railway Documentation

- Railway Docs: https://docs.railway.app
- Look for "Environment Variables" section

---

## ✅ Success Indicators

**Variables are working when:**

1. ✅ Variables appear in Variables tab
2. ✅ Logs show "Set" (not "NOT SET")
3. ✅ Logs show "Database initialized successfully"
4. ✅ App starts without errors

---

**Follow these steps to diagnose why Railway isn't reading your variables!** 🔍

