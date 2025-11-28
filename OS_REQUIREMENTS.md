# Operating System Requirements

## Overview

Your **Synnex Invoice Extractor** application is **cross-platform** and can run on multiple operating systems. Here's what you need:

---

## ✅ **For Development (Local Machine)**

### **Windows** ✅ (You're currently using this)
- **Windows 10/11** (64-bit)
- Node.js v14+ installed
- MySQL Server installed
- Works perfectly for development

**Current Setup:**
- You're on Windows 10 (build 26200)
- PowerShell for commands
- Can run `npm run dev` locally

### **macOS** ✅
- macOS 10.15 (Catalina) or later
- Node.js v14+ installed
- MySQL Server installed
- Works perfectly for development

### **Linux** ✅
- Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- Node.js v14+ installed
- MySQL Server installed
- Works perfectly for development

---

## 🚀 **For Production (Hostinger VPS)**

### **Recommended: Ubuntu Linux** ⭐ (Best Choice)

**Why Ubuntu?**
- ✅ Most popular and well-documented
- ✅ Easy to set up Node.js and MySQL
- ✅ Large community support
- ✅ Stable and secure
- ✅ Hostinger VPS supports it
- ✅ Best performance for Node.js apps

**Recommended Version:**
- **Ubuntu 22.04 LTS** (Long Term Support)
  - Supported until 2027
  - Latest stable version
  - Best compatibility with Node.js and MySQL

**Alternative Ubuntu Versions:**
- Ubuntu 20.04 LTS (also good, supported until 2025)
- Ubuntu 18.04 LTS (older but still supported)

### **Alternative Linux Distributions:**

#### **Debian** ✅
- Debian 11 (Bullseye) or Debian 12 (Bookworm)
- Similar to Ubuntu (Ubuntu is based on Debian)
- Good performance
- Slightly more minimal than Ubuntu

#### **CentOS/Rocky Linux** ✅
- CentOS 7/8 or Rocky Linux 8/9
- Enterprise-focused
- Very stable
- Good for production

---

## ❌ **NOT Recommended for Production:**

### **Windows Server** ⚠️
- Can work but not ideal
- Higher resource usage
- More expensive licensing
- Less common for Node.js deployments
- Harder to manage remotely

---

## 📋 **OS Comparison for Hostinger VPS**

| Operating System | Ease of Setup | Performance | Cost | Community Support | Recommendation |
|-----------------|---------------|-------------|------|-------------------|----------------|
| **Ubuntu 22.04** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | ⭐⭐⭐⭐⭐ | ✅ **BEST** |
| **Debian 11/12** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | ⭐⭐⭐⭐ | ✅ Good |
| **CentOS/Rocky** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | ⭐⭐⭐⭐ | ✅ Good |
| **Windows Server** | ⭐⭐ | ⭐⭐⭐ | Paid | ⭐⭐⭐ | ❌ Not recommended |

---

## 🎯 **Recommended Setup for Hostinger**

### **Choose: Ubuntu 22.04 LTS**

When you purchase Hostinger VPS, select:
- **OS Template:** Ubuntu 22.04 LTS
- **Architecture:** 64-bit
- **Panel:** None (or cPanel if you prefer GUI)

---

## 📝 **What You'll Need to Install on Ubuntu 22.04**

After getting your VPS with Ubuntu, you'll install:

```bash
# 1. Node.js (v18 LTS recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. MySQL Server
sudo apt update
sudo apt install mysql-server -y

# 3. Nginx (web server/reverse proxy)
sudo apt install nginx -y

# 4. PM2 (process manager)
sudo npm install -g pm2

# 5. Git (to clone your code)
sudo apt install git -y
```

---

## 🔧 **System Requirements**

### **Minimum Requirements:**
- **CPU:** 1 vCPU core
- **RAM:** 1 GB (2 GB recommended)
- **Storage:** 20 GB SSD
- **OS:** Ubuntu 22.04 LTS (64-bit)

### **Recommended Requirements:**
- **CPU:** 2 vCPU cores
- **RAM:** 2 GB
- **Storage:** 40 GB SSD
- **OS:** Ubuntu 22.04 LTS (64-bit)

---

## 💻 **Development vs Production**

### **Development (Your Local Machine)**
- **Current OS:** Windows 10 ✅
- **Purpose:** Code, test, develop
- **Requirements:** Node.js + MySQL
- **No OS change needed** - Windows works fine!

### **Production (Hostinger VPS)**
- **Recommended OS:** Ubuntu 22.04 LTS ✅
- **Purpose:** Run application 24/7
- **Requirements:** Node.js + MySQL + Nginx + PM2
- **Choose Ubuntu** when setting up VPS

---

## 🚀 **Quick Start Guide**

### **Step 1: Development (Keep Windows)**
```bash
# On your Windows machine (current setup)
npm run dev
# Works perfectly! ✅
```

### **Step 2: Production (Choose Ubuntu on VPS)**
```
1. Purchase Hostinger VPS 2
2. Select OS: Ubuntu 22.04 LTS
3. Follow deployment guide
4. Deploy your application
```

---

## 📚 **Summary**

### **For Development:**
- ✅ **Windows 10/11** - You're already set! (Current)
- ✅ **macOS** - Also works
- ✅ **Linux** - Also works

### **For Production (Hostinger VPS):**
- ✅ **Ubuntu 22.04 LTS** - **RECOMMENDED** ⭐
- ✅ **Debian 11/12** - Good alternative
- ✅ **CentOS/Rocky Linux** - Good alternative
- ❌ **Windows Server** - Not recommended

---

## 🎯 **Action Items**

1. ✅ **Keep Windows for development** - No change needed
2. ✅ **Choose Ubuntu 22.04 LTS** when setting up Hostinger VPS
3. ✅ **Follow the deployment guide** in `DEPLOYMENT_HOSTINGER.md`

---

**Bottom Line:** Your app works on Windows for development. For Hostinger VPS production, choose **Ubuntu 22.04 LTS** - it's the best option for Node.js + MySQL applications.


