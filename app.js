const STORAGE_KEYS = {
  profile: "vibelink-profile",
  savedMatches: "vibelink-saved-matches",
};

const AI_ENABLED = true; // Toggle AI features on/off

// Firebase services (initialized after Firebase loads)
let firebaseAuth = null;
let firestoreDb = null;
let currentUser = null;
let FIREBASE_ENABLED = false;

// AI_SERVICE is loaded from ai-service.js (declared there as const)
// We just reference it, don't redeclare it

const TAG_SUGGESTIONS = {
  about: [
    "introverted",
    "organized",
    "night owl",
    "early riser",
    "tactical gamer",
    "collaborative learner",
    "creative strategist",
    "community builder",
    "calm communicator",
    "competitive",
    "plant parent",
    "runner",
    "cozy gamer",
  ],
  looking: [
    "motivated study buddy",
    "quiet roommate",
    "high-ELO teammate",
    "weekly run club",
    "volleyball squad",
    "people who prefer mornings",
    "night shift coders",
    "mindful roommates",
    "gym accountability partner",
    "cozy co-op gamer",
  ],
};

const CATEGORY_COPY = {
  Education: {
    eyebrow: "Education",
    title: "Study Pods & Accountability Crews",
    description:
      "Switch between late-night focus squads or morning studio labs. Choose a focus to see curated pods aligned with your tags.",
    dropdownLabel: "Study focus",
  },
  Sports: {
    eyebrow: "Sports",
    title: "Pickup Games & Training Crews",
    description:
      "Dial-in by sport, intensity, and home court. Matches surface squads that share your role preferences and schedule.",
    dropdownLabel: "Sport preference",
  },
  Gaming: {
    eyebrow: "Gaming",
    title: "Ranked Queues & Cozy Lobbies",
    description:
      "Choose the ladder you grind or the co-op vibe you love. We balance rank, playstyle, and comms.",
    dropdownLabel: "Game focus",
  },
  Roommates: {
    eyebrow: "Roommates",
    title: "Living Situations That Match Your Rhythm",
    description:
      "Screen for cleanliness, rituals, and schedules. VibeLink highlights households that already live like you do.",
    dropdownLabel: "Lifestyle vibe",
  },
};

const CATEGORY_OPTIONS = {
  Education: [
    { label: "Any study focus", value: "all" },
    { label: "Night-owl accountability", value: "night-owl" },
    { label: "Product & design labs", value: "design" },
    { label: "Computer science grind", value: "computer science" },
  ],
  Sports: [
    { label: "All sports", value: "all" },
    { label: "Volleyball squads", value: "volleyball" },
    { label: "Soccer & futsal crews", value: "soccer" },
    { label: "Sunrise run clubs", value: "running" },
  ],
  Gaming: [
    { label: "All gaming vibes", value: "all" },
    { label: "Valorant ranked", value: "valorant" },
    { label: "Cozy co-op", value: "cozy" },
    { label: "Tactical squads", value: "tactical" },
  ],
  Roommates: [
    { label: "All lifestyles", value: "all" },
    { label: "Quiet mornings", value: "quiet" },
    { label: "Creative loft energy", value: "creative" },
    { label: "Night shift coders", value: "night" },
  ],
};

const MATCH_TEMPLATES = [
  {
    id: "edu-night-owl",
    category: "Education",
    title: "Night Owl Accountability Pod",
    summary: "11pm focus sprints with pomodoro timers and shared Notion dashboards.",
    keywords: ["night-owl", "computer science"],
    tags: ["night owl", "pomodoro", "cs439", "deep work"],
    details: ["Late nights · Sun-Thu", "Shared spaced-repetition decks", "Camera-optional focus rooms"],
    members: ["Kai · Cloud eng", "Jenny · Stats grad", "Mara · UX minor"],
    baseScore: 58,
  },
  {
    id: "edu-product-studio",
    category: "Education",
    title: "Product Studio Crunch Crew",
    summary: "Morning makers balancing capstone prototyping with design critiques.",
    keywords: ["design", "morning"],
    tags: ["mornings", "product", "figma", "accountability"],
    details: ["Mon/Wed 9am standups", "Figma review swaps", "Sprint demo prep"],
    members: ["Lina · Design lead", "Omar · Frontend dev", "Priya · Researcher"],
    baseScore: 60,
  },
  {
    id: "sports-volleyball",
    category: "Sports",
    title: "Downtown Volleyball Stack",
    summary: "Intermediate co-ed squad rotating setter drills and chill scrims.",
    keywords: ["volleyball"],
    tags: ["setter", "drills", "weeknights", "downtown"],
    details: ["Tue/Thu 7pm · Downtown Rec", "Need one setter + libero", "Chill competitive pace"],
    members: ["Theo · Opp hitter", "Mika · Libero", "Rowan · Setter", "Jude · Coach"],
    baseScore: 62,
  },
  {
    id: "sports-run-club",
    category: "Sports",
    title: "Sunrise Run Club · Lady Bird Trail",
    summary: "6am runners pacing 9-10 min miles with matcha cooldowns.",
    keywords: ["running"],
    tags: ["morning", "running", "trail", "accountability"],
    details: ["Tues/Thu 6am start", "Warm-up mobility led by Ellis", "Post-run matcha bar hang"],
    members: ["Noor · Pacer", "Ellis · Strength coach", "Sam · Med student"],
    baseScore: 55,
  },
  {
    id: "sports-soccer",
    category: "Sports",
    title: "Eastside Futsal Triangle",
    summary: "Weeknight futsal runs for midfielders who like quick rotations.",
    keywords: ["soccer"],
    tags: ["soccer", "midfielder", "weeknights", "eastside"],
    details: ["Wed/Fri 8pm", "Indoor futsal court", "Looking for flexible winger"],
    members: ["Piper · Mid", "Luis · Keeper", "Ren · Winger"],
    baseScore: 57,
  },
  {
    id: "gaming-valorant",
    category: "Gaming",
    title: "Valorant Tactical Trio",
    summary: "Ascendant-ranked supportive mains running weekly VOD reviews.",
    keywords: ["valorant", "tactical"],
    tags: ["valorant", "tactical", "ranked", "discord"],
    details: ["Thu/Fri ranked queues", "VOD review Sundays", "Zero tilt comms"],
    members: ["Milo · Controller", "Ivy · Initiator", "Rey · Flex"],
    baseScore: 63,
  },
  {
    id: "gaming-cozy",
    category: "Gaming",
    title: "Cozy Co-Op Saturdays",
    summary: "Narrative explorers hopping between indie titles and Stardew farms.",
    keywords: ["cozy"],
    tags: ["stardew", "story driven", "co-op", "slow living"],
    details: ["Sat 6pm CST", "Switch + PC cross-play", "Playlist swaps each week"],
    members: ["Ames · Farm architect", "Bea · Narrative curator", "Sol · Chill tank"],
    baseScore: 54,
  },
  {
    id: "room-quiet",
    category: "Roommates",
    title: "Quiet Morning Loft Share",
    summary: "Two-bedroom loft prioritizing plant care, calm playlists, and early lights out.",
    keywords: ["quiet"],
    tags: ["tea", "plants", "early riser", "minimalist"],
    details: ["Lights out 10:30pm", "Shared yoga mat space", "Utilities avg $85/mo"],
    members: ["Mira · UX researcher", "Han · Bio major"],
    baseScore: 56,
  },
  {
    id: "room-creative",
    category: "Roommates",
    title: "Creative Loft Collective",
    summary: "Sunlit loft for night-owl makers who jam, paint, and co-work respectfully.",
    keywords: ["creative", "night"],
    tags: ["night owl", "music", "jam sessions", "respectful noise"],
    details: ["Headphones after 11pm", "Monthly gallery pop-up", "Bike storage included"],
    members: ["Zee · Audio engineer", "Poppy · Illustrator", "Luis · XR dev"],
    baseScore: 58,
  },
];

const defaultProfile = {
  fullName: "",
  displayName: "",
  city: "",
  photo: "",
  bio: "",
  aboutTags: [],
  lookingTags: [],
  categories: [],
  naturalLanguagePreferences: "", // New field for AI text analysis
  aiInsights: null, // Store AI-generated insights
};

const tagState = {
  about: new Map(),
  looking: new Map(),
};

const DISCOVER_COPY = {
  Education: {
    summary: "Line up study buddies by courses, study style, and availability.",
    highlights: ["Pomodoro pods", "Night owls", "Peer reviews"],
    form: [
      { type: "select", id: "studyFocus", label: "Study flow", options: ["Any style", "Pomodoro", "Collaborative", "Quiet focus"] },
      { type: "text", id: "course", label: "Course or topic", placeholder: "CS 439 or Linear Algebra" },
    ],
  },
  Sports: {
    summary: "Pick-up squads, run clubs, and league play by sport + role.",
    highlights: ["Pickup hoops", "Weekend futsal", "Sunrise runs"],
    form: [
      { type: "select", id: "sport", label: "Sport type", options: ["Any sport", "Soccer", "Volleyball", "Basketball", "Running"] },
      { type: "text", id: "position", label: "Position / role", placeholder: "defender, setter, pacer…" },
    ],
  },
  Roommates: {
    summary: "Find people who share routines, noise tolerance, and habits.",
    highlights: ["Plant parents", "Night shift coders", "Early risers"],
    form: [
      { type: "select", id: "routine", label: "Routine preference", options: ["Any", "Early mornings", "Night owls", "Hybrid"] },
      { type: "text", id: "houseRule", label: "House rules or vibe", placeholder: "quiet nights, tea rituals…" },
    ],
  },
  Travel: {
    summary: "Match explorers for weekend trips or backpacking buddies.",
    highlights: ["Road trips", "National parks", "Budget flights"],
    form: [
      { type: "select", id: "travelType", label: "Trip style", options: ["Any", "Weekend getaway", "Backpacking", "Food crawl"] },
      { type: "text", id: "destination", label: "Dream destination", placeholder: "Sedona, Lisbon, Tokyo…" },
    ],
  },
  Friends: {
    summary: "Meet locals who love similar routines, hobbies, or meetups.",
    highlights: ["Board games", "Coffee chats", "Study cafes"],
    form: [
      { type: "select", id: "friendActivity", label: "Preferred hang", options: ["Any", "Coffee", "Creative nights", "Study meetups"] },
      { type: "text", id: "friendNote", label: "What should they know?", placeholder: "new in town, loves film photos…" },
    ],
  },
  Gaming: {
    summary: "Queue up for ranked, co-op, or cozy nights.",
    highlights: ["Valorant tactics", "Switch cozy", "Zero tilt comms"],
    form: [
      { type: "select", id: "gameTitle", label: "Game focus", options: ["Any title", "Valorant", "LoL", "Switch co-op", "Indie co-op"] },
      { type: "text", id: "rank", label: "Rank / vibe", placeholder: "Ascendant 2, cozy casual…" },
    ],
  },
  Dating: {
    summary: "Connect by lifestyle, pace, and shared values.",
    highlights: ["Slow mornings", "Creative nights", "Active dates"],
    form: [
      { type: "select", id: "dateStyle", label: "Date style", options: ["Any", "Slow mornings", "Adventures", "Creative nights"] },
      { type: "text", id: "value", label: "Value you care about", placeholder: "communication, kindness…" },
    ],
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("VibeLink: DOMContentLoaded fired");
  
  // Initialize Firebase first
  try {
    if (typeof initFirebase === 'function') {
      const firebaseServices = initFirebase();
      if (firebaseServices) {
        firebaseAuth = firebaseServices.auth;
        firestoreDb = firebaseServices.db;
        FIREBASE_ENABLED = true;
        console.log("VibeLink: Firebase initialized successfully");
        
        // Set up auth state listener
        firebaseAuth.onAuthStateChanged((user) => {
          currentUser = user;
          if (user) {
            console.log("VibeLink: User signed in:", user.uid);
            // Sync profile from Firestore if user is logged in
            syncProfileFromFirestore();
            // Update auth UI
            updateAuthUI();
          } else {
            console.log("VibeLink: User signed out");
            // Fall back to localStorage
            updateAuthUI();
          }
        });
      } else {
        console.warn("VibeLink: Firebase initialization failed - using localStorage only");
      }
    } else {
      console.warn("VibeLink: Firebase not available - using localStorage only");
    }
  } catch (error) {
    console.error("VibeLink: Firebase setup error:", error);
  }
  
  // Initialize AI service if available
  if (AI_ENABLED) {
    try {
      if (typeof AI_SERVICE !== 'undefined') {
        // AI_SERVICE is loaded from ai-service.js
        window.AI_SERVICE = AI_SERVICE;
        // Initialize AI service (will check for proxy or user's API key)
        const initialized = AI_SERVICE.init();
        if (initialized) {
          console.log("VibeLink: AI Service initialized successfully");
        } else {
          console.warn("VibeLink: AI Service initialization failed - AI features disabled");
        }
      } else {
        console.warn("VibeLink: AI_SERVICE not found - make sure ai-service.js is loaded");
      }
    } catch (error) {
      console.error("VibeLink: Error initializing AI service:", error);
    }
  }
  
  try {
  const page = document.body?.dataset.page || "home";
    console.log("VibeLink: Initializing page:", page);
  const map = {
    home: initHomePage,
    profile: initProfilePage,
    category: initCategoryPage,
      discover: initDiscoverPage,
      network: initNetworkPage,
    };
    const initFn = map[page];
    if (initFn) {
      initFn();
      console.log("VibeLink: Page initialized successfully");
    } else {
      console.error("VibeLink: No init function found for page:", page);
    }
  } catch (error) {
    console.error("VibeLink: Error initializing page:", error);
  }
});

const MATCH_LIBRARY = [
  {
    id: "edu-night-owls",
    topic: "Education",
    title: "Night Owl Accountability Pod",
    summary: "11pm focus sprints with spaced-repetition swaps.",
    tags: ["night owl", "pomodoro", "deep work"],
    details: ["Sun–Thu 10:30pm check-ins", "Notion tracker included", "Camera optional"],
    keywords: ["night", "pomodoro"],
    members: ["Kai · cloud eng", "Jenny · stats grad", "Mara · UX minor"],
    scoreBase: 60,
    conversationStarters: ["What is your anchor task tonight?", "Share a resource that saved you this week."],
    messages: [
      { author: "Kai", role: "member", text: "Dropping the CS439 flashcards if anyone needs them." },
      { author: "Jenny", role: "member", text: "I can host a midnight focus room for 30 mins." },
    ],
  },
  {
    id: "edu-studio",
    topic: "Education",
    title: "Product Studio Crunch Crew",
    summary: "Morning stan-ups for hybrid prototyping teams.",
    tags: ["mornings", "product", "figma"],
    details: ["Mon/Wed 9am standups", "Weekly design crits", "Async Notion board"],
    keywords: ["morning", "product"],
    members: ["Lina · design lead", "Omar · FE dev", "Priya · researcher"],
    scoreBase: 58,
    conversationStarters: ["Need eyes on a prototype?", "What sprint win are you celebrating?"],
    messages: [{ author: "Lina", role: "member", text: "Dropping tomorrow's figma board link." }],
  },
  {
    id: "sports-run",
    topic: "Sports",
    title: "Sunrise Run Club · Lady Bird",
    summary: "6am runners pacing 9–10 min miles plus matcha cooldown.",
    tags: ["running", "mornings"],
    details: ["Tue/Thu 6am", "Hills day on Thursdays", "Playlist swap after runs"],
    keywords: ["running", "morning"],
    members: ["Noor · pacer", "Ellis · coach", "Sam · med student"],
    scoreBase: 57,
    conversationStarters: ["Need a stretch suggestion?", "What race are you eyeing?"],
    messages: [{ author: "Noor", role: "member", text: "Testing a hills loop this Thursday—join?" }],
  },
  {
    id: "sports-volley",
    topic: "Sports",
    title: "Downtown Volleyball Stack",
    summary: "Intermediate squad rotating setter drills and chill scrims.",
    tags: ["volleyball", "setter", "weeknights"],
    details: ["Tue/Thu 7pm", "Need setter + libero", "Court 4 downtown rec"],
    keywords: ["volleyball", "setter"],
    members: ["Theo · opposite", "Mika · libero", "Rowan · setter"],
    scoreBase: 62,
    conversationStarters: ["Which drills keep your passing sharp?", "Need subs for Thursday league?"],
    messages: [{ author: "Jude", role: "member", text: "Court 4 is open Friday—mini scrim?" }],
  },
  {
    id: "travel-coast",
    topic: "Travel",
    title: "Pacific Coast Weekenders",
    summary: "Car shares for scenic drives + coffee crawl itineraries.",
    tags: ["roadtrip", "coffee lovers"],
    details: ["Depart Fri evenings", "Shared photo album", "Budget-friendly stays"],
    keywords: ["weekend", "road"],
    members: ["Zara · photographer", "Micah · barista scout"],
    scoreBase: 55,
    conversationStarters: ["What playlist are we using?", "Favorite overlook stop?"],
    messages: [{ author: "Micah", role: "member", text: "I booked a tasting flight in Santa Cruz." }],
  },
  {
    id: "friends-creative",
    topic: "Friends",
    title: "Analog & Chill Collective",
    summary: "Film photo walks, gallery hops, and café coworking.",
    tags: ["film", "gallery", "coffee"],
    details: ["Sundays 11am meetups", "Shared inspo board", "Beginner friendly"],
    keywords: ["coffee", "creative"],
    members: ["Poppy · illustrator", "Leo · product designer"],
    scoreBase: 56,
    conversationStarters: ["What roll are you shooting?", "Share a fav local gallery."],
    messages: [{ author: "Leo", role: "member", text: "Booked two seats for the zine workshop." }],
  },
  {
    id: "gaming-valorant",
    topic: "Gaming",
    title: "Valorant Tactical Trio",
    summary: "Ascendant-ranked supportive mains with weekly VOD reviews.",
    tags: ["valorant", "tactical", "discord"],
    details: ["Fri ranked queues", "Sunday VOD review", "Zero tilt comms"],
    keywords: ["valorant", "ranked"],
    members: ["Milo · controller", "Ivy · initiator", "Rey · flex"],
    scoreBase: 63,
    conversationStarters: ["Queue tonight? Pick a map.", "Drop a clip for hype."],
    messages: [{ author: "Ivy", role: "member", text: "Have Haven smokes ready if we queue later." }],
  },
  {
    id: "dating-slow",
    topic: "Dating",
    title: "Slow Morning Connect",
    summary: "Match people who love early markets, journaling, and brunch dates.",
    tags: ["slow living", "mornings"],
    details: ["Saturdays 9am coffee", "Prompt cards provided", "Screened intros"],
    keywords: ["slow", "morning"],
    members: ["Liv · ceramicist", "Aaron · product PM"],
    scoreBase: 54,
    conversationStarters: ["What ritual grounds your morning?", "Favorite café corner?"],
    messages: [{ author: "Liv", role: "member", text: "Trying the new farmer's market this week." }],
  },
];

const AI_BOTS = [
  {
    id: "sarah",
    name: "Sarah",
    title: "Sarah · Striker & Hype Squad",
    personaTags: ["sporty", "outgoing", "extroverted", "traveler", "soccer striker"],
    likes: ["introvert", "soccer", "bookworm"],
    topics: ["Sports", "Travel", "Friends"],
    conversationStarters: [
      "Which field or city should we plan our next pickup game in?",
      "Share a book or playlist that hypes you up before a match.",
    ],
    openingMessage: "Hey! I'm Sarah. I love hosting pick-up games and post-match travel chats. Let's plan something fun.",
  },
  {
    id: "ryan",
    name: "Ryan",
    title: "Ryan · Coding Nerd & Volley Setter",
    personaTags: ["introverted", "volleyball setter", "full-stack builder"],
    likes: ["extrovert", "volleyball", "code review buddy"],
    topics: ["Education", "Sports", "Gaming"],
    conversationStarters: [
      "Want to pair-program or run drills first?",
      "What's the nerdiest thing you built recently?",
    ],
    openingMessage: "Hi, Ryan here. I'm usually quiet until we start coding or passing drills—but I'm excited to sync up.",
  },
  {
    id: "alex",
    name: "Alex",
    title: "Alex · Storyteller & Coffee Chats",
    personaTags: ["public speaker", "book lover", "coffee dates", "community builder"],
    likes: ["any vibe", "coffee", "discussion"],
    topics: ["Friends", "Dating", "Travel", "Education", "Roommates", "Gaming", "Sports"],
    conversationStarters: [
      "Favorite café for deep conversations?",
      "Which book do you always recommend?",
    ],
    openingMessage: "Hey! I'm Alex. I don't do sports, but I can host a great conversation over coffee or books. Let's connect.",
  },
  {
    id: "maya",
    name: "Maya",
    title: "Maya · Study Pod Leader & Night Owl",
    personaTags: ["organized", "night owl", "collaborative learner", "accountability partner"],
    likes: ["night owl", "pomodoro", "study buddy", "computer science"],
    topics: ["Education", "Roommates"],
    conversationStarters: [
      "What's your go-to study technique?",
      "Want to set up a shared Notion workspace?",
    ],
    openingMessage: "Hi! I'm Maya. I run late-night study pods and love accountability partners. Let's crush some goals together!",
  },
  {
    id: "jordan",
    name: "Jordan",
    title: "Jordan · Gaming Enthusiast & Tactical Player",
    personaTags: ["tactical gamer", "competitive", "ranked player", "discord regular"],
    likes: ["valorant", "tactical", "ranked", "zero tilt"],
    topics: ["Gaming", "Friends"],
    conversationStarters: [
      "What rank are you grinding for?",
      "Want to run some VOD reviews together?",
    ],
    openingMessage: "Hey! Jordan here. I'm all about ranked queues and improving gameplay. Let's queue up and climb together!",
  },
  {
    id: "sam",
    name: "Sam",
    title: "Sam · Cozy Gamer & Chill Vibes",
    personaTags: ["cozy gamer", "story driven", "co-op lover", "slow living"],
    likes: ["cozy", "stardew", "story driven", "co-op"],
    topics: ["Gaming", "Friends", "Roommates"],
    conversationStarters: [
      "What cozy games are you playing right now?",
      "Want to start a farm together in Stardew?",
    ],
    openingMessage: "Hi! I'm Sam. I love cozy games and chill vibes. Perfect for unwinding after a long day. Let's game together!",
  },
  {
    id: "taylor",
    name: "Taylor",
    title: "Taylor · Runner & Fitness Enthusiast",
    personaTags: ["runner", "early riser", "fitness", "accountability partner"],
    likes: ["running", "morning", "trail", "gym"],
    topics: ["Sports", "Friends"],
    conversationStarters: [
      "What's your favorite running route?",
      "Want to join our sunrise run club?",
    ],
    openingMessage: "Hey! I'm Taylor. I'm all about morning runs and staying active. Let's hit the trails together!",
  },
  {
    id: "riley",
    name: "Riley",
    title: "Riley · Creative & Plant Parent",
    personaTags: ["plant parent", "creative", "minimalist", "early riser"],
    likes: ["plants", "quiet", "tea", "minimalist"],
    topics: ["Roommates", "Friends", "Dating"],
    conversationStarters: [
      "How many plants do you have?",
      "Want to swap plant care tips?",
    ],
    openingMessage: "Hi! I'm Riley. I love plants, quiet mornings, and creative spaces. Looking for like-minded roommates!",
  },
  {
    id: "casey",
    name: "Casey",
    title: "Casey · Travel Explorer & Adventure Seeker",
    personaTags: ["traveler", "adventurous", "outgoing", "explorer"],
    likes: ["travel", "adventure", "backpacking", "road trips"],
    topics: ["Travel", "Friends", "Dating"],
    conversationStarters: [
      "What's your dream destination?",
      "Want to plan a weekend road trip?",
    ],
    openingMessage: "Hey! I'm Casey. Always planning the next adventure. Let's explore together!",
  },
];

// Gemini configuration expects a same-origin proxy (window.VIBELINK_GEMINI_PROXY or meta[vibelink-gemini-proxy])
const GEMINI_CONFIG = {
  baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  model: "models/gemini-1.5-flash-latest",
};

const GEMINI_GENERATION = {
  temperature: Number(window?.VIBELINK_GEMINI_TEMPERATURE ?? 0.4),
  maxOutputTokens: Number(window?.VIBELINK_GEMINI_MAX_TOKENS ?? 768),
};

const GEMINI_CACHE_TTL = 1000 * 60 * 5;
const GEMINI_CACHE_MAX = 10;
const geminiCache = new Map();

function resolveGeminiAuth() {
  const metaProxy =
    typeof document !== "undefined"
      ? document.querySelector('meta[name="vibelink-gemini-proxy"]')?.content
      : "";
  const envProxy =
    typeof window !== "undefined" && typeof window.VIBELINK_GEMINI_PROXY === "string"
      ? window.VIBELINK_GEMINI_PROXY
      : "";
  const candidate = (envProxy || metaProxy || "").trim();
  if (candidate) {
    const url = candidate;
    // Allow http:// for localhost development, https:// for production
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      console.warn("VIBELINK_GEMINI_PROXY must start with http:// or https://");
      return null;
    }
    if (/key=|api_key=/i.test(url)) {
      console.error("VIBELINK_GEMINI_PROXY must not contain API keys. Remove key query parameters.");
      return null;
    }
    try {
      const parsed = new URL(url, window?.location?.origin);
      // Allow same origin or localhost for development
      const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
      if (window?.location?.origin && parsed.origin !== window.location.origin && !isLocalhost) {
        console.warn("VIBELINK_GEMINI_PROXY should live on the same origin as the app (localhost allowed for dev).");
        // Don't return null - allow localhost proxy
      }
      return { type: "proxy", url: parsed.href };
    } catch (error) {
      console.error("Invalid VIBELINK_GEMINI_PROXY URL", error);
      return null;
    }
  }
  return null;
}

// Removed duplicate DOMContentLoaded - using the one at line 281 that handles all pages

function highlightNav(page) {
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const target = link.getAttribute("href");
    const isActive =
      (page === "home" && target === "index.html") ||
      (page === "profile" && target?.includes("profile")) ||
      (page === "discover" && target?.includes("discover")) ||
      (page === "network" && target?.includes("network"));
    if (isActive) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* Home */
async function initHomePage() {
  highlightNav("home");
  const profile = await loadProfile();
  const cards = document.querySelectorAll("[data-category-card]");
  cards.forEach((card) => {
    const category = card.dataset.categoryCard;
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = profile.categories.includes(category);
      checkbox.addEventListener("change", () => toggleCategory(category, checkbox.checked));
    }
    card.querySelector("[data-category-link]")?.addEventListener("click", () => ensureCategorySelected(category));
  });
  renderSelectedCategories(profile.categories);
}

/* Profile */
async function initProfilePage() {
  highlightNav("profile");
  
  // Set up authentication UI
  setupAuthUI();
  
  const profile = await loadProfile();
  setInputValue("fullName", profile.fullName);
  setInputValue("displayName", profile.displayName);
  setInputValue("city", profile.city);
  setInputValue("photo", profile.photo);
  setInputValue("bio", profile.bio);
  setInputValue("naturalLanguagePreferences", profile.naturalLanguagePreferences || "");

  setupTagPanels(profile);
  setupAIFeatures();

  const form = document.getElementById("profileForm");
  form?.addEventListener("submit", handleProfileSave);
  document.getElementById("profileResetBtn")?.addEventListener("click", handleProfileReset);
  
  // Add AI text analysis button if AI is enabled
  if (AI_ENABLED) {
    setupAITextAnalysis();
  }
}

async function handleProfileSave(event) {
  event.preventDefault();
  const currentProfile = await loadProfile();
  const profile = {
    ...currentProfile,
    fullName: getValue("fullName"),
    displayName: getValue("displayName"),
    city: getValue("city"),
    photo: getValue("photo"),
    bio: getValue("bio"),
    naturalLanguagePreferences: getValue("naturalLanguagePreferences"),
    aboutTags: Array.from(tagState.about.values()),
    lookingTags: Array.from(tagState.looking.values()),
  };
  
  // Analyze natural language input with AI if provided
  const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
  if (AI_ENABLED && profile.naturalLanguagePreferences && aiService && (aiService.apiKey || aiService.proxyUrl)) {
    setStatusMessage("profileStatus", "Analyzing preferences with AI...");
    try {
      const textAnalysis = await aiService.analyzeTextInput(profile.naturalLanguagePreferences);
      if (textAnalysis && textAnalysis.extracted_tags) {
        // Auto-add extracted tags to looking tags
        textAnalysis.extracted_tags.forEach(tag => {
          if (tag && !tagState.looking.has(normalize(tag))) {
            addTag("looking", tag);
          }
        });
        profile.lookingTags = Array.from(tagState.looking.values());
        profile.aiInsights = textAnalysis;
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      setStatusMessage("profileStatus", "Profile saved (AI analysis skipped) ✨");
    }
  }
  
  await saveProfile(profile);
  setStatusMessage("profileStatus", "Profile saved ✨");
}

function initCategoryPage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("category");
  const category = CATEGORY_COPY[requested] ? requested : "Education";
  const copy = CATEGORY_COPY[category];

  const eyebrow = document.getElementById("categoryEyebrow");
  const title = document.getElementById("categoryTitle");
  const description = document.getElementById("categoryDescription");
  const preferenceLabel = document.getElementById("preferenceLabel");

  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (title) title.textContent = copy.title;
  if (description) description.textContent = copy.description;
  if (preferenceLabel) preferenceLabel.textContent = copy.dropdownLabel;

  hydratePreferenceSelect(category);
  document.getElementById("generateMatchesBtn")?.addEventListener("click", () => renderCategoryMatches(category));
  // Don't auto-generate matches on page load - wait for user to click button
  // Clear status message on init
  setStatusMessage("categoryStatus", "");
}

// Removed duplicate functions - using the correct ones at line 1431

async function toggleCategory(category, isChecked) {
  const profile = await loadProfile();
  const categories = new Set(profile.categories);
  if (isChecked) {
    categories.add(category);
  } else {
    categories.delete(category);
  }
  profile.categories = Array.from(categories);
  await saveProfile(profile); // This will save to Firestore if user is signed in
  renderSelectedCategories(profile.categories);
  console.log(`✅ Category "${category}" ${isChecked ? 'added' : 'removed'}. Categories:`, profile.categories);
}

async function ensureCategorySelected(category) {
  const profile = await loadProfile();
  if (profile.categories.includes(category)) return;
  profile.categories = [...profile.categories, category];
  await saveProfile(profile);
  renderSelectedCategories(profile.categories);
}

function renderSelectedCategories(categories = []) {
  const container = document.getElementById("selectedCategories");
  if (!container) return;
  container.innerHTML = "";
  if (!categories.length) {
    container.innerHTML = `<span class="chip chip--ghost">No categories selected yet</span>`;
    return;
  }
  categories.forEach((category) => {
    const span = document.createElement("span");
    span.className = "chip chip--solid";
    span.textContent = category;
    container.appendChild(span);
  });
}

function setInputValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value || "";
  }
}

async function handleProfileSave(event) {
  event.preventDefault();
  const profile = await loadProfile();
  profile.fullName = getValue("fullName");
  profile.displayName = getValue("displayName");
  profile.city = getValue("city");
  profile.photo = getValue("photo");
  profile.bio = getValue("bio");
  profile.naturalLanguagePreferences = getValue("naturalLanguagePreferences");
  profile.aboutTags = Array.from(tagState.about.values());
  profile.lookingTags = Array.from(tagState.looking.values());
  
  // Analyze natural language input with AI if provided
  const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
  if (AI_ENABLED && profile.naturalLanguagePreferences && aiService && (aiService.apiKey || aiService.proxyUrl)) {
    setStatusMessage("profileStatus", "Analyzing preferences with AI...");
    try {
      const textAnalysis = await aiService.analyzeTextInput(profile.naturalLanguagePreferences);
      if (textAnalysis && textAnalysis.extracted_tags) {
        // Auto-add extracted tags to looking tags
        textAnalysis.extracted_tags.forEach(tag => {
          if (tag && !tagState.looking.has(normalize(tag))) {
            addTag("looking", tag);
          }
        });
        profile.lookingTags = Array.from(tagState.looking.values());
        profile.aiInsights = textAnalysis;
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      setStatusMessage("profileStatus", "Profile saved (AI analysis skipped) ✨");
    }
  }
  
  await saveProfile(profile);
  setStatusMessage("profileStatus", "Profile saved ✨");
}

function handleProfileReset() {
  localStorage.removeItem(STORAGE_KEYS.profile);
  setupTagPanels({});
  document.getElementById("profileForm")?.reset();
  setStatusMessage("profileStatus", "Profile cleared. Start fresh!");
}

function setupTagPanels(profile) {
  tagState.about = new Map();
  tagState.looking = new Map();
  (profile.aboutTags || []).forEach((tag) => tagState.about.set(normalize(tag), tag));
  (profile.lookingTags || []).forEach((tag) => tagState.looking.set(normalize(tag), tag));
  renderSelectedTags("about");
  renderSelectedTags("looking");
  renderTagSuggestions("about");
  renderTagSuggestions("looking");
  bindTagControls();
}

function bindTagControls() {
  document.querySelectorAll("[data-add-tag]").forEach((button) => {
    button.addEventListener("click", async () => {
      const type = button.dataset.addTag;
      const input = document.querySelector(`[data-tag-input="${type}"]`);
      if (input?.value.trim()) {
        await addTag(type, input.value.trim());
        input.value = "";
      }
    });
  });

  document.querySelectorAll("[data-tag-input]").forEach((input) => {
    input.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (input.value.trim()) {
          await addTag(input.dataset.tagInput, input.value.trim());
          input.value = "";
        }
      }
    });
  });
}

// TAG_SUGGESTIONS moved to top of file to avoid duplication

function renderTagSuggestions(type) {
  const container = document.querySelector(`[data-tag-suggestions="${type}"]`);
  if (!container) {
    console.warn(`Tag suggestions container not found for type: ${type}`);
    return;
  }
  container.innerHTML = "";
  
  if (!TAG_SUGGESTIONS[type] || !Array.isArray(TAG_SUGGESTIONS[type])) {
    console.warn(`No tag suggestions found for type: ${type}`);
    return;
  }
  
  TAG_SUGGESTIONS[type].forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tag-suggestion";
    button.textContent = tag;
    button.addEventListener("click", () => toggleTag(type, tag, button));
    container.appendChild(button);
  });
  syncSuggestionStates(type);
}

function toggleTag(type, label, button) {
  const key = normalize(label);
  if (tagState[type].has(key)) {
    tagState[type].delete(key);
    button?.classList.remove("active");
  } else {
    tagState[type].set(key, prettify(label));
    button?.classList.add("active");
  }
  renderSelectedTags(type);
  syncSuggestionStates(type);
}

async function addTag(type, label) {
  const key = normalize(label);
  if (!key || tagState[type].has(key)) return;
  
  tagState[type].set(key, prettify(label));
  renderSelectedTags(type);
  syncSuggestionStates(type);
  
  // If AI is enabled and this is a custom tag (not in suggestions), analyze it
  if (AI_ENABLED && type === "looking") {
    const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
    if (aiService && (aiService.apiKey || aiService.proxyUrl)) {
      const suggestions = TAG_SUGGESTIONS[type] || [];
      const isCustomTag = !suggestions.some(s => normalize(s) === key);
      
      if (isCustomTag) {
        try {
          // Analyze the custom tag to extract semantic meaning
          const analysis = await aiService.analyzeTextInput(label);
          if (analysis && analysis.extracted_tags) {
            console.log(`AI analyzed custom tag "${label}":`, analysis.extracted_tags);
            // Store AI insights for this tag
            const profile = await loadProfile();
            if (!profile.tagInsights) profile.tagInsights = {};
            if (!profile.tagInsights[type]) profile.tagInsights[type] = {};
            profile.tagInsights[type][key] = analysis;
            await saveProfile(profile);
          }
        } catch (error) {
          console.warn("AI analysis for custom tag failed:", error);
          // Continue without AI analysis
        }
      }
    }
  }
}

function renderSelectedTags(type) {
  const container = document.querySelector(`[data-selected-tags="${type}"]`);
  if (!container) return;
  container.innerHTML = "";
  if (!tagState[type].size) {
    container.innerHTML = `<p class="tag-panel__hint">No tags selected yet.</p>`;
    return;
  }
  tagState[type].forEach((label, key) => {
    const pill = document.createElement("span");
    pill.className = "tag-chip";
    pill.innerHTML = `${label} <button type="button" aria-label="Remove ${label}">×</button>`;
    pill.querySelector("button")?.addEventListener("click", () => {
      tagState[type].delete(key);
      renderSelectedTags(type);
      syncSuggestionStates(type);
    });
    container.appendChild(pill);
  });
}

function syncSuggestionStates(type) {
  const container = document.querySelector(`[data-tag-suggestions="${type}"]`);
  if (!container) return;
  container.querySelectorAll("button").forEach((btn) => {
    const key = normalize(btn.textContent);
    btn.classList.toggle("active", tagState[type].has(key));
  });
}

/* Discover */
function initDiscoverPage() {
  highlightNav("discover");
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic") && DISCOVER_COPY[params.get("topic")] ? params.get("topic") : "Sports";
  renderDiscoverHero(topic);
  renderDiscoverForm(topic);
  document.getElementById("discoverForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await renderDiscoverMatches(topic);
  });
  document.getElementById("discoverReset")?.addEventListener("click", () => {
    document.getElementById("discoverForm")?.reset();
    setStatusMessage("discoverStatus", "Preferences cleared.");
    // Clear the matches container when resetting
    const container = document.getElementById("discoverMatches");
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No matches yet</h3>
          <p>Fill the form above and press "Generate matches".</p>
        </div>
      `;
    }
  });
  // Don't auto-generate matches on page load - wait for user to click button
}

function renderDiscoverHero(topic) {
  const copy = DISCOVER_COPY[topic];
  document.getElementById("discoverTopic").textContent = topic;
  document.getElementById("discoverTitle").textContent = `${topic} discover page`;
  document.getElementById("discoverSummary").textContent = copy.summary;
  const highlightContainer = document.getElementById("topicHighlights");
  highlightContainer.innerHTML = "";
  copy.highlights.forEach((item) => {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = item;
    highlightContainer.appendChild(pill);
  });
  document.getElementById("discoverFormHeading").textContent = `Dial in your ${topic.toLowerCase()} preferences.`;
}

function renderDiscoverForm(topic) {
  const container = document.getElementById("discoverFields");
  container.innerHTML = "";
  DISCOVER_COPY[topic].form.forEach((field) => {
    const wrapper = document.createElement("label");
    wrapper.htmlFor = field.id;
    wrapper.textContent = field.label;
    const control = field.type === "select" ? document.createElement("select") : document.createElement("input");
    control.id = field.id;
    control.name = field.id;
    if (field.type === "select") {
      field.options.forEach((option) => {
        const el = document.createElement("option");
        el.value = option.toLowerCase();
        el.textContent = option;
        control.appendChild(el);
      });
    } else {
      control.type = "text";
      control.placeholder = field.placeholder || "";
    }
    wrapper.appendChild(control);
    container.appendChild(wrapper);
  });
}

async function renderDiscoverMatches(topic) {
  const container = document.getElementById("discoverMatches");
  if (!container) return;
  setStatusMessage("discoverStatus", "Generating fresh matches…");
  container.innerHTML = `
    <div class="empty-state">
      <h3>Generating suggestions…</h3>
      <p>We're searching for real users and AI matches for you.</p>
    </div>
  `;
  const profile = await loadProfile();
  const formData = new FormData(document.getElementById("discoverForm"));
  const preferenceTokens = Array.from(formData.values())
    .map((value) => value.toString().trim().toLowerCase())
    .filter(Boolean);

  container.innerHTML = "";
  
  // Step 1: Try to find real users first (if Firebase is enabled and user is logged in)
  let realUserMatches = [];
  if (FIREBASE_ENABLED && currentUser) {
    setStatusMessage("discoverStatus", "Searching for real users with similar interests…");
    console.log("🔍 Starting real user search...");
    console.log("  - Firebase enabled:", FIREBASE_ENABLED);
    console.log("  - Current user:", currentUser?.uid);
    console.log("  - Topic:", topic);
    console.log("  - User profile categories:", profile.categories);
    realUserMatches = await findRealUserMatches(topic, profile, preferenceTokens);
    console.log(`👥 Found ${realUserMatches.length} real user matches`);
    if (realUserMatches.length === 0) {
      console.log("⚠️ No real users found. Possible reasons:");
      console.log("  1. No other users have selected this category:", topic);
      console.log("  2. Other users haven't saved their profiles to Firestore");
      console.log("  3. Firestore query failed (check for errors above)");
    }
  } else {
    console.log("⚠️ Real user matching disabled");
    console.log("  - Firebase enabled:", FIREBASE_ENABLED);
    console.log("  - Current user:", currentUser ? "signed in" : "NOT signed in");
    if (!FIREBASE_ENABLED) console.log("  → Firebase not initialized");
    if (!currentUser) console.log("  → User not signed in - sign in to match with real users");
  }

  // Step 2: Get AI-generated matches (only if not rate limited)
  let aiMatches = [];
  try {
    setStatusMessage("discoverStatus", "Generating AI matches…");
    aiMatches = await fetchGeminiMatches(topic, profile, preferenceTokens);
    console.log(`🤖 Found ${aiMatches.length} AI-generated matches`);
  } catch (error) {
    console.warn("⚠️ AI matching failed (rate limited or unavailable):", error.message);
    // Continue without AI matches
    aiMatches = [];
  }

  // Step 3: Get static library matches (only if no real users found)
  let libraryMatches = [];
  if (realUserMatches.length === 0) {
    libraryMatches = MATCH_LIBRARY.filter((match) => match.topic === topic).map((match) => {
      const score = calculateScore(match, profile, preferenceTokens);
      return { ...match, score, isHardCoded: true }; // Mark as hard-coded
    });
    console.log(`📚 Found ${libraryMatches.length} library matches (hard-coded)`);
  } else {
    console.log("✅ Real users found - skipping hard-coded library matches");
  }

  // Combine matches: REAL USERS FIRST (always prioritize), then AI, then library only if no real users
  const combinedMatches = [...realUserMatches, ...aiMatches, ...libraryMatches];

  // If no good real user matches (65%+ threshold), show AI bots as fallback
  if (realUserMatches.length === 0 && combinedMatches.length === 0) {
    // Fallback to AI bots if no compatible real users found
    const botMatches = generateBotMatches(topic, profile, preferenceTokens);
    if (botMatches.length) {
      botMatches.forEach((match) => container.appendChild(buildMatchCard(match)));
      setStatusMessage(
        "discoverStatus",
        "No compatible users found (need 65%+ similarity). Here are AI buddy groups to get started!"
      );
    } else {
      container.appendChild(buildEmptyState("No matches yet", "Try different preferences or update your profile tags."));
      setStatusMessage("discoverStatus", "No matches found. Update your profile to find better matches.");
    }
    return;
  }
  
  // If we have real users but they're low quality (<70%), also show bots as options
  if (realUserMatches.length > 0 && realUserMatches.every(m => m.score < 70)) {
    const botMatches = generateBotMatches(topic, profile, preferenceTokens);
    combinedMatches.push(...botMatches);
    setStatusMessage("discoverStatus", `Found ${realUserMatches.length} user${realUserMatches.length > 1 ? 's' : ''} with some compatibility. AI bots also available.`);
  }

  // Sort by score and render
  combinedMatches
    .sort((a, b) => b.score - a.score)
    .forEach((match) => container.appendChild(buildMatchCard(match)));

  const matchCount = combinedMatches.length;
  const realUserCount = realUserMatches.length;
  const hardCodedCount = combinedMatches.filter(m => m.isHardCoded).length;
  
  let statusMsg = `Showing ${matchCount} match${matchCount > 1 ? "es" : ""}`;
  if (realUserCount > 0) {
    statusMsg += ` (${realUserCount} real user${realUserCount > 1 ? "s" : ""})`;
  } else if (hardCodedCount > 0) {
    statusMsg += ` (${hardCodedCount} sample match${hardCodedCount > 1 ? "es" : ""} - no real users found yet)`;
  }
  setStatusMessage("discoverStatus", statusMsg);
}

async function renderCategoryMatches(category) {
  const container = document.getElementById("categoryMatches");
  const select = document.getElementById("preferenceSelect");
  if (!container || !select) return;
  const preference = select.value || "all";
  
  // Show loading state immediately when user clicks button
  setStatusMessage("categoryStatus", "Generating matches...");
  container.innerHTML = '<div class="loading-state">Analyzing compatibility...</div>';
  
  const profile = await loadProfile();
  const matches = MATCH_TEMPLATES.filter((match) => match.category === category).filter((match) => {
    if (preference === "all") return true;
    return match.keywords.includes(preference);
  });

  container.innerHTML = "";
  if (!matches.length) {
    container.appendChild(buildEmptyState(preference));
    setStatusMessage("categoryStatus", "No invites yet. Try a different dropdown option.");
    return;
  }

  // Show loading state if using AI
  const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
  if (AI_ENABLED && aiService && (aiService.apiKey || aiService.proxyUrl)) {
    setStatusMessage("categoryStatus", "Analyzing matches with AI...");
    container.innerHTML = '<div class="loading-state">Analyzing compatibility with AI...</div>';
  }

  // Calculate scores (with AI enhancement if available)
  const matchResults = [];
  for (const match of matches) {
    let score = calculateScore(match, profile, preference);
    let aiInsights = null;
    let explanation = null;

    // Enhance with AI if available
    if (AI_ENABLED && aiService && (aiService.apiKey || aiService.proxyUrl)) {
      try {
        aiInsights = await aiService.generateMatchScore(profile, match, category, preference);
        if (aiInsights && aiInsights.compatibility_score) {
          // Blend AI score with traditional score (70% AI, 30% traditional)
          score = Math.round(score * 0.3 + aiInsights.compatibility_score * 0.7);
          score = Math.min(99, Math.max(0, score));
        }
        if (aiInsights) {
          explanation = await aiService.generateMatchExplanation(profile, match, score, aiInsights);
        }
      } catch (error) {
        console.error("AI matching error:", error);
        // Fall back to traditional scoring
      }
    }

    matchResults.push({ match, score, aiInsights, explanation });
  }

  // Sort by score (highest first)
  matchResults.sort((a, b) => b.score - a.score);

  // Render matches
  container.innerHTML = "";
  matchResults.forEach(({ match, score, aiInsights, explanation }) => {
    container.appendChild(buildMatchCard(match, score, aiInsights, explanation));
  });

  setStatusMessage("categoryStatus", `Showing ${matches.length} match${matches.length > 1 ? "es" : ""} (AI-enhanced).`);
}

function buildEmptyState(preference) {
  const div = document.createElement("div");
  div.className = "empty-state";
  const label = preference === "all" ? "a category" : preference;
  div.innerHTML = `
    <h3>No matches yet</h3>
    <p>Try switching the dropdown or add more tags on the profile page for stronger signals (${label}).</p>
  `;
  return div;
}

function buildMatchCard(match, score = null, aiInsights = null, explanation = null) {
  const article = document.createElement("article");
  article.className = "match-card";
  
  // Build AI insights section if available
  let aiSection = "";
  if (aiInsights) {
    const reasons = aiInsights.match_reasons || [];
    const concerns = aiInsights.potential_concerns || [];
    const starters = aiInsights.conversation_starters || [];
    
    aiSection = `
      <div class="ai-insights">
        ${explanation ? `<p class="ai-explanation">${explanation}</p>` : ""}
        ${reasons.length > 0 ? `
          <div class="ai-reasons">
            <strong>Why this match:</strong>
            <ul>
              ${reasons.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
        ${starters.length > 0 ? `
          <div class="ai-starters">
            <strong>Conversation starters:</strong>
            <ul>
              ${starters.map(s => `<li>${s}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
        ${concerns.length > 0 ? `
          <div class="ai-concerns">
            <strong>Consider:</strong>
            <ul>
              ${concerns.map(c => `<li>${c}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
      </div>
    `;
  }
  
  // Add indicator for real users vs hard-coded matches
  const matchTypeBadge = match.isRealUser 
    ? '<span class="match-badge real-user">👤 Real User (AI-Matched)</span>'
    : match.isHardCoded 
    ? '<span class="match-badge hard-coded">📚 Sample Match</span>'
    : '';
  
  // Add AI insights if available (for real user matches enhanced by AI)
  const aiInsightsSection = match.aiInsights ? `
    <div class="ai-insights" style="margin-top: 1rem; padding: 1rem; background: var(--surface-alt); border-radius: 8px;">
      <p style="font-weight: 600; margin-bottom: 0.5rem; color: var(--accent);">🤖 AI-Powered Match Analysis:</p>
      ${match.aiExplanation ? `<p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${match.aiExplanation}</p>` : ''}
      ${match.aiInsights.match_reasons ? `
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: var(--text); font-size: 0.9rem;">
          ${match.aiInsights.match_reasons.slice(0, 3).map(reason => `<li>${reason}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  ` : '';
  
  article.innerHTML = `
    <header>
      <div>
        <p class="eyebrow">${match.topic} ${matchTypeBadge}</p>
        <h3>${match.title}</h3>
      </div>
      <div class="compat-score">${match.score}%</div>
    </header>
    <div class="compat-meter"><span style="width:${match.score}%"></span></div>
    <p>${match.summary}</p>
    <ul>${match.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
    <div class="member-stack">
      ${match.members.map((member) => `<span class="member">${member}</span>`).join("")}
    </div>
    ${aiInsightsSection}
    ${aiSection}
    <button class="btn btn-primary" data-save-match="${match.id}">Save invite</button>
  `;

  article.querySelector("[data-save-match]")?.addEventListener("click", async () => {
    const saved = await saveMatch(match);
  const button = article.querySelector("[data-save-match]");
    if (saved) {
      button.textContent = "Saved to Network";
    button.classList.add("accepted");
      button.disabled = true;
      
      // Note: Real user matching would require a backend service
      // For now, all matches are saved locally
      
      setStatusMessage("discoverStatus", `${match.title} added to Network.`);
    } else {
      button.textContent = "Already saved";
      button.disabled = true;
    }
  });

  return article;
}

async function fetchGeminiMatches(topic, profile, preferenceTokens) {
  // Try using AI_SERVICE first (from ai-service.js)
  const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
  if (aiService && (aiService.apiKey || aiService.proxyUrl)) {
    try {
      // Use the AI service to generate matches
      // Note: This may fail due to rate limiting - that's OK, we'll continue without AI matches
      const prompt = composeGeminiPrompt(topic, profile, preferenceTokens);
      const response = await aiService.callAPI([{
        role: "user",
        content: prompt
      }], { max_tokens: 1000 });
      
      // Parse the response and build matches
      const parsed = extractJsonArray(response);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map((item, index) => buildMatchFromGemini(item, topic, index)).filter(Boolean);
      }
    } catch (error) {
      // Rate limiting or other errors - gracefully fail
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        console.warn("⚠️ Gemini API rate limited - skipping AI matches for now");
      } else {
        console.warn("⚠️ AI_SERVICE Gemini request failed:", error.message);
      }
      return []; // Return empty array instead of falling through
    }
  }
  
  // Fallback to proxy system if AI_SERVICE not available
  const auth = resolveGeminiAuth();
  if (!auth) {
    console.warn("Gemini API not configured; skipping Gemini matches.");
    return [];
  }
  try {
    const prompt = composeGeminiPrompt(topic, profile, preferenceTokens);
    const cacheKey = `${topic}:${prompt}`;
    if (geminiCache.has(cacheKey)) {
      const entry = geminiCache.get(cacheKey);
      if (Date.now() - entry.timestamp < GEMINI_CACHE_TTL) {
        return entry.matches.map((match) => ({ ...match }));
      }
      geminiCache.delete(cacheKey);
    }
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: GEMINI_GENERATION.temperature,
        maxOutputTokens: GEMINI_GENERATION.maxOutputTokens,
      },
    };
    const requestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    let response;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        response = await fetch(auth.url, requestInit);
        break;
      } catch (networkError) {
        if (attempt === 1) throw networkError;
        await wait(300 * (attempt + 1));
      }
    }
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        console.warn("⚠️ Gemini API rate limited (429) - skipping AI matches");
      } else {
        console.warn("⚠️ Gemini API error:", response.status, errorText);
      }
      return [];
    }
    const data = await response.json();
    const text =
      data?.candidates
        ?.flatMap((candidate) => candidate.content?.parts || [])
        .map((part) => part.text || "")
        .join("\n") || "";
    const parsed = extractJsonArray(text);
    if (!Array.isArray(parsed) || !parsed.length) return [];
    const built = parsed.map((item, index) => buildMatchFromGemini(item, topic, index)).filter(Boolean);
    geminiCache.set(cacheKey, { timestamp: Date.now(), matches: built });
    if (geminiCache.size > GEMINI_CACHE_MAX) {
      const oldestKey = [...geminiCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0]?.[0];
      if (oldestKey) geminiCache.delete(oldestKey);
    }
    return built;
  } catch (error) {
    console.warn("Gemini request failed", error);
    return [];
  }
}

function composeGeminiPrompt(topic, profile, preferenceTokens) {
  const profileSummary = {
    name: sanitizeForPrompt(profile.displayName || profile.fullName || "Guest"),
    city: sanitizeForPrompt(profile.city || "N/A"),
    bio: sanitizeForPrompt(profile.bio || ""),
    aboutTags: (profile.aboutTags || []).slice(0, 6).map((tag) => sanitizeForPrompt(tag, 48)),
    lookingTags: (profile.lookingTags || []).slice(0, 6).map((tag) => sanitizeForPrompt(tag, 48)),
  };
  const preferences =
    preferenceTokens
      .map((token) => sanitizeForPrompt(token, 60))
      .filter(Boolean)
      .join(", ") || "none provided";
  return `
You are VibeLink's AI matchmaker. Create 1-2 micro-community suggestions for the "${topic}" topic.
Base your ideas on this profile JSON: ${JSON.stringify(profileSummary)} and these extra preferences: ${preferences}.
Return ONLY a JSON array with objects shaped exactly like this:
[
  {
    "title": "Short catchy headline",
    "summary": "One sentence why this group fits.",
    "tags": ["keyword1","keyword2"],
    "details": ["detail bullet 1","detail bullet 2"],
    "members": ["Name · short role", "Name · short role"],
    "conversationStarters": ["prompt 1","prompt 2"],
    "messages": [
      {"author":"Name","text":"Short intro"},
      {"author":"Another","text":"Supportive reply"}
    ],
    "score": 88
  }
]
Ensure the JSON is valid.`;
}

function sanitizeForPrompt(value, maxLength = 160) {
  if (!value && value !== 0) return "";
  const cleaned = value
    .toString()
    .replace(/[\r\n]+/g, " ")
    .replace(/[{}[\]<>`]/g, "")
    .replace(/[^a-z0-9.,!?@#%&()\-\/\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, maxLength);
}

function extractJsonArray(text) {
  if (!text) return null;
  const trimmed = text.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore and try to extract
  }
  const match = trimmed.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (error) {
    console.warn("Failed to parse Gemini JSON payload", error);
    return null;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a fallback chat response when AI is unavailable
 * Uses intelligent context-aware responses based on conversation history and match context
 */
function generateFallbackChatResponse(match, userMessage, conversationHistory, respondingMemberName = null) {
  const message = userMessage.toLowerCase().trim();
  const topic = match.topic || "";
  const tags = match.tags || [];
  
  // Extract member name and role from responding member (or first member)
  const memberToUse = respondingMemberName || match.members[0] || "Group Member";
  const memberParts = memberToUse.split("·");
  const memberName = memberParts[0].trim();
  const memberRole = memberParts.length > 1 ? memberParts[1].trim() : "";
  
  // Find matching AI bot for better persona-based responses
  const matchingBot = AI_BOTS.find(bot => {
    const botNameMatch = bot.name.toLowerCase() === memberName.toLowerCase();
    const topicMatch = bot.topics.includes(topic);
    return botNameMatch || topicMatch;
  });
  
  // Analyze the user's message more intelligently
  const isQuestion = message.includes("?") || 
    /^(what|who|when|where|why|how|which|is|are|can|could|would|do|does|did)\s/i.test(message);
  const isGreeting = /^(hi|hey|hello|sup|yo|greetings)/i.test(message);
  const isNameQuestion = /(what.*name|who.*are.*you|your.*name)/i.test(message);
  const isPersonalQuestion = /(your|you|yourself)/i.test(message);
  
  // Get context from recent conversation
  const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
  const conversationTopic = extractTopicFromHistory(conversationHistory);
  
  // Handle name questions intelligently
  if (isNameQuestion) {
    if (memberRole) {
      return `I'm ${memberName}, the ${memberRole} for this group. Nice to meet you!`;
    }
    return `I'm ${memberName}! Great to connect with you.`;
  }
  
  // Handle favorite game questions (common for gaming groups)
  if (message.includes("favorite") && (message.includes("game") || message.includes("games"))) {
    if (matchingBot) {
      if (matchingBot.personaTags.some(t => t.includes("cozy"))) {
        return "I'm really into cozy games like Stardew Valley and Animal Crossing! They're perfect for unwinding. What about you?";
      }
      if (matchingBot.personaTags.some(t => t.includes("tactical") || t.includes("competitive"))) {
        return "I'm all about tactical games like Valorant and CS:GO. Love the competitive aspect! What do you play?";
      }
    }
    if (topic === "Gaming") {
      const gameTag = tags.find(t => t.includes("game") || t.includes("gaming"));
      const gameType = gameTag || "a few different games";
      return `I love gaming! Right now I'm really into ${gameType}. What's your favorite?`;
    }
  }
  
  // Handle greetings with context
  if (isGreeting) {
    if (conversationHistory.length === 0) {
      return `Hey! I'm ${memberName}${memberRole ? `, the ${memberRole}` : ""}. Excited to be part of this ${topic.toLowerCase()} group!`;
    }
    return `Hey there! Welcome to the group. I'm ${memberName}.`;
  }
  
  // Handle questions with topic-specific intelligent responses
  if (isQuestion) {
    // Education topic
    if (topic === "Education" || tags.some(t => t.includes("study") || t.includes("learn") || t.includes("accountability"))) {
      if (message.includes("when") || message.includes("time") || message.includes("schedule")) {
        return "I usually study late nights, around 10pm-1am. What works for you? We could sync up!";
      }
      if (message.includes("how") || message.includes("technique") || message.includes("method")) {
        return "I've been using the Pomodoro technique—25 min focused sessions with 5 min breaks. It's been really effective!";
      }
      if (message.includes("what") && (message.includes("task") || message.includes("work") || message.includes("focus"))) {
        const workItem = memberRole || "current project";
        return `I'm working on my ${workItem} tonight. What are you tackling?`;
      }
      return "That's a great question! I'd love to discuss it more. Want to set up a study session to dive deeper?";
    }
    
    // Sports topic
    if (topic === "Sports" || tags.some(t => t.includes("run") || t.includes("game") || t.includes("sport") || t.includes("fitness"))) {
      if (message.includes("when") || message.includes("time") || message.includes("schedule")) {
        return "I'm usually free in the mornings for runs, or evenings for games. What works for everyone?";
      }
      if (message.includes("where") || message.includes("location") || message.includes("place")) {
        return "I know a great spot! Want me to share the location? We could meet there.";
      }
      if (message.includes("race") || message.includes("event")) {
        return "I've been eyeing a few races coming up. Are you training for something specific?";
      }
      if (message.includes("stretch") || message.includes("warm") || message.includes("cool")) {
        return "I have some great stretches! Dynamic warm-ups before, static stretches after. Want me to share my routine?";
      }
      return "I'm definitely interested! Let's coordinate the details and make it happen.";
    }
    
    // Travel topic
    if (topic === "Travel" || tags.some(t => t.includes("travel") || t.includes("trip") || t.includes("adventure"))) {
      if (message.includes("when") || message.includes("time")) {
        return "I'm flexible on timing! What dates are you thinking? I'd love to join if it works out.";
      }
      if (message.includes("where") || message.includes("location") || message.includes("place")) {
        return "I've been wanting to explore that area! I know some great spots there. Want recommendations?";
      }
      return "That sounds amazing! I'm definitely interested. Let's plan it out!";
    }
    
    // Gaming topic
    if (topic === "Gaming" || tags.some(t => t.includes("game") || t.includes("gaming") || t.includes("queue"))) {
      if (message.includes("when") || message.includes("time")) {
        return "I'm usually online in the evenings, around 7-11pm. Want to queue up then?";
      }
      if (message.includes("rank") || message.includes("elo") || message.includes("level")) {
        return "I've been grinding ranked lately. What rank are you at? We could team up!";
      }
      return "I'm down! That sounds fun. Let's coordinate and get a game going.";
    }
    
    // Generic question response
    return "That's a great question! I'd love to help with that. Want to discuss it more?";
  }
  
  // Handle statements/agreements with context
  if (message.includes("yes") || message.includes("yeah") || message.includes("sure") || message.includes("cool") || message.includes("awesome") || message.includes("nice")) {
    return "Awesome! I'm excited about this too. Let's make it happen!";
  }
  
  // Use conversation context if available
  if (lastMessage && conversationTopic) {
    if (topic === "Sports") {
      return "That sounds great! I'm definitely interested. Let's coordinate the details.";
    }
    if (topic === "Education") {
      return "I'm on board with that! Want to set up a time to work on it together?";
    }
  }
  
  // Topic-specific default responses
  if (topic === "Education") {
    return "That's a great idea! I'm always looking for study accountability partners. Want to sync up?";
  } else if (topic === "Sports") {
    return "I'm down! What day works best for everyone? Let's make it happen.";
  } else if (topic === "Travel") {
    return "I'd love to join! When are you thinking? This sounds like it could be really fun.";
  } else if (topic === "Gaming") {
    return "I'm usually online in the evenings. Want to queue up?";
  }
  
  // Generic friendly response
  return "Thanks for sharing! I'm looking forward to connecting with everyone in this group.";
}

/**
 * Extract topic/theme from conversation history
 */
function extractTopicFromHistory(history) {
  if (!history || history.length === 0) return null;
  const recentText = history.slice(-3).map(m => m.text).join(" ").toLowerCase();
  if (recentText.includes("study") || recentText.includes("learn")) return "study";
  if (recentText.includes("run") || recentText.includes("game") || recentText.includes("sport")) return "activity";
  if (recentText.includes("travel") || recentText.includes("trip")) return "travel";
  return null;
}

function buildMatchFromGemini(item, topic, index) {
  if (!item || typeof item !== "object") {
    console.warn("Gemini match ignored due to unexpected payload:", item);
    return null;
  }
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const details = Array.isArray(item.details) && item.details.length ? item.details : ["AI generated suggestion"];
  const members = Array.isArray(item.members) && item.members.length ? item.members : ["VibeLink AI · concierge"];
  const starters = Array.isArray(item.conversationStarters) && item.conversationStarters.length
    ? item.conversationStarters
    : ["Share what you're seeking from this group."];
  const messages =
    Array.isArray(item.messages) && item.messages.length
      ? item.messages
      : [{ author: "VibeLink AI", text: "Kicking off this room—drop a quick intro!" }];
  return {
    id: `gemini-${topic.toLowerCase()}-${index}-${Date.now()}`,
    topic,
    title: item.title || `AI-crafted ${topic} pod`,
    summary: item.summary || "VibeLink AI believes this mix will fit your preferences.",
    tags,
    details,
    members,
    conversationStarters: starters,
    messages,
    score: item.score ? Math.min(99, Math.max(60, Number(item.score) || 80)) : 82,
  };
}

function generateBotMatches(topic, profile, preferenceTokens) {
  const eligibleBots = AI_BOTS.filter((bot) => bot.topics.includes(topic));
  const botsToUse = eligibleBots.length ? eligibleBots : AI_BOTS;
  const profileTags = [...(profile.aboutTags || []), ...(profile.lookingTags || [])].map(normalize);
  return botsToUse.map((bot) => buildBotMatch(bot, topic, profileTags, preferenceTokens));
}

function buildBotMatch(bot, topic, profileTags, preferenceTokens) {
  const likeHits =
    bot.likes[0] === "any vibe"
      ? []
      : bot.likes.filter((like) => profileTags.some((tag) => tag.includes(normalize(like))));
  const preferenceHit = preferenceTokens.some((token) =>
    bot.personaTags.some((trait) => token.includes(normalize(trait)))
  );
  const score = Math.min(98, 78 + likeHits.length * 4 + (preferenceHit ? 6 : 0));
  const title = `AI Buddy: ${bot.name}`;
  const summary = likeHits.length
    ? `AI paired you with ${bot.name} because you both vibe on ${likeHits
        .map((tag) => prettify(tag))
        .join(", ")}.`
    : `AI matched you with ${bot.name} to kickstart this ${topic.toLowerCase()} pod.`;
  const details = [
    `${bot.name} brings ${bot.personaTags.slice(0, 2).map(prettify).join(" & ")} energy.`,
    "VibeLink adds supportive AI members if the room needs more people.",
    preferenceHit ? "Your preferences align with their current plan." : "Perfect starter pod while invitations go out.",
  ];
  const members = [
    `${bot.name} · ${bot.title.split("·")[1].trim()}`,
    "VibeLink AI · auto-curator",
  ];
  return {
    id: `bot-${bot.id}-${topic.toLowerCase()}`,
    topic,
    title,
    summary,
    tags: bot.personaTags,
    details,
    members,
    conversationStarters: bot.conversationStarters,
    messages: [
      { author: bot.name, role: "member", text: bot.openingMessage },
      {
        author: "VibeLink AI",
        role: "ai",
        text: "Jump in whenever you’re ready. I’ll bring in more humans as soon as they accept!",
      },
    ],
    score,
  };
}

/* Network / chats */
function initNetworkPage() {
  highlightNav("network");
  renderNetworkList();
  renderNetworkStats();
}

function renderNetworkStats() {
  const stats = document.getElementById("networkStats");
  if (!stats) return;
  const matches = loadSavedMatches();
  stats.innerHTML = "";
  const pill = document.createElement("span");
  pill.className = "pill";
  pill.textContent = `${matches.length} saved invite${matches.length === 1 ? "" : "s"}`;
  stats.appendChild(pill);
}

let currentChatId = null;

async function renderNetworkList() {
  const list = document.getElementById("networkList");
  const windowPane = document.getElementById("networkWindow");
  if (!list || !windowPane) return;
  const matches = await loadSavedMatches();
  list.innerHTML = "";
  if (!matches.length) {
    list.appendChild(buildEmptyState("No saved chats yet", "Save a match on Discover to unlock chats."));
    windowPane.innerHTML = `
      <div class="chat-placeholder">
        <h3>Select a chat</h3>
        <p>Once you save a match, it will appear here with a live thread.</p>
      </div>`;
    return;
  }
  matches.forEach((match) => {
    const button = document.createElement("button");
    button.className = `chat-pill ${currentChatId === match.id ? "active" : ""}`;
    button.innerHTML = `<strong>${match.title}</strong><span class="muted">${match.topic} · ${match.members.length} people</span>`;
    button.addEventListener("click", () => {
      currentChatId = match.id;
      renderNetworkWindow(match);
      renderNetworkList();
    });
    list.appendChild(button);
  });
  if (!currentChatId) {
    currentChatId = matches[0].id;
    renderNetworkWindow(matches[0]);
  } else {
    const active = matches.find((m) => m.id === currentChatId);
    if (active) renderNetworkWindow(active);
  }
}

function renderNetworkWindow(match) {
  const windowPane = document.getElementById("networkWindow");
  if (!windowPane) return;
  
  // Clean up previous listener if exists
  if (window.currentMatchListener) {
    window.currentMatchListener();
    window.currentMatchListener = null;
  }
  
  windowPane.innerHTML = `
    <div class="chat-header">
      <div>
        <h3>${match.title}</h3>
        <p class="muted">${match.topic} · ${match.summary}</p>
      </div>
      <div class="chat-tags">
        ${match.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
    </div>
    <div class="chat-members">
      ${match.members.map((member) => `<span class="member">${member}</span>`).join("")}
    </div>
    <div class="conversation-starters">
      ${match.conversationStarters.map((starter) => `<button type="button" data-convo="${starter}">${starter}</button>`).join("")}
    </div>
    <div class="messages" id="messageThread">
      ${match.messages.map((msg) => buildMessageBubble(msg)).join("")}
    </div>
    <div id="typingIndicator" style="display: none;" class="message typing">
      <strong id="typingAuthor">Someone</strong>
      <p class="typing-dots"><span>.</span><span>.</span><span>.</span></p>
    </div>
    <form class="chat-input" id="networkChatForm">
      <input type="text" id="networkMessageInput" placeholder="Share an update..." autocomplete="off" />
      <button class="btn btn-primary" type="submit">Send</button>
    </form>
  `;

  windowPane.querySelectorAll("[data-convo]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById("networkMessageInput");
      input.value = button.dataset.convo;
      input.focus();
    });
  });

  document.getElementById("networkChatForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("networkMessageInput");
    if (!input?.value.trim()) return;
    
    const userMessage = input.value.trim();
    const profile = await loadProfile();
    
    // Clear input immediately
    input.value = "";
    input.disabled = true; // Disable input while waiting for AI response
    
    // Add user message to match and save immediately
    const userMessageObj = {
      author: profile.displayName || "You",
      authorId: currentUser?.uid || null,
      role: "me",
      text: userMessage,
    };
    await appendMessage(match.id, userMessageObj);
    
    // Show user message immediately by appending to DOM
    const messageThread = document.getElementById("messageThread");
    if (messageThread) {
      const userBubble = buildMessageBubble({
        author: profile.displayName || "You",
        role: "me",
        text: userMessage,
      });
      messageThread.insertAdjacentHTML("beforeend", userBubble);
      // Scroll to bottom with a slight delay to ensure DOM is updated
      setTimeout(() => {
        messageThread.scrollTop = messageThread.scrollHeight;
      }, 100);
    }
    
    // Re-enable input
    input.disabled = false;
    input.focus();
    
    // Show typing indicator BELOW the user message
    const typingIndicator = document.getElementById("typingIndicator");
    const typingAuthor = document.getElementById("typingAuthor");
    const respondingMember = match.members[0] || "Group Member";
    if (typingIndicator && typingAuthor) {
      typingAuthor.textContent = respondingMember.split("·")[0].trim();
      typingIndicator.style.display = "block";
      // Scroll to show typing indicator
      const messagesContainer = document.querySelector(".messages-container");
      if (messagesContainer) {
        setTimeout(() => {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
      }
    }
    
    // Generate AI response if AI is enabled
    const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
    if (AI_ENABLED && aiService && (aiService.apiKey || aiService.proxyUrl)) {
      try {
        // Get conversation history
        const savedMatches = await loadSavedMatches();
        const currentMatch = savedMatches.find(m => m.id === match.id);
        const conversationHistory = (currentMatch?.messages || []).slice(-5); // Last 5 messages for context
        
        // Build prompt for AI response with better context
        const membersList = match.members.map(m => {
          const parts = m.split("·");
          return parts.length > 1 ? `${parts[0].trim()} (${parts[1].trim()})` : m;
        }).join(", ");
        
        const contextPrompt = `You are ${match.members[0] || "a group member"} participating in a group chat for "${match.title}".

GROUP CONTEXT:
- Topic: ${match.topic}
- Description: ${match.summary}
- Group members: ${membersList}
- Group tags/interests: ${match.tags.join(", ")}

RECENT CONVERSATION:
${conversationHistory.length > 0 
  ? conversationHistory.map(m => `${m.author}: ${m.text}`).join("\n")
  : "This is the start of the conversation."}

USER'S MESSAGE: "${userMessage}"

INSTRUCTIONS:
- Respond as ${match.members[0] || "a group member"} would naturally respond
- Be helpful, friendly, and contextually relevant
- Answer questions directly if asked
- Show enthusiasm and engagement
- Keep responses concise (1-2 sentences, max 3)
- Match the tone and style of the group (${match.tags.join(", ")})
- If asked a personal question (like "what is your name"), respond naturally based on your role in the group

Your response:`;
        
        const aiResponse = await aiService.callAPI([{
          role: "user",
          content: contextPrompt
        }], { max_tokens: 150 });
        
        // Hide typing indicator first
        if (typingIndicator) typingIndicator.style.display = "none";
        
        // Add AI response
        if (aiResponse && aiResponse.trim()) {
          // Use first member name as AI responder, or generate a name
          const aiAuthor = match.members[0] || "Group Member";
          await appendMessage(match.id, {
            author: aiAuthor,
            role: "them",
            text: aiResponse.trim(),
          });
          
          // Append response to DOM immediately (below typing indicator)
          if (messageThread) {
            const responseBubble = buildMessageBubble({
              author: aiAuthor,
              role: "them",
              text: aiResponse.trim(),
            });
            messageThread.insertAdjacentHTML("beforeend", responseBubble);
            const messagesContainer = document.querySelector(".messages-container");
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }
        } else {
          // Empty response - provide fallback
          const fallbackResponse = generateFallbackChatResponse(match, userMessage, conversationHistory, match.members[0]);
          await appendMessage(match.id, {
            author: match.members[0] || "Group Member",
            authorId: null, // Fallback response
            role: "them",
            text: fallbackResponse,
          });
          
          if (messageThread) {
            const responseBubble = buildMessageBubble({
              author: match.members[0] || "Group Member",
              role: "them",
              text: fallbackResponse,
            });
            messageThread.insertAdjacentHTML("beforeend", responseBubble);
            const messagesContainer = document.querySelector(".messages-container");
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }
        }
      } catch (error) {
        console.error("AI chat error:", error);
        // Hide typing indicator
        if (typingIndicator) typingIndicator.style.display = "none";
        
        // Fallback: Generate a reasonable response using rule-based system
        const savedMatches = await loadSavedMatches();
        const currentMatch = savedMatches.find(m => m.id === match.id);
        const conversationHistory = (currentMatch?.messages || []).slice(-5);
        const fallbackResponse = generateFallbackChatResponse(match, userMessage, conversationHistory, match.members[0]);
        
        await appendMessage(match.id, {
          author: match.members[0] || "Group Member",
          role: "them",
          text: fallbackResponse,
        });
        
        if (messageThread) {
          const responseBubble = buildMessageBubble({
            author: match.members[0] || "Group Member",
            role: "them",
            text: fallbackResponse,
          });
          messageThread.insertAdjacentHTML("beforeend", responseBubble);
          const messagesContainer = document.querySelector(".messages-container");
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }
      }
    } else {
      // Hide typing indicator
      if (typingIndicator) typingIndicator.style.display = "none";
      
      // No AI - just add a placeholder response
      const fallbackResponse = generateFallbackChatResponse(match, userMessage, [], match.members[0]);
      await appendMessage(match.id, {
        author: match.members[0] || "Group Member",
        authorId: null, // Fallback response
        role: "them",
        text: fallbackResponse,
      });
      
      if (messageThread) {
        const responseBubble = buildMessageBubble({
          author: match.members[0] || "Group Member",
          role: "them",
          text: fallbackResponse,
        });
        messageThread.insertAdjacentHTML("beforeend", responseBubble);
        const messagesContainer = document.querySelector(".messages-container");
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    }
    
    input.disabled = false; // Re-enable input
    input.focus();
    renderNetworkList();
  });

  const messageThread = document.getElementById("messageThread");
  messageThread.scrollTop = messageThread.scrollHeight;
}

function buildMessageBubble(message) {
  const isMe = message.role === "me";
  const author = isMe ? "You" : message.author;
  return `
    <div class="message ${isMe ? "me" : ""}">
      <strong>${author}</strong>
      <p>${message.text}</p>
    </div>
  `;
}

async function appendMessage(matchId, message) {
  // Save to Firestore if it's a real match group
  if (FIREBASE_ENABLED && firestoreDb && matchId.startsWith("match-")) {
    try {
      const firestoreMatchId = matchId.replace("match-", "");
      await firestoreDb.collection("matches").doc(firestoreMatchId).collection("messages").add({
        ...message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // Update match's updatedAt
      await firestoreDb.collection("matches").doc(firestoreMatchId).update({
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return; // Real-time listener will update UI
    } catch (error) {
      console.error("Error saving message to Firestore:", error);
      // Fall through to localStorage
    }
  }
  
  // Fallback to localStorage for local matches
  const matches = await loadSavedMatches();
  const match = matches.find((item) => item.id === matchId);
  if (!match) {
    console.warn(`Match not found: ${matchId}`);
    return;
  }
  
  // Ensure messages array exists
  if (!match.messages) match.messages = [];
  match.messages = [...match.messages, message];
  
  await saveMatches(matches);
  
  // Update UI if this match is currently displayed
  if (window.currentChatId === matchId) {
    const messageThread = document.getElementById("messageThread");
    if (messageThread) {
      const messageBubble = buildMessageBubble(message);
      messageThread.insertAdjacentHTML("beforeend", messageBubble);
      setTimeout(() => {
        messageThread.scrollTop = messageThread.scrollHeight;
      }, 100);
    }
  }
}

/* Firebase Authentication Functions */
function setupAuthUI() {
  const authPrompt = document.getElementById("authPrompt");
  if (!authPrompt) return;
  
  updateAuthUI();
  
  // Set up auth form handlers
  document.getElementById("showSignUpBtn")?.addEventListener("click", () => showAuthForm("signup"));
  document.getElementById("showSignInBtn")?.addEventListener("click", () => showAuthForm("signin"));
  document.getElementById("logoutBtn")?.addEventListener("click", handleSignOut);
}

function updateAuthUI() {
  const authPrompt = document.getElementById("authPrompt");
  if (!authPrompt) return;

  if (currentUser && FIREBASE_ENABLED) {
    // User is signed in
    authPrompt.style.display = "block";
    authPrompt.innerHTML = `
      <div class="user-info">
        <div class="avatar">${currentUser.email?.charAt(0).toUpperCase() || "U"}</div>
        <div>
          <strong>${currentUser.email}</strong>
          <p class="sync-status">✓ Synced to cloud</p>
        </div>
      </div>
      <button id="logoutBtn" class="btn btn-ghost">Sign Out</button>
    `;
    document.getElementById("logoutBtn")?.addEventListener("click", handleSignOut);
  } else {
    // User is not signed in
    authPrompt.style.display = "block";
    authPrompt.innerHTML = `
      <p><strong>Sign in to match with real users</strong></p>
      <p>Create an account to match with real people and chat in real-time!</p>
      <button id="showSignUpBtn" class="btn btn-primary">Sign Up</button>
      <button id="showSignInBtn" class="btn btn-ghost">Sign In</button>
    `;
    document.getElementById("showSignUpBtn")?.addEventListener("click", () => showAuthForm("signup"));
    document.getElementById("showSignInBtn")?.addEventListener("click", () => showAuthForm("signin"));
  }
}

function showAuthForm(mode) {
  const authPrompt = document.getElementById("authPrompt");
  if (!authPrompt) return;

  authPrompt.innerHTML = `
    <div class="auth-section">
      <h3>${mode === "signup" ? "Create Account" : "Sign In"}</h3>
      <form class="auth-form" id="authForm">
        <label>
          Email
          <input type="email" id="authEmail" required />
        </label>
        <label>
          Password
          <input type="password" id="authPassword" required minlength="6" />
        </label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">${mode === "signup" ? "Sign Up" : "Sign In"}</button>
          <button type="button" class="btn btn-ghost" id="cancelAuthBtn">Cancel</button>
        </div>
        <p class="status" id="authStatus" role="status" aria-live="polite"></p>
      </form>
    </div>
  `;

  document.getElementById("authForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail")?.value.trim();
    const password = document.getElementById("authPassword")?.value;
    
    if (!email || !password) {
      setStatusMessage("authStatus", "Please fill in all fields");
      return;
    }

    try {
      if (mode === "signup") {
        await handleSignUp(email, password);
      } else {
        await handleSignIn(email, password);
      }
    } catch (error) {
      setStatusMessage("authStatus", error.message || "Authentication failed");
    }
  });

  document.getElementById("cancelAuthBtn")?.addEventListener("click", () => {
    updateAuthUI();
  });
}

async function handleSignUp(email, password) {
  if (!firebaseAuth) throw new Error("Firebase not initialized");
  
  const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
  const profile = await loadProfile();
  
  // Save profile to Firestore
  if (firestoreDb) {
    await firestoreDb.collection("users").doc(userCredential.user.uid).set({
      ...profile,
      email: userCredential.user.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  setStatusMessage("authStatus", "Account created! Profile synced.");
  updateAuthUI();
}

async function handleSignIn(email, password) {
  if (!firebaseAuth) throw new Error("Firebase not initialized");
  
  await firebaseAuth.signInWithEmailAndPassword(email, password);
  setStatusMessage("authStatus", "Signed in successfully!");
  updateAuthUI();
}

async function handleSignOut() {
  if (!firebaseAuth) return;
  
  await firebaseAuth.signOut();
  updateAuthUI();
}

async function syncProfileFromFirestore() {
  if (!FIREBASE_ENABLED || !currentUser || !firestoreDb) return;

  try {
    const userDoc = await firestoreDb.collection("users").doc(currentUser.uid).get();
    if (userDoc.exists) {
      const profileData = userDoc.data();
      // Merge with default profile
      const mergedProfile = { ...defaultProfile, ...profileData };
      // Save to localStorage as cache
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(mergedProfile));
      // Update UI if on profile page
      if (document.body.getAttribute("data-page") === "profile") {
        setInputValue("fullName", mergedProfile.fullName);
        setInputValue("displayName", mergedProfile.displayName);
        setInputValue("city", mergedProfile.city);
        setInputValue("photo", mergedProfile.photo);
        setInputValue("bio", mergedProfile.bio);
        setInputValue("naturalLanguagePreferences", mergedProfile.naturalLanguagePreferences || "");
        // Reload tag panels
        setupTagPanels(mergedProfile);
      }
    }
  } catch (error) {
    console.error("Error syncing profile from Firestore:", error);
  }
}

/* Real User Matching Functions - AI-Powered Based on Tags, Bio, and Preferences */
async function findRealUserMatches(topic, userProfile, preferenceTokens = []) {
  if (!FIREBASE_ENABLED || !currentUser || !firestoreDb) {
    return []; // Return empty if Firebase not available
  }

  try {
    // AI-POWERED MATCHING: Query ALL users and let AI score compatibility
    // Matching is based on tags, bio, and preferences - NOT categories
    console.log("🔍 AI-Powered Real User Matching");
    console.log("📋 Current user profile:");
    console.log("   - Tags:", [...(userProfile.aboutTags || []), ...(userProfile.lookingTags || [])]);
    console.log("   - Bio:", userProfile.bio);
    console.log("   - Preferences:", userProfile.naturalLanguagePreferences);
    console.log("   - Topic interest:", topic);
    console.log("🔑 Current user ID:", currentUser.uid);
    
    // Query ALL users (or recent users) - AI will filter and score them
    // Limit to recent users to avoid processing too many
    const usersSnapshot = await firestoreDb
      .collection("users")
      .limit(50) // Get up to 50 users for AI to analyze
      .get();

    console.log(`👥 Found ${usersSnapshot.size} users in Firestore`);
    
    if (usersSnapshot.size === 0) {
      console.log("❌ No users found in Firestore!");
      console.log("   → Make sure other users have:");
      console.log("      1. Signed in");
      console.log("      2. Saved their profile to Firestore");
      console.log("   → Check Firestore Console → users collection to verify");
      return [];
    }
    
    const potentialMatches = [];
    const userTags = [...(userProfile.aboutTags || []), ...(userProfile.lookingTags || [])].map(normalize);
    console.log("🏷️ Current user tags:", userTags);

    // First pass: Basic filtering based on tags and bio similarity
    const candidates = [];
    usersSnapshot.forEach(doc => {
      const otherUser = doc.data();
      // Skip current user
      if (doc.id === currentUser.uid) {
        console.log("⏭️ Skipping current user:", doc.id);
        return;
      }
      
      // Skip users with no profile data
      if (!otherUser.aboutTags && !otherUser.lookingTags && !otherUser.bio) {
        return;
      }
      
      const otherTags = [...(otherUser.aboutTags || []), ...(otherUser.lookingTags || [])].map(normalize);
      const tagOverlap = userTags.filter(tag => otherTags.includes(tag)).length;
      
      // Calculate basic similarity score (more sensitive)
      let baseScore = 30; // Start lower
      
      // Tag overlap (more weight for shared tags)
      const totalUserTags = userTags.length;
      const totalOtherTags = otherTags.length;
      if (totalUserTags > 0 && totalOtherTags > 0) {
        const tagSimilarity = tagOverlap / Math.max(totalUserTags, totalOtherTags);
        baseScore += Math.round(tagSimilarity * 40); // Up to 40 points for tag similarity
      }
      
      // Bio similarity (simple keyword matching)
      if (userProfile.bio && otherUser.bio) {
        const userBioWords = userProfile.bio.toLowerCase().split(/\s+/);
        const otherBioWords = otherUser.bio.toLowerCase().split(/\s+/);
        const bioOverlap = userBioWords.filter(word => word.length > 3 && otherBioWords.includes(word)).length;
        if (bioOverlap > 0) {
          baseScore += Math.min(20, bioOverlap * 5); // Up to 20 points for bio similarity
        }
      }
      
      // Preferences match
      if (preferenceTokens.length > 0) {
        const preferenceMatch = preferenceTokens.some(token => 
          otherTags.some(tag => tag.includes(token) || token.includes(tag)) ||
          (otherUser.bio && otherUser.bio.toLowerCase().includes(token))
        );
        if (preferenceMatch) {
          baseScore += 10;
        }
      }
      
      // Only include candidates with decent similarity (at least some overlap)
      if (baseScore >= 40) {
        candidates.push({
          doc,
          otherUser,
          otherTags,
          tagOverlap,
          baseScore: Math.min(95, baseScore) // Cap at 95, let AI push to 100
        });
      }
    });
    
    console.log(`📊 Found ${candidates.length} potential candidates for AI analysis`);
    
    // Second pass: Use AI to score compatibility (or basic scoring if AI unavailable)
    const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
    const useAI = AI_ENABLED && aiService && (aiService.apiKey || aiService.proxyUrl);
    
    if (useAI) {
      console.log("🤖 Using AI to analyze compatibility...");
    } else {
      console.log("⚠️ AI not available - using basic tag-based matching");
    }
    
    // Process candidates (limit to top 10 for AI to avoid rate limits)
    const candidatesToProcess = candidates.slice(0, useAI ? 10 : 20);
    
    for (const candidate of candidatesToProcess) {
      const { doc, otherUser, otherTags, tagOverlap, baseScore } = candidate;
      let finalScore = baseScore;
      let aiInsights = null;
      
      // Try AI scoring if available
      if (useAI) {
        try {
          console.log(`🤖 AI analyzing: ${otherUser.displayName || otherUser.email}`);
          aiInsights = await aiService.generateMatchScore(userProfile, {
            title: `${otherUser.displayName || 'User'}'s Profile`,
            summary: otherUser.bio || "Looking for connections",
            tags: otherUser.aboutTags || [],
            details: [
              otherUser.bio || "",
              `Looking for: ${(otherUser.lookingTags || []).join(", ")}`,
              otherUser.naturalLanguagePreferences || ""
            ],
          }, topic, preferenceTokens.join(", "));
          
          if (aiInsights && aiInsights.compatibility_score) {
            // Use AI score directly (it's more accurate), but ensure it's reasonable
            const aiScore = Math.max(0, Math.min(100, aiInsights.compatibility_score));
            // If AI score is very different from base, trust AI more
            // If similar, blend them
            const scoreDiff = Math.abs(aiScore - baseScore);
            if (scoreDiff > 20) {
              // AI strongly disagrees - trust AI (90% weight)
              finalScore = Math.round(baseScore * 0.1 + aiScore * 0.9);
            } else {
              // AI agrees - use AI score directly
              finalScore = aiScore;
            }
            console.log(`🤖 AI score: ${baseScore} → ${finalScore} (AI: ${aiScore})`);
          } else {
            // AI didn't return a score - use base score
            finalScore = baseScore;
          }
        } catch (aiError) {
          // If AI fails, use basic score
          if (aiError.message?.includes('429') || aiError.message?.includes('rate limit')) {
            console.warn(`⚠️ AI rate limited for ${otherUser.displayName || otherUser.email}, using basic score`);
          } else {
            console.warn(`⚠️ AI error: ${aiError.message}, using basic score`);
          }
          // Continue with basic score
        }
      }
      
      // Only show matches with meaningful similarity
      // Higher threshold: 65% minimum for real users (very different users shouldn't show)
      if (finalScore >= 65) {
        console.log(`✅ Adding match: ${otherUser.displayName || otherUser.email} (score: ${finalScore})`);
        potentialMatches.push({
          id: `user-${doc.id}`,
          userId: doc.id,
          topic,
          title: `${otherUser.displayName || otherUser.email?.split('@')[0] || 'User'}'s ${topic} Group`,
          summary: aiInsights?.match_reasons?.[0] || otherUser.bio || `Join ${otherUser.displayName || 'this user'}'s ${topic.toLowerCase()} group`,
          tags: otherUser.aboutTags || [],
          details: [
            aiInsights?.match_reasons?.[1] || `Matched based on: ${tagOverlap > 0 ? tagOverlap + ' shared interests' : 'AI analysis'}`,
            otherUser.bio || "Looking for connections",
          ],
          members: [
            `${otherUser.displayName || otherUser.email?.split('@')[0] || 'User'} · ${topic.toLowerCase()} enthusiast`,
          ],
          conversationStarters: aiInsights?.conversation_starters || [
            `Hey! I saw we both like ${topic.toLowerCase()}`,
            `Want to connect about ${topic.toLowerCase()}?`,
          ],
          score: finalScore,
          isRealUser: true,
          userIds: [doc.id, currentUser.uid],
          aiInsights: aiInsights, // Store for display
          aiExplanation: aiInsights?.match_reasons?.join(" ") || null,
        });
      }
    }

    // AI scoring is now done in the loop above - no need for separate enhancement

    console.log(`🎯 Returning ${potentialMatches.length} potential matches`);
    return potentialMatches.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("❌ Error finding real user matches:", error);
    return [];
  }
}

async function createMatchGroup(match, userProfile) {
  if (!FIREBASE_ENABLED || !currentUser || !firestoreDb || !match.userIds) {
    return null;
  }

  try {
    // Check if match group already exists
    const existingMatch = await firestoreDb
      .collection("matches")
      .where("members", "array-contains", currentUser.uid)
      .where("topic", "==", match.topic)
      .where("userIds", "array-contains-any", match.userIds)
      .limit(1)
      .get();

    if (!existingMatch.empty) {
      return existingMatch.docs[0].id; // Return existing match ID
    }

    // Create new match group
    const matchData = {
      topic: match.topic,
      title: match.title,
      summary: match.summary,
      tags: match.tags || [],
      members: match.members || [],
      userIds: match.userIds,
      conversationStarters: match.conversationStarters || [],
      messages: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const matchRef = await firestoreDb.collection("matches").add(matchData);
    return matchRef.id;
  } catch (error) {
    console.error("Error creating match group:", error);
    return null;
  }
}

/* Shared utilities */
async function loadProfile() {
  // Try Firestore first if user is logged in
  if (FIREBASE_ENABLED && currentUser && firestoreDb) {
    try {
      const userDoc = await firestoreDb.collection("users").doc(currentUser.uid).get();
      if (userDoc.exists) {
        const profileData = userDoc.data();
        const mergedProfile = { ...defaultProfile, ...profileData };
        // Cache in localStorage
        localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(mergedProfile));
        return mergedProfile;
      }
    } catch (error) {
      console.error("Error loading profile from Firestore:", error);
    }
  }
  
  // Fallback to localStorage
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || "{}");
    return { ...defaultProfile, ...stored };
  } catch {
    return { ...defaultProfile };
  }
}

async function saveProfile(profile) {
  // Save to localStorage immediately
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  
  // Save to Firestore if user is logged in
  if (FIREBASE_ENABLED && currentUser && firestoreDb) {
    try {
      await firestoreDb.collection("users").doc(currentUser.uid).set({
        ...profile,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      console.log("Profile saved to Firestore");
    } catch (error) {
      console.error("Error saving profile to Firestore:", error);
    }
  }
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function setStatusMessage(id, message) {
  const target = document.getElementById(id);
  if (!target) return;
  target.textContent = message || "";
}

async function loadSavedMatches() {
  // Load from Firestore if user is logged in
  if (FIREBASE_ENABLED && currentUser && firestoreDb) {
    try {
      const matchesSnapshot = await firestoreDb
        .collection("matches")
        .where("userIds", "array-contains", currentUser.uid)
        .orderBy("updatedAt", "desc")
        .get();

      const firestoreMatches = [];
      for (const doc of matchesSnapshot.docs) {
        const matchData = doc.data();
        // Load messages
        const messagesSnapshot = await doc.ref.collection("messages")
          .orderBy("timestamp", "asc")
          .get();
        
        const messages = messagesSnapshot.docs.map(msgDoc => {
          const msgData = msgDoc.data();
          return {
            author: msgData.author || "Unknown",
            role: msgData.authorId === currentUser.uid ? "me" : "them",
            text: msgData.text || "",
            timestamp: msgData.timestamp?.toDate?.() || new Date(),
          };
        });

        firestoreMatches.push({
          id: `match-${doc.id}`,
          ...matchData,
          messages,
        });
      }

      // Also load localStorage matches (for backward compatibility)
      const localMatches = JSON.parse(localStorage.getItem(STORAGE_KEYS.savedMatches) || "[]");
      const allMatches = [...firestoreMatches, ...localMatches];
      
      // Cache in localStorage
      localStorage.setItem(STORAGE_KEYS.savedMatches, JSON.stringify(allMatches));
      return allMatches;
    } catch (error) {
      console.error("Error loading matches from Firestore:", error);
      // Fall through to localStorage
    }
  }

  // Fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.savedMatches) || "[]");
  } catch {
    return [];
  }
}

async function saveMatches(matches) {
  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.savedMatches, JSON.stringify(matches));
  
  // Note: Firestore matches are saved individually when created/updated
  // This function mainly handles localStorage matches
}

async function saveMatch(match) {
  const matches = await loadSavedMatches();
  if (matches.some((item) => item.id === match.id)) return false;
  matches.push({
    id: match.id,
    title: match.title,
    topic: match.topic,
    summary: match.summary,
    tags: match.tags,
    members: match.members,
    conversationStarters: [...(match.conversationStarters || [])],
    messages: (match.messages || []).map((msg) => ({ ...msg })),
  });
  await saveMatches(matches);
  return true;
}

function buildEmptyState(title, description) {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
  return div;
}

function calculateScore(match, profile, preferenceTokens = []) {
  let score = match.scoreBase || 55;
  const allTags = [...(profile.aboutTags || []), ...(profile.lookingTags || [])].map(normalize);
  const overlap = match.tags.filter((tag) => allTags.includes(normalize(tag)));
  score += overlap.length * 4;
  const preferenceHit = preferenceTokens.some((token) => token && match.keywords.some((key) => token.includes(key)));
  if (preferenceHit) score += 8;
  return Math.min(99, score);
}

function normalize(text) {
  return text?.toString().trim().toLowerCase() || "";
}

function prettify(text) {
  return text
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""))
    .join(" ")
    .trim();
}

// AI Feature Setup Functions
function setupAIFeatures() {
  // Check if AI service is available
  const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
  if (!aiService) {
    return;
  }

  // Check if proxy is configured (most secure - no key needed)
  const proxyMeta = document.querySelector('meta[name="vibelink-gemini-proxy"]')?.content;
  const proxyEnv = window.VIBELINK_GEMINI_PROXY;
  if (proxyMeta || proxyEnv) {
    // Proxy is configured - no need to show API key prompt
    console.log("VibeLink: Proxy detected, skipping API key prompt");
    return;
  }

  // Check if user has saved their own API key
  const apiKey = aiService.getApiKeyFromEnv();
  if (!apiKey) {
    // No proxy and no saved key - show API key input prompt
    showAPIKeyPrompt();
  } else {
    aiService.init(apiKey);
  }
}

function setupAITextAnalysis() {
  // Add analyze button next to natural language input if it exists
  const nlInput = document.getElementById("naturalLanguagePreferences");
  if (nlInput && !document.getElementById("analyzeTextBtn")) {
    const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
    if (!aiService) return;
    
    const analyzeBtn = document.createElement("button");
    analyzeBtn.type = "button";
    analyzeBtn.id = "analyzeTextBtn";
    analyzeBtn.className = "btn btn-inline";
    analyzeBtn.textContent = "Analyze with AI";
    analyzeBtn.style.marginTop = "0.5rem";
    analyzeBtn.addEventListener("click", async () => {
      const text = nlInput.value.trim();
      if (!text) {
        setStatusMessage("profileStatus", "Please enter some text to analyze.");
        return;
      }
      // Check for proxy URL (preferred) or API key
      if (!aiService || (!aiService.apiKey && !aiService.proxyUrl)) {
        setStatusMessage("profileStatus", "AI service not configured. Using proxy or set your Gemini API key.");
        // Don't show prompt if proxy is available
        if (!aiService.proxyUrl) {
          showAPIKeyPrompt();
        }
        return;
      }
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "Analyzing...";
      try {
        const analysis = await aiService.analyzeTextInput(text);
        if (analysis && analysis.extracted_tags) {
          analysis.extracted_tags.forEach(tag => {
            if (tag && !tagState.looking.has(normalize(tag))) {
              addTag("looking", tag);
            }
          });
          setStatusMessage("profileStatus", `AI extracted ${analysis.extracted_tags.length} tags from your text! ✨`);
        }
      } catch (error) {
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          setStatusMessage("profileStatus", "AI is rate limited. Try again in a moment.");
        } else {
          setStatusMessage("profileStatus", "AI analysis failed. Check console for details.");
        }
        console.error("AI analysis error:", error);
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze with AI";
      }
    });
    const label = nlInput.closest("label");
    if (label) {
      label.appendChild(analyzeBtn);
    } else {
      nlInput.parentElement?.appendChild(analyzeBtn);
    }
  }
}

function showAPIKeyPrompt() {
  // Create a simple modal or inline prompt for API key
  const existing = document.getElementById("apiKeyPrompt");
  if (existing) return;

  const aiService = window.AI_SERVICE || (typeof AI_SERVICE !== 'undefined' ? AI_SERVICE : null);
  if (!aiService) return;

  const prompt = document.createElement("div");
  prompt.id = "apiKeyPrompt";
  prompt.className = "api-key-prompt";
  prompt.innerHTML = `
    <div class="api-key-content">
      <h3>Enable AI Features</h3>
      <p>Enter your Google Gemini API key to enable intelligent matching and text analysis.</p>
      <input type="password" id="apiKeyInput" placeholder="AIza..." />
      <div class="api-key-actions">
        <button id="saveApiKeyBtn" class="btn btn-primary">Save Key</button>
        <button id="skipApiKeyBtn" class="btn btn-ghost">Skip (Use Basic Matching)</button>
      </div>
      <p class="api-key-hint">Your key is stored locally and never sent to our servers.</p>
      <p class="api-key-hint"><a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--accent-2);">Get your free API key from Google AI Studio</a></p>
    </div>
  `;

  document.body.appendChild(prompt);

  document.getElementById("saveApiKeyBtn")?.addEventListener("click", () => {
    const key = document.getElementById("apiKeyInput")?.value.trim();
    if (key) {
      aiService.saveApiKey(key);
      aiService.init(key);
      prompt.remove();
      setStatusMessage("profileStatus", "AI features enabled! ✨");
    }
  });

  document.getElementById("skipApiKeyBtn")?.addEventListener("click", () => {
    prompt.remove();
  });
}
