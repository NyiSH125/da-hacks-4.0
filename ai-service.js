/**
 * AI Service Module for VibeLink
 * Handles Google Gemini API integration for intelligent matching and text analysis
 * Uses Gemini's free tier API
 */

const AI_SERVICE = {
  // API Configuration - NEVER hardcode API keys in frontend code!
  // Use a backend proxy or let users enter their own key
  apiKey: null, // Removed hardcoded key for security
  apiBaseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
  model: "gemini-2.0-flash-exp", // Free tier model, can use "gemini-pro" for stable version
  proxyUrl: null, // Optional: Backend proxy URL to hide API key

  /**
   * Initialize the AI service with API key or proxy
   */
  init(apiKey) {
    // Check for proxy first (most secure)
    this.getApiKeyFromEnv(); // This sets proxyUrl if available
    
    if (this.proxyUrl) {
      console.log("AI Service: Using secure proxy (API key hidden on server)", this.proxyUrl);
      // Set a flag to indicate proxy is configured (so checks for apiKey don't fail)
      this.apiKey = "PROXY_MODE"; // Special flag to indicate proxy mode
      return true;
    }
    
    // Fallback to user's API key
    this.apiKey = apiKey || this.getApiKeyFromEnv();
    if (!this.apiKey) {
      console.warn("AI Service: No API key or proxy configured. AI features will be disabled.");
      return false;
    }
    return true;
  },

  /**
   * Get API key from environment or localStorage
   * SECURITY: Never hardcode keys - users should enter their own
   */
  getApiKeyFromEnv() {
    // Check for proxy URL first (most secure)
    const proxyMeta = document.querySelector('meta[name="vibelink-gemini-proxy"]')?.content;
    const proxyEnv = window.VIBELINK_GEMINI_PROXY;
    if (proxyMeta || proxyEnv) {
      this.proxyUrl = proxyMeta || proxyEnv;
      return null; // No API key needed when using proxy
    }
    
    // Check localStorage (user-entered key)
    const stored = localStorage.getItem("vibelink-gemini-key");
    if (stored) return stored;
    
    // No key found - user must enter their own
    return null;
  },

  /**
   * Save API key securely (in production, use backend)
   */
  saveApiKey(apiKey) {
    localStorage.setItem("vibelink-gemini-key", apiKey);
    this.apiKey = apiKey;
  },

  /**
   * Make API call to Google Gemini
   * SECURE: Uses proxy if available, otherwise requires user's API key
   */
  async callAPI(messages, options = {}) {
    // SECURITY: Prefer proxy over direct API key
    if (this.proxyUrl) {
      return this.callAPIviaProxy(messages, options);
    }

    // Fallback: Direct API call (requires user's own API key)
    if (!this.apiKey || this.apiKey === "PROXY_MODE") {
      throw new Error("Google Gemini API key not configured. Please set your API key or configure a proxy.");
    }

    // Convert messages format to Gemini format
    // Gemini expects contents array with role and parts
    const contents = messages.map(msg => ({
      role: msg.role === "system" ? "user" : msg.role, // Gemini doesn't have system role
      parts: [{ text: msg.content }]
    }));

    // If first message is system, prepend it to user message
    if (messages[0]?.role === "system") {
      contents[1].parts[0].text = `${messages[0].content}\n\n${contents[1].parts[0].text}`;
      contents.shift(); // Remove system message
    }

    const model = options.model || this.model;
    const url = `${this.apiBaseUrl}/${model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.max_tokens || 1000,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      throw new Error(`Gemini API Error: ${error.error?.message || response.statusText || "Unknown error"}`);
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error("Unexpected response format from Gemini API");
  },

  /**
   * SECURE: Make API call via backend proxy (hides API key)
   * Includes retry logic for rate limiting (429 errors) with exponential backoff
   */
  async callAPIviaProxy(messages, options = {}, retryCount = 0) {
    const model = options.model || this.model;
    const maxRetries = 3;
    // Exponential backoff: 3s, 6s, 12s for 429 errors
    const baseDelay = 3000;
    const retryDelay = baseDelay * Math.pow(2, retryCount);
    
    // Convert messages format
    const contents = messages.map(msg => ({
      role: msg.role === "system" ? "user" : msg.role,
      parts: [{ text: msg.content }]
    }));

    if (messages[0]?.role === "system") {
      contents[1].parts[0].text = `${messages[0].content}\n\n${contents[1].parts[0].text}`;
      contents.shift();
    }

    const requestBody = {
      model: model,
      contents: contents,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.max_tokens || 1000,
      },
    };

    try {
      // Call your backend proxy (API key is on server, not exposed)
      const response = await fetch(this.proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Handle rate limiting (429) with exponential backoff
      if (response.status === 429) {
        if (retryCount < maxRetries) {
          console.warn(`Rate limited (429). Retrying in ${retryDelay/1000}s... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return this.callAPIviaProxy(messages, options, retryCount + 1);
        } else {
          // After max retries, throw user-friendly error
          throw new Error("AI service is temporarily busy due to high demand. Please wait a moment and try again.");
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
        const errorMsg = error.error?.message || response.statusText || "Unknown error";
        throw new Error(`Proxy API Error: ${errorMsg}`);
      }

      const data = await response.json();
      return data.text || data.response || data.content;
    } catch (error) {
      // If it's already our custom error message, re-throw it
      if (error.message.includes("temporarily busy") || error.message.includes("429")) {
        throw error;
      }
      
      // If it's a network error and we haven't exceeded retries, try again
      if (retryCount < maxRetries) {
        console.warn(`Network error. Retrying in ${retryDelay/1000}s... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.callAPIviaProxy(messages, options, retryCount + 1);
      }
      throw error;
    }
  },

  /**
   * Analyze user profile and extract insights
   */
  async analyzeProfile(profile) {
    const prompt = `Analyze this user profile and extract key insights about their personality, preferences, and matching needs.

Profile Data:
- Name: ${profile.fullName || profile.displayName || "Anonymous"}
- Bio: ${profile.bio || "No bio provided"}
- About-Me Tags: ${profile.aboutTags?.join(", ") || "None"}
- Looking-For Tags: ${profile.lookingTags?.join(", ") || "None"}
- Selected Categories: ${profile.categories?.join(", ") || "None"}

Provide a JSON response with:
1. personality_traits: Array of 3-5 key personality traits inferred
2. preferences: Array of preferences and interests
3. matching_priorities: What they value most in matches (3-5 items)
4. lifestyle_patterns: Daily routines, schedules, habits inferred
5. communication_style: How they likely communicate (brief, detailed, casual, formal)
6. deal_breakers: Potential incompatibilities to avoid

Return ONLY valid JSON, no additional text.`;

    try {
      const response = await this.callAPI([
        {
          role: "user",
          content: `You are an expert at analyzing user profiles for social matching. Extract insights and return structured JSON data only.\n\n${prompt}`,
        },
      ]);

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error("Profile analysis error:", error);
      return null;
    }
  },

  /**
   * Analyze natural language text input for preferences
   */
  async analyzeTextInput(text, context = {}) {
    const prompt = `Analyze this user's natural language input about their preferences and extract structured information.

User Input: "${text}"
Context: ${context.category ? `Category: ${context.category}` : ""} ${context.preference ? `Preference: ${context.preference}` : ""}

Extract and return JSON with:
1. extracted_tags: Array of relevant tags/keywords
2. preferences: Specific preferences mentioned
3. requirements: Any requirements or deal-breakers
4. sentiment: Overall sentiment (positive/neutral/negative)
5. intent: What they're looking for (study buddy, roommate, gaming partner, etc.)

Return ONLY valid JSON, no additional text.`;

    try {
      const response = await this.callAPI([
        {
          role: "user",
          content: `You extract structured data from natural language user inputs for matching purposes. Return JSON only.\n\n${prompt}`,
        },
      ]);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error("Text analysis error:", error);
      return null;
    }
  },

  /**
   * Generate intelligent match scores using AI
   */
  async generateMatchScore(userProfile, matchProfile, category, preference) {
    const prompt = `You are a matching algorithm for a social connection app. Calculate compatibility between a user and a potential match.

User Profile:
- Bio: ${userProfile.bio || "Not provided"}
- About-Me Tags: ${userProfile.aboutTags?.join(", ") || "None"}
- Looking-For Tags: ${userProfile.lookingTags?.join(", ") || "None"}
- Categories: ${userProfile.categories?.join(", ") || "None"}

Match Profile:
- Title: ${matchProfile.title}
- Summary: ${matchProfile.summary}
- Tags: ${matchProfile.tags?.join(", ") || "None"}
- Details: ${matchProfile.details?.join("; ") || "None"}
- Members: ${matchProfile.members?.join(", ") || "None"}

Category: ${category}
Preference: ${preference}

Analyze compatibility and return JSON with:
1. compatibility_score: Number 0-100
2. match_reasons: Array of 3-5 reasons why they're compatible
3. potential_concerns: Array of any potential issues or mismatches
4. conversation_starters: Array of 2-3 suggested conversation starters

Return ONLY valid JSON, no additional text.`;

    try {
      const response = await this.callAPI([
        {
          role: "user",
          content: `You are an expert at calculating social compatibility. Analyze profiles and return structured JSON with scores and insights.\n\n${prompt}`,
        },
      ]);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error("Match scoring error:", error);
      return null;
    }
  },

  /**
   * Generate personalized match explanations
   */
  async generateMatchExplanation(userProfile, match, score, aiInsights) {
    const prompt = `Generate a brief, friendly explanation (2-3 sentences) for why this match was suggested to the user.

User's Looking-For Tags: ${userProfile.lookingTags?.join(", ") || "Not specified"}
Match: ${match.title} - ${match.summary}
Compatibility Score: ${score}%
Match Reasons: ${aiInsights?.match_reasons?.join(", ") || "General compatibility"}

Write a natural, encouraging explanation that highlights why this is a good match.`;

    try {
      const response = await this.callAPI(
        [
          {
            role: "user",
            content: `You write friendly, encouraging match explanations for users. Be concise (2-3 sentences) and highlight compatibility.\n\n${prompt}`,
          },
        ],
        { max_tokens: 150 }
      );

      return response.trim();
    } catch (error) {
      console.error("Explanation generation error:", error);
      return `This match aligns with your preferences and has a ${score}% compatibility score.`;
    }
  },

  /**
   * Batch analyze multiple matches efficiently
   */
  async analyzeMatchesBatch(userProfile, matches, category, preference) {
    // For efficiency, analyze top matches only
    const topMatches = matches.slice(0, 5);
    const results = [];

    for (const match of topMatches) {
      try {
        const aiInsights = await this.generateMatchScore(
          userProfile,
          match,
          category,
          preference
        );
        results.push({
          matchId: match.id,
          insights: aiInsights,
        });
      } catch (error) {
        console.error(`Error analyzing match ${match.id}:`, error);
      }
    }

    return results;
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = AI_SERVICE;
}

