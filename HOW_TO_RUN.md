# How to Run the Application

## Quick Start Guide

### Prerequisites Check

✅ **Supabase Project**: Already configured!

- URL: `https://gmhzouyrfbdasvestkvu.supabase.co`
- API Key: Already in `env.example`

### Step-by-Step Instructions

## 1️⃣ Create .env File

Copy the example file:

```bash
copy env.example .env
```

Or create `.env` manually with:

```env
PORT=5000
SUPABASE_URL=https://gmhzouyrfbdasvestkvu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHpvdXlyZmJkYXN2ZXN0a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk2NzYsImV4cCI6MjA3OTg4NTY3Nn0.e625U0XC94FMFWCj3fdC1nSHyaBRRjZoDXP_b_uwcbw
JWT_SECRET=your-secret-key-change-in-production-use-random-string
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: Update `OPENAI_API_KEY` if you want to use AI invoice extraction features.

---

## 2️⃣ Set Up Supabase Database (REQUIRED!)

**This is the most important step!** Without this, the app won't work.

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `gmhzouyrfbdasvestkvu`
3. **Open SQL Editor**: Click "SQL Editor" in left sidebar
4. **Create New Query**: Click "New query" button
5. **Copy SQL Schema**: Open `supabase_schema.sql` file and copy ALL contents
6. **Paste and Run**: Paste into SQL Editor and click "Run" (or Ctrl+Enter)
7. **Verify**: Go to "Table Editor" and check you see:
   - ✅ `users` table
   - ✅ `invoices` table
   - ✅ `prompts` table

### Option B: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
supabase db push
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` and all other dependencies.

---

## 4️⃣ Start the Application

```bash
npm run dev
```

This starts:

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## 5️⃣ Login

1. Open browser: http://localhost:3000
2. Login with:
   - **Email**: `kasem_u@synnex.co.th`
   - **Password**: `admin123`

---

## ✅ Expected Output

When you run `npm run dev`, you should see:

```
[0] Database initialized successfully
[0] Server running on port 5000
[1] Compiled successfully!
[1] webpack compiled with 0 warnings
```

---

## ❌ Troubleshooting

### Error: "Missing Supabase configuration"

- **Solution**: Make sure `.env` file exists and has `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### Error: "relation 'users' does not exist"

- **Solution**: Run `supabase_schema.sql` in Supabase SQL Editor (Step 2)

### Error: "Invalid API key"

- **Solution**: Check your Supabase Anon Key in `.env` matches your Supabase project

### Error: "Cannot connect to Supabase"

- **Solution**:
  1. Verify Supabase project is active: https://supabase.com/dashboard
  2. Check internet connection
  3. Verify URL and API key are correct

---

## 🧪 Test Supabase Connection

You can test if Supabase is accessible by running:

```bash
node -e "require('dotenv').config(); const {createClient} = require('@supabase/supabase-js'); const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY); supabase.from('users').select('count').then(r => console.log('✅ Supabase connected!', r)).catch(e => console.log('❌ Error:', e.message));"
```

---

## 📝 Summary

**To run the app, you need:**

1. ✅ `.env` file (copy from `env.example`)
2. ✅ Supabase database schema created (run `supabase_schema.sql`)
3. ✅ Dependencies installed (`npm install`)
4. ✅ Start app (`npm run dev`)

**Most common issue**: Forgetting to run the SQL schema in Supabase! Make sure Step 2 is completed.

---

## 🚀 Quick Commands

```bash
# 1. Create .env
copy env.example .env

# 2. Install dependencies
npm install

# 3. Start app
npm run dev
```

**Remember**: Don't forget to run the SQL schema in Supabase SQL Editor!
