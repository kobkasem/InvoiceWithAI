# 🔧 Fix Railway Build Error - Node Version & Cache Issue

## Error Messages

1. **Node Version Issue:**
   ```
   npm warn EBADENGINE Unsupported engine {
     package: '@supabase/supabase-js@2.79.0',
     required: { node: '>=20.0.0' },
     current: { node: 'v18.20.5' }
   }
   ```

2. **Cache Lock Issue:**
   ```
   npm error EBUSY: resource busy or locked, rmdir '/app/node_modules/.cache'
   ```

## ✅ Solution: Update Node Version & Fix Cache

### Fix 1: Update Node Version to 20

I've updated `.nvmrc` to Node 20, but you also need to set it in Railway:

**In Railway Dashboard:**

1. Go to your Railway project
2. Click **Settings** tab
3. Scroll to **"Build & Deploy"** section
4. Find **"Node Version"** or **"NIXPACKS_NODE_VERSION"**
5. Set it to: `20` or `20.x`
6. Click **Save**

**OR** Railway should auto-detect `.nvmrc` file (which I've updated to 20).

### Fix 2: Update Build Command

I've updated `railway.json` with a build command that clears cache first:

**In Railway Dashboard:**

1. Go to **Settings** → **Build & Deploy**
2. Update **Build Command** to:
   ```
   rm -rf node_modules/.cache && npm ci && cd client && rm -rf node_modules/.cache && npm ci && npm run build
   ```
3. Click **Save**

---

## 🚀 Quick Fix Steps

### Step 1: Update Railway Settings

1. **Railway Dashboard** → Your Project → **Settings**
2. **Build & Deploy** section:
   - **Node Version**: `20` (or `20.x`)
   - **Build Command**: 
     ```
     rm -rf node_modules/.cache && npm ci && cd client && rm -rf node_modules/.cache && npm ci && npm run build
     ```
3. Click **Save**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** or wait for auto-deploy
3. Watch the build logs

---

## 📝 What Changed

✅ **`.nvmrc`** - Updated from Node 18 to Node 20  
✅ **`railway.json`** - Updated build command to clear cache before npm ci

---

## 🔍 Why This Happens

1. **Node Version**: Supabase v2.79.0 requires Node 20+, but Railway was using Node 18
2. **Cache Lock**: Docker build cache can get locked during parallel builds

---

## ✅ Alternative: Use npm install Instead

If `npm ci` still has issues, you can use `npm install`:

**Build Command:**
```
npm install && cd client && npm install && npm run build
```

**Note**: `npm install` is slightly slower but more forgiving with cache issues.

---

## 🆘 Still Having Issues?

### Check Railway Logs

1. Railway Dashboard → **Deployments**
2. Click latest deployment → **View Logs**
3. Look for:
   - Node version in logs
   - Cache errors
   - Build errors

### Verify Node Version

In Railway logs, you should see:
```
Node version: v20.x.x
```

If you see `v18.x.x`, Railway isn't using Node 20 yet.

### Force Node 20

If Railway doesn't auto-detect `.nvmrc`:

1. **Settings** → **Variables**
2. Add new variable:
   ```
   NIXPACKS_NODE_VERSION = 20
   ```
3. Save and redeploy

---

## 📋 Summary

**What to do:**

1. ✅ Update Node version to 20 in Railway Settings
2. ✅ Update Build Command (already in railway.json)
3. ✅ Redeploy
4. ✅ Check logs for Node 20

**Files updated:**
- ✅ `.nvmrc` → Node 20
- ✅ `railway.json` → Fixed build command

**Next:** Update Railway settings and redeploy!

