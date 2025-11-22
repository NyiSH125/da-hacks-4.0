# AI-Powered Matching Setup Guide

## Overview

VibeLink now includes AI-powered matching that uses **Google Gemini's free API** to:
- Analyze natural language text inputs
- Extract preferences and tags automatically
- Generate intelligent compatibility scores
- Provide match explanations and conversation starters

## Setup Instructions

### 1. Get Your Google Gemini API Key (FREE!)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

**Note:** Gemini offers a generous free tier with no credit card required!

### 2. Configure the API Key

When you first use AI features, you'll be prompted to enter your API key. The key is stored locally in your browser's localStorage and never sent to our servers.

**Alternative:** You can set it programmatically:
```javascript
// In browser console
AI_SERVICE.saveApiKey('your-api-key-here');
AI_SERVICE.init('your-api-key-here');
```

### 3. Using AI Features

#### Natural Language Preferences

On the Profile page, you'll find a new text area: **"Natural language preferences"**

Enter your preferences in plain English, for example:
```
"I want a study buddy who's serious about grades, prefers quiet environments, 
and can meet in the evenings. Someone who's organized and won't flake on study sessions."
```

Click **"Analyze with AI"** to automatically extract tags and preferences.

#### AI-Enhanced Matching

When viewing matches on category pages:
- Matches are automatically analyzed with AI if your API key is configured
- Compatibility scores blend traditional matching (30%) with AI analysis (70%)
- Each match includes:
  - **Why this match**: Reasons for compatibility
  - **Conversation starters**: Suggested opening messages
  - **Consider**: Potential concerns or mismatches

## Features

### Text Analysis
- Extracts relevant tags from natural language
- Identifies preferences and requirements
- Understands sentiment and intent

### Intelligent Matching
- Analyzes profile compatibility beyond simple tag matching
- Considers context, lifestyle patterns, and communication styles
- Generates personalized match explanations

### Free Tier Benefits

- **Completely FREE** - No credit card required!
- Uses `gemini-2.0-flash-exp` by default (fast and free)
- Can use `gemini-pro` for more stable results (also free)
- Generous rate limits on free tier
- Each match analysis uses ~500-1000 tokens
- Text analysis uses ~300-500 tokens

**Free tier limits:**
- 15 requests per minute (RPM)
- 1 million tokens per day
- Perfect for development and small to medium apps

## Disabling AI Features

To disable AI features, set in `app.js`:
```javascript
const AI_ENABLED = false;
```

The app will fall back to traditional tag-based matching.

## Troubleshooting

### "AI service not configured"
- Make sure you've entered your API key
- Check that the key is valid (should start with `AIza`)

### "AI analysis failed"
- Verify your API key is correct
- Check that you haven't exceeded free tier rate limits (15 RPM)
- Ensure you have internet connection
- Try using `gemini-pro` instead of `gemini-2.0-flash-exp` if issues persist

### Slow matching
- AI analysis takes 2-5 seconds per match
- Consider analyzing fewer matches at once
- Free tier has rate limits (15 requests per minute)

## Security Notes

- API keys are stored in browser localStorage only
- Keys never leave your browser
- For production, consider using a backend proxy to hide API keys
- Never commit API keys to version control

## Advanced Configuration

Edit `ai-service.js` to customize:
- Model selection (`gemini-2.0-flash-exp`, `gemini-pro`, etc.)
- Temperature (creativity level)
- Max tokens (response length)
- Custom prompts for analysis

**Available Gemini models:**
- `gemini-2.0-flash-exp` - Latest experimental model (fast, free)
- `gemini-pro` - Stable production model (free)
- `gemini-1.5-pro` - More capable (may require paid tier)

