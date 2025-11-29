# 🔧 Fix Login Issue - Step by Step Guide

## Problem Identified

**Backend server is NOT running!** This is why login fails.

---

## ✅ Solution: Start the Backend Server

### Step 1: Check Current Status

The backend server needs to be running on port 5000 for login to work.

### Step 2: Start the Server

Open a terminal in the project folder and run:

```bash
npm run dev
```

**OR** if you want to run backend only:

```bash
npm run server
```

### Step 3: Verify Server is Running

You should see:
```
[0] Database initialized successfully
[0] Server running on port 5000
```

If you see errors, check:
- ✅ `.env` file exists and has correct Supabase credentials
- ✅ Database tables exist (run `supabase_schema.sql` if needed)
- ✅ Port 5000 is not already in use

---

## 🔍 What to Check

### 1. Is Server Running?

**Check in terminal:**
- Look for "Server running on port 5000"
- If not, start it with `npm run dev`

**Check in browser:**
- Open: http://localhost:5000/api/health
- Should see: `{"status":"OK","message":"Server is running"}`

### 2. Check Browser Console

Press **F12** → **Console** tab:
- Look for red error messages
- Check for "Network Error" or "ECONNREFUSED"

### 3. Check Network Tab

Press **F12** → **Network** tab:
- Try logging in
- Look for `/api/auth/login` request
- Check if it's red (failed) or green (success)
- Click on it to see error details

---

## 🚀 Quick Fix Commands

```bash
# 1. Make sure you're in the project folder
cd c:\Udemy_tutorial\cursor_project\SynnexInvoiceExtractor_Cursor

# 2. Start the server
npm run dev

# 3. Wait for both servers to start:
#    - Backend: http://localhost:5000
#    - Frontend: http://localhost:3000

# 4. Then try logging in again
```

---

## ❌ Common Issues & Fixes

### Issue 1: "Cannot connect to server"
**Fix:** Start backend server with `npm run dev`

### Issue 2: Port 5000 already in use
**Fix:** 
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Issue 3: "Database initialized successfully" but login still fails
**Fix:** Check server console for specific errors

### Issue 4: CORS errors
**Fix:** Make sure backend has `app.use(cors())` (already configured)

---

## 🧪 Test the Fix

1. **Start server**: `npm run dev`
2. **Wait for**: "Server running on port 5000"
3. **Open browser**: http://localhost:3000
4. **Try login**: 
   - Email: `kasem_u@synnex.co.th`
   - Password: `admin123`
5. **Should work now!**

---

## 📝 Summary

**The Problem:** Backend server is not running
**The Solution:** Run `npm run dev` to start both frontend and backend
**The Result:** Login will work once server is running

---

**Next Step:** Start the server and try logging in again!

