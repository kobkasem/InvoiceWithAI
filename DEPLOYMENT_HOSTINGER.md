# Hostinger Deployment Guide for Synnex Invoice Extractor

## Application Requirements

Your application needs:
- **Node.js** (v14 or higher) - Backend server
- **MySQL** (v5.7 or higher) - Database
- **File Storage** - For invoice uploads and exports
- **Port Access** - For Express server (port 5000)
- **SSL/HTTPS** - For secure connections

## Recommended Hostinger Package

### ✅ **BEST OPTION: VPS Hosting**

**Why VPS?**
- Full root access to install Node.js, MySQL, and other dependencies
- Complete control over server configuration
- Can run Node.js applications natively
- Better performance for database operations
- Suitable for production applications

**Recommended VPS Plans:**
1. **VPS 1** (Minimum for testing)
   - 1 vCPU, 1 GB RAM, 20 GB SSD
   - Good for: Small deployments, testing
   - ⚠️ May be tight for production with file uploads

2. **VPS 2** (Recommended for production)
   - 2 vCPU, 2 GB RAM, 40 GB SSD
   - Good for: Small to medium production use
   - ✅ Better performance for MySQL and file processing

3. **VPS 3** (For larger scale)
   - 4 vCPU, 4 GB RAM, 80 GB SSD
   - Good for: Multiple users, high file upload volume

### ⚠️ Alternative: Cloud Hosting (if Node.js is supported)

Some Hostinger Cloud plans support Node.js, but you need to verify:
- Check if Node.js runtime is available
- MySQL database included
- File storage limits
- Process management (PM2 support)

**Note:** Shared hosting typically does NOT support Node.js applications.

## Deployment Architecture Options

### Option 1: Full VPS Deployment (Recommended)
```
┌─────────────────────────────────┐
│     Hostinger VPS              │
│  ┌──────────────────────────┐  │
│  │  Node.js Server (Port 80)│  │
│  │  - Express API           │  │
│  │  - Serves React Build    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  MySQL Database          │  │
│  │  - Local or Remote       │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  Nginx (Reverse Proxy)   │  │
│  │  - SSL/HTTPS             │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

### Option 2: Hybrid (If available)
```
┌─────────────────────────────────┐
│  Hostinger Cloud/Shared         │
│  - React Frontend (Static)     │
└─────────────────────────────────┘
           ↓ API Calls
┌─────────────────────────────────┐
│  Hostinger VPS                  │
│  - Node.js Backend              │
│  - MySQL Database               │
└─────────────────────────────────┘
```

## Step-by-Step Deployment Checklist

### 1. Choose Your Package
- ✅ **VPS 2** (2GB RAM) - Recommended starting point
- Or **VPS 1** if budget is tight (may need upgrade later)

### 2. After Purchasing VPS

#### A. Initial Server Setup
```bash
# Connect via SSH
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js (v18 LTS recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server

# Install Nginx (for reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

#### B. MySQL Configuration
```bash
# Secure MySQL installation
mysql_secure_installation

# Create database and user
mysql -u root -p
```

```sql
CREATE DATABASE SynnexInvoiceExtractor_cursor 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'synnex_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON SynnexInvoiceExtractor_cursor.* TO 'synnex_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### C. Deploy Your Application
```bash
# Create app directory
mkdir -p /var/www/synnex-invoice
cd /var/www/synnex-invoice

# Upload your project files (use SFTP or Git)
# Or clone from Git repository

# Install dependencies
npm install
cd client
npm install
npm run build
cd ..

# Create .env file
nano .env
```

#### D. Environment Configuration (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=synnex_user
DB_PASSWORD=your_strong_password
DB_NAME=SynnexInvoiceExtractor_cursor
JWT_SECRET=your-very-strong-random-secret-key-here
OPENAI_API_KEY=your-openai-api-key
```

#### E. Start Application with PM2
```bash
# Start the server
pm2 start server/index.js --name synnex-invoice

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### F. Configure Nginx Reverse Proxy
```bash
nano /etc/nginx/sites-available/synnex-invoice
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

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
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/synnex-invoice /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### G. Setup SSL (Let's Encrypt)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### 3. File Permissions
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

## Important Considerations

### Database Storage
- MySQL will use disk space for:
  - Invoice file data (BLOB storage)
  - User data
  - Extracted invoice data
- Monitor disk usage regularly
- Consider moving large files to external storage if needed

### Performance Optimization
1. **Enable MySQL Query Cache**
2. **Use PM2 Cluster Mode** (for multiple CPU cores)
   ```bash
   pm2 start server/index.js -i max --name synnex-invoice
   ```
3. **Setup MySQL Indexes** (already in your schema)
4. **Enable Gzip Compression** in Nginx

### Security Checklist
- ✅ Change default MySQL root password
- ✅ Use strong JWT_SECRET
- ✅ Use strong database password
- ✅ Enable firewall (UFW)
- ✅ Keep Node.js and MySQL updated
- ✅ Regular backups
- ✅ SSL/HTTPS enabled

### Backup Strategy
```bash
# MySQL backup script
#!/bin/bash
mysqldump -u synnex_user -p SynnexInvoiceExtractor_cursor > backup_$(date +%Y%m%d).sql

# Add to crontab for daily backups
# 0 2 * * * /path/to/backup-script.sh
```

## Cost Estimate (Approximate)

- **VPS 2** (2GB RAM): ~$8-12/month
- **Domain**: ~$10-15/year
- **SSL Certificate**: Free (Let's Encrypt)
- **Total**: ~$8-12/month

## Alternative: Hostinger MySQL Database (Separate Service)

If you choose a hosting plan without MySQL, you can:
1. Use Hostinger's separate MySQL database service
2. Connect from your VPS to remote MySQL
3. Update DB_HOST in .env to remote MySQL host

## Support Resources

- Hostinger VPS Documentation
- Node.js Production Best Practices
- MySQL Performance Tuning
- PM2 Documentation: https://pm2.keymetrics.io/

## Next Steps

1. ✅ Purchase Hostinger VPS 2 plan
2. ✅ Get your domain name (or use IP address initially)
3. ✅ Follow deployment steps above
4. ✅ Test the application
5. ✅ Setup monitoring and backups

---

**Recommendation**: Start with **VPS 2** (2GB RAM) - it provides enough resources for MySQL, Node.js, and file processing without being overkill for most use cases.




