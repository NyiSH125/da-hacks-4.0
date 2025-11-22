# Setup Instructions for ver3 Branch

## 🔑 IMPORTANT: API Key Setup Required

**YES, you need to add your own API key!** The repository does NOT include an API key for security reasons.

---

## Quick Setup (5 minutes)

### Step 1: Get Your Google Gemini API Key (FREE)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

**Note:** Gemini offers a generous free tier - no credit card required!

---

### Step 2: Create `.env` File

1. In the project root directory, create a file named `.env`
2. Add your API key:

```bash
GEMINI_API_KEY=your-api-key-here
PORT=3001
```

**Replace `your-api-key-here` with the actual key you copied!**

Example:
```bash
GEMINI_API_KEY=AIzaSyAbC123...your-actual-key
PORT=3001
```

---

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server
- `cors` - Cross-origin requests
- `dotenv` - Environment variable loader

---

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
🔒 Secure Gemini Proxy + Static Server running on http://localhost:3001
✅ API key is hidden from frontend
🌐 Serving HTML files from: /path/to/project
📝 Open http://localhost:3001 in your browser
```

---

### Step 5: Open in Browser

Open **http://localhost:3001** in your browser.

---

## ✅ Verification

1. **Check server is running:** You should see the VibeLink home page
2. **Check API key is working:** 
   - Go to Profile page
   - You should NOT see an API key prompt (if you do, check your `.env` file)
   - Open browser console (F12) - you should see: `AI Service: Using secure proxy...`

---

## 🔒 Security Notes

- ✅ Your `.env` file is in `.gitignore` - it won't be committed to git
- ✅ API key is stored on the server, never exposed to browser
- ✅ Each developer needs their own API key
- ⚠️ **NEVER commit your `.env` file to git!**

---

## 🐛 Troubleshooting

### "Cannot GET /" Error
- Make sure server is running: `npm start`
- Check you're accessing `http://localhost:3001` (with http://)

### "GEMINI_API_KEY not found" Error
- Check `.env` file exists in project root
- Check `.env` file has `GEMINI_API_KEY=your-key-here`
- Make sure there are no spaces around the `=` sign
- Restart the server after creating `.env`

### API Key Prompt Appears
- Check `.env` file is in the correct location (project root)
- Check the API key format is correct
- Restart the server

### Rate Limiting (429 Errors)
- Gemini free tier has rate limits (~15 requests/minute)
- Wait a few seconds between requests
- The app will automatically retry with exponential backoff

---

## 📝 File Structure

```
project-root/
├── .env                    ← CREATE THIS (not in git)
├── .env.example            ← Template (in git)
├── proxy-server.js         ← Backend server
├── ai-service.js          ← AI integration
├── app.js                 ← Main app logic
├── package.json           ← Dependencies
└── [other files...]
```

---

## 🎯 What Changed in ver3?

- ✅ AI-powered matching with Google Gemini
- ✅ Secure proxy server (API key hidden)
- ✅ Intelligent chat responses
- ✅ Typing indicators
- ✅ Better fallback responses when AI is unavailable
- ✅ Profile saving fixes
- ✅ Discover page improvements

---

## Need Help?

1. Check `QUICK_START.md` for quick reference
2. Check `DEBUG.md` for debugging tips
3. Check `SECURITY.md` for security details
4. Check `AI_SETUP.md` for AI feature details

---

## ⚠️ Important Reminders

1. **Each developer needs their own API key** - Get it from Google AI Studio
2. **Create `.env` file** - Copy from `.env.example` if needed
3. **Never commit `.env`** - It's already in `.gitignore`
4. **Restart server** after creating/updating `.env`

