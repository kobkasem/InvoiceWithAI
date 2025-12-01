# 🔐 Environment Variables Setup for Railway

## Important: Railway Doesn't Use .env File!

**For Railway deployment**, you **don't need to change your local `.env` file**. Instead, you'll set environment variables **directly in Railway dashboard**.

However, you can keep your local `.env` file for **local development** - it won't affect Railway.

---

## 📋 Environment Variables for Railway

When deploying to Railway, you need to add these variables in the **Railway dashboard**:

### Required Variables

| Variable            | Value                                      | Notes                                                          |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `NODE_ENV`          | `production`                               | Set to production mode                                         |
| `PORT`              | `5000`                                     | Railway will override this automatically, but set it anyway    |
| `SUPABASE_URL`      | `https://gmhzouyrfbdasvestkvu.supabase.co` | ✅ Already have this (from env.example)                        |
| `SUPABASE_ANON_KEY` | `eyJhbGci...`                              | ✅ Already have this (from env.example)                        |
| `JWT_SECRET`        | **Generate new one**                       | ⚠️ **MUST CHANGE** - Generate a strong random string           |
| `OPENAI_API_KEY`    | `sk-proj-...`                              | ⚠️ **MUST CHANGE** - Use your actual OpenAI key                |
| `FRONTEND_URL`      | `https://your-app.up.railway.app`          | ⚠️ **Set after first deploy** - Railway will give you this URL |

### Optional Variables (for email/password reset)

| Variable         | Value                  | Notes                           |
| ---------------- | ---------------------- | ------------------------------- |
| `EMAIL_SERVICE`  | `gmail`                | Only if you need email features |
| `EMAIL_USER`     | `your-email@gmail.com` | Only if you need email features |
| `EMAIL_PASSWORD` | `your-app-password`    | Only if you need email features |
| `EMAIL_FROM`     | `noreply@synnex.co.th` | Only if you need email features |

---

## 🔑 How to Generate Values

### 1. Generate JWT_SECRET

**On Windows (PowerShell):**

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**On Mac/Linux:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Copy this value** - you'll use it for `JWT_SECRET` in Railway.

### 2. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-proj-`)

### 3. Get Supabase Credentials

✅ **You already have these** from `env.example`:

- `SUPABASE_URL`: `https://gmhzouyrfbdasvestkvu.supabase.co`
- `SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**To verify or get new ones:**

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon/public key**

### 4. Get Railway URL (After First Deploy)

1. Deploy to Railway first
2. Go to Railway dashboard → Your project → **Settings** → **Networking**
3. Railway will show: `https://your-app-name.up.railway.app`
4. Copy this URL
5. Add/update `FRONTEND_URL` variable in Railway with this URL
6. Redeploy (or wait for auto-redeploy)

---

## 📝 Step-by-Step: Adding Variables in Railway

### Step 1: Go to Railway Dashboard

1. Sign in to [railway.app](https://railway.app)
2. Select your project

### Step 2: Open Variables Tab

1. Click on your project
2. Click **"Variables"** tab (or go to **Settings** → **Variables**)

### Step 3: Add Each Variable

Click **"New Variable"** and add each one:

```
Variable Name: NODE_ENV
Value: production
```

```
Variable Name: PORT
Value: 5000
```

```
Variable Name: SUPABASE_URL
Value: https://gmhzouyrfbdasvestkvu.supabase.co
```

```
Variable Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHpvdXlyZmJkYXN2ZXN0a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk2NzYsImV4cCI6MjA3OTg4NTY3Nn0.e625U0XC94FMFWCj3fdC1nSHyaBRRjZoDXP_b_uwcbw
```

```
Variable Name: JWT_SECRET
Value: aa643190-3dcd-47a0-9dce-66f93400b6e7
```

```
Variable Name: OPENAI_API_KEY
Value: sk-proj-your-actual-openai-key-here
```

```
Variable Name: FRONTEND_URL
Value: https://your-app.up.railway.app
(Update this AFTER first deployment with your actual Railway URL)
```

---

## ⚠️ Important Notes

### 1. Don't Push .env to GitHub

✅ **Good**: Your `.env` file is already in `.gitignore` - it won't be pushed to GitHub.

❌ **Bad**: Never commit `.env` file with real secrets to GitHub!

### 2. Local .env vs Railway Variables

- **Local `.env`**: Use for development on your computer
- **Railway Variables**: Use for production deployment
- They are **separate** - Railway doesn't read your local `.env` file

### 3. Values That MUST Change

- ✅ `JWT_SECRET` - **MUST** generate a new strong random string
- ✅ `OPENAI_API_KEY` - **MUST** use your actual OpenAI key (not placeholder)
- ✅ `FRONTEND_URL` - **MUST** update with Railway URL after first deploy

### 4. Values You Can Keep

- ✅ `SUPABASE_URL` - Already correct (if using same Supabase project)
- ✅ `SUPABASE_ANON_KEY` - Already correct (if using same Supabase project)
- ✅ `PORT` - Can keep as 5000 (Railway will handle it)

---

## 🔄 After First Deployment

1. **Get your Railway URL** from Settings → Networking
2. **Update `FRONTEND_URL`** in Railway Variables
3. **Redeploy** (or wait for auto-redeploy)
4. **Test** your application

---

## ✅ Quick Checklist

Before deploying to Railway:

- [ ] Generated new `JWT_SECRET` (random 32+ character string)
- [ ] Have your actual `OPENAI_API_KEY` ready
- [ ] Verified `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- [ ] Ready to add variables in Railway dashboard
- [ ] Will update `FRONTEND_URL` after first deploy

---

## 🆘 Troubleshooting

### "Missing environment variables" error

- Check Railway dashboard → Variables tab
- Make sure all required variables are added
- Check for typos in variable names

### "Invalid API key" error

- Verify `OPENAI_API_KEY` is correct (starts with `sk-proj-`)
- Make sure no extra spaces before/after the value
- Check OpenAI dashboard to verify key is active

### "Database connection failed"

- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check Supabase project is active
- Verify database tables exist (run `supabase_schema.sql`)

---

**Remember**: Railway uses environment variables from the dashboard, NOT your local `.env` file! 🚀
