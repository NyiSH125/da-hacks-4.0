# da-hacks-4.0
Social Matching App

## 🚀 Quick Start

**IMPORTANT:** This branch requires API key setup. See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed steps.

### Quick Setup (5 minutes)

1. **Get your free Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Create `.env` file** in project root:
   ```bash
   GEMINI_API_KEY=your-api-key-here
   PORT=3001
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the server:**
   ```bash
   npm start
   ```
5. **Open http://localhost:3001** in your browser

**See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for complete setup guide.**

## Features

- **Profile Management**: Create and save your profile with tags and preferences
- **Category Selection**: Choose from Education, Sports, Gaming, and Roommates
- **AI-Powered Matching**: Intelligent matching using Google Gemini API
- **Natural Language Input**: Describe preferences in plain English
- **Tag-Based Matching**: Traditional tag overlap matching (works without AI)
- **Secure Proxy Server**: API key hidden from frontend
- **Intelligent Chat**: AI-powered responses with typing indicators

## AI Features

This app includes AI-powered matching capabilities using **Google Gemini's FREE API**. 

**Setup Required:** Each developer needs their own API key. See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md).

**No credit card required!** Gemini's free tier is perfect for this app.

## Tech Stack

- Vanilla JavaScript
- OpenAI API (GPT-4o-mini)
- LocalStorage for data persistence
- Modern CSS with dark theme
