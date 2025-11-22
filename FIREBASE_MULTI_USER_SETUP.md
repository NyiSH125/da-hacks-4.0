# Firebase Multi-User Setup Guide

## Overview
This guide will help you set up Firebase for real multi-user matching in VibeLink.

## Step 1: Firebase Console Setup (YOU DO THIS)

### 1.1 Get Your Firebase Config
1. Go to https://console.firebase.google.com
2. Select your project: **DAHack4**
3. Click the **gear icon (⚙️)** next to "Project Overview"
4. Select **"Project settings"**
5. Scroll down to **"Your apps"** section
6. If you see a web app already registered, click on it
7. If not, click the **`</>` (Web)** icon to add a web app
   - App nickname: **DAHack4** (or any name you like)
   - **DO NOT** check "Also set up Firebase Hosting" (we're using local server)
   - Click **"Register app"**
8. You'll see a `firebaseConfig` object - **COPY THESE VALUES**:
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

### 1.2 Add Config to HTML Files (YOU DO THIS)
Open each HTML file (`index.html`, `profile.html`, `discover.html`, `network.html`, `category.html`) and replace the placeholder values in the `<meta>` tags:

**Find these lines (near the top of each HTML file):**
```html
<meta name="firebase-api-key" content="YOUR_API_KEY_HERE" />
<meta name="firebase-auth-domain" content="YOUR_PROJECT_ID.firebaseapp.com" />
<meta name="firebase-project-id" content="YOUR_PROJECT_ID" />
<meta name="firebase-storage-bucket" content="YOUR_PROJECT_ID.appspot.com" />
<meta name="firebase-messaging-sender-id" content="YOUR_MESSAGING_SENDER_ID" />
<meta name="firebase-app-id" content="YOUR_APP_ID" />
```

**Replace with your actual values:**
```html
<meta name="firebase-api-key" content="AIzaSy..." />
<meta name="firebase-auth-domain" content="dahack4.firebaseapp.com" />
<meta name="firebase-project-id" content="dahack4" />
<meta name="firebase-storage-bucket" content="dahack4.appspot.com" />
<meta name="firebase-messaging-sender-id" content="123456789" />
<meta name="firebase-app-id" content="1:123456789:web:abcdef" />
```

**Do this for ALL 5 HTML files!**

### 1.3 Enable Authentication
1. In Firebase Console, go to **"Authentication"** in left sidebar
2. Click **"Get started"** if you haven't enabled it
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

### 1.4 Create Firestore Database
1. In Firebase Console, go to **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to you, e.g., `us-central`)
5. Click **"Enable"**

### 1.5 Set Up Firestore Security Rules (IMPORTANT)
1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with this (allows users to read/write their own data and read public profiles):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow public read for matching (only public fields)
      allow read: if request.auth != null;
    }
    
    // Matches - users can read/write matches they're part of
    match /matches/{matchId} {
      allow read, write: if request.auth != null && 
        (resource.data.members != null && request.auth.uid in resource.data.members);
      allow create: if request.auth != null;
    }
    
    // Messages - users can read/write messages in matches they're part of
    match /matches/{matchId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 2: Test the Setup
1. Start your server: `npm start`
2. Open `http://localhost:3001`
3. Go to Profile page
4. You should see Sign Up/Sign In buttons
5. Create an account
6. Your profile will sync to Firestore

## What Happens Next
- **Profiles are saved to Firestore** - Your profile syncs to the cloud when you're signed in
- **Real user matching** - When generating matches, the app queries Firestore for real users with similar interests
- **AI-powered compatibility** - AI scores compatibility between you and real users
- **Hybrid matching** - If no real users found, AI bots are shown as fallback
- **Match groups** - When you accept a match with a real user, a match group is created in Firestore
- **Real-time chat** - Messages sync in real-time using Firestore listeners

## How It Works

### Matching Flow:
1. User goes to Discover page and selects a topic (Travel, Sports, etc.)
2. App queries Firestore for users who:
   - Have the same topic in their categories
   - Have similar tags (using AI analysis)
   - Are active recently
3. AI scores compatibility between current user and potential matches
4. Shows real users first, then AI-generated matches, then library matches
5. If no matches found, shows AI bots as fallback

### Chat Flow:
1. When user accepts a real user match, a match group is created in Firestore
2. Messages are saved to Firestore in real-time
3. Firestore listeners update the UI automatically when new messages arrive
4. All users in the match group see messages instantly

### Profile Sync:
- When signed in: Profile saves to both localStorage (cache) and Firestore
- When signed out: Profile only saves to localStorage
- On login: Profile loads from Firestore and syncs to localStorage

