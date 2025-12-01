# 🚂 Step-by-Step: Deploy to Railway

Complete guide to deploy your Synnex Invoice Extractor to Railway.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Code pushed to GitHub (already done ✅)
- [ ] GitHub account
- [ ] Supabase project set up
- [ ] OpenAI API key ready
- [ ] JWT_SECRET generated (you have: `aa643190-3dcd-47a0-9dce-66f93400b6e7`)

---

## 🚀 Step 1: Sign Up for Railway

1. Go to **[railway.app](https://railway.app)**
2. Click **"Start a New Project"** or **"Login"**
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. You'll be redirected to Railway dashboard

---

## 📦 Step 2: Create New Project

1. In Railway dashboard, click **"New Project"** (top right)
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your GitHub repositories
4. Find and click on: **`InvoiceWithAI`** (or your repo name)
5. Railway will start detecting your project automatically

**Wait a moment** - Railway is analyzing your code.

---

## ⚙️ Step 3: Configure Build Settings

Railway should auto-detect Node.js, but let's verify:

1. Click on your project name
2. Go to **Settings** tab (left sidebar)
3. Scroll to **"Build & Deploy"** section
4. Verify these settings:

   **Build Command:**
   ```
   npm install && cd client && npm install && npm run build
   ```

   **Start Command:**
   ```
   node server/index.js
   ```

   **Root Directory:**
   ```
   / (leave as root)
   ```

5. If settings are different, update them and click **"Save"**

---

## 🔐 Step 4: Add Environment Variables

**This is the most important step!**

1. In your Railway project, click **"Variables"** tab (left sidebar)
2. Click **"New Variable"** button
3. Add each variable one by one:

### Variable 1: NODE_ENV
```
Variable Name: NODE_ENV
Value: production
```
Click **"Add"**

### Variable 2: PORT
```
Variable Name: PORT
Value: 5000
```
Click **"Add"**

### Variable 3: SUPABASE_URL
```
Variable Name: SUPABASE_URL
Value: https://gmhzouyrfbdasvestkvu.supabase.co
```
Click **"Add"**

### Variable 4: SUPABASE_ANON_KEY
```
Variable Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtaHpvdXlyZmJkYXN2ZXN0a3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk2NzYsImV4cCI6MjA3OTg4NTY3Nn0.e625U0XC94FMFWCj3fdC1nSHyaBRRjZoDXP_b_uwcbw
```
Click **"Add"**

### Variable 5: JWT_SECRET
```
Variable Name: JWT_SECRET
Value: aa643190-3dcd-47a0-9dce-66f93400b6e7
```
Click **"Add"**

### Variable 6: OPENAI_API_KEY
```
Variable Name: OPENAI_API_KEY
Value: sk-proj-your-actual-openai-key-here
```
⚠️ **Replace with your actual OpenAI API key!**
Click **"Add"**

### Variable 7: FRONTEND_URL (Temporary)
```
Variable Name: FRONTEND_URL
Value: https://placeholder.railway.app
```
⚠️ **We'll update this after first deploy!**
Click **"Add"**

---

## 🚀 Step 5: Deploy

1. After adding all variables, Railway will **automatically start deploying**
2. Go to **"Deployments"** tab to watch the build progress
3. You'll see logs showing:
   - Installing dependencies
   - Building React frontend
   - Starting server

**First deployment takes 3-5 minutes** - be patient!

---

## 🌐 Step 6: Get Your Railway URL

1. After deployment completes, go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. You'll see your Railway URL, something like:
   ```
   https://your-app-name.up.railway.app
   ```
4. **Copy this URL** - you'll need it!

---

## 🔄 Step 7: Update FRONTEND_URL

1. Go back to **"Variables"** tab
2. Find `FRONTEND_URL` variable
3. Click the **pencil icon** (edit) next to it
4. Replace the value with your actual Railway URL:
   ```
   https://your-app-name.up.railway.app
   ```
   (Use the URL you copied in Step 6)
5. Click **"Update"**
6. Railway will **automatically redeploy** with the new value

---

## ✅ Step 8: Test Your Deployment

1. Wait for redeployment to complete (check Deployments tab)
2. Visit your Railway URL in browser: `https://your-app-name.up.railway.app`
3. You should see your login page!

### Test Login:
- **Email**: `kasem_u@synnex.co.th`
- **Password**: `admin123`

### Test Features:
- [ ] Login works
- [ ] Dashboard loads
- [ ] File upload works
- [ ] API calls work

---

## 🔍 Step 9: Check Logs (If Issues)

If something doesn't work:

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"View Logs"**
4. Look for error messages

Common issues:
- **Build failed**: Check build logs for missing dependencies
- **Application crashed**: Check runtime logs for errors
- **Database error**: Verify Supabase credentials
- **API error**: Check OpenAI API key

---

## 📊 Step 10: Monitor Your App

### View Logs:
- **Deployments** tab → Click deployment → **View Logs**

### Check Status:
- Green dot = Running
- Yellow dot = Building
- Red dot = Error

### Restart App:
- **Settings** → **General** → **Restart**

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] App loads at Railway URL
- [ ] Login works
- [ ] Dashboard displays
- [ ] File upload works
- [ ] No errors in logs
- [ ] Environment variables are set correctly

---

## 🆘 Troubleshooting

### Build Fails

**Check:**
- Build logs in Deployments tab
- Verify build command is correct
- Check Node.js version (Railway uses latest LTS)

**Fix:**
- Update build command in Settings → Build & Deploy
- Check package.json has correct scripts

### App Crashes

**Check:**
- Runtime logs in Deployments tab
- Verify all environment variables are set
- Check for missing dependencies

**Fix:**
- Add missing environment variables
- Check server/index.js for errors
- Verify database connection

### Frontend Not Loading

**Check:**
- Verify `client/build` folder exists after build
- Check server/index.js serves static files
- Look for 404 errors in logs

**Fix:**
- Rebuild: Settings → Redeploy
- Verify build command includes `npm run build`

### Database Connection Error

**Check:**
- SUPABASE_URL is correct
- SUPABASE_ANON_KEY is correct
- Supabase project is active

**Fix:**
- Update Supabase credentials in Variables
- Verify Supabase project is running
- Check database tables exist

---

## 📝 Quick Reference

### Railway Dashboard URLs:
- **Projects**: [railway.app/dashboard](https://railway.app/dashboard)
- **Documentation**: [docs.railway.app](https://docs.railway.app)

### Your Project:
- **Dashboard**: Railway dashboard → Your project
- **Variables**: Project → Variables tab
- **Deployments**: Project → Deployments tab
- **Settings**: Project → Settings tab

---

## 🎯 Next Steps After Deployment

1. **Test all features** thoroughly
2. **Monitor logs** for any errors
3. **Update admin password** after first login
4. **Set up custom domain** (optional, in Settings → Networking)
5. **Configure backups** (if needed)

---

## 💡 Pro Tips

1. **Auto-Deploy**: Railway auto-deploys on every GitHub push (enabled by default)
2. **Custom Domain**: Add your domain in Settings → Networking
3. **Environment**: Use different variables for staging/production
4. **Monitoring**: Check logs regularly for issues
5. **Backups**: Railway keeps deployment history

---

**You're all set!** 🚀

Follow these steps and your app will be live on Railway in minutes!

For detailed troubleshooting, see `DEPLOYMENT_TROUBLESHOOTING.md`

