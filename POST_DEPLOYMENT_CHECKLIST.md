# ✅ Post-Deployment Checklist - Railway

Congratulations! Your app is deployed successfully. Here's what to do next:

---

## 🎯 Step 1: Get Your Railway URL

1. Railway Dashboard → Your Project → **Settings**
2. Scroll to **"Networking"** section
3. Copy your Railway URL (e.g., `https://your-app-name.up.railway.app`)

---

## 🔄 Step 2: Update FRONTEND_URL (If Needed)

1. Go to **Variables** tab
2. Find `FRONTEND_URL` variable
3. Click **Edit** (pencil icon)
4. Update value to your actual Railway URL:
   ```
   https://your-app-name.up.railway.app
   ```
5. Click **Update**
6. Railway will auto-redeploy (or manually redeploy)

**Why?** This ensures email links and redirects work correctly.

---

## 🧪 Step 3: Test Your Deployment

### Test 1: Visit Your App

1. Open your Railway URL in browser
2. You should see the **Login page**
3. ✅ If you see login page → Frontend is working!

### Test 2: Login

1. Use default admin credentials:
   - **Email**: `kasem_u@synnex.co.th`
   - **Password**: `admin123`
2. Click **Login**
3. ✅ If you see Dashboard → Authentication is working!

### Test 3: Check Dashboard

1. After login, you should see:
   - Dashboard with statistics
   - Navigation menu
   - Recent invoices
2. ✅ If dashboard loads → Backend API is working!

### Test 4: Test File Upload

1. Go to **Upload** page
2. Try uploading a test invoice image
3. ✅ If upload works → File handling is working!

### Test 5: Check API Health

1. Visit: `https://your-app-name.up.railway.app/api/health`
2. Should see: `{"status":"OK","message":"Server is running"}`
3. ✅ If you see this → Server is running!

---

## 🔒 Step 4: Security Checklist

### ⚠️ IMPORTANT: Change Admin Password

**Do this immediately after first login!**

1. Login with default credentials
2. Go to **User Management** (if available) or update profile
3. Change password from `admin123` to a strong password
4. ✅ Password changed → More secure!

### Verify Environment Variables

1. Railway Dashboard → **Variables** tab
2. Verify all variables are set:
   - ✅ `NODE_ENV` = `production`
   - ✅ `SUPABASE_URL` = (your Supabase URL)
   - ✅ `SUPABASE_ANON_KEY` = (your Supabase key)
   - ✅ `JWT_SECRET` = (your secret)
   - ✅ `OPENAI_API_KEY` = (your OpenAI key)
   - ✅ `FRONTEND_URL` = (your Railway URL)

---

## 📊 Step 5: Monitor Your App

### Check Logs

1. Railway Dashboard → **Deployments**
2. Click latest deployment → **View Logs**
3. Look for:
   - ✅ No errors
   - ✅ "Server running on port 5000"
   - ✅ Database connection successful

### Check Status

1. Railway Dashboard → Your Project
2. Should see:
   - ✅ Green status indicator
   - ✅ "Active" status
   - ✅ URL is accessible

---

## 🎨 Step 6: Custom Domain (Optional)

If you want to use your own domain:

1. Railway Dashboard → **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain name
4. Follow DNS instructions
5. Wait for SSL certificate (automatic)

---

## 🔧 Step 7: Verify Features Work

Test these key features:

- [ ] **Login/Logout** - Works correctly
- [ ] **Dashboard** - Shows statistics
- [ ] **File Upload** - Can upload invoices
- [ ] **AI Extraction** - Extracts invoice data
- [ ] **Invoice List** - Shows all invoices
- [ ] **Invoice Detail** - Can view invoice details
- [ ] **Manual Entry** - Can manually enter invoices
- [ ] **Review Page** - Supervisors can review
- [ ] **User Management** - Admins can manage users
- [ ] **Prompt Management** - Can manage AI prompts

---

## 📝 Step 8: Production Readiness

### Performance

- [ ] App loads quickly (< 3 seconds)
- [ ] No console errors (check browser console F12)
- [ ] API responses are fast

### Functionality

- [ ] All features work as expected
- [ ] File uploads work
- [ ] Database saves data correctly
- [ ] AI extraction works

### Security

- [ ] Admin password changed
- [ ] HTTPS enabled (Railway does this automatically)
- [ ] Environment variables are secure
- [ ] No sensitive data exposed

---

## 🚨 Troubleshooting

### Issue: Can't Login

**Check:**
- Database tables exist (run `supabase_schema.sql` in Supabase)
- Admin user exists in database
- Password is correct

**Fix:**
- Verify Supabase connection
- Check Railway logs for errors

### Issue: File Upload Fails

**Check:**
- Upload directory permissions
- File size limits
- Railway logs for errors

**Fix:**
- Check `server/uploads` directory exists
- Verify file size is within limits

### Issue: AI Extraction Fails

**Check:**
- OpenAI API key is valid
- API key has credits
- Railway logs for API errors

**Fix:**
- Verify `OPENAI_API_KEY` in Railway Variables
- Check OpenAI dashboard for usage/credits

---

## 📚 Next Steps

### For Production Use

1. **Set up monitoring** - Use Railway's built-in monitoring
2. **Configure backups** - Set up Supabase backups
3. **Set up alerts** - Configure Railway alerts for downtime
4. **Performance tuning** - Monitor and optimize as needed

### For Development

1. **Keep Railway updated** - Push changes to GitHub
2. **Test locally first** - Test changes before deploying
3. **Use branches** - Create branches for features
4. **Monitor costs** - Keep an eye on Railway usage

---

## 🎉 Success Checklist

After completing all steps, you should have:

- ✅ App deployed and accessible
- ✅ Login working
- ✅ All features tested
- ✅ Admin password changed
- ✅ Environment variables configured
- ✅ Monitoring set up
- ✅ Ready for production use!

---

## 📞 Support Resources

- **Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
- **Project Logs**: Railway → Deployments → View Logs

---

## 🎯 Quick Reference

### Your App URL
```
https://your-app-name.up.railway.app
```

### Health Check
```
https://your-app-name.up.railway.app/api/health
```

### Default Login
- Email: `kasem_u@synnex.co.th`
- Password: `admin123` ⚠️ **Change this!**

---

**Congratulations! Your app is live! 🚀**

Test everything and let me know if you encounter any issues!

