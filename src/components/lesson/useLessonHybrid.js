import { useState, useCallback } from "react";
import { sfxCorrect, sfxComplete, sfxCompletePerfect, sfxLessonIncomplete } from "../../lib/audio.js";
import { normalizeEntityKey, deriveSkillKeysFromQuestion } from "../../lib/mastery.js";

// ── Stage classification ────────────────────────────────────────────────────

const GUIDED_TYPES = new Set(["guided_reveal", "form_intro", "letter_in_context", "tap_in_order"]);
const BUILDUP_TYPES = new Set(["buildup", "buildup_pair", "buildup_word"]);
const FREE_TYPES = new Set(["free_read", "comprehension", "spot_the_break"]);

/**
 * Tag each exercise with its stage based on type.
 * Guided stage types: guided_reveal, form_intro, letter_in_context, tap_in_order
 * Buildup stage types: buildup, buildup_pair, buildup_word
 * Free stage types: free_read, comprehension, spot_the_break
 * Unknown types default to "guided".
 *
 * Does NOT mutate the original array or exercise objects.
 * @param {Array<{type?: string}>} exercises
 * @returns {Array<{stage: "guided"|"buildup"|"free"}>}
 */
export function buildLessonStages(exercises) {
  return exercises.map((ex) => {
    const type = ex.type;
    let stage;
    if (GUIDED_TYPES.has(type)) {
      stage = "guided";
    } else if (BUILDUP_TYPES.has(type)) {
      stage = "buildup";
    } else if (FREE_TYPES.has(type)) {
      stage = "free";
    } else {
      stage = "guided";
    }
    return { ...ex, stage };
  });
}

/**
 * Advance to the next exercise.
 * @param {number} currentIndex
 * @param {number} totalExercises
 * @returns {{ index: number, done: boolean }}
 */
export function advanceStage(currentIndex, totalExercises) {
  const index = currentIndex + 1;
  const done = index >= totalExercises;
  return { index, done };
}

/**
 * Compute lesson progress as a percentage 0–100.
 * @param {number} currentIndex
 * @param {number} totalExercises
 * @returns {number}
 */
export function computeHybridProgress(currentIndex, totalExercises) {
  if (totalExercises <= 0) return 0;
  return Math.min(100, Math.max(0, (currentIndex / totalExercises) * 100));
}

// ── React hook ─────────────────────────────────────────────────────────────

/**
 * Hook for managing the three-stage hybrid lesson flow used in Phase 4+ lessons.
 * Stages: guided reveal → build-up reading → free reading.
 *
 * @param {{ lesson: object, exercises: Array, onComplete: Function }} params
 */
export default function useLessonHybrid({ lesson, exercises, onComplete }) {
  const [stages] = useState(() => buildLessonStages(exercises));
  const [exIndex, setExIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState("active"); // "active" | "summary"

  const totalExercises = stages.length;
  const currentExercise = stages[exIndex] ?? null;
  const currentStage = currentExercise?.stage ?? "guided";
  const progress = computeHybridProgress(exIndex, totalExercises);

  /**
   * Record a result for the current exercise.
   * Attaches mastery tracking keys (targetKey, skillKeys) if question context is available.
   * @param {{ correct?: boolean, targetId?: any, question?: object, [key: string]: any }} result
   */
  const recordResult = useCallback((result) => {
    const { targetId, question, ...rest } = result;
    const targetKey = targetId != null ? normalizeEntityKey(targetId, question) : null;
    const skillKeys = question ? deriveSkillKeysFromQuestion(question) : [];
    setResults((prev) => [
      ...prev,
      { ...rest, targetId, question, targetKey, skillKeys },
    ]);
    if (result.correct) sfxCorrect();
  }, []);

  /**
   * Advance to the next exercise, or transition to summary when done.
   */
  const advance = useCallback(() => {
    const { index, done } = advanceStage(exIndex, totalExercises);
    if (done) {
      // Pick completion SFX based on accuracy
      const correct = results.filter((r) => r.correct).length;
      const total = results.length;
      const accuracy = total > 0 ? correct / total : 0;
      if (accuracy >= 0.9) {
        sfxCompletePerfect();
      } else if (accuracy >= 0.5) {
        sfxComplete();
      } else {
        sfxLessonIncomplete();
      }
      setPhase("summary");
      if (typeof onComplete === "function") onComplete(results);
    } else {
      setExIndex(index);
    }
  }, [exIndex, totalExercises, results, onComplete]);

  return {
    currentExercise,
    currentStage,
    exIndex,
    totalExercises,
    progress,
    results,
    phase,
    recordResult,
    advance,
  };
}
