# 🔍 Verify Railway Environment Variables

## Error: Missing Supabase Configuration

If you're still getting this error, it means Railway isn't reading your environment variables correctly.

---

## ✅ Step-by-Step: Verify Variables Are Set

### Step 1: Check Railway Variables Tab

1. Railway Dashboard → Your Project
2. Click **"Variables"** tab
3. You should see a list of variables

**Check if these exist:**
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `NODE_ENV`
- [ ] `PORT`
- [ ] `JWT_SECRET`
- [ ] `OPENAI_API_KEY`
- [ ] `FRONTEND_URL`

### Step 2: Verify Variable Names Are Exact

**Variable names must be EXACTLY:**
- ✅ `SUPABASE_URL` (all caps, underscore)
- ✅ `SUPABASE_ANON_KEY` (all caps, underscores)
- ❌ `SUPABASEURL` (wrong - no underscore)
- ❌ `supabase_url` (wrong - lowercase)
- ❌ `SUPABASE_URL ` (wrong - trailing space)

### Step 3: Verify Variable Values

Click on each variable to edit and check:

**SUPABASE_URL:**
- ✅ Should start with `https://`
- ✅ Should end with `.supabase.co`
- ✅ No spaces before/after
- Example: `https://gmhzouyrfbdasvestkvu.supabase.co`

**SUPABASE_ANON_KEY:**
- ✅ Should be a long string (JWT token)
- ✅ Starts with `eyJ...`
- ✅ No spaces before/after
- ✅ Complete key (not truncated)

---

## 🔧 Common Issues & Fixes

### Issue 1: Variables Not Added

**Symptom:** Variables tab is empty or missing variables

**Fix:**
1. Click **"New Variable"**
2. Add each variable one by one
3. Make sure to click **"Add"** after each one

### Issue 2: Variable Names Wrong

**Symptom:** Variables exist but names don't match

**Fix:**
1. Delete incorrect variable
2. Add new variable with correct name
3. Use exact spelling: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

### Issue 3: Variable Values Have Spaces

**Symptom:** Values have leading/trailing spaces

**Fix:**
1. Click **Edit** on variable
2. Remove any spaces before/after value
3. Click **Update**

### Issue 4: Variables Not Applied After Adding

**Symptom:** Added variables but app still shows error

**Fix:**
1. After adding variables, **Redeploy**:
   - Go to **Deployments** tab
   - Click **"Redeploy"**
2. Or wait for auto-redeploy (may take a minute)

---

## 🧪 Test: Verify Variables Are Being Read

After redeploying, check Railway logs:

1. Railway Dashboard → **Deployments**
2. Click latest deployment → **View Logs**
3. Look for:
   - ✅ "Server running on port 5000"
   - ✅ "Database initialized successfully"
   - ❌ "Missing Supabase configuration" (should NOT see this)

If you still see "Missing Supabase configuration", the variables aren't being read.

---

## 📋 Quick Checklist

Before redeploying, verify:

- [ ] `SUPABASE_URL` exists in Variables tab
- [ ] `SUPABASE_ANON_KEY` exists in Variables tab
- [ ] Variable names are exactly correct (case-sensitive)
- [ ] Variable values have no extra spaces
- [ ] Values are complete (not truncated)
- [ ] Clicked "Add" after adding each variable
- [ ] Redeployed after adding variables

---

## 🚀 After Adding/Updating Variables

**Important:** Railway needs to redeploy to pick up new variables!

1. **Add/Update variables** in Variables tab
2. **Redeploy**:
   - Go to **Deployments** tab
   - Click **"Redeploy"** button
   - Or wait for auto-redeploy
3. **Check logs** to verify variables are loaded

---

## 🆘 Still Not Working?

### Option 1: Delete and Re-add Variables

1. Railway Dashboard → **Variables**
2. Delete `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Add them again with exact names
4. Redeploy

### Option 2: Check Railway Service Settings

1. Railway Dashboard → **Settings**
2. Check if there are any service-specific variable settings
3. Make sure variables are set at the **service level**, not project level

### Option 3: Contact Railway Support

If variables are set correctly but still not working:
- Check Railway documentation
- Contact Railway support
- Check Railway Discord/community

---

## ✅ Expected Result

After fixing variables and redeploying:

1. **Logs should show:**
   ```
   Database initialized successfully
   Server running on port 5000
   ```

2. **No errors about:**
   - Missing Supabase configuration
   - supabaseUrl is required

3. **App should:**
   - Start successfully
   - Connect to database
   - Be accessible via Railway URL

---

**Make sure variables are set correctly and redeploy!** 🚀

