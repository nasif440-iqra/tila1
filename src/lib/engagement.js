/**
 * Engagement Layer — centralized microcopy, companion motif helpers,
 * and progression psychology utilities for Iqra AI.
 *
 * All copy is production-quality, calm, premium, and spiritually aligned.
 * No slang, no childish praise, no arcade language.
 */

// ─── Correct answer microcopy (rotating, per-mode) ─────────────────────────

export const CORRECT_COPY = {
  recognition: [
    "That's right.",
    "You got it.",
    "Correct.",
    "Well spotted.",
    "Exactly right.",
    "You see the difference.",
    "Good eye.",
    "That's the one.",
    "Clear and correct.",
  ],
  sound: [
    "You matched it.",
    "Good ear.",
    "That's the sound.",
    "You recognized it.",
    "Right match.",
    "Your ear is learning.",
    "You can hear it now.",
    "Spot on.",
  ],
  harakat: [
    "You read that.",
    "You heard the vowel.",
    "That's the right sound.",
    "You're reading Arabic sounds.",
    "You matched the mark to the sound.",
    "You can hear the difference.",
    "The vowels are making sense.",
    "That's real reading.",
  ],
};

// ─── Near-miss / wrong answer encouragement ─────────────────────────────────

export const WRONG_ENCOURAGEMENT = [
  "That's a common confusion — look closely.",
  "Almost — the details make the difference.",
  "Close one. Take a careful look.",
  "Not quite — but you're learning the distinction.",
  "This is how you build accuracy.",
  "Good attempt — the difference is subtle.",
];

// ─── Streak microcopy ───────────────────────────────────────────────────────

export const STREAK_COPY = {
  default: [
    "Steady progress",
    "Finding your rhythm",
    "Clear and focused",
    "Building momentum",
    "Confident steps",
  ],
  harakat: [
    "Reading naturally",
    "The vowels are clear",
    "Steady ear",
    "Flowing through",
    "Hearing the patterns",
  ],
};

// ─── Mid-quiz encouragement ─────────────────────────────────────────────────

export const MID_CELEBRATE_COPY = {
  default: [
    "The patterns are becoming familiar",
    "You're building real recognition",
    "This is steady progress",
    "You're seeing the details clearly",
    "Keep this pace — it's working",
  ],
  harakat: [
    "You're reading letter-vowel combinations",
    "The marks are becoming clear",
    "You can hear the differences — real progress",
    "These sounds are becoming natural",
    "You're connecting marks to meaning",
  ],
};

// ─── Completion microcopy ───────────────────────────────────────────────────

export const COMPLETION_HEADLINES = {
  firstLesson: "Your first step",
  perfect: "Flawless.",
  great: "Well done.",
  good: "Solid effort.",
  harakatPerfect: "Every sound, correct.",
  harakatGreat: "Reading with clarity.",
};

export const COMPLETION_SUBLINES = {
  firstLesson: "You've taken the first step in reading Quran.",
  perfect: "Every answer was precise. That's real learning.",
  great: "Strong understanding. The letters are becoming clear.",
  good: "Each attempt sharpens your recognition. Keep going.",
  harakatPerfect: "You matched every mark to its sound.",
  harakatGreat: "The vowels are starting to feel natural.",
};

// ─── Continuation / unlock copy ─────────────────────────────────────────────

export const CONTINUATION_COPY = [
  "Your next step is ready.",
  "The journey continues.",
  "Ready when you are.",
  "One more step forward.",
  "The next lesson builds on this.",
];

export const UNLOCK_COPY = [
  "You've unlocked the next lesson.",
  "A new lesson is now available.",
  "Your progress has opened a new path.",
];

// ─── Islamic closing quotes (expanded) ──────────────────────────────────────

export const CLOSING_QUOTES = [
  "Whoever takes a path seeking knowledge, Allah makes easy a path to Paradise.",
  "A little each day goes a long way.",
  "The one who reads the Quran beautifully will be with noble angels.",
  "Every letter learned is a step on a beautiful path.",
  "Seeking knowledge is an obligation upon every Muslim.",
  "Read, in the name of your Lord who created.",
  "The best among you are those who learn the Quran and teach it.",
  "He who does not give up hope in His mercy is truly blessed.",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export function pickCopy(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns the correct-answer message pool for a given question context.
 */
export function getCorrectPool(isHarakat, isSound) {
  if (isHarakat) return CORRECT_COPY.harakat;
  if (isSound) return CORRECT_COPY.sound;
  return CORRECT_COPY.recognition;
}

/**
 * Returns a completion descriptor based on accuracy and lesson context.
 */
export function getCompletionTier(accuracy, isFirst, isHarakat) {
  if (isFirst) return "firstLesson";
  if (isHarakat) return accuracy === 100 ? "harakatPerfect" : "harakatGreat";
  if (accuracy === 100) return "perfect";
  if (accuracy >= 70) return "great";
  return "good";
}

/**
 * Get the recap text summarizing what was learned in this lesson.
 */
export function getLessonRecap(lesson, teachLetters, lessonCombos) {
  const mode = lesson.lessonMode;
  if (mode === "harakat-intro") {
    return "You learned the three short vowel marks — Fatha, Kasra, and Damma.";
  }
  if (mode === "harakat" || mode === "harakat-mixed") {
    const sounds = lessonCombos.slice(0, 4).map(c => `"${c.sound}"`).join(", ");
    return `You practiced reading: ${sounds}`;
  }
  if (mode === "contrast") {
    const names = teachLetters.map(l => l.name).join(" and ");
    return `You learned to distinguish ${names} by sound.`;
  }
  if (mode === "sound") {
    const names = teachLetters.map(l => l.name).join(", ");
    return `You connected ${names} to ${teachLetters.length === 1 ? "its" : "their"} sound${teachLetters.length > 1 ? "s" : ""}.`;
  }
  // recognition
  const names = teachLetters.map(l => l.name).join(", ");
  return `You learned to recognize ${names}.`;
}
