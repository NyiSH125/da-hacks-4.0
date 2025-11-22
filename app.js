const STORAGE_KEYS = {
  profile: "vibelink-profile",
  savedMatches: "vibelink-saved-matches",
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
    openingMessage: "Hey! I’m Sarah. I love hosting pick-up games and post-match travel chats. Let’s plan something fun.",
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
      "What’s the nerdiest thing you built recently?",
    ],
    openingMessage: "Hi, Ryan here. I’m usually quiet until we start coding or passing drills—but I’m excited to sync up.",
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
    openingMessage: "Hey! I’m Alex. I don’t do sports, but I can host a great conversation over coffee or books. Let’s connect.",
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
    if (!url.startsWith("https://")) {
      console.warn("VIBELINK_GEMINI_PROXY must be https.");
      return null;
    }
    if (/key=|api_key=/i.test(url)) {
      console.error("VIBELINK_GEMINI_PROXY must not contain API keys. Remove key query parameters.");
      return null;
    }
    try {
      const parsed = new URL(url, window?.location?.origin);
      if (window?.location?.origin && parsed.origin !== window.location.origin) {
        console.error("VIBELINK_GEMINI_PROXY must live on the same origin as the app.");
        return null;
      }
      return { type: "proxy", url: parsed.href };
    } catch (error) {
      console.error("Invalid VIBELINK_GEMINI_PROXY URL", error);
      return null;
    }
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body?.dataset.page || "home";
  switch (page) {
    case "profile":
      initProfilePage();
      break;
    case "discover":
      initDiscoverPage();
      break;
    case "network":
      initNetworkPage();
      break;
    default:
      highlightNav("home");
  }
});

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

/* Profile */
function initProfilePage() {
  highlightNav("profile");
  const profile = loadProfile();
  setInputValue("fullName", profile.fullName);
  setInputValue("displayName", profile.displayName);
  setInputValue("city", profile.city);
  setInputValue("photo", profile.photo);
  setInputValue("bio", profile.bio);
  setupTagPanels(profile);
  document.getElementById("profileForm")?.addEventListener("submit", handleProfileSave);
  document.getElementById("profileResetBtn")?.addEventListener("click", handleProfileReset);
}

function handleProfileSave(event) {
  event.preventDefault();
  const profile = {
    ...loadProfile(),
    fullName: getValue("fullName"),
    displayName: getValue("displayName"),
    city: getValue("city"),
    photo: getValue("photo"),
    bio: getValue("bio"),
    aboutTags: Array.from(tagState.about.values()),
    lookingTags: Array.from(tagState.looking.values()),
  };
  saveProfile(profile);
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
    button.addEventListener("click", () => {
      const type = button.dataset.addTag;
      const input = document.querySelector(`[data-tag-input="${type}"]`);
      if (input?.value.trim()) {
        addTag(type, input.value.trim());
        input.value = "";
      }
    });
  });

  document.querySelectorAll("[data-tag-input]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (input.value.trim()) {
          addTag(input.dataset.tagInput, input.value.trim());
          input.value = "";
        }
      }
    });
  });
}

const TAG_SUGGESTIONS = {
  about: ["introverted", "organized", "night owl", "early riser", "tactical gamer", "runner", "creative strategist"],
  looking: ["motivated study buddy", "quiet roommate", "weekly run club", "high-ELO teammate", "cozy co-op gamer", "mindful roommates"],
};

function renderTagSuggestions(type) {
  const container = document.querySelector(`[data-tag-suggestions="${type}"]`);
  if (!container) return;
  container.innerHTML = "";
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

function addTag(type, label) {
  const key = normalize(label);
  if (!key || tagState[type].has(key)) return;
  tagState[type].set(key, prettify(label));
  renderSelectedTags(type);
  syncSuggestionStates(type);
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
  });
  renderDiscoverMatches(topic);
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
      <p>We’re asking Gemini and the VibeLink bots to assemble a pod for you.</p>
    </div>
  `;
  const profile = loadProfile();
  const formData = new FormData(document.getElementById("discoverForm"));
  const preferenceTokens = Array.from(formData.values())
    .map((value) => value.toString().trim().toLowerCase())
    .filter(Boolean);

  const matches = MATCH_LIBRARY.filter((match) => match.topic === topic).map((match) => {
    const score = calculateScore(match, profile, preferenceTokens);
    return { ...match, score };
  });

  const aiMatches = await fetchGeminiMatches(topic, profile, preferenceTokens);

  container.innerHTML = "";
  const combinedMatches = [...matches, ...aiMatches];
  if (!combinedMatches.length) {
    const botMatches = generateBotMatches(topic, profile, preferenceTokens);
    if (botMatches.length) {
      botMatches.forEach((match) => container.appendChild(buildMatchCard(match)));
      setStatusMessage(
        "discoverStatus",
        "No live pods right now, so VibeLink spun up AI buddy groups with Sarah, Ryan, or Alex."
      );
    } else {
      container.appendChild(buildEmptyState("No matches yet", "Try different preferences."));
      setStatusMessage("discoverStatus", "No matches found.");
    }
    return;
  }

  combinedMatches
    .sort((a, b) => b.score - a.score)
    .forEach((match) => container.appendChild(buildMatchCard(match)));

  setStatusMessage("discoverStatus", `Showing ${combinedMatches.length} match${combinedMatches.length > 1 ? "es" : ""}.`);
}

function buildMatchCard(match) {
  const article = document.createElement("article");
  article.className = "match-card";
  article.innerHTML = `
    <header>
      <div>
        <p class="eyebrow">${match.topic}</p>
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
    <button class="btn btn-primary" data-save-match="${match.id}">Save invite</button>
  `;

  article.querySelector("[data-save-match]")?.addEventListener("click", () => {
    const saved = saveMatch(match);
    const button = article.querySelector("[data-save-match]");
    if (saved) {
      button.textContent = "Saved to Network";
      button.classList.add("accepted");
      button.disabled = true;
      setStatusMessage("discoverStatus", `${match.title} added to Network.`);
    } else {
      button.textContent = "Already saved";
      button.disabled = true;
    }
  });

  return article;
}

async function fetchGeminiMatches(topic, profile, preferenceTokens) {
  const auth = resolveGeminiAuth();
  if (!auth) {
    console.warn("VIBELINK_GEMINI_PROXY is not configured; skipping Gemini matches.");
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
      console.warn("Gemini API error", await response.text());
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

function renderNetworkList() {
  const list = document.getElementById("networkList");
  const windowPane = document.getElementById("networkWindow");
  if (!list || !windowPane) return;
  const matches = loadSavedMatches();
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

  document.getElementById("networkChatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("networkMessageInput");
    if (!input?.value.trim()) return;
    appendMessage(match.id, {
      author: loadProfile().displayName || "You",
      role: "me",
      text: input.value.trim(),
    });
    input.value = "";
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

function appendMessage(matchId, message) {
  const matches = loadSavedMatches();
  const match = matches.find((item) => item.id === matchId);
  if (!match) return;
  match.messages = [...match.messages, message];
  saveMatches(matches);
}

/* Shared utilities */
function loadProfile() {
  try {
    return { fullName: "", displayName: "", city: "", photo: "", bio: "", aboutTags: [], lookingTags: [], ...JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || "{}") };
  } catch {
    return { fullName: "", displayName: "", city: "", photo: "", bio: "", aboutTags: [], lookingTags: [] };
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
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
  if (target) target.textContent = message;
}

function loadSavedMatches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.savedMatches) || "[]");
  } catch {
    return [];
  }
}

function saveMatches(matches) {
  localStorage.setItem(STORAGE_KEYS.savedMatches, JSON.stringify(matches));
}

function saveMatch(match) {
  const matches = loadSavedMatches();
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
  saveMatches(matches);
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

