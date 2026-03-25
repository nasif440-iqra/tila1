# Google Cloud TTS Setup for Iqra AI

Phase 3 harakat combo audio uses Google Cloud Text-to-Speech.
This guide covers local development setup.

## Prerequisites

- Node.js 18+
- A Google Cloud account with billing enabled

## Step 1: Enable the API

1. Go to https://console.cloud.google.com
2. Create a project (or use an existing one)
3. Search for "Cloud Text-to-Speech API" in the search bar
4. Click **Enable**

## Step 2: Create credentials

### Option A: Service Account Key (recommended for local dev)

1. In Google Cloud Console, go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Name it `iqra-tts` (or anything you like)
4. Grant the role **Cloud Text-to-Speech User**
5. Click the service account → **Keys** tab → **Add Key** → **Create new key** → **JSON**
6. Save the downloaded file as `google-tts-key.json` in the project root

Then create a `.env` file in the project root:

```
GOOGLE_APPLICATION_CREDENTIALS=./google-tts-key.json
API_PORT=3001
```

### Option B: gcloud CLI (if you have it installed)

```bash
gcloud auth application-default login
```

This stores credentials in your system. No `.env` file needed for auth.

## Step 3: Install dependencies

```bash
npm install
```

## Step 4: Run in development

Open **two terminals**:

**Terminal 1 — API server:**
```bash
npm run dev:server
```
You should see:
```
[Server] API server running on http://localhost:3001
[TTS Server] Google Cloud TTS client initialized and verified
```

**Terminal 2 — Vite frontend:**
```bash
npm run dev
```

Open the URL shown (usually http://localhost:5173).
Navigate to any Phase 3 harakat lesson and tap a combo card to hear audio.

## Step 5: Verify it works

Visit http://localhost:3001/api/health in your browser.
You should see `"ttsAvailable": true`.

## Production

```bash
npm run build
npm start
```

This runs the Express server which serves both the built frontend and the TTS API.

## Costs

Google Cloud TTS pricing (as of 2024):
- Standard voices: free up to 4 million characters/month
- WaveNet voices (used here): free up to 1 million characters/month
- After that: $16 per million characters

Harakat combos are 1-3 characters each. With file caching, each unique combo
is generated only once ever. The current 9 combos cost essentially nothing.

## Troubleshooting

- **"Google Cloud TTS not available"** — Check that your `.env` file exists and `google-tts-key.json` is in the project root
- **"Could not load default credentials"** — The key file path is wrong or the file is invalid
- **Server won't start** — Make sure port 3001 is free, or change `API_PORT` in `.env`
- **Frontend gets 503** — The API server isn't running. Start it with `npm run dev:server`
