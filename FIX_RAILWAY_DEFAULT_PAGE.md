# 🔧 Fix: Railway Showing Default API Page

## Problem

Visiting `https://invoicewithai.railway.app/` shows Railway's default API page instead of your React app.

---

## 🔍 Root Causes

### Cause 1: Server Not Running (Most Likely)

- Server crashes before it can serve files
- Usually due to missing environment variables
- Railway shows default page when no server responds

### Cause 2: React Build Missing

- Build didn't complete successfully
- `client/build` folder doesn't exist
- Server can't serve React app

### Cause 3: Wrong Port Configuration

- Railway sets PORT automatically
- Server might be listening on wrong port

---

## ✅ Step-by-Step Fix

### Step 1: Check Railway Logs

1. **Railway Dashboard** → Your Project
2. **Deployments** tab → Latest deployment
3. **View Logs**

**Look for:**

- ✅ "Server running on port 5000" (or Railway's PORT)
- ✅ "Client build folder found"
- ❌ "Missing Supabase configuration"
- ❌ Build errors

### Step 2: Add Environment Variables (If Missing)

If logs show "Missing Supabase configuration":

1. **Variables** tab → Add:
   - `SUPABASE_URL` = `https://gmhzouyrfbdasvestkvu.supabase.co`
   - `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHpvdXlyZmJkYXN2ZXN0a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk2NzYsImV4cCI6MjA3OTg4NTY3Nn0.e625U0XC94FMFWCj3fdC1nSHyaBRRjZoDXP_b_uwcbw`
2. **Redeploy**

### Step 3: Verify Build Completed

In logs, look for:

```
Creating an optimized production build...
Compiled successfully!
The build folder is ready to be deployed.
```

**If build failed:**

- Check build logs for errors
- Fix errors
- Redeploy

### Step 4: Check Server Started

In logs, look for:

```
✅ Client build folder found, serving static files
Server running on port 5000
```

**If you see:**

```
⚠️  Client build folder not found
```

Then React build didn't complete.

---

## 🛠️ Quick Fixes

### Fix 1: Verify Build Command

1. **Railway Settings** → Build & Deploy
2. **Build Command** should be:
   ```
   npm install && cd client && npm install && npm run build
   ```
3. **Save** and redeploy

### Fix 2: Check PORT Variable

Railway sets PORT automatically. Make sure:

1. **Variables** tab → `PORT` is set (or Railway auto-sets it)
2. Server uses `process.env.PORT` (which it does)

### Fix 3: Force Redeploy

1. **Deployments** tab
2. **Redeploy**
3. **Watch logs** carefully
4. **Check** for success messages

---

## 🧪 Diagnostic Tests

### Test 1: Check Health Endpoint

Visit: `https://invoicewithai.railway.app/api/health`

**✅ Success:** `{"status":"OK","message":"Server is running"}`

- Server is running
- Issue is with React build or routing

**❌ Failure:** Connection refused or error

- Server not running
- Check logs for errors

### Test 2: Check Root Path

Visit: `https://invoicewithai.railway.app/`

**✅ Success:** Login page (React app)

- Everything working!

**❌ Failure:** Railway default page or error

- Server not running or build missing

---

## 📋 Complete Checklist

Before testing, verify:

- [ ] Environment variables are set in Railway
- [ ] Build command is correct
- [ ] Build logs show "Build completed successfully"
- [ ] Server logs show "Server running on port"
- [ ] Server logs show "Client build folder found"
- [ ] No errors in logs
- [ ] Deployment shows "Active" status

---

## 🎯 Expected Result After Fix

When visiting `https://invoicewithai.railway.app/`:

- ✅ Should see **Login page** (React app)
- ✅ Should NOT see Railway's default API page
- ✅ Should be able to login
- ✅ Health check should work: `/api/health`

---

## 🆘 Still Not Working?

### Check These:

1. **Railway Logs** - What do they show?

   - Server running?
   - Build completed?
   - Any errors?

2. **Variables** - Are they set?

   - Check Variables tab
   - Verify names are exact

3. **Build** - Did it complete?

   - Check build logs
   - Look for "Build completed"

4. **Port** - Is server listening?
   - Check logs for "Server running on port"
   - Railway sets PORT automatically

---

**Check Railway logs first - they will tell you what's wrong!** 🔍
