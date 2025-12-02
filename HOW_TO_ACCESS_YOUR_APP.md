# 🌐 How to Access Your Railway App

Guide to find and use your deployed application URL.

---

## 🔗 Finding Your Railway URL

### Method 1: Railway Dashboard (Easiest)

1. **Go to**: https://railway.app
2. **Login** to your account
3. **Click** on your project
4. **Click** on your service/app
5. **Go to "Settings"** tab (left sidebar)
6. **Scroll to "Networking"** section
7. **You'll see your URL** like:
   ```
   https://your-app-name.up.railway.app
   ```

### Method 2: Railway Dashboard - Overview

1. **Railway Dashboard** → Your Project
2. **Overview** tab
3. Look for **"Domains"** or **"URL"** section
4. Your Railway URL will be displayed there

---

## 🎯 Your App URL Format

Railway URLs typically look like:
```
https://your-app-name.up.railway.app
```

**Examples:**
- `https://synnex-invoice-extractor.up.railway.app`
- `https://invoice-app.up.railway.app`
- `https://your-project-name.up.railway.app`

---

## 🚀 How to Use Your App

### Step 1: Open Your App

1. **Copy your Railway URL** (from Settings → Networking)
2. **Open browser**
3. **Paste URL** in address bar
4. **Press Enter**

### Step 2: Login

1. **Login page** should appear
2. **Use default credentials:**
   - **Email**: `kasem_u@synnex.co.th`
   - **Password**: `admin123`
3. **Click "Login"**

### Step 3: Use the App

After login, you'll see:
- **Dashboard** - Statistics and overview
- **Upload** - Upload invoices
- **Invoices** - View all invoices
- **Manual Entry** - Manually enter invoice data
- **Review** - Review invoices (Supervisor)
- **Users** - Manage users (Admin)
- **Prompts** - Manage AI prompts (Admin/Supervisor)

---

## 🔍 Quick Access Methods

### Option 1: Direct URL
```
https://your-app-name.up.railway.app
```

### Option 2: Health Check Endpoint
```
https://your-app-name.up.railway.app/api/health
```
Should return: `{"status":"OK","message":"Server is running"}`

### Option 3: Login Page
```
https://your-app-name.up.railway.app/login
```

---

## 📱 Access from Anywhere

**Your Railway URL works from:**
- ✅ Any computer
- ✅ Any browser
- ✅ Mobile devices
- ✅ Anywhere with internet

**No installation needed** - just visit the URL!

---

## 🔐 Default Login Credentials

**Admin Account:**
- **Email**: `kasem_u@synnex.co.th`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change this password after first login!

---

## 🎯 Quick Steps to Access

1. **Get URL**: Railway Dashboard → Settings → Networking
2. **Copy URL**: `https://your-app-name.up.railway.app`
3. **Open Browser**: Paste URL
4. **Login**: Use default credentials
5. **Start Using**: Upload invoices, view dashboard, etc.

---

## 🆘 Troubleshooting

### Problem: URL Not Working

**Check:**
1. Is deployment active? (Railway Dashboard → Check status)
2. Is URL correct? (Copy from Railway Settings)
3. Try health check: `/api/health`

**Fix:**
- Wait for deployment to complete
- Check Railway logs for errors
- Verify deployment is "Active"

### Problem: "Application Error"

**Check:**
- Railway Dashboard → Deployments → View Logs
- Look for error messages

**Fix:**
- Fix errors shown in logs
- Redeploy if needed

### Problem: Can't Find URL

**Check:**
- Railway Dashboard → Settings → Networking
- Or Overview tab → Domains section

**Fix:**
- If no URL shown, deployment might not be complete
- Wait for deployment to finish
- Check deployment status

---

## 📋 What You Need

**To access your app, you need:**
- ✅ Railway account (you have this)
- ✅ Project deployed (should be done)
- ✅ Railway URL (from Settings → Networking)
- ✅ Internet connection

**That's it!** Just visit the URL in your browser.

---

## 🎉 Success Indicators

**Your app is accessible when:**
- ✅ Railway URL loads in browser
- ✅ Login page appears
- ✅ Can login successfully
- ✅ Dashboard loads after login

---

## 🔗 Quick Reference

**Your Railway URL:**
```
https://your-app-name.up.railway.app
```

**Find it here:**
- Railway Dashboard → Your Project → Settings → Networking

**Health Check:**
```
https://your-app-name.up.railway.app/api/health
```

---

**Go to Railway Dashboard → Settings → Networking to get your app URL!** 🚀

