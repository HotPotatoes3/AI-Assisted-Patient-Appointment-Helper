# AI Chatbot Debugging Guide

## If the page goes white or chatbot doesn't work:

### Step 1: Open Browser Console
1. Press `F12` or right-click → "Inspect"
2. Go to the "Console" tab
3. Look for any red error messages

### Step 2: Check for Common Errors

**Error: "OpenRouter API key not configured"**
- Solution: Add your API key to `frontend/.env.local`
  ```
  VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
  ```
- Restart the dev server: `npm run dev`

**Error: "API error: 401"**
- Your API key is invalid or expired
- Get a new one: https://openrouter.ai/keys

**Error: "API error: 429"**
- Rate limit exceeded
- Wait a moment and try again

**Error: "Invalid API response"**
- OpenRouter API returned unexpected format
- Check your API key is correct
- Try a simpler message

### Step 3: Test the Chatbot

1. Click the 🤖 button to open the chatbot
2. Type a simple message like: "Hello"
3. Check the browser console for debug logs:
   - Look for: "Sending message: Hello"
   - Look for: "API Response received:"
   - Look for: "Calling OpenRouter API..."

### Step 4: Debug Information Logged

When you send a message, the console will show:
- ✅ "AIAssistant initialized"
- ✅ "API Key configured: true"
- ✅ "Sending message: [your message]"
- ✅ "Message history: [...]"
- ✅ "Calling OpenRouter API..."
- ✅ "API Response status: 200"
- ✅ "API Response received: [response]"

### Step 5: Check .env.local

Make sure your file looks like this:
```
# OpenRouter API Configuration
# Get your free API key from: https://openrouter.ai/keys
# Paste your API key here after the = sign
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here

# API Base URL (for backend endpoints)
VITE_API_BASE=/api
```

**Important:** 
- The key should start with `sk-or-v1-`
- Do NOT commit .env.local to GitHub
- It's already in .gitignore

### Step 6: Restart Everything

If it's still not working:
```bash
# Stop the dev server (Ctrl+C)
# Stop the backend (Ctrl+C)

# Restart backend:
./gradlew bootRun

# Restart frontend:
cd frontend
npm run dev
```

### Still Not Working?

1. Check that port 3000/3001 is not blocked
2. Make sure `npm install` completed successfully
3. Try clearing browser cache (Ctrl+Shift+Delete)
4. Check console for any React errors
5. Make sure the API key is correct

## OpenRouter Free Model Info

- **Model:** nvidia/nemotron-3-super-120b-a12b:free
- **Features:** Reasoning-enabled (extended thinking)
- **Rate Limit:** Check your account at https://openrouter.ai
- **Costs:** Free tier may have usage limits

## Example Console Output

When everything works, you should see:
```
AIAssistant initialized
API Key configured: true
Sending message: How can I register a patient?
Message history: Array(1)
Calling OpenRouter API...
Request body: {model: "nvidia/nemotron-3-super-120b-a12b:free", messages: Array(2), ...}
API Response status: 200
API Result: {id: "1234...", choices: Array(1), ...}
API Response received: {content: "I can help you register a patient...", reasoning_details: "..."}
```
