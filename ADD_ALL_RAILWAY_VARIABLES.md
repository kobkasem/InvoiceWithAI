# 🔐 Add ALL Required Variables in Railway

## ⚠️ Current Errors

Your deployment is failing because these variables are **NOT SET** in Railway:

1. ❌ `SUPABASE_URL` - NOT SET
2. ❌ `SUPABASE_ANON_KEY` - NOT SET  
3. ❌ `OPENAI_API_KEY` - NOT SET

---

## ✅ Step-by-Step: Add ALL Variables

### Step 1: Go to Railway Variables

1. **Railway Dashboard** → Your Project
2. **Click on your SERVICE/APP** (not just project)
3. **Click "Variables"** tab

### Step 2: Add Variable 1 - SUPABASE_URL

1. **Click "New Variable"**
2. **Variable Name:** `SUPABASE_URL`
3. **Value:** `https://gmhzouyrfbdasvestkvu.supabase.co`
4. **Click "Add"**

### Step 3: Add Variable 2 - SUPABASE_ANON_KEY

1. **Click "New Variable"** again
2. **Variable Name:** `SUPABASE_ANON_KEY`
3. **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHpvdXlyZmJkYXN2ZXN0a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk2NzYsImV4cCI6MjA3OTg4NTY3Nn0.e625U0XC94FMFWCj3fdC1nSHyaBRRjZoDXP_b_uwcbw`
4. **Click "Add"**

### Step 4: Add Variable 3 - OPENAI_API_KEY

1. **Click "New Variable"** again
2. **Variable Name:** `OPENAI_API_KEY`
3. **Value:** `sk-proj-your-actual-openai-key-here`
   - ⚠️ **Replace with your REAL OpenAI API key!**
   - Get it from: https://platform.openai.com/account/api-keys
4. **Click "Add"**

### Step 5: Add Variable 4 - NODE_ENV

1. **Click "New Variable"**
2. **Variable Name:** `NODE_ENV`
3. **Value:** `production`
4. **Click "Add"**

### Step 6: Add Variable 5 - PORT

1. **Click "New Variable"**
2. **Variable Name:** `PORT`
3. **Value:** `5000`
4. **Click "Add"**

### Step 7: Add Variable 6 - JWT_SECRET

1. **Click "New Variable"**
2. **Variable Name:** `JWT_SECRET`
3. **Value:** `aa643190-3dcd-47a0-9dce-66f93400b6e7`
4. **Click "Add"**

### Step 8: Add Variable 7 - FRONTEND_URL

1. **Click "New Variable"**
2. **Variable Name:** `FRONTEND_URL`
3. **Value:** `https://invoicewithai.railway.app`
   - ⚠️ Update this after first successful deploy if Railway gives you a different URL
4. **Click "Add"**

---

## 📋 Complete Variables List

After adding all, your Variables tab should show:

```
SUPABASE_URL
https://gmhzouyrfbdasvestkvu.supabase.co

SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY
sk-proj-your-actual-key-here

NODE_ENV
production

PORT
5000

JWT_SECRET
aa643190-3dcd-47a0-9dce-66f93400b6e7

FRONTEND_URL
https://invoicewithai.railway.app
```

---

## 🔄 Step 9: Redeploy (CRITICAL!)

**After adding ALL variables:**

1. **Go to "Deployments" tab**
2. **Click "Redeploy"**
3. **Wait 2-5 minutes**
4. **Check logs** - should see success!

---

## ✅ Success Indicators

After redeploy, logs should show:

```
✅ Supabase client initialized successfully
✅ OpenAI client initialized successfully
✅ Client build folder found, serving static files
Server running on port 5000
```

**Should NOT see:**
```
❌ Current SUPABASE_URL: NOT SET
❌ Current SUPABASE_ANON_KEY: NOT SET
❌ OpenAIError: The OPENAI_API_KEY environment variable is missing
```

---

## 🎯 Quick Checklist

Before redeploying:

- [ ] `SUPABASE_URL` added
- [ ] `SUPABASE_ANON_KEY` added
- [ ] `OPENAI_API_KEY` added (with REAL key)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `JWT_SECRET` added
- [ ] `FRONTEND_URL` added
- [ ] All variables are at SERVICE level (not project level)
- [ ] Variable names are EXACTLY correct
- [ ] Ready to redeploy

---

## 🆘 Important Notes

### Variable Names Must Be Exact

- ✅ `SUPABASE_URL` (all caps, underscore)
- ✅ `SUPABASE_ANON_KEY` (all caps, underscores)
- ✅ `OPENAI_API_KEY` (all caps, underscores)
- ❌ No spaces, no typos, case-sensitive!

### Service Level vs Project Level

- Variables must be at **SERVICE level**
- Click on your service/app first
- Then go to Variables tab

### OpenAI API Key

- You MUST get a real API key from OpenAI
- Go to: https://platform.openai.com/account/api-keys
- Create new secret key
- Copy it (starts with `sk-proj-`)
- Add to Railway Variables

---

## 🚀 After Adding All Variables

1. **Redeploy**
2. **Check logs** - should see all success messages
3. **Visit:** `https://invoicewithai.railway.app/`
4. **Should see:** Login page (not Railway default page)

---

**Add ALL 7 variables in Railway, then redeploy!** 🎯

