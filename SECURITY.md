# Security Guide: API Key Protection

## ⚠️ IMPORTANT: API Key Security

**NEVER hardcode API keys in frontend code!** Anyone can view them in:
- Browser DevTools (F12)
- View Page Source
- Network tab
- JavaScript files

## Current Setup

Your API key is currently **NOT hardcoded** (removed for security). You have two secure options:

---

## Option 1: Backend Proxy (RECOMMENDED for Production)

**Most Secure** - API key stays on server, never exposed to browser.

### Setup Steps:

1. **Install dependencies:**
   ```bash
   npm install express cors dotenv
   ```

2. **Create `.env` file:**
   ```bash
   GEMINI_API_KEY=your-api-key-here
   PORT=3001
   ```
   **Important:** Replace `your-api-key-here` with your own Google Gemini API key!

3. **Start the proxy server:**
   ```bash
   node proxy-server.js
   ```

4. **Add proxy meta tag to your HTML files:**
   ```html
   <head>
     <meta name="vibelink-gemini-proxy" content="http://localhost:3001/api/gemini">
   </head>
   ```

5. **The proxy will:**
   - Hide your API key from the frontend
   - Forward requests to Gemini API
   - Return responses to your app

### For Production:
- Deploy proxy server to Heroku, Vercel, or similar
- Update meta tag with production URL
- Keep `.env` file secure (never commit to git)

---

## Option 2: User-Entered Key (For Demos/Testing)

**Less Secure** - Each user enters their own key.

### How it works:
1. User visits your app
2. Modal prompts for API key
3. Key stored in browser's localStorage
4. Each user uses their own key

### Pros:
- No backend needed
- Good for demos/hackathons
- Each user manages their own key

### Cons:
- Users must have their own API key
- Key visible in localStorage (but only to that user)

---

## Current Configuration

The app is set up to:
1. **First check** for proxy URL (most secure)
2. **Fallback** to user-entered key from localStorage
3. **Never** hardcode keys in source code

---

## Quick Start (Using Proxy)

1. Copy your API key to `.env` file
2. Run: `node proxy-server.js`
3. Add meta tag to HTML (see above)
4. Your API key is now secure! 🔒

---

## For Hackathon/Demo

If you're just demoing and don't want to set up a proxy:
- Use Option 2 (user-entered key)
- Users enter their own keys
- Works immediately, no backend needed

---

## Security Checklist

- ✅ No hardcoded API keys in frontend
- ✅ Proxy option available
- ✅ User key option available
- ✅ `.env` file in `.gitignore`
- ✅ API key never exposed in browser

