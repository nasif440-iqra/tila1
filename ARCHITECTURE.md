# Iqra AI — Architecture & Product Overview

## What Is Iqra AI?

Iqra AI is a progressive, game-based web application that teaches users how to read the Quran in Arabic. "Iqra" means "read" in Arabic — the first word revealed in the Quran. The app targets learners of all ages (children and adults) who want foundational Arabic reading skills, particularly non-native speakers beginning Quranic education.

**Core value proposition:**
- Bite-sized ~2-minute lessons
- Completely free
- Structured, game-based progression
- Audio pronunciation guidance
- Adaptive feedback with visual and audio cues
- No pressure, no judgment — gentle and encouraging tone throughout

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.3 (JSX) + Vite 8 |
| **Backend** | Express.js 5 (Node.js) |
| **Styling** | CSS-in-JS (inline styles) + CSS custom properties |
| **Fonts** | Amiri (Arabic serif), Nunito (English sans-serif) via Google Fonts |
| **Audio** | Pre-recorded WAV files (letter names/sounds) + Web Audio API (SFX) + Google Cloud TTS (harakat) |
| **Persistence** | Browser localStorage (user progress) — no database |
| **External API** | Google Cloud Text-to-Speech (WaveNet, Arabic female voice) |
| **Build** | Vite (dev server + production build to `dist/`) |

---

## Directory Structure

```
src/
├── App.jsx                        # Root component — screen routing logic
├── main.jsx                       # React entry point
├── components/
│   ├── OnboardingScreen.jsx       # First-time welcome experience
│   ├── HomeScreen.jsx             # Main dashboard — phase/lesson selection
│   ├── LessonScreen.jsx           # Quiz engine — intro, questions, summary
│   ├── ProgressScreen.jsx         # Stats & letter mastery grid
│   └── Icons.jsx                  # SVG icon components
├── data/
│   ├── lessons.js                 # 39 lesson definitions (phases, modules, letter IDs)
│   ├── letters.js                 # 28 Arabic letters with metadata
│   └── harakat.js                 # 3 vowel marks + 9 letter-vowel combos
└── lib/
    ├── progress.js                # localStorage read/write for user progress
    ├── audio.js                   # Audio playback (letter names/sounds + synthesized SFX)
    ├── tts.js                     # Google Cloud TTS client (frontend)
    └── questionGenerator.js       # Procedural quiz question generation

server.js                          # Express backend — TTS proxy + static file serving
audio/
├── names/                         # Pre-recorded letter name audio (WAV)
├── sounds/                        # Pre-recorded letter sound audio (WAV)
└── generated/                     # Server-cached TTS audio (MP3)
```

---

## Pedagogical Design

### Three-Phase Curriculum

The app follows a carefully structured 3-phase progression with 39 total lessons. Each phase builds on the previous one, and phases unlock based on completion thresholds.

#### Phase 1: Letter Recognition (13 lessons, 6 modules)

**Goal:** Visually identify all 28 Arabic letters by shape.

**Method:**
- Letters are grouped by visual "families" — letters that share the same base shape but differ by dot count/position (e.g., Ba/Ta/Tha share a shape but have 1 dot below, 2 dots above, and 3 dots above respectively).
- Each lesson teaches 1–3 related letters and uses a `familyRule` to explain the distinguishing pattern (e.g., "How many dots? Where are they?").
- Question types: visual tap recognition, name-to-letter matching, letter-to-name identification, dot-based rules.
- Lessons progress from the simplest letters (Alif — no dots, standalone) to the most complex forms.

**Progression:**
- Module 1.1: Alif → Ba/Ta/Tha
- Module 1.2: Jeem/Haa/Khaa → Dal/Dhal
- Module 1.3: Ra/Zayn → Seen/Sheen
- Module 1.4: Saad/Daad → Taa/Dhaa
- Module 1.5: Ain/Ghayn → Fa/Qaf
- Module 1.6: Kaaf/Laam → Meem/Noon → Ha/Waw/Ya

#### Phase 2: Letter Sounds (20 lessons, 2 modules)

**Goal:** Learn the pronunciation of each letter and distinguish confusable sounds.

**Method:**
- 13 "sound" lessons teach individual letter pronunciations using audio playback.
- 7 "contrast" lessons present confusable sound pairs side-by-side (e.g., Seen vs. Sheen, Saad vs. Seen, heavy vs. light letters).
- Uses a **sound confusion map** to select pedagogically relevant distractors — options in quizzes are chosen from letters that learners commonly confuse.
- Question types: audio-to-letter identification, letter-to-sound matching, contrast discrimination.

**Unlock:** Requires 4 completed Phase 1 lessons.

#### Phase 3: Harakat / Short Vowels (6 lessons, 1 module)

**Goal:** Introduce the three primary short vowel marks (Fatha, Kasra, Damma) and apply them to letters.

**Method:**
- Lesson 1 is a conceptual introduction: "Harakat are vowel marks added to letters — they're not letters themselves."
- Lessons 2–4 apply one vowel at a time to familiar letters (Ba, Ta, Tha).
- Lesson 5 mixes all three vowels on the same letters.
- Lesson 6 is a comprehensive review.
- Uses Google Cloud TTS to generate real Arabic audio for each letter+vowel combination (e.g., "بَ" = "ba").
- Introduces 9 harakat combinations: 3 letters × 3 vowels.

**Unlock:** Requires 6 completed Phase 2 lessons.

### Pedagogical Principles

| Principle | Implementation |
|-----------|---------------|
| **Visual family grouping** | Letters sharing base shapes are taught together so learners internalize the dot-based distinction system |
| **Spaced repetition** | Incorrectly answered questions are recycled to the end of the quiz |
| **Scaffolded difficulty** | Early questions use easy distractors; later questions use visually/phonetically similar options |
| **Multi-modal learning** | Visual shapes + audio pronunciation + written names reinforce each other |
| **Immediate feedback** | Correct/incorrect feedback appears instantly with explanations for wrong answers |
| **Positive reinforcement** | Streak celebrations (3+ correct), mid-quiz celebrations, completion confetti |
| **Low cognitive load** | 2-minute lessons, 5–10 questions each, mobile-friendly large tap targets |
| **Review integration** | Each lesson includes `reviewIds` — previously taught letters mixed in for reinforcement |

---

## User Experience Flow

### 1. Onboarding

When the app loads for the first time (`onboarded: false` in localStorage):

```
┌─────────────────────────────┐
│     بِسْمِ ٱلله              │
│                             │
│         ب                   │  (large animated Arabic letter)
│                             │
│  Learn to read Quran,       │
│     step by step            │
│                             │
│  No pressure. No judgment.  │
│  Just you and the letters.  │
│                             │
│    [ Start learning ]       │
└─────────────────────────────┘
```

- Tapping "Start learning" sets `onboarded: true` and navigates to HomeScreen.
- A soft tap sound plays on interaction.

### 2. Home Screen (Dashboard)

The home screen is the central hub. It shows:

1. **Greeting** — Dynamic based on progress (e.g., "Welcome back!" or first-time greeting).
2. **Continue card** — Shows the last completed lesson and a quick "Continue" button for the next one.
3. **Three expandable phase sections**, each with:
   - Phase title and description
   - Progress bar (e.g., "5 / 13 lessons")
   - Expandable list of lesson cards
   - Lock indicator if phase hasn't been unlocked yet

```
┌─────────────────────────────┐
│  Iqra AI                    │
│  Assalamu Alaikum!          │
│                             │
│  ┌─ Continue ─────────────┐ │
│  │ Lesson 4: Dal & Dhal   │ │
│  │ [ Continue → ]         │ │
│  └────────────────────────┘ │
│                             │
│  ▼ Phase 1: Letter Shapes   │
│    ████████░░░░  5/13       │
│    ├─ ✓ Meet Alif           │
│    ├─ ✓ Ba, Ta, Tha         │
│    ├─ ✓ Jeem, Haa, Khaa     │
│    ├─ ○ Dal & Dhal          │
│    └─ 🔒 Ra & Zayn          │
│                             │
│  ▶ Phase 2: Letter Sounds 🔒│
│  ▶ Phase 3: Harakat      🔒│
│                             │
│  ┌──────┬──────┐            │
│  │ Home │ Progress │        │
│  └──────┴──────┘            │
└─────────────────────────────┘
```

### 3. Lesson Flow

Each lesson has three stages:

#### Stage A: Intro Screen

- Displays the lesson concept and the letters being taught.
- Shows the `familyRule` (e.g., "These letters share the same shape. The dots tell them apart.").
- Large visual examples of the target letters.
- "Let's practice" button to begin the quiz.

#### Stage B: Quiz

- Progress bar at the top shows question count.
- Question prompt (text and/or audio) with animated entrance.
- 3–4 large tappable answer options.
- **On correct answer:**
  - Option turns green with a checkmark, pop animation, and success sound.
  - Auto-advances after 850ms.
  - Streak counter increments; celebration at 3+ streak.
- **On wrong answer:**
  - Selected option turns red with a shake animation and error sound.
  - Correct answer highlights green.
  - Detailed explanation appears (e.g., "That's Jeem (جـ). It has one dot below. Khaa (خـ) has one dot above.").
  - Question is recycled to the end of the quiz for retry.
- **Mid-quiz celebration:** At the halfway mark for lessons with 8+ questions.
- **Audio questions:** A speaker button plays the letter sound; tapping options also plays their sounds.

#### Stage C: Summary

- Animated confetti and completion message.
- Lesson marked as completed in progress.
- "Home" button returns to dashboard.

```
Quiz Flow:
  Intro → Q1 → Q2 → ... → [Mid-celebration] → ... → Qn → Summary
                ↑                                         │
                └──── (recycled wrong answers) ───────────┘
```

### 4. Progress Screen

- **Key metrics:** Letters learned count, phase progress percentages, overall accuracy.
- **Letter mastery grid:** All 28 Arabic letters displayed in a grid.
  - Green: learned (sufficient correct answers)
  - Partial: shows correct/attempts ratio
  - Gray: not yet encountered
- Animated cascade reveal on load.

### 5. Navigation

- **Bottom tab bar** (sticky): Home | Progress
- **Lesson navigation:** Back button returns to home from any lesson stage.
- **Sequential unlock:** Lessons unlock one at a time within a phase (currently all unlocked for testing).
- **Phase gates:** Phase 2 requires 4 Phase 1 completions; Phase 3 requires 6 Phase 2 completions.

---

## Data Models

### Lesson

```js
{
  id: 4,                              // Unique ID
  phase: 1,                           // 1, 2, or 3
  lessonMode: "recognition",          // "recognition" | "sound" | "contrast" | "harakat" | "harakat-intro" | "harakat-mixed"
  module: "1.2",                      // Module grouping
  moduleTitle: "Curves & Cups",       // Human-readable module name
  title: "Dal & Dhal",               // Lesson title
  description: "Two open letters...", // Short description
  teachIds: [8, 9],                   // Letter IDs being taught
  reviewIds: [2, 3, 4],              // Previously learned letter IDs for review
  familyRule: "Same shape, one has a dot", // Teaching principle
  hasSpeaking: false                  // Whether lesson includes speech input
}
```

### Letter

```js
{
  id: 2,                        // 1–28
  letter: "ب",                  // Arabic character
  name: "Ba",                   // English name
  transliteration: "b",         // Latin equivalent
  sound: "Like 'b' in 'ball'", // Pronunciation guide
  tip: "Lips together...",      // Articulation tip
  dots: 1,                      // Dot count (0–3)
  dotPos: "below",              // "none" | "above" | "below"
  family: "ba-group",           // Visual family
  soundHint: "'b' as in ball"   // Short sound description
}
```

### Harakat

```js
// Vowel mark
{ id: "fatha", mark: "َ", name: "Fatha", sound: "a", description: "short 'a' sound", position: "above" }

// Letter + vowel combination
{ id: "ba-fatha", letterId: 2, harakahId: "fatha", display: "بَ", sound: "ba", letterName: "Ba" }
```

### User Progress (localStorage)

```js
{
  onboarded: true,
  progress: {
    2: { correct: 5, attempts: 7 },   // Letter Ba: 5 correct out of 7
    3: { correct: 3, attempts: 3 },   // Letter Ta: 3/3
    // ...
  },
  completedLessonIds: [1, 2, 3],
  lessonsCompleted: 3,
  lastCompletedLessonId: 3
}
```

---

## Audio System

The app uses three distinct audio layers:

### 1. Synthesized Sound Effects (Web Audio API)

Generated on-the-fly using oscillators — no audio files needed:
- `tap` — UI interaction feedback
- `correct` — Success chime
- `wrong` — Error tone
- `streak` — Streak celebration
- `complete` — Lesson completion fanfare
- `transition` — Screen transition

### 2. Pre-recorded Letter Audio (WAV)

56 audio files total (28 letters × 2 types):
- `audio/names/{letter}.wav` — Letter name pronunciation (e.g., "Ba")
- `audio/sounds/{letter}.wav` — Letter sound pronunciation (e.g., the "b" sound)

Played during Phase 1 and Phase 2 lessons. Falls back to a synthesized tone if a file is missing.

### 3. Google Cloud TTS (MP3)

Used in Phase 3 for harakat combinations:
- Frontend calls `/api/tts?text=بَ`
- Express server calls Google Cloud TTS (WaveNet, `ar-XA-Wavenet-A`, female, rate 0.85)
- Response is an MP3 blob, cached both:
  - **Server-side:** file system (`audio/generated/`) with content-hashed filenames
  - **Frontend:** in-memory Map for session reuse

---

## Backend Architecture

The backend is minimal — a single Express server with two endpoints:

### `GET /api/tts?text=<arabic_text>`

- Accepts Arabic text to synthesize
- Checks file cache → returns cached MP3 if available
- Otherwise calls Google Cloud TTS API → caches result → returns MP3
- Response: `audio/mpeg` content type

### `GET /api/health`

- Returns JSON with server status and TTS availability

### Production Serving

In production, Express also serves the Vite-built frontend from `dist/`:
```
Express Server (port 3001)
├── /api/tts      → Google Cloud TTS proxy
├── /api/health   → Health check
└── /*            → Static files from dist/
```

In development, Vite's dev server (port 5173) proxies `/api` requests to Express (port 3001).

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1A8562` | Buttons, success states, learned letters |
| `--primary-light` | `#DAF0E4` | Backgrounds, highlights |
| `--primary-dark` | `#145840` | Hover states |
| `--accent` | `#B8863B` | Gold accents, streak celebrations |
| `--bg` | `#FAF7F2` | Page background (warm beige) |
| `--danger` | `#BD524D` | Error states, wrong answers |
| `--text` | `#2D2D2D` | Primary text |
| `--text-light` | `#6B6B6B` | Secondary text |

### Typography

- **Arabic text:** Amiri (serif) — traditional, elegant Quranic style
- **English text:** Nunito (sans-serif) — friendly, rounded, approachable

### Layout

- Mobile-first: `max-width: 430px`, centered
- Full-screen lesson experience (no distractions)
- Large touch targets for quiz options (minimum 48px)
- Bottom navigation bar (sticky)

### Animations

- `fadeUp` — Content entrance
- `scaleIn` — Element appearance
- `pop` — Correct answer celebration
- `shake` — Wrong answer feedback
- `glowPulse` — Audio button pulsing
- `gentleFloat` — Onboarding letter animation
- `streakBounce` — Streak counter animation

---

## Key Architectural Decisions

1. **No database / no auth** — Prioritizes zero-friction onboarding. Users start learning immediately with no signup. Trade-off: no cross-device sync.

2. **localStorage for progress** — Simple, instant, offline-capable. No network requests for progress tracking.

3. **Procedural question generation** — Questions aren't hand-written; they're generated from lesson definitions + letter metadata + confusion maps. This scales to new lessons without authoring individual questions.

4. **Sound confusion maps** — Distractors in quizzes aren't random. They're chosen from letters that are commonly confused (visually or phonetically), making quizzes pedagogically meaningful.

5. **Server-side TTS caching** — Google Cloud TTS is called once per unique text; results are cached as MP3 files. This minimizes API costs and improves response time.

6. **Hybrid audio strategy** — Pre-recorded WAVs for letter names/sounds (higher quality, offline) + TTS for harakat combos (scalable, avoids recording dozens of combinations).

7. **Phase gating** — Phases unlock progressively to prevent cognitive overload. Learners must demonstrate mastery before advancing.

---

## Current State & Notes

- **39 lessons** are fully defined across 3 phases.
- **Lesson unlocking** is temporarily set to "all unlocked" for testing — the sequential unlock logic exists but is bypassed.
- **Speaking/recording** features are referenced in lesson definitions (`hasSpeaking`) but not yet implemented.
- **No analytics or telemetry** — completely private.
- **Offline capable** for Phase 1 and Phase 2 (pre-recorded audio). Phase 3 requires network for TTS.
