# 🚂 Deploy to Railway (Recommended for Testing)

Railway is **perfect for testing** because:
- ✅ **Free tier** with $5 credit/month
- ✅ **Super easy** deployment (connects to GitHub)
- ✅ **Automatic deployments** on git push
- ✅ **Built-in environment variables** management
- ✅ **No credit card required** for free tier
- ✅ **PostgreSQL available** (though we use Supabase)

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Make sure your code is on GitHub**
   - If not, create a GitHub repository
   - Push your code to GitHub

2. **Verify your `.env` file** (we'll add these in Railway):
   ```env
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-key
   JWT_SECRET=your-secret-key
   OPENAI_API_KEY=your-openai-key
   FRONTEND_URL=https://your-app.railway.app
   ```

### Step 2: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (easiest way)
4. Authorize Railway to access your GitHub

### Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `SynnexInvoiceExtractor_Cursor`
4. Railway will start detecting your project

### Step 4: Configure Build Settings

Railway should auto-detect Node.js, but verify:

1. Go to your project → **Settings** → **Build & Deploy**
2. **Build Command**: 
   ```
   npm install && cd client && npm install && npm run build
   ```
3. **Start Command**:
   ```
   node server/index.js
   ```
4. **Root Directory**: Leave as `/` (root)

### Step 5: Add Environment Variables

1. Go to your project → **Variables** tab
2. Click **"New Variable"**
3. Add each variable one by one:

   ```
   NODE_ENV = production
   PORT = 5000
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_ANON_KEY = your-anon-key-here
   JWT_SECRET = generate-a-random-32-char-string
   OPENAI_API_KEY = sk-proj-your-actual-key
   FRONTEND_URL = https://your-app.railway.app
   ```

   **Important**: 
   - Generate `JWT_SECRET` using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Get `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Supabase dashboard
   - Get `OPENAI_API_KEY` from OpenAI dashboard

### Step 6: Deploy

1. Railway will **automatically deploy** when you:
   - Add environment variables
   - Push to GitHub
   - Or click **"Deploy"** button

2. Wait for deployment (usually 2-5 minutes)

3. Check **Deployments** tab for logs

### Step 7: Get Your URL

1. Go to **Settings** → **Networking**
2. Railway will generate a URL like: `https://your-app.up.railway.app`
3. **Update `FRONTEND_URL`** in Variables to match this URL
4. Redeploy (or wait for auto-deploy)

### Step 8: Test Your Deployment

1. Visit your Railway URL
2. Test login with:
   - Email: `kasem_u@synnex.co.th`
   - Password: `admin123`
3. Test file upload
4. Check logs in Railway dashboard if issues

---

## Troubleshooting

### Build Fails

**Check logs** in Railway dashboard:
- Look for missing dependencies
- Verify Node.js version (Railway uses latest LTS)

**Common fixes**:
```bash
# Make sure package.json has build script
# In package.json:
"scripts": {
  "build": "cd client && npm install && npm run build"
}
```

### Application Crashes

**Check logs**:
- Railway dashboard → **Deployments** → Click on deployment → **View Logs**

**Common issues**:
- Missing environment variables
- Database connection issues
- Port conflicts (Railway sets PORT automatically)

### Frontend Not Loading

**Verify**:
1. `client/build` folder exists after build
2. Server serves static files (check `server/index.js`)
3. Check Railway logs for errors

---

## Cost

- **Free Tier**: $5 credit/month (enough for testing)
- **After Free Tier**: ~$5-10/month for small apps
- **No credit card required** for free tier

---

## Advantages

✅ **Easiest deployment** - Just connect GitHub  
✅ **Free tier** - Perfect for testing  
✅ **Auto-deploy** - Push to GitHub = auto deploy  
✅ **Built-in monitoring** - View logs easily  
✅ **Environment variables** - Easy to manage  
✅ **Custom domains** - Can add your domain later  

---

## Next Steps After Testing

Once testing is complete, you can:
1. **Upgrade Railway plan** for production
2. **Add custom domain** (Settings → Networking)
3. **Set up monitoring** and alerts
4. **Configure backups**

---

## Quick Reference

- **Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Support**: Railway Discord or email

---

**Railway is the BEST choice for testing!** 🚀

