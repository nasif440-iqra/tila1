import { useState, useCallback, useEffect, useRef } from "react";
import { LESSONS } from "../data/lessons.js";
import { loadProgress, saveProgress, recalculateWirdOnAppOpen, recordPractice, getTodayDateString, getDayDifference, getCompletedPhaseIntercept, updateLetterSRS } from "../lib/progress.js";

export default function useIqraAppState() {
  // Load and normalize progress on mount
  const savedRef = useRef(null);
  if (!savedRef.current) {
    const raw = loadProgress();
    const { result, changed } = recalculateWirdOnAppOpen(raw);
    if (changed) {
      saveProgress({
        onboarded: result.onboarded,
        progress: result.progress,
        completedLessonIds: result.completedLessonIds,
        lessonsCompleted: result.lessonsCompleted,
        lastCompletedLessonId: result.lastCompletedLessonId,
        lastPracticeDate: result.lastPracticeDate,
        currentWird: result.currentWird,
        longestWird: result.longestWird,
        todayLessonCountDate: result.todayLessonCountDate,
        todayLessonCount: result.todayLessonCount,
      });
    }
    savedRef.current = result;
  }
  const saved = savedRef.current;

  // Determine if we should show the return-user hadith interstitial
  const shouldShowHadith = () => {
    if (!saved.lastPracticeDate) return false;
    const today = getTodayDateString();
    const gap = getDayDifference(today, saved.lastPracticeDate);
    if (gap < 1) return false;
    const lastShown = localStorage.getItem("lastHadithInterstitialDate");
    if (lastShown === today) return false;
    return true;
  };

  const initialScreen = shouldShowHadith() ? "returnHadith" : "home";

  const [progress, setProgress] = useState(saved.progress);
  const [completedLessonIds, setCompletedLessonIds] = useState(saved.completedLessonIds);
  const [lessonsCompleted, setLessonsCompleted] = useState(saved.lessonsCompleted);
  const [lastCompletedLesson, setLastCompletedLesson] = useState(
    saved.lastCompletedLessonId ? LESSONS.find(l => l.id === saved.lastCompletedLessonId) || null : null
  );
  const [wirdState, setWirdState] = useState({
    lastPracticeDate: saved.lastPracticeDate,
    currentWird: saved.currentWird,
    longestWird: saved.longestWird,
    todayLessonCountDate: saved.todayLessonCountDate,
    todayLessonCount: saved.todayLessonCount,
  });
  const [phaseCompleteData, setPhaseCompleteData] = useState(null);

  const hasCompletedOnboarding = saved.onboarded || localStorage.getItem("hasCompletedOnboarding") === "true";

  // Persist state changes
  useEffect(() => {
    saveProgress({
      onboarded: hasCompletedOnboarding,
      progress,
      completedLessonIds,
      lessonsCompleted,
      lastCompletedLessonId: lastCompletedLesson?.id || null,
      ...wirdState,
    });
  }, [hasCompletedOnboarding, progress, completedLessonIds, lessonsCompleted, lastCompletedLesson, wirdState]);

  const handleLessonComplete = useCallback((lessonId, quizResults, speakResults) => {
    let hasPhaseIntercept = false;

    // Only track numeric lesson IDs in completedLessonIds (skip "review" etc.)
    if (typeof lessonId === "number") {
      setCompletedLessonIds(prev => {
        const newIds = prev.includes(lessonId) ? prev : [...prev, lessonId];

        if (!prev.includes(lessonId)) {
          const intercept = getCompletedPhaseIntercept(prev, newIds);
          if (intercept) {
            hasPhaseIntercept = true;
            setPhaseCompleteData(intercept);
          }
        }

        return newIds;
      });
    }

    setProgress(prev => {
      const next = { ...prev };
      const today = getTodayDateString();

      // Update per-question stats
      for (const r of quizResults) {
        const ex = next[r.targetId] || { correct: 0, attempts: 0 };
        next[r.targetId] = { ...ex, correct: (ex.correct ?? 0) + (r.correct ? 1 : 0), attempts: (ex.attempts ?? 0) + 1 };
      }

      // Compute per-letter session outcome for SRS: majority correct = true
      const letterOutcomes = {};
      for (const r of quizResults) {
        if (!letterOutcomes[r.targetId]) letterOutcomes[r.targetId] = { correct: 0, total: 0 };
        letterOutcomes[r.targetId].total++;
        if (r.correct) letterOutcomes[r.targetId].correct++;
      }

      // Update SRS for each letter that appeared
      for (const [id, outcome] of Object.entries(letterOutcomes)) {
        const wasCorrect = outcome.correct > outcome.total / 2;
        next[id] = updateLetterSRS(next[id], wasCorrect, today);
      }

      return next;
    });

    setLessonsCompleted(prev => prev + 1);
    if (typeof lessonId === "number") {
      setLastCompletedLesson(LESSONS.find(l => l.id === lessonId));
    }
    setWirdState(prev => recordPractice(prev));

    return hasPhaseIntercept;
  }, []);

  const handlePhaseCompleteContinue = useCallback(() => {
    setPhaseCompleteData(null);
  }, []);

  const handleDismissHadith = useCallback(() => {
    localStorage.setItem("lastHadithInterstitialDate", getTodayDateString());
  }, []);

  return {
    progress,
    completedLessonIds,
    lessonsCompleted,
    lastCompletedLesson,
    wirdState,
    phaseCompleteData,
    initialScreen,
    hasCompletedOnboarding,
    handleLessonComplete,
    handlePhaseCompleteContinue,
    handleDismissHadith,
  };
}
