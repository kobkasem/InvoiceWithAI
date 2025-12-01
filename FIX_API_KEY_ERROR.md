# 🔧 Fix "Incorrect API key" Error

## Problem
Getting error: "401 Incorrect API key provided: your-ope************here"

Even though you've updated `.env`, the server is still using the old placeholder value.

---

## ✅ Solution: Restart Server + Verify

### Step 1: Verify .env File

Your `.env` file should have:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**NOT:**
```env
OPENAI_API_KEY=your-openai-api-key-here  ❌
```

### Step 2: RESTART THE SERVER (CRITICAL!)

**This is the most important step!**

1. **Stop the server:**
   - Go to terminal where `npm run dev` is running
   - Press `Ctrl+C` to stop it
   - Wait until it's completely stopped

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for startup:**
   ```
   [0] Database initialized successfully
   [0] Server running on port 5000
   ```

### Step 3: Check Server Console

After restarting, look at the server console. You should see:
- ✅ No warnings about API key
- ✅ "Server running on port 5000"

If you see:
- ⚠️ "WARNING: OpenAI API key is not configured properly!"
- → Check your `.env` file again

### Step 4: Test Again

1. Go to: http://localhost:3000
2. Upload an invoice
3. Should work now!

---

## 🔍 Why This Happens

The server reads `.env` file **only when it starts**. If you update `.env` while the server is running, it won't see the changes until you restart.

---

## ✅ Quick Fix Checklist

- [ ] Updated `.env` with real API key (starts with `sk-proj-`)
- [ ] **Stopped the server** (Ctrl+C)
- [ ] **Started server again** (`npm run dev`)
- [ ] Waited for "Server running on port 5000"
- [ ] Tried uploading invoice again

---

## 🧪 Verify API Key is Loaded

Run this to check:
```bash
node verify-api-key.js
```

Should show: ✅ API Key Configuration is correct!

---

## ❌ If Still Not Working

1. **Check .env file location:**
   - Must be in project root (same folder as `package.json`)
   - Not in `server/` or `client/` folder

2. **Check .env file format:**
   ```env
   OPENAI_API_KEY=sk-proj-abc123...  ✅ Correct
   OPENAI_API_KEY="sk-proj-abc123..."  ❌ Don't use quotes
   OPENAI_API_KEY = sk-proj-abc123...  ❌ No spaces around =
   ```

3. **Check server console:**
   - Look for any error messages
   - Check if API key warning appears

---

## 🎯 Most Common Issue

**Server not restarted!** 

The `.env` file is only read when the server starts. You **MUST** restart the server after updating `.env`.

---

**Next Step**: Restart your server now! 🚀



