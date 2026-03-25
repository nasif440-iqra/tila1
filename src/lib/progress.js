import { LESSONS, PHASE_1_COMPLETION_THRESHOLD, PHASE_2_COMPLETION_THRESHOLD } from "../data/lessons.js";

const STORAGE_KEY = "iqra_progress";

/** Call from browser console: resetProgress() — wipes saved state so the app starts fresh. */
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("lastHadithInterstitialDate");
  location.reload();
}
if (typeof window !== "undefined") window.resetProgress = resetProgress;

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    return data;
  } catch {
    return null;
  }
}

export function loadProgress() {
  const data = loadRaw();
  let completedLessonIds = Array.isArray(data?.completedLessonIds) ? data.completedLessonIds.filter(id => typeof id === "number") : [];

  // Old Phase 2 lived at IDs 14-34, now renumbered to 44-64
  // Old Phase 3 lived at IDs 35-52, now renumbered to 66-83
  // Clear any stored IDs in the old ranges so users aren't marked
  // as having completed lessons that no longer exist at those IDs.
  const OLD_RENUMBERED_IDS = new Set();
  for (let i = 44; i <= 83; i++) OLD_RENUMBERED_IDS.add(i);
  if (completedLessonIds.some(id => OLD_RENUMBERED_IDS.has(id))) {
    console.log("[Iqra] Migrating progress: clearing old lesson IDs 44-83 (Phase 2/3 renumbered).");
    completedLessonIds = completedLessonIds.filter(id => !OLD_RENUMBERED_IDS.has(id));
  }

  return {
    onboarded: data?.onboarded === true,
    progress: (data?.progress && typeof data.progress === "object") ? data.progress : {},
    completedLessonIds,
    lessonsCompleted: typeof data?.lessonsCompleted === "number" ? data.lessonsCompleted : 0,
    lastCompletedLessonId: typeof data?.lastCompletedLessonId === "number" ? data.lastCompletedLessonId : null,
    // Wird & daily tracking — migration-safe defaults
    lastPracticeDate: typeof data?.lastPracticeDate === "string" ? data.lastPracticeDate : null,
    currentWird: typeof data?.currentWird === "number" ? data.currentWird : 0,
    longestWird: typeof data?.longestWird === "number" ? data.longestWird : 0,
    todayLessonCountDate: typeof data?.todayLessonCountDate === "string" ? data.todayLessonCountDate : null,
    todayLessonCount: typeof data?.todayLessonCount === "number" ? data.todayLessonCount : 0,
  };
}

export function saveProgress({ onboarded, progress, completedLessonIds, lessonsCompleted, lastCompletedLessonId, lastPracticeDate, currentWird, longestWird, todayLessonCountDate, todayLessonCount }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      onboarded,
      progress,
      completedLessonIds,
      lessonsCompleted,
      lastCompletedLessonId,
      lastPracticeDate,
      currentWird,
      longestWird,
      todayLessonCountDate,
      todayLessonCount,
    }));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/* ── Date helpers ── */

export function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDayDifference(dateA, dateB) {
  // Parse YYYY-MM-DD strings as local dates and return whole calendar day difference
  const a = new Date(dateA + "T00:00:00");
  const b = new Date(dateB + "T00:00:00");
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

/* ── Wird recalculation on app open ── */

export function recalculateWirdOnAppOpen(prog) {
  const today = getTodayDateString();
  let changed = false;
  let result = { ...prog };

  // Normalize daily lesson count for a new day
  if (result.todayLessonCountDate !== today) {
    result = { ...result, todayLessonCount: 0, todayLessonCountDate: today };
    changed = true;
  }

  // If no practice date recorded yet, nothing to normalize
  if (!result.lastPracticeDate) return { result, changed };

  const gap = getDayDifference(today, result.lastPracticeDate);

  if (gap <= 1) {
    // Practiced today or yesterday — wird unchanged
    return { result, changed };
  }

  // Gap of 2+ days — reset current wird
  if (result.currentWird !== 0) {
    result = { ...result, currentWird: 0 };
    changed = true;
  }

  return { result, changed };
}

/* ── Record practice on lesson completion ── */

export function recordPractice(prog) {
  const today = getTodayDateString();
  let result = { ...prog };

  // Normalize daily count date first
  if (result.todayLessonCountDate !== today) {
    result = { ...result, todayLessonCount: 0, todayLessonCountDate: today };
  }

  // Increment daily lesson count
  result = { ...result, todayLessonCount: result.todayLessonCount + 1 };

  if (!result.lastPracticeDate) {
    // First ever practice
    result = { ...result, lastPracticeDate: today, currentWird: 1, longestWird: Math.max(result.longestWird, 1) };
    return result;
  }

  const gap = getDayDifference(today, result.lastPracticeDate);

  if (gap === 0) {
    // Already practiced today — do NOT increment wird
    result = { ...result, lastPracticeDate: today };
    return result;
  }

  if (gap === 1) {
    // Practiced yesterday — extend wird
    const newWird = result.currentWird + 1;
    result = { ...result, lastPracticeDate: today, currentWird: newWird, longestWird: Math.max(result.longestWird, newWird) };
    return result;
  }

  // Gap 2+ days — restart wird
  result = { ...result, lastPracticeDate: today, currentWird: 1, longestWird: Math.max(result.longestWird, 1) };
  return result;
}

/* ── SRS helpers ── */

function addDateDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const SRS_INTERVALS = { 1: 1, 2: 3, 3: 7, 4: 14 };

/**
 * Pure function: compute the next SRS state for a single letter entry.
 * @param {{ correct: number, attempts: number, lastSeen?: string|null, nextReview?: string|null, intervalDays?: number, sessionStreak?: number }} entry
 * @param {boolean} wasCorrect - whether the user got this letter correct overall in the session
 * @param {string} today - YYYY-MM-DD
 * @returns {object} updated entry
 */
export function updateLetterSRS(entry, wasCorrect, today) {
  const e = {
    correct: entry?.correct ?? 0,
    attempts: entry?.attempts ?? 0,
    lastSeen: entry?.lastSeen ?? null,
    nextReview: entry?.nextReview ?? null,
    intervalDays: entry?.intervalDays ?? 1,
    sessionStreak: entry?.sessionStreak ?? 0,
  };

  if (wasCorrect) {
    e.sessionStreak += 1;
    e.intervalDays = SRS_INTERVALS[e.sessionStreak] ?? 30;
    e.nextReview = addDateDays(today, e.intervalDays);
  } else {
    e.sessionStreak = 0;
    e.intervalDays = 1;
    e.nextReview = today; // due again immediately
  }

  e.lastSeen = today;
  return e;
}

/* ── Phase helpers ── */

const PHASE_META = {
  1: { title: "Letter Recognition", lessons: LESSONS.filter(l => l.phase === 1) },
  2: { title: "Letter Sounds", lessons: LESSONS.filter(l => l.phase === 2) },
  3: { title: "Harakat (Vowels)", lessons: LESSONS.filter(l => l.phase === 3) },
};

export function getAllPhases() {
  return [1, 2, 3].map(p => ({ phase: p, ...PHASE_META[p] }));
}

export function getPhaseByLessonId(lessonId) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  return lesson ? lesson.phase : null;
}

export function getPhaseProgress(completedLessonIds, phaseNum) {
  const meta = PHASE_META[phaseNum];
  if (!meta) return { total: 0, completed: 0 };
  const completed = meta.lessons.filter(l => completedLessonIds.includes(l.id)).length;
  return { total: meta.lessons.length, completed, title: meta.title };
}

export function getCompletedPhaseIntercept(prevCompletedIds, newCompletedIds) {
  // Detect if a phase just became fully complete
  for (const p of [1, 2, 3]) {
    const meta = PHASE_META[p];
    const wasDone = meta.lessons.every(l => prevCompletedIds.includes(l.id));
    const nowDone = meta.lessons.every(l => newCompletedIds.includes(l.id));
    if (!wasDone && nowDone) {
      const nextPhase = p < 3 ? { phase: p + 1, title: PHASE_META[p + 1].title } : null;
      return { phase: p, title: meta.title, nextPhase };
    }
  }
  return null;
}

/* ── Zeigarnik momentum copy ── */

export function getPhaseMomentumCopy(completedLessonIds) {
  // Find the current active phase (first phase not fully complete)
  for (const p of [1, 2, 3]) {
    const meta = PHASE_META[p];
    const done = meta.lessons.filter(l => completedLessonIds.includes(l.id)).length;
    const total = meta.lessons.length;

    if (done >= total) continue; // Phase complete, check next

    const remaining = total - done;
    const nextPhase = p < 3 ? PHASE_META[p + 1].title : null;
    const phaseName = meta.title;

    if (done === 0) return null; // Haven't started — show nothing

    if (remaining === 1) {
      return {
        line1: `One lesson left in ${phaseName}.`,
        line2: nextPhase ? `Finish it to unlock ${nextPhase}.` : "Finish it to complete your journey.",
      };
    }

    if (remaining <= 3) {
      return {
        line1: `You're very close to finishing ${phaseName}.`,
        line2: nextPhase ? `${remaining} lessons left to unlock ${nextPhase}.` : `${remaining} lessons left to complete your journey.`,
      };
    }

    if (done <= 2) {
      return {
        line1: `You've started ${phaseName}.`,
        line2: "Complete a few more lessons to build momentum.",
      };
    }

    return {
      line1: `You're making progress in ${phaseName}.`,
      line2: `${remaining} lessons left to complete this phase.`,
    };
  }

  // All phases done
  return null;
}

export function isLessonUnlocked(lessonIndex, completedLessonIds) {
  if (lessonIndex === 0) return true;
  const cur = LESSONS[lessonIndex];
  const prev = LESSONS[lessonIndex - 1];
  if (!cur || !prev) return false;

  // Phase 2 requires Phase 1 threshold
  if (cur.phase === 2 && prev.phase === 1) {
    const p1Done = LESSONS.filter(l => l.phase === 1 && completedLessonIds.includes(l.id)).length;
    return p1Done >= PHASE_1_COMPLETION_THRESHOLD;
  }

  // Phase 3 requires Phase 2 threshold
  if (cur.phase === 3 && prev.phase === 2) {
    const p2Done = LESSONS.filter(l => l.phase === 2 && completedLessonIds.includes(l.id)).length;
    return p2Done >= PHASE_2_COMPLETION_THRESHOLD;
  }

  return completedLessonIds.includes(prev.id);
}

export function isPhase2Unlocked(completedLessonIds) {
  const p1Done = LESSONS.filter(l => l.phase === 1 && completedLessonIds.includes(l.id)).length;
  return p1Done >= PHASE_1_COMPLETION_THRESHOLD;
}

export function isPhase3Unlocked(completedLessonIds) {
  const p2Done = LESSONS.filter(l => l.phase === 2 && completedLessonIds.includes(l.id)).length;
  return p2Done >= PHASE_2_COMPLETION_THRESHOLD;
}
