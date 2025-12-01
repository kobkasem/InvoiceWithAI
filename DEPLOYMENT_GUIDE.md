# 🚀 Complete Deployment Guide - Synnex Invoice Extractor

## Overview

This application is a **Node.js/Express backend** with a **React frontend**, using **Supabase (PostgreSQL)** as the database. This guide covers deployment to various hosting platforms.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Required

Create a `.env` file in the root directory with:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Secret (REQUIRED - Use a strong random string)
JWT_SECRET=your-very-strong-random-secret-key-min-32-chars

# OpenAI API Key (REQUIRED for AI extraction)
OPENAI_API_KEY=sk-proj-your-actual-openai-key

# Email Configuration (Optional - for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@synnex.co.th

# Frontend URL (for email links)
FRONTEND_URL=https://your-domain.com
```

### 2. Database Setup

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Run Schema**: Copy `supabase_schema.sql` and execute it in Supabase SQL Editor
3. **Get Credentials**: Copy your Supabase URL and anon key from Project Settings → API

### 3. Build Frontend

```bash
cd client
npm install
npm run build
cd ..
```

This creates the `client/build` folder that the server will serve.

---

## 🌐 Deployment Options

### Option 1: VPS Deployment (Recommended for Full Control)

#### Platforms: DigitalOcean, AWS EC2, Linode, Hostinger VPS, etc.

#### Step 1: Server Setup

```bash
# Connect to your VPS via SSH
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Reverse Proxy)
apt install -y nginx
```

#### Step 2: Deploy Application

```bash
# Create app directory
mkdir -p /var/www/synnex-invoice
cd /var/www/synnex-invoice

# Upload your project files (via Git, SFTP, or SCP)
# If using Git:
git clone your-repository-url .
# OR upload files via SFTP/SCP

# Install dependencies
npm install
cd client
npm install
npm run build
cd ..

# Create .env file
nano .env
# Paste your environment variables (see Pre-Deployment Checklist)
```

#### Step 3: Start Application with PM2

```bash
# Start the server
pm2 start server/index.js --name synnex-invoice

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown
```

#### Step 4: Configure Nginx Reverse Proxy

```bash
nano /etc/nginx/sites-available/synnex-invoice
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Increase body size for file uploads
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings for large file uploads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/synnex-invoice /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default if exists
nginx -t  # Test configuration
systemctl reload nginx
```

#### Step 5: Setup SSL (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

#### Step 6: File Permissions

```bash
# Set proper permissions
chown -R www-data:www-data /var/www/synnex-invoice
chmod -R 755 /var/www/synnex-invoice

# Create upload directories
mkdir -p /var/www/synnex-invoice/server/uploads
mkdir -p /var/www/synnex-invoice/server/exports/json
mkdir -p /var/www/synnex-invoice/server/exports/xml
chown -R www-data:www-data /var/www/synnex-invoice/server/uploads
chown -R www-data:www-data /var/www/synnex-invoice/server/exports
```

#### Step 7: Firewall Configuration

```bash
# Install UFW
apt install -y ufw

# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
```

---

### Option 2: Railway Deployment

Railway is great for Node.js apps with PostgreSQL support.

#### Steps:

1. **Sign up** at [railway.app](https://railway.app)
2. **Create New Project** → "Deploy from GitHub repo"
3. **Add Environment Variables**:
   - Go to Project Settings → Variables
   - Add all variables from `.env` file
4. **Configure Build**:
   - Build Command: `npm install && cd client && npm install && npm run build`
   - Start Command: `node server/index.js`
5. **Deploy**: Railway will automatically deploy on push to main branch

**Note**: Railway provides a PostgreSQL database, but you can still use Supabase by configuring the environment variables.

---

### Option 3: Render Deployment

Render is another excellent option for Node.js apps.

#### Steps:

1. **Sign up** at [render.com](https://render.com)
2. **Create New Web Service**
3. **Connect Repository** (GitHub/GitLab)
4. **Configure**:
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `node server/index.js`
   - **Environment**: Node
5. **Add Environment Variables**:
   - Go to Environment tab
   - Add all variables from `.env` file
6. **Deploy**: Render will automatically deploy

---

### Option 4: Heroku Deployment

#### Steps:

1. **Install Heroku CLI**: [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
2. **Login**: `heroku login`
3. **Create App**: `heroku create your-app-name`
4. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SUPABASE_URL=your-supabase-url
   heroku config:set SUPABASE_ANON_KEY=your-key
   heroku config:set JWT_SECRET=your-secret
   heroku config:set OPENAI_API_KEY=your-key
   # ... add all other variables
   ```
5. **Add Buildpacks**:
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```
6. **Update package.json** scripts:
   ```json
   "scripts": {
     "start": "node server/index.js",
     "heroku-postbuild": "cd client && npm install && npm run build"
   }
   ```
7. **Deploy**: `git push heroku main`

---

### Option 5: Vercel/Netlify (Frontend) + Backend Separate

#### Frontend (Vercel/Netlify):

1. **Build**: `cd client && npm run build`
2. **Deploy**: Upload `client/build` folder
3. **Environment Variables**: Set `REACT_APP_API_URL=https://your-backend-url.com`

#### Backend (Separate):

Deploy backend to Railway, Render, or VPS as described above.

**Update Frontend API URL**:
- Edit `client/src` files to use `process.env.REACT_APP_API_URL` instead of `localhost:5000`

---

## 🔧 Common Deployment Issues & Solutions

### Issue 1: "Cannot find module" errors

**Solution**:
```bash
# Make sure all dependencies are installed
npm install
cd client && npm install && cd ..
```

### Issue 2: Frontend not loading

**Solution**:
- Ensure `client/build` folder exists
- Run `cd client && npm run build`
- Check server is serving static files (see `server/index.js`)

### Issue 3: Database connection errors

**Solution**:
- Verify Supabase URL and key in `.env`
- Check Supabase project is active
- Verify database tables exist (run `supabase_schema.sql`)

### Issue 4: File upload fails

**Solution**:
- Check upload directory permissions
- Increase `client_max_body_size` in Nginx (if using)
- Verify `server/uploads` directory exists

### Issue 5: CORS errors

**Solution**:
- Update `FRONTEND_URL` in `.env` to your actual domain
- Check CORS configuration in `server/index.js`

### Issue 6: Port already in use

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

### Issue 7: PM2 not starting on reboot

**Solution**:
```bash
# Re-run PM2 startup
pm2 startup
# Follow the command it shows
pm2 save
```

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string (min 32 characters)
- [ ] Use strong passwords for all services
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Configure Supabase Row Level Security (RLS) policies
- [ ] Use environment variables for all secrets
- [ ] Enable firewall on VPS
- [ ] Keep Node.js and dependencies updated
- [ ] Regular backups of database
- [ ] Change default admin password after first login

---

## 📊 Monitoring & Maintenance

### PM2 Commands

```bash
# View logs
pm2 logs synnex-invoice

# Monitor
pm2 monit

# Restart
pm2 restart synnex-invoice

# Stop
pm2 stop synnex-invoice

# Delete
pm2 delete synnex-invoice
```

### Database Backups

**Supabase**: Use Supabase dashboard → Database → Backups

**Manual Backup**:
```bash
# Export data from Supabase dashboard or use pg_dump
```

### Logs Location

- **PM2 Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **Application Logs**: Check PM2 logs

---

## 🚨 Troubleshooting

### Check Server Status

```bash
# PM2 status
pm2 status

# Nginx status
systemctl status nginx

# Check if port is listening
netstat -tulpn | grep 5000
```

### View Application Logs

```bash
# PM2 logs
pm2 logs synnex-invoice --lines 100

# Real-time logs
pm2 logs synnex-invoice --lines 0
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# From external (replace with your domain)
curl https://your-domain.com/api/health
```

---

## 📝 Post-Deployment Steps

1. ✅ **Test Login**: Use default admin credentials
   - Email: `kasem_u@synnex.co.th`
   - Password: `admin123`
   - **IMPORTANT**: Change password immediately!

2. ✅ **Test File Upload**: Upload a test invoice

3. ✅ **Test AI Extraction**: Verify OpenAI API key works

4. ✅ **Check File Storage**: Verify uploads are saved correctly

5. ✅ **Test Export**: Generate JSON/XML exports

6. ✅ **Monitor Logs**: Check for any errors

---

## 💰 Cost Estimates

### VPS Hosting
- **DigitalOcean Droplet**: $6-12/month (1-2GB RAM)
- **AWS EC2**: $10-20/month (t2.micro/small)
- **Linode**: $5-12/month
- **Hostinger VPS**: $8-12/month

### Platform Hosting
- **Railway**: Free tier available, then ~$5-20/month
- **Render**: Free tier available, then ~$7-25/month
- **Heroku**: Free tier discontinued, ~$7-25/month

### Database
- **Supabase**: Free tier (500MB), then ~$25/month

### Domain & SSL
- **Domain**: $10-15/year
- **SSL**: Free (Let's Encrypt)

---

## 🆘 Need Help?

1. Check server logs: `pm2 logs synnex-invoice`
2. Check browser console (F12)
3. Verify environment variables are set correctly
4. Test API endpoints directly
5. Check Supabase dashboard for database issues

---

## 📚 Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Last Updated**: 2024
**Application Version**: 1.0.0

