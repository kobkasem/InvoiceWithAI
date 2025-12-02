# 🔧 Fix: Railway Not Reading Supabase Variables

## Problem
You're seeing this error even though you set the variables:
```
Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.
Current SUPABASE_URL: NOT SET
Current SUPABASE_ANON_KEY: NOT SET
```

## Common Causes

### Cause 1: Variables Set at Wrong Level (Most Common!)
Railway has TWO levels for variables:
- **Project Level** - Shared across all services
- **Service Level** - Specific to one service

**Your variables MUST be at SERVICE level!**

### Cause 2: Variable Name Typos
Variable names are **case-sensitive**:
- ✅ `SUPABASE_URL` (correct)
- ❌ `supabase_url` (wrong)
- ❌ `Supabase_URL` (wrong)
- ❌ `SUPABASE-URL` (wrong)

### Cause 3: Not Redeployed After Adding Variables
Railway needs to redeploy after adding variables.

---

## ✅ Step-by-Step Fix

### Step 1: Verify You're in the Right Place

1. **Go to Railway Dashboard:** https://railway.app
2. **Click on your PROJECT** (not just the dashboard)
3. **Click on your SERVICE** (the actual app/service, not the project)
   - You should see tabs: **Variables**, **Settings**, **Deployments**, etc.
   - If you only see project-level options, you're in the wrong place!

### Step 2: Check Current Variables

1. **Click "Variables" tab** (left sidebar)
2. **Look for:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

**Do you see them?**
- ✅ **Yes** → Go to Step 3
- ❌ **No** → Go to Step 4

### Step 3: Verify Variable Names Are Exact

Check the variable names:
- Must be exactly: `SUPABASE_URL` (all caps, underscore)
- Must be exactly: `SUPABASE_ANON_KEY` (all caps, underscore)

**Common mistakes:**
- `supabase_url` (lowercase) ❌
- `SUPABASE-URL` (dash instead of underscore) ❌
- `SUPABASE_URL ` (trailing space) ❌
- `SUPABASE_ANON_KEY` (correct) ✅

**If names are wrong:**
1. Delete the wrong variable
2. Add it again with correct name
3. Railway will auto-redeploy

### Step 4: Add Variables (If Missing)

1. **Click "New Variable"** button
2. **Add First Variable:**
   - **Name:** `SUPABASE_URL` (exactly like this)
   - **Value:** Your Supabase project URL (starts with `https://`)
   - **Click "Add"**

3. **Add Second Variable:**
   - **Click "New Variable"** again
   - **Name:** `SUPABASE_ANON_KEY` (exactly like this)
   - **Value:** Your Supabase anon/public key (long string)
   - **Click "Add"**

### Step 5: Verify Values Are Correct

**SUPABASE_URL should look like:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**SUPABASE_ANON_KEY should look like:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
(Long string starting with `eyJ`)

**Common mistakes:**
- ❌ Extra spaces before/after
- ❌ Quotes around the value (don't add quotes!)
- ❌ Wrong key (using service_role instead of anon)
- ❌ Missing `https://` in URL

### Step 6: Force Redeploy

After adding/updating variables:

1. **Go to "Deployments" tab**
2. **Click "Redeploy"** (or wait for auto-redeploy - usually happens automatically)
3. **Wait 2-3 minutes** for deployment to complete

### Step 7: Check Logs

1. **Click "Deployments" tab**
2. **Click latest deployment**
3. **Click "View Logs"**
4. **Look for:**

✅ **Good:**
```
✅ Supabase client initialized successfully
📍 Supabase URL: https://xxxxx.supabase.co...
```

❌ **Bad:**
```
⚠️  Missing Supabase configuration...
Current SUPABASE_URL: NOT SET
```

---

## 🧪 Test After Fix

After Railway redeploys, test:

1. **Check health endpoint:**
   ```
   https://invoicewithai.railway.app/api/health
   ```

2. **Check logs** - should show:
   ```
   ✅ Supabase client initialized successfully
   ```

---

## 🔍 Troubleshooting

### Issue: Variables Still Not Found After Adding

**Check:**
1. Are variables at **SERVICE level** (not project level)?
2. Are variable names **exactly** `SUPABASE_URL` and `SUPABASE_ANON_KEY`?
3. Did Railway **redeploy** after adding variables?
4. Check logs - do you see the debug output showing which env vars exist?

### Issue: Variables Show in Dashboard But Not in Logs

**This means:**
- Variables are set but Railway didn't redeploy
- Or variables are at project level instead of service level

**Fix:**
1. Go to **Service** (not project) → Variables
2. Verify variables are there
3. **Manually redeploy** (Deployments → Redeploy)

### Issue: Getting Supabase Values

**Where to find your Supabase values:**

1. **Go to Supabase Dashboard:** https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings** → **API**
4. **Copy:**
   - **Project URL** → This is `SUPABASE_URL`
   - **anon/public key** → This is `SUPABASE_ANON_KEY`

---

## 📋 Checklist

Before asking for help, verify:

- [ ] Variables are at **SERVICE level** (not project level)
- [ ] Variable names are exactly: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- [ ] Values don't have extra spaces or quotes
- [ ] Railway has redeployed after adding variables
- [ ] Checked logs - do you see "Supabase client initialized"?
- [ ] Values are correct (URL starts with https://, key starts with eyJ)

---

## 🆘 Still Not Working?

Share these details:

1. **Screenshot of Railway Variables tab** (showing variable names)
2. **Last 20 lines of Railway logs** (showing the error)
3. **Are variables at SERVICE or PROJECT level?**
4. **Did you redeploy after adding variables?**

I'll help you fix it! 🚀

