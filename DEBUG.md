# Debugging Guide

## Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for errors.

### Expected Console Messages:
- ✅ `VibeLink: DOMContentLoaded fired`
- ✅ `VibeLink: Initializing page: [page name]`
- ✅ `VibeLink: Page initialized successfully`
- ✅ `AI Service: Using secure proxy (API key hidden on server) http://localhost:3001/api/gemini`

### Common Errors:

1. **"AI_SERVICE is not defined"**
   - Check that `ai-service.js` is loading
   - Check Network tab to see if `ai-service.js` returns 200 OK

2. **"Cannot read property of undefined"**
   - Check that all HTML elements exist (use Elements tab)
   - Verify `data-page` attribute is set on `<body>`

3. **"Failed to fetch" or CORS errors**
   - Make sure proxy server is running
   - Check that proxy URL in meta tag matches server URL

4. **Profile not saving**
   - Check localStorage in Application tab
   - Look for `vibelink-profile` key
   - Check console for JavaScript errors

## Test Steps

1. **Open http://localhost:3001**
2. **Open Browser Console (F12)**
3. **Check for errors**
4. **Try clicking buttons/interacting**
5. **Check Network tab for failed requests**

## Quick Fixes

- **Refresh the page** (Ctrl+R or Cmd+R)
- **Clear browser cache** (Ctrl+Shift+Delete)
- **Restart the server** (`npm start`)
- **Check server logs** in terminal

