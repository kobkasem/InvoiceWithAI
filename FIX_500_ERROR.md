# 🔧 Fix 500 Login Error

## Problem
Getting 500 error when trying to login: "Request failed with status code 500"

## Root Cause
The `emailService` requires `nodemailer` which may not be installed, causing the auth route to fail when loading.

## ✅ Solution Applied

I've made the email service optional so it won't crash the login route.

## 🚀 Fix Steps

### Step 1: Restart the Server

**IMPORTANT**: You must restart the server for changes to take effect!

1. **Stop the current server** (Ctrl+C in the terminal where `npm run dev` is running)

2. **Start it again**:
   ```bash
   npm run dev
   ```

### Step 2: Try Login Again

After restarting, try logging in:
- Email: `kasem_u@synnex.co.th`
- Password: `admin123`

---

## 🔍 What Was Fixed

1. ✅ Made `emailService` import optional
2. ✅ Added better error logging in login route
3. ✅ Made nodemailer optional in emailService

---

## 📝 If Still Getting 500 Error

### Check Server Console Logs

Look at the terminal where `npm run dev` is running. You should see detailed error messages like:

```
Fetch user error: ...
Login error: ...
```

### Common Issues:

1. **Supabase connection error**
   - Check `.env` has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   
2. **Database table missing**
   - Run `supabase_schema.sql` in Supabase SQL Editor

3. **JWT_SECRET missing**
   - Check `.env` has `JWT_SECRET` set

---

## 🧪 Test After Restart

1. Restart server: `npm run dev`
2. Wait for: "Server running on port 5000"
3. Try login at: http://localhost:3000
4. Check server console for any errors

---

## ✅ Expected Result

After restart, login should work! The 500 error should be gone.

**Next Step**: Restart your server and try logging in again!

