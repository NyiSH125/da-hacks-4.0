# Firebase Setup Guide for VibeLink

## Step 1: Get Your Firebase Configuration

1. Go to your Firebase Console: https://console.firebase.google.com
2. Select your project (DAHack4)
3. Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
4. Select **"Project settings"**
5. Scroll down to the **"Your apps"** section
6. If you don't have a web app yet:
   - Click the **"</>" (Web)** icon
   - Register your app with a nickname (e.g., "VibeLink Web")
   - Click **"Register app"**
7. Copy the `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "dahack4.firebaseapp.com",
  projectId: "dahack4",
  storageBucket: "dahack4.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 2: Enable Firebase Services

### Enable Authentication (Email/Password)

1. In Firebase Console, go to **"Authentication"** in the left sidebar
2. Click **"Get started"** if you haven't enabled it yet
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

### Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose the closest to you)
5. Click **"Enable"**

**⚠️ Important:** For production, you'll need to set up Firestore security rules. For now, test mode is fine for development.

## Step 3: Add Configuration to HTML Files

Replace the placeholder values in these files:
- `index.html`
- `profile.html`
- `network.html`
- `discover.html`
- `category.html`

Find these lines in each file:
```html
<meta name="firebase-api-key" content="YOUR_API_KEY_HERE" />
<meta name="firebase-auth-domain" content="YOUR_PROJECT_ID.firebaseapp.com" />
<meta name="firebase-project-id" content="YOUR_PROJECT_ID" />
<meta name="firebase-storage-bucket" content="YOUR_PROJECT_ID.appspot.com" />
<meta name="firebase-messaging-sender-id" content="YOUR_MESSAGING_SENDER_ID" />
<meta name="firebase-app-id" content="YOUR_APP_ID" />
```

Replace with your actual values:
- `YOUR_API_KEY_HERE` → Your `apiKey` from firebaseConfig
- `YOUR_PROJECT_ID` → Your `projectId` from firebaseConfig (use this for authDomain and storageBucket too)
- `YOUR_MESSAGING_SENDER_ID` → Your `messagingSenderId` from firebaseConfig
- `YOUR_APP_ID` → Your `appId` from firebaseConfig

### Example:
If your config is:
```javascript
apiKey: "AIzaSyAbc123..."
authDomain: "dahack4.firebaseapp.com"
projectId: "dahack4"
storageBucket: "dahack4.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abcdef"
```

Then your meta tags should be:
```html
<meta name="firebase-api-key" content="AIzaSyAbc123..." />
<meta name="firebase-auth-domain" content="dahack4.firebaseapp.com" />
<meta name="firebase-project-id" content="dahack4" />
<meta name="firebase-storage-bucket" content="dahack4.appspot.com" />
<meta name="firebase-messaging-sender-id" content="123456789" />
<meta name="firebase-app-id" content="1:123456789:web:abcdef" />
```

## Step 4: Test Your Setup

1. Start your proxy server: `npm start`
2. Open `http://localhost:3001` in your browser
3. Go to the Profile page
4. Open browser console (F12)
5. You should see: `"Firebase initialized successfully"`
6. You should see the authentication UI on the Profile page

## Troubleshooting

### "Firebase SDK not loaded"
- Make sure the Firebase SDK scripts are included in your HTML (they should be)
- Check browser console for script loading errors

### "Firebase config not found"
- Double-check that you've replaced ALL placeholder values in the meta tags
- Make sure there are no typos in the meta tag names

### Authentication not working
- Make sure Email/Password authentication is enabled in Firebase Console
- Check that your authDomain matches your project ID

### Firestore errors
- Make sure Firestore Database is created and enabled
- Check that you're using "test mode" for development

## Security Note

The Firebase config (especially apiKey) is safe to expose in client-side code. Firebase has security rules that protect your data. However, make sure to:
- Set up proper Firestore security rules before going to production
- Never commit sensitive data (API keys for other services) to version control

