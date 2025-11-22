/**
 * SECURE BACKEND PROXY SERVER for VibeLink
 * 
 * This is a Node.js/Express server that hides your API key from the frontend.
 * 
 * SETUP:
 * 1. Install dependencies: npm install express cors dotenv
 * 2. Create .env file with: GEMINI_API_KEY=your-actual-api-key-here
 * 3. Run: node proxy-server.js
 * 4. Update your HTML to use the proxy (see instructions below)
 * 
 * SECURITY:
 * - API key is stored in .env file (never committed to git)
 * - Frontend calls this proxy, proxy calls Gemini
 * - API key never exposed to browser
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to call this
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// SECURE: API key is in .env file, not in code
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not found in .env file!');
  console.error('Create a .env file with: GEMINI_API_KEY=your-key-here');
  process.exit(1);
}

// Simple rate limiting: track requests per minute
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 15; // Gemini free tier allows ~15 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const requests = requestCounts.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return false; // Rate limited
  }
  
  // Add current request
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true; // OK
}

// Proxy endpoint - forwards requests to Gemini API
app.post('/api/gemini', async (req, res) => {
  try {
    // Simple rate limiting (by IP)
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        error: { 
          message: 'Too many requests. Please wait a moment before trying again.',
          code: 'RATE_LIMIT_EXCEEDED'
        } 
      });
    }

    const { model, contents, generationConfig } = req.body;

    if (!model || !contents) {
      return res.status(400).json({ error: 'Missing required fields: model, contents' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: generationConfig || {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      return res.status(response.status).json({ error: error.error?.message || 'Gemini API error' });
    }

    const data = await response.json();
    
    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    res.json({ text, response: text, content: text });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'VibeLink Gemini Proxy is running' });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔒 Secure Gemini Proxy + Static Server running on http://localhost:${PORT}`);
  console.log(`✅ API key is hidden from frontend`);
  console.log(`🌐 Serving HTML files from: ${__dirname}`);
  console.log(`📝 Open http://localhost:${PORT} in your browser`);
});

