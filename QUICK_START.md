# Quick Start Guide

## 🚀 How to Run VibeLink

### Step 1: Start the Server
```bash
npm start
```
or
```bash
node proxy-server.js
```

You should see:
```
🔒 Secure Gemini Proxy + Static Server running on http://localhost:3001
✅ API key is hidden from frontend
🌐 Serving HTML files from: /path/to/your/project
📝 Open http://localhost:3001 in your browser
```

### Step 2: Open in Browser
Open **http://localhost:3001** in your browser (NOT just localhost:3001 without http://)

The server now:
- ✅ Serves all HTML files (index.html, profile.html, discover.html, etc.)
- ✅ Handles AI API calls securely through `/api/gemini`
- ✅ Keeps your API key hidden from the browser

---

## 🔍 Troubleshooting

### "Cannot GET /" Error
- Make sure you're accessing **http://localhost:3001** (with http://)
- Make sure the server is running (`npm start`)
- Check that port 3001 isn't already in use

### Discover Page Not Working
- Open browser console (F12) and check for errors
- Make sure you selected a topic from the home page
- Try clicking "Generate matches" button

### Profile Not Saving
- Check browser console for errors
- Make sure you click "Save profile" button
- Check localStorage in DevTools (Application tab → Local Storage)

### AI Features Not Working
- Check that proxy server is running
- Open browser console and look for "AI Service: Using secure proxy" message
- Verify `.env` file has your API key

---

## 📝 Notes

- The proxy server serves BOTH static files AND API endpoints
- Your API key is in `.env` file (never exposed to browser)
- All HTML files are configured to use the proxy automatically

