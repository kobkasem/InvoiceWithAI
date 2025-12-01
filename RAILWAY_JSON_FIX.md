# 🔧 Railway.json Configuration - Can't Change Build Command

## Issue
You can't change the build command in Railway dashboard because Railway automatically reads `railway.json` file and uses that configuration.

## ✅ Solution: Update railway.json File

I've updated the `railway.json` file with a simpler, more reliable build command:

```json
{
  "build": {
    "buildCommand": "npm install && cd client && npm install && npm run build"
  }
}
```

---

## 🚀 What to Do

### Step 1: The Fix is Already Pushed

The updated `railway.json` is already on GitHub. Railway will automatically use it on the next deployment.

### Step 2: Trigger a New Deployment

**Option A: Wait for Auto-Deploy**
- Railway auto-deploys when you push to GitHub
- Since we just pushed, it should deploy automatically
- Check **Deployments** tab to see if it's deploying

**Option B: Manual Redeploy**
1. Railway Dashboard → **Deployments** tab
2. Click **"Redeploy"** button (or three dots menu → Redeploy)
3. Railway will use the updated `railway.json`

**Option C: Push a Small Change**
- Make any small change (add a comment, update README)
- Push to GitHub
- Railway will auto-deploy with new `railway.json`

---

## 🔍 Verify railway.json is Being Used

### Check Railway Logs

1. Railway Dashboard → **Deployments**
2. Click latest deployment → **View Logs**
3. Look for the build command being executed
4. Should see: `npm install && cd client && npm install && npm run build`

### Check Settings

1. Railway Dashboard → **Settings** → **Build & Deploy**
2. You might see:
   - Build Command: (might be grayed out or show "From railway.json")
   - Or it might show the command from `railway.json`

---

## 📝 Current railway.json Configuration

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && cd client && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**This is the simplest, most reliable build command.**

---

## 🆘 If Railway Still Uses Old Command

### Option 1: Delete railway.json Temporarily

If Railway keeps using an old command:

1. **Temporarily rename** `railway.json` to `railway.json.backup`
2. Push to GitHub
3. Railway will use auto-detection
4. Set build command manually in Settings
5. Then rename back if needed

**But this shouldn't be necessary** - the updated `railway.json` should work.

### Option 2: Check for Cached Configuration

1. Railway Dashboard → **Settings**
2. Look for any cached or locked settings
3. Try clicking **"Reset"** or **"Clear Cache"** if available

---

## ✅ Summary

**What happened:**
- Railway reads `railway.json` automatically
- Manual settings in UI are overridden by `railway.json`
- This is actually good - configuration is in code!

**What I did:**
- ✅ Updated `railway.json` with simpler build command
- ✅ Pushed to GitHub
- ✅ Railway will use it on next deploy

**What you need to do:**
- ✅ Wait for auto-deploy OR manually redeploy
- ✅ Check logs to verify it's using the new command
- ✅ Make sure Node version is 20 (set in Variables or .nvmrc)

---

## 🎯 Next Steps

1. **Check Deployments tab** - Is it deploying?
2. **View Logs** - Is it using the new build command?
3. **Verify Node 20** - Check logs show `v20.x.x`
4. **Watch for success** - Build should complete!

The updated `railway.json` is on GitHub and Railway will use it automatically! 🚀

