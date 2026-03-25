import { ARABIC_LETTERS, getLetter } from "../../data/letters.js";
import { shuffle, getDistractors, makeOpts, makeNameOpts } from "./shared.js";

/**
 * Generate questions for checkpoint lessons.
 * - Pull ALL teachIds from lesson (all 28 letters for Phase 1 checkpoint)
 * - Weight toward letters user has struggled with (accuracy < 0.7 or attempts === 0)
 * - Generate 15 questions total
 * - Use only recognition question types
 * - Ensure every letter appears at least once if possible
 */
export function generateCheckpointQs(lesson, progress) {
  const allIds = lesson.teachIds || [];
  const allPool = [...allIds];
  const qs = [];

  // Classify letters by struggle level
  const struggled = [];
  const unseen = [];
  const strong = [];

  for (const id of allIds) {
    const entry = progress?.[id];
    if (!entry || (entry.attempts ?? 0) === 0) {
      unseen.push(id);
    } else if ((entry.correct ?? 0) / (entry.attempts ?? 1) < 0.7) {
      struggled.push(id);
    } else {
      strong.push(id);
    }
  }

  // Build a weighted pool: struggled/unseen letters appear more often
  const weightedPool = [
    ...struggled, ...struggled, ...struggled,
    ...unseen, ...unseen, ...unseen,
    ...strong,
  ];

  // Ensure every letter gets at least one question if possible
  const guaranteed = shuffle([...allIds]).slice(0, Math.min(allIds.length, 15));
  const remaining = 15 - guaranteed.length;

  // Fill remaining slots from weighted pool
  const extra = [];
  for (let i = 0; i < remaining; i++) {
    extra.push(weightedPool[Math.floor(Math.random() * weightedPool.length)] ?? allIds[0]);
  }

  const questionLetterIds = shuffle([...guaranteed, ...extra]);

  // Generate recognition-style questions for each selected letter
  const qTypes = ["tap", "name_to_letter", "letter_to_name", "rule", "find"];

  for (let i = 0; i < Math.min(questionLetterIds.length, 15); i++) {
    const lid = questionLetterIds[i];
    const t = getLetter(lid);
    if (!t) continue;

    const type = qTypes[i % qTypes.length];
    const dists = getDistractors(t.id, allPool, 2);

    if (type === "tap") {
      qs.push({ type: "tap", prompt: `Tap ${t.name}`, targetId: t.id, options: makeOpts([t, ...dists], t.id) });
    } else if (type === "name_to_letter") {
      qs.push({ type: "name_to_letter", prompt: `Which is ${t.name}?`, targetId: t.id, options: makeOpts([t, ...dists], t.id) });
    } else if (type === "letter_to_name") {
      qs.push({ type: "letter_to_name", prompt: t.letter, promptSubtext: "What is this letter?", targetId: t.id, options: makeNameOpts([t, ...dists], t.id) });
    } else if (type === "rule") {
      qs.push({ type: "rule", prompt: t.dots > 0 ? `Which has ${t.visualRule}?` : `Which has no dots?`, targetId: t.id, options: makeOpts([t, ...dists], t.id) });
    } else {
      qs.push({ type: "find", prompt: `Find ${t.name}`, targetId: t.id, options: makeOpts([t, ...dists], t.id) });
    }
  }

  return shuffle(qs).slice(0, 15);
}
