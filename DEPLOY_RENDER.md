# 🎨 Deploy to Render (Great Alternative for Testing)

Render is another excellent option for testing:
- ✅ **Free tier** available
- ✅ **Easy deployment** from GitHub
- ✅ **Automatic SSL** certificates
- ✅ **Good documentation**
- ✅ **Free PostgreSQL** (optional, we use Supabase)

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Make sure your code is on GitHub**
   - Push your code to GitHub repository

2. **Create `render.yaml`** (optional but recommended):

Create a file called `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: synnex-invoice-extractor
    env: node
    buildCommand: npm install && cd client && npm install && npm run build
    startCommand: node server/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

**Note**: Render uses port 10000 by default, but you can set PORT in environment variables.

### Step 2: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your GitHub

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository: `SynnexInvoiceExtractor_Cursor`

### Step 4: Configure Service

Fill in the form:

- **Name**: `synnex-invoice-extractor` (or your choice)
- **Environment**: `Node`
- **Region**: Choose closest to you (e.g., `Singapore` for Asia)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (or `/` if needed)
- **Build Command**: 
  ```
  npm install && cd client && npm install && npm run build
  ```
- **Start Command**:
  ```
  node server/index.js
  ```
- **Instance Type**: `Free` (for testing)

### Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section:

Click **"Add Environment Variable"** and add:

```
NODE_ENV = production
PORT = 10000
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
JWT_SECRET = generate-a-random-32-char-string
OPENAI_API_KEY = sk-proj-your-actual-key
FRONTEND_URL = https://your-app.onrender.com
```

**Important**: 
- Generate `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Get Supabase credentials from Supabase dashboard
- Get OpenAI key from OpenAI dashboard
- `FRONTEND_URL` will be `https://your-app-name.onrender.com` (you'll get this after first deploy)

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will start building (takes 5-10 minutes first time)
3. Watch the **Logs** tab for progress

### Step 7: Get Your URL

1. After deployment, Render gives you a URL like:
   `https://synnex-invoice-extractor.onrender.com`
2. **Update `FRONTEND_URL`** in Environment Variables
3. **Redeploy** (or it will auto-redeploy)

### Step 8: Test Your Deployment

1. Visit your Render URL
2. Test login:
   - Email: `kasem_u@synnex.co.th`
   - Password: `admin123`
3. Test file upload
4. Check logs if issues

---

## Important Notes

### Free Tier Limitations

- **Spins down after 15 minutes** of inactivity
- **First request** after spin-down takes ~30 seconds (cold start)
- **512 MB RAM** limit
- **100 GB bandwidth** per month

**For testing**: This is fine! Just be patient on first request.

### Auto-Deploy

- Render **auto-deploys** on every push to main branch
- You can disable this in Settings → Auto-Deploy

### Custom Domain

- Free tier supports custom domains
- Go to Settings → Custom Domains
- Add your domain and follow DNS instructions

---

## Troubleshooting

### Build Fails

**Check logs**:
- Go to your service → **Logs** tab
- Look for error messages

**Common fixes**:
- Verify build command is correct
- Check Node.js version (Render uses Node 18 by default)
- Ensure all dependencies are in `package.json`

### Application Crashes

**Check logs**:
- Render dashboard → Your service → **Logs**

**Common issues**:
- Missing environment variables
- Port conflicts (use PORT from environment)
- Database connection issues

### Slow First Request

**Normal for free tier**:
- Free tier spins down after 15 min inactivity
- First request wakes it up (takes ~30 seconds)
- Subsequent requests are fast

**Solution**: 
- Upgrade to paid plan ($7/month) for always-on
- Or use a ping service to keep it awake

### Frontend Not Loading

**Verify**:
1. Build completed successfully (check logs)
2. `client/build` folder exists
3. Server serves static files correctly

---

## Cost

- **Free Tier**: 
  - 750 hours/month (enough for testing)
  - Spins down after inactivity
  - 512 MB RAM
  
- **Starter Plan**: $7/month
  - Always on
  - 512 MB RAM
  - Better for production

---

## Advantages

✅ **Free tier** - Good for testing  
✅ **Easy setup** - Connect GitHub  
✅ **Auto SSL** - HTTPS by default  
✅ **Good docs** - Clear documentation  
✅ **Custom domains** - Free tier supports  
✅ **Auto-deploy** - Push to deploy  

---

## Disadvantages

⚠️ **Spins down** - Free tier sleeps after 15 min  
⚠️ **Cold starts** - First request slow after sleep  
⚠️ **Limited RAM** - 512 MB on free tier  

---

## Quick Reference

- **Dashboard**: [dashboard.render.com](https://dashboard.render.com)
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Support**: support@render.com

---

**Render is a great alternative to Railway!** 🎨

