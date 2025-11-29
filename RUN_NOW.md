# 🚀 RUN THE APPLICATION NOW

## ✅ Pre-flight Checklist

Before running, make sure:

- [x] ✅ `.env` file exists (DONE!)
- [x] ✅ Dependencies installed (DONE!)
- [ ] ⚠️ **SQL Schema run in Supabase** (Check this!)

---

## Step 1: Verify Supabase Database Setup

**IMPORTANT**: Make sure you've run the SQL schema in Supabase!

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"Table Editor"** in left sidebar
4. Verify you see these tables:
   - ✅ `users`
   - ✅ `invoices`
   - ✅ `prompts`

**If tables don't exist:**
- Go to **"SQL Editor"**
- Copy ALL contents from `supabase_schema.sql`
- Paste and click **"Run"**

---

## Step 2: Start the Application

Open your terminal in the project folder and run:

```bash
npm run dev
```

This will start:
- **Backend Server**: http://localhost:5000
- **Frontend App**: http://localhost:3000

---

## Step 3: What You Should See

### ✅ Success Output:
```
[0] Database initialized successfully
[0] Server running on port 5000
[1] Compiled successfully!
[1] webpack compiled with 0 warnings
```

### ❌ If You See Errors:

**Error: "relation 'users' does not exist"**
- **Fix**: Run `supabase_schema.sql` in Supabase SQL Editor

**Error: "Missing Supabase configuration"**
- **Fix**: Check `.env` file has `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**Error: "Invalid API key"**
- **Fix**: Verify Supabase credentials in `.env` match your Supabase project

---

## Step 4: Login

1. Open browser: **http://localhost:3000**
2. Login with:
   - **Email**: `kasem_u@synnex.co.th`
   - **Password**: `admin123`

---

## 🎉 You're Done!

Once logged in, you can:
- Upload invoices
- View invoice list
- Check dashboard
- Manage users
- Edit prompts

---

## Quick Commands Reference

```bash
# Start application
npm run dev

# Start backend only
npm run server

# Start frontend only  
npm run client

# Install dependencies (if needed)
npm install
```

---

## Need Help?

- Check `HOW_TO_RUN.md` for detailed troubleshooting
- Check console output for specific error messages
- Verify Supabase tables exist in Table Editor

