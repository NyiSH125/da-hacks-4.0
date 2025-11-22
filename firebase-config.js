/**
 * Firebase Configuration and Initialization
 * 
 * This file initializes Firebase using configuration values from HTML meta tags.
 * Replace the placeholder values in your HTML files with your actual Firebase config.
 */

function initFirebase() {
  // Check if Firebase SDK is loaded
  if (typeof firebase === 'undefined') {
    console.warn("Firebase SDK not loaded. Make sure Firebase scripts are included in your HTML.");
    return null;
  }

  // Read config from meta tags
  const getMeta = (name) => {
    const meta = document.querySelector(`meta[name="${name}"]`);
    return meta ? meta.getAttribute("content") : null;
  };

  const apiKey = getMeta("firebase-api-key");
  const authDomain = getMeta("firebase-auth-domain");
  const projectId = getMeta("firebase-project-id");
  const storageBucket = getMeta("firebase-storage-bucket");
  const messagingSenderId = getMeta("firebase-messaging-sender-id");
  const appId = getMeta("firebase-app-id");

  // Check if config is provided
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || 
      !authDomain || authDomain.includes("YOUR_PROJECT_ID") ||
      !projectId || projectId === "YOUR_PROJECT_ID") {
    console.warn("Firebase configuration not found or incomplete. Using localStorage only.");
    return null;
  }

  try {
    // Initialize Firebase
    if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: apiKey,
        authDomain: authDomain,
        projectId: projectId,
        storageBucket: storageBucket,
        messagingSenderId: messagingSenderId,
        appId: appId,
      };

      firebase.initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully");
    }

    // Get Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();

    return {
      auth: auth,
      db: db,
    };
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    return null;
  }
}
