const STORAGE_KEY = "vibelink-profile";

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
};

const tagState = {
  about: new Map(),
  looking: new Map(),
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body?.dataset.page || "home";
  const map = {
    home: initHomePage,
    profile: initProfilePage,
    category: initCategoryPage,
  };
  map[page]?.();
});

function initHomePage() {
  const profile = loadProfile();
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

function initProfilePage() {
  const form = document.getElementById("profileForm");
  if (!form) return;
  const profile = loadProfile();
  setInputValue("fullName", profile.fullName);
  setInputValue("displayName", profile.displayName);
  setInputValue("city", profile.city);
  setInputValue("photo", profile.photo);
  setInputValue("bio", profile.bio);

  setupTagPanels(profile);

  form.addEventListener("submit", handleProfileSave);
  document.getElementById("profileResetBtn")?.addEventListener("click", handleProfileReset);
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
  renderCategoryMatches(category);
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...defaultProfile, ...stored };
  } catch {
    return { ...defaultProfile };
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function toggleCategory(category, isChecked) {
  const profile = loadProfile();
  const categories = new Set(profile.categories);
  if (isChecked) {
    categories.add(category);
  } else {
    categories.delete(category);
  }
  profile.categories = Array.from(categories);
  saveProfile(profile);
  renderSelectedCategories(profile.categories);
}

function ensureCategorySelected(category) {
  const profile = loadProfile();
  if (profile.categories.includes(category)) return;
  profile.categories = [...profile.categories, category];
  saveProfile(profile);
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

function handleProfileSave(event) {
  event.preventDefault();
  const profile = loadProfile();
  profile.fullName = getValue("fullName");
  profile.displayName = getValue("displayName");
  profile.city = getValue("city");
  profile.photo = getValue("photo");
  profile.bio = getValue("bio");
  profile.aboutTags = Array.from(tagState.about.values());
  profile.lookingTags = Array.from(tagState.looking.values());
  saveProfile(profile);
  setStatusMessage("profileStatus", "Profile saved ✨");
}

function handleProfileReset() {
  localStorage.removeItem(STORAGE_KEY);
  tagState.about.clear();
  tagState.looking.clear();
  document.getElementById("profileForm")?.reset();
  setupTagPanels(defaultProfile);
  setStatusMessage("profileStatus", "Profile reset. Start fresh!");
}

function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function setupTagPanels(profile) {
  tagState.about = new Map();
  tagState.looking = new Map();
  (profile.aboutTags || []).forEach((tag) => tagState.about.set(normalize(tag), tag));
  (profile.lookingTags || []).forEach((tag) => tagState.looking.set(normalize(tag), tag));
  renderTagSuggestions("about");
  renderTagSuggestions("looking");
  renderSelectedTags("about");
  renderSelectedTags("looking");
  bindTagControls();
}

function bindTagControls() {
  document.querySelectorAll("[data-add-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.addTag;
      const input = document.querySelector(`[data-tag-input="${type}"]`);
      if (input && input.value.trim()) {
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
    tagState[type].set(key, prettifyTag(label));
    button?.classList.add("active");
  }
  renderSelectedTags(type);
  syncSuggestionStates(type);
}

function addTag(type, label) {
  const key = normalize(label);
  if (!key || tagState[type].has(key)) return;
  tagState[type].set(key, prettifyTag(label));
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
  container.querySelectorAll("button").forEach((button) => {
    const key = normalize(button.textContent);
    button.classList.toggle("active", tagState[type].has(key));
  });
}

function hydratePreferenceSelect(category) {
  const select = document.getElementById("preferenceSelect");
  if (!select) return;
  select.innerHTML = "";
  (CATEGORY_OPTIONS[category] || []).forEach((option) => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    select.appendChild(element);
  });
}

function renderCategoryMatches(category) {
  const container = document.getElementById("categoryMatches");
  const select = document.getElementById("preferenceSelect");
  if (!container || !select) return;
  const preference = select.value || "all";
  const profile = loadProfile();
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

  matches.forEach((match) => {
    const score = calculateScore(match, profile, preference);
    container.appendChild(buildMatchCard(match, score));
  });
  setStatusMessage("categoryStatus", `Showing ${matches.length} match${matches.length > 1 ? "es" : ""}.`);
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

function buildMatchCard(match, score) {
  const article = document.createElement("article");
  article.className = "match-card";
  article.innerHTML = `
    <header>
      <div>
        <p class="eyebrow">${match.category}</p>
        <h3>${match.title}</h3>
      </div>
      <div class="compat-score">${score}%</div>
    </header>
    <div class="compat-meter"><span style="width:${score}%"></span></div>
    <p>${match.summary}</p>
    <ul>
      ${match.details.map((detail) => `<li>${detail}</li>`).join("")}
    </ul>
    <div class="member-stack">
      ${match.members.map((member) => `<span class="member">${member}</span>`).join("")}
    </div>
    <button class="btn btn-primary" data-save-match="${match.id}">Save invite</button>
  `;

  const button = article.querySelector("[data-save-match]");
  button?.addEventListener("click", () => {
    button.textContent = "Saved";
    button.disabled = true;
    button.classList.add("accepted");
    setStatusMessage("categoryStatus", `Saved ${match.title} to your list.`);
  });

  return article;
}

function calculateScore(match, profile, preference) {
  let score = match.baseScore ?? 55;
  score += countOverlap(profile.aboutTags, match.tags) * 4;
  score += countOverlap(profile.lookingTags, match.tags) * 5;
  if (preference !== "all" && match.keywords.includes(preference)) {
    score += 8;
  }
  if (profile.categories?.includes(match.category)) {
    score += 4;
  }
  return Math.min(99, Math.round(score));
}

function countOverlap(source = [], target = []) {
  if (!source?.length || !target?.length) return 0;
  const normalizedTarget = target.map((tag) => normalize(tag));
  return source.reduce((count, tag) => {
    return normalizedTarget.includes(normalize(tag)) ? count + 1 : count;
  }, 0);
}

function normalize(text) {
  return text?.toString().trim().toLowerCase() || "";
}

function prettifyTag(text) {
  return text
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""))
    .join(" ")
    .trim();
}

function setStatusMessage(id, message) {
  const target = document.getElementById(id);
  if (!target) return;
  target.textContent = message;
}

