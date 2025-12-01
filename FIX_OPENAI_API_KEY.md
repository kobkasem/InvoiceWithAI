# 🔑 Fix OpenAI API Key Error

## Problem
Getting error: "401 Incorrect API key provided: your-ope************here"

## Cause
Your `.env` file has a placeholder API key instead of a real OpenAI API key.

---

## ✅ Solution: Add Your Real OpenAI API Key

### Step 1: Get Your OpenAI API Key

1. Go to: https://platform.openai.com/account/api-keys
2. Sign in to your OpenAI account
3. Click **"Create new secret key"**
4. Copy the API key (it starts with `sk-...`)
5. **Important**: Save it immediately - you won't be able to see it again!

### Step 2: Update Your .env File

Open your `.env` file and update this line:

**Current (wrong):**
```env
OPENAI_API_KEY=your-openai-api-key-here
```

**Should be (your real key):**
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Example:**
```env
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### Step 3: Restart the Server

After updating `.env`, restart your server:

1. Stop the server (Ctrl+C)
2. Start again: `npm run dev`

---

## 🔒 Security Note

- ✅ Never commit `.env` file to GitHub (it's already in `.gitignore`)
- ✅ Keep your API key secret
- ✅ Don't share your API key publicly
- ✅ If exposed, regenerate it immediately at OpenAI

---

## 💰 OpenAI API Costs

**Note**: Using OpenAI API costs money based on usage:
- GPT-4 Vision API: ~$0.01-0.03 per image
- Check pricing: https://openai.com/pricing

**Free Tier**: OpenAI may provide some free credits for new accounts.

---

## 🧪 Test After Update

1. Update `.env` with real API key
2. Restart server
3. Try uploading an invoice image
4. Should work now!

---

## ❌ If You Don't Have OpenAI API Key

If you don't want to use OpenAI API right now:

1. You can still use **Manual Entry** feature
2. Invoice upload with AI extraction won't work
3. But all other features will work fine

---

## 📝 Quick Fix

1. Get API key from: https://platform.openai.com/account/api-keys
2. Update `.env` file: `OPENAI_API_KEY=sk-proj-your-actual-key-here`
3. Restart server: `npm run dev`
4. Try again!



