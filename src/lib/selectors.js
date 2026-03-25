import { LESSONS } from "../data/lessons.js";

export function getCurrentLesson(completedLessonIds) {
  return LESSONS.find(l => !completedLessonIds.includes(l.id)) || LESSONS[LESSONS.length - 1];
}

export function getLearnedLetterIds(completedLessonIds) {
  return [...new Set(
    LESSONS.filter(l => completedLessonIds.includes(l.id)).flatMap(l => l.teachIds || [])
  )];
}

export function getPhaseCounts(completedLessonIds) {
  const p1 = LESSONS.filter(l => l.phase === 1);
  const p2 = LESSONS.filter(l => l.phase === 2);
  const p3 = LESSONS.filter(l => l.phase === 3);
  return {
    p1Done: p1.filter(l => completedLessonIds.includes(l.id)).length,
    p2Done: p2.filter(l => completedLessonIds.includes(l.id)).length,
    p3Done: p3.filter(l => completedLessonIds.includes(l.id)).length,
    p1Total: p1.length,
    p2Total: p2.length,
    p3Total: p3.length,
  };
}

export function getDailyGoal() {
  const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingDailyGoal") : null;
  if (!raw) return 1;
  const minutes = parseInt(raw, 10);
  // "3" -> 1, "5" -> 1, "10" -> 2
  return Math.max(1, Math.round(minutes / 5));
}

export function getCurrentPhase(completedLessonIds) {
  const current = getCurrentLesson(completedLessonIds);
  return current.phase;
}

export function getDueLetters(progress, today) {
  return Object.entries(progress)
    .filter(([id, entry]) => {
      if (!entry?.nextReview) return false;
      if (!entry?.lastSeen) return false;
      return entry.nextReview <= today;
    })
    .map(([id]) => parseInt(id, 10));
}
