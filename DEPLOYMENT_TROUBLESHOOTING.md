# 🔧 Deployment Troubleshooting Guide

## Quick Diagnosis

### 1. Check Server Status

```bash
# Check if server is running
curl http://localhost:5000/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

### 2. Check PM2 Status

```bash
pm2 status
pm2 logs synnex-invoice --lines 50
```

### 3. Check Environment Variables

```bash
# On Linux/Mac
cat .env | grep -v "PASSWORD\|SECRET\|KEY"

# On Windows
type .env
```

---

## Common Errors & Solutions

### ❌ Error: "Cannot find module"

**Symptoms:**
```
Error: Cannot find module 'express'
Error: Cannot find module '@supabase/supabase-js'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm install
cd client && npm install && cd ..
```

---

### ❌ Error: "Port 5000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env file
```

---

### ❌ Error: "Database connection failed"

**Symptoms:**
```
Missing Supabase configuration
Database initialization error
```

**Solution:**
1. Check `.env` file has:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```
2. Verify Supabase project is active
3. Check Supabase dashboard → Settings → API
4. Test connection:
   ```bash
   node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
   ```

---

### ❌ Error: "Frontend not loading"

**Symptoms:**
- Blank page
- 404 errors for static files
- "Cannot GET /" error

**Solution:**
```bash
# Build frontend
cd client
npm run build
cd ..

# Verify build folder exists
ls -la client/build

# Restart server
pm2 restart synnex-invoice
```

---

### ❌ Error: "File upload fails"

**Symptoms:**
```
Error: ENOENT: no such file or directory, open 'server/uploads/...'
```

**Solution:**
```bash
# Create upload directories
mkdir -p server/uploads
mkdir -p server/exports/json
mkdir -p server/exports/xml

# Set permissions (Linux/Mac)
chmod -R 755 server/uploads
chmod -R 755 server/exports
```

---

### ❌ Error: "OpenAI API key invalid"

**Symptoms:**
```
401 Incorrect API key provided
```

**Solution:**
1. Check `.env` file has valid API key:
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-key
   ```
2. **Restart server** (important!):
   ```bash
   pm2 restart synnex-invoice
   ```
3. Verify key is loaded:
   ```bash
   node verify-api-key.js
   ```

---

### ❌ Error: "JWT_SECRET not set"

**Symptoms:**
```
Error: jwt_secret is required
```

**Solution:**
1. Generate a strong secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Add to `.env`:
   ```env
   JWT_SECRET=your-generated-secret-here
   ```
3. Restart server

---

### ❌ Error: "CORS policy blocked"

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Check `FRONTEND_URL` in `.env` matches your domain
2. Verify CORS is enabled in `server/index.js`
3. If frontend/backend on different domains, update CORS config

---

### ❌ Error: "PM2 not starting on reboot"

**Symptoms:**
- Server doesn't start after server restart

**Solution:**
```bash
# Re-run PM2 startup
pm2 startup
# Follow the command it shows (usually something like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-user --hp /home/your-user

pm2 save
```

---

### ❌ Error: "Nginx 502 Bad Gateway"

**Symptoms:**
- 502 error when accessing site
- Nginx can't connect to backend

**Solution:**
1. Check if Node.js server is running:
   ```bash
   pm2 status
   curl http://localhost:5000/api/health
   ```

2. Check Nginx error logs:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. Verify Nginx config:
   ```bash
   nginx -t
   ```

4. Check proxy_pass URL matches server port

---

### ❌ Error: "SSL certificate issues"

**Symptoms:**
- Browser shows "Not Secure"
- SSL certificate errors

**Solution:**
```bash
# Renew Let's Encrypt certificate
certbot renew

# Or get new certificate
certbot --nginx -d your-domain.com

# Check certificate expiry
certbot certificates
```

---

## Debugging Steps

### Step 1: Check Logs

```bash
# PM2 logs
pm2 logs synnex-invoice --lines 100

# Nginx logs (if using)
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# System logs
journalctl -u nginx -f  # Linux systemd
```

### Step 2: Test Components Individually

```bash
# Test database connection
node -e "
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('users').select('count').then(r => console.log('DB OK:', r)).catch(e => console.log('DB Error:', e));
"

# Test API endpoint
curl http://localhost:5000/api/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/me
```

### Step 3: Verify File Structure

```bash
# Check required files exist
ls -la .env
ls -la client/build
ls -la server/index.js
ls -la server/uploads
```

### Step 4: Check Permissions

```bash
# Check file permissions
ls -la server/uploads
ls -la server/exports

# Fix if needed
chmod -R 755 server/uploads
chmod -R 755 server/exports
chown -R www-data:www-data server/uploads  # If using www-data user
```

---

## Quick Fixes

### Restart Everything

```bash
# Stop PM2
pm2 stop synnex-invoice
pm2 delete synnex-invoice

# Rebuild
npm run deploy

# Start fresh
pm2 start ecosystem.config.js --env production
pm2 save
```

### Reset Environment

```bash
# Backup current .env
cp .env .env.backup

# Verify .env has all required variables
# Compare with env.example

# Restart server
pm2 restart synnex-invoice
```

### Clean Install

```bash
# Remove node_modules
rm -rf node_modules client/node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
cd client && npm install && cd ..

# Rebuild
cd client && npm run build && cd ..
```

---

## Getting Help

When asking for help, provide:

1. **Error message** (full text)
2. **Server logs**: `pm2 logs synnex-invoice --lines 50`
3. **Environment**: OS, Node.js version (`node -v`)
4. **Deployment method**: VPS, Railway, Render, etc.
5. **What you've tried**: Steps you've already taken

---

## Prevention Checklist

- [ ] `.env` file has all required variables
- [ ] Frontend is built (`client/build` exists)
- [ ] Upload directories exist and have permissions
- [ ] Database tables are created (run `supabase_schema.sql`)
- [ ] PM2 is configured to start on boot
- [ ] SSL certificate is valid and auto-renewing
- [ ] Firewall allows necessary ports (80, 443, 22)
- [ ] Regular backups are configured
- [ ] Monitoring is set up (PM2 monitoring or external service)

---

**Last Updated**: 2024

