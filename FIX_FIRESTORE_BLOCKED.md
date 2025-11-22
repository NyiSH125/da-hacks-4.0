# Fix: Firestore Blocked Error (ERR_BLOCKED_BY_CLIENT)

## The Problem
You're seeing this error in the console:
```
firestore.googleapis.com/... Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```

This means your browser or an extension is blocking Firestore requests, preventing:
- Profile saving to Firestore
- Real user matching
- Real-time chat

## Solutions (Try in Order)

### Solution 1: Disable Ad Blockers (Most Common Fix)

**If you have an ad blocker (uBlock Origin, AdBlock Plus, etc.):**

1. **Click the ad blocker icon** in your browser toolbar
2. **Disable it for `localhost:3001`** or add an exception
3. **Refresh the page** (Cmd+Shift+R or Ctrl+Shift+R)

**For uBlock Origin:**
- Click the uBlock icon
- Click the power button to disable for this site
- Or click the settings icon → "Disable on this site"

**For AdBlock Plus:**
- Click the AdBlock icon
- Click "Don't run on pages on this domain"
- Refresh the page

### Solution 2: Check Browser Privacy Settings

**Chrome:**
1. Go to `chrome://settings/privacy`
2. Check "Block third-party cookies" - try disabling temporarily
3. Or add `localhost` to allowed sites

**Firefox:**
1. Go to `about:preferences#privacy`
2. Under "Cookies and Site Data", check settings
3. Make sure `localhost` is allowed

**Safari:**
1. Go to Safari → Preferences → Privacy
2. Uncheck "Prevent cross-site tracking" temporarily
3. Or add `localhost` to exceptions

### Solution 3: Check Other Extensions

Some privacy extensions block Firebase:
- Privacy Badger
- Ghostery
- DuckDuckGo Privacy Essentials
- Any "Privacy" or "Tracker Blocker" extensions

**To test:**
1. Open browser in **Incognito/Private mode** (extensions usually disabled)
2. Go to `http://localhost:3001`
3. If it works in incognito, an extension is blocking it

### Solution 4: Whitelist Firebase Domains

Add these to your ad blocker's whitelist:
- `*.firebaseapp.com`
- `*.firestore.googleapis.com`
- `*.googleapis.com`
- `localhost`

### Solution 5: Use a Different Browser

If nothing works, try:
- **Chrome** (if using Firefox)
- **Firefox** (if using Chrome)
- **Safari** (if on Mac)

## Verify It's Fixed

After applying a fix:

1. **Refresh the page** (hard refresh: Cmd+Shift+R / Ctrl+Shift+R)
2. **Open Console** (F12)
3. **Check for errors** - the `ERR_BLOCKED_BY_CLIENT` should be gone
4. **Go to Profile page** - should show "✓ Synced to cloud"
5. **Save profile** - check Firestore Console to verify it saved

## Quick Test

1. Open browser in **Incognito/Private mode**
2. Go to `http://localhost:3001`
3. Sign in
4. Check console - if no errors, it's an extension blocking it

## Still Not Working?

If Firestore is still blocked after trying all solutions:

1. Check if you're behind a **corporate firewall** or **VPN** that blocks Google services
2. Try a different network (mobile hotspot)
3. Check browser console for other errors
4. Verify Firebase config is correct in HTML files

