# 🔧 Fix: Railway Showing Default API Page Instead of Login

## Problem
Visiting `https://invoicewithai.railway.app/` shows Railway's default API page (ASCII train) instead of your React login page.

**This means Railway isn't connecting to your Express server.**

---

## 🔍 Root Causes

### Cause 1: Server Not Running (Most Likely)
- Server crashes during startup
- Usually due to missing environment variables
- Railway shows default page when no server responds

### Cause 2: Wrong Service Configuration
- Railway doesn't know which service to run
- Port configuration issue
- Service not properly configured

### Cause 3: React Build Missing
- Build didn't complete
- `client/build` folder doesn't exist
- Server can't serve React app

---

## ✅ Step-by-Step Fix

### Step 1: Check Railway Service Configuration

1. **Railway Dashboard** → Your Project
2. **Look for your service/app** - Do you see a service listed?
3. **Click on the service** (not just project)
4. **Go to Settings** tab

**Check:**
- **Start Command** should be: `node server/index.js`
- **Port** - Railway sets this automatically (check if PORT variable is set)

### Step 2: Verify All Environment Variables Are Set

**Go to Variables tab** and verify you have ALL 7 variables:

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `OPENAI_API_KEY` (with real key)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `JWT_SECRET`
- [ ] `FRONTEND_URL`

**If any are missing, add them!**

### Step 3: Check Railway Logs

1. **Deployments** tab → Latest deployment
2. **View Logs**

**Look for:**
- ✅ "Server running on port 5000" (or Railway's PORT)
- ✅ "Client build folder found"
- ❌ "Missing Supabase configuration"
- ❌ Server crash errors

### Step 4: Verify Build Completed

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

---

## 🛠️ Quick Fixes

### Fix 1: Verify Start Command

1. **Railway Settings** → Build & Deploy
2. **Start Command** should be: `node server/index.js`
3. **Save** if changed

### Fix 2: Check Service Type

Railway should detect it as a **Web Service** (not API service).

1. **Settings** → Check service type
2. Should be "Web Service" or "Node.js"
3. If wrong, you might need to recreate the service

### Fix 3: Force Redeploy

1. **Deployments** tab
2. **Redeploy**
3. **Watch logs** carefully
4. **Check** for "Server running" message

---

## 🔧 Alternative: Check Railway Service Setup

### If Railway Shows Default Page:

**Railway shows its default page when:**
- No service is running
- Service crashed
- Wrong service type configured

**Check:**
1. **Railway Dashboard** → Your Project
2. **Do you see a service listed?**
   - ✅ Yes → Click on it, check Variables and Settings
   - ❌ No → Railway might not have detected your app correctly

### If No Service Detected:

1. **Delete the current deployment**
2. **Create new service** from GitHub repo
3. **Railway should auto-detect** Node.js
4. **Add all environment variables**
5. **Deploy**

---

## 📋 Diagnostic Checklist

Check these:

- [ ] Service exists in Railway (not just project)
- [ ] Start Command is: `node server/index.js`
- [ ] All 7 environment variables are set
- [ ] Variables are at SERVICE level (not project level)
- [ ] Build logs show "Build completed successfully"
- [ ] Server logs show "Server running on port"
- [ ] No errors in logs
- [ ] Deployment shows "Active" status

---

## 🧪 Test: Is Server Running?

### Test 1: Health Check

Visit: `https://invoicewithai.railway.app/api/health`

**✅ Success:** `{"status":"OK","message":"Server is running"}`
- Server is running!
- Issue is with React routing

**❌ Failure:** Connection refused or Railway default page
- Server not running
- Check logs for errors

### Test 2: Check Root Path

Visit: `https://invoicewithai.railway.app/`

**✅ Success:** Login page (React app)
- Everything working!

**❌ Failure:** Railway default page
- Server not running or not configured correctly

---

## 🆘 Most Common Issue: Variables Not Set

**If logs show:**
```
Current SUPABASE_URL: NOT SET
Current SUPABASE_ANON_KEY: NOT SET
```

**Then:**
1. **Variables** tab → Add missing variables
2. **Make sure** they're at SERVICE level
3. **Redeploy**

---

## 🎯 Expected Result

After fixing, when you visit `https://invoicewithai.railway.app/`:

- ✅ Should see **Login page** (React app with form)
- ✅ Should NOT see Railway's default API page
- ✅ Should be able to login

---

## 🚀 Quick Action Items

1. [ ] Check Railway → Your Project → Your Service exists
2. [ ] Check Variables tab → All 7 variables are set
3. [ ] Check Settings → Start Command is `node server/index.js`
4. [ ] Check Deployments → Latest deployment logs
5. [ ] Look for "Server running on port" in logs
6. [ ] If not found, add missing variables and redeploy
7. [ ] Test `/api/health` endpoint
8. [ ] Test root URL `/`

---

**The server needs to be running for Railway to serve your app instead of the default page!**

**Check Railway logs to see if server is starting successfully!** 🔍

