# Fix 404 Error on /api/health Endpoint

## Problem
Getting `404 (Not Found)` when accessing `https://invoicewithai.railway.app/api/health`

## Root Causes
1. **Server not running** - Server crashed on startup
2. **Routes not registered** - Routes failed to load
3. **Railway routing issue** - Railway not forwarding requests correctly

## Step-by-Step Fix

### Step 1: Check Railway Deployment Logs

1. Go to [Railway Dashboard](https://railway.app)
2. Click on your project
3. Click on **Deployments** tab
4. Click on the **latest deployment**
5. Click **View Logs**

### Step 2: Look for These Messages

✅ **Good signs (server is running):**
```
🚀 Starting server...
📍 PORT: 5000
✅ Server running on port 5000
✅ Health check available at: http://0.0.0.0:5000/api/health
✅ All API routes loaded successfully
```

❌ **Bad signs (server crashed):**
```
❌ Error loading routes: ...
❌ Uncaught Exception: ...
Missing Supabase configuration...
Missing OpenAI API key...
```

### Step 3: Check if Server Started

In Railway logs, look for:
- `✅ Server running on port 5000` - Server started successfully
- `Server running on port ${PORT}` - Old format (also OK)

**If you DON'T see this message:**
- Server crashed before starting
- Check for error messages above it
- Most common: Missing environment variables

### Step 4: Verify Environment Variables

Go to Railway Dashboard → Your Service → **Variables** tab

**Required variables:**
- `SUPABASE_URL` ✅
- `SUPABASE_ANON_KEY` ✅
- `OPENAI_API_KEY` ✅
- `JWT_SECRET` ✅
- `PORT` (usually auto-set by Railway) ✅

**If any are missing:**
1. Add them in Railway Variables
2. Redeploy (Railway auto-redeploys when you add variables)

### Step 5: Check Railway Service Settings

1. Railway Dashboard → Your Service → **Settings**
2. Check **Start Command**: Should be `node server/index.js`
3. Check **Root Directory**: Should be `/` (root of repo)

### Step 6: Test After Redeploy

After Railway redeploys (2-3 minutes):

1. **Test health endpoint:**
   ```
   https://invoicewithai.railway.app/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running","timestamp":"..."}`

2. **Test root page:**
   ```
   https://invoicewithai.railway.app/
   ```
   Should show login page (not Railway default page)

## Common Issues & Solutions

### Issue 1: Server Crashes on Startup

**Symptoms:**
- Logs show error then stop
- No "Server running" message

**Solution:**
- Check Railway logs for specific error
- Usually missing environment variables
- Add missing variables → Redeploy

### Issue 2: Routes Not Loading

**Symptoms:**
- Server starts but `/api/health` returns 404
- Logs show "Error loading routes"

**Solution:**
- Check Railway logs for route loading errors
- Verify all route files exist in `server/routes/`
- Check for syntax errors in route files

### Issue 3: Railway Default Page Shows

**Symptoms:**
- Root URL shows Railway's default API page
- `/api/health` returns 404

**Solution:**
- Server is not running at all
- Check Railway logs for startup errors
- Verify `startCommand` in `railway.json` is correct

### Issue 4: Build Failed

**Symptoms:**
- Deployment shows "Build Failed"
- No deployment logs available

**Solution:**
- Check build logs (not deployment logs)
- Common issues:
  - ESLint errors (should be fixed now)
  - npm install failures
  - Missing dependencies

## Debug Commands (If You Have SSH Access)

If Railway provides SSH access:

```bash
# Check if server process is running
ps aux | grep node

# Check if port is listening
netstat -tulpn | grep 5000

# Check environment variables
env | grep SUPABASE
env | grep OPENAI
```

## Still Not Working?

1. **Check Railway Status Page:** https://status.railway.app
2. **Verify GitHub Connection:** Railway → Settings → Source
3. **Try Manual Redeploy:** Railway → Deployments → Redeploy
4. **Check Railway Documentation:** https://docs.railway.app

## What We Fixed

✅ Added comprehensive startup logging
✅ Added 404 handler for unmatched API routes  
✅ Added error handling for route loading
✅ Added uncaught exception handlers
✅ Health check route is now first (before React static serving)

The new logs will help identify exactly where the problem is!

