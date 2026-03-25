import { getLetter } from "../../data/letters.js";
import { shuffle, getDistractors, makeOpts, makeNameOpts } from "./shared.js";

/**
 * Generate questions for review sessions (spaced repetition).
 * - Use recognition question types (same as Phase 1)
 * - Pull questions from teachIds (the due letter IDs)
 * - Weight toward letters with lower SRS sessionStreak
 * - Generate min(dueCount * 3, 15) questions
 */
export function generateReviewQs(lesson, progress) {
  const dueIds = lesson.teachIds || [];
  const dueCount = dueIds.length;
  const totalQs = Math.min(dueCount * 3, 15);
  const allPool = [...dueIds];
  const qs = [];

  // Weight toward letters with lower sessionStreak
  const weighted = [];
  for (const id of dueIds) {
    const entry = progress?.[id];
    const streak = entry?.sessionStreak ?? 0;
    // Lower streak = more weight
    const weight = streak <= 0 ? 4 : streak <= 1 ? 3 : streak <= 2 ? 2 : 1;
    for (let i = 0; i < weight; i++) weighted.push(id);
  }

  // Build question targets: ensure each due letter appears at least once
  const guaranteed = shuffle([...dueIds]).slice(0, Math.min(dueIds.length, totalQs));
  const remaining = totalQs - guaranteed.length;
  const extra = [];
  for (let i = 0; i < remaining; i++) {
    extra.push(weighted[Math.floor(Math.random() * weighted.length)] ?? dueIds[0]);
  }

  const questionLetterIds = shuffle([...guaranteed, ...extra]);
  const qTypes = ["tap", "name_to_letter", "letter_to_name", "rule", "find"];

  for (let i = 0; i < Math.min(questionLetterIds.length, totalQs); i++) {
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

  return shuffle(qs).slice(0, totalQs);
}
