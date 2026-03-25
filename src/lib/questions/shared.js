import { ARABIC_LETTERS, getLetter } from "../../data/letters.js";
import { LESSONS } from "../../data/lessons.js";

export function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function pickRandom(a) { return a[Math.floor(Math.random() * a.length)]; }

// Maps letter IDs to IDs they're commonly confused with
export const SOUND_CONFUSION_MAP = {
  2: [3, 4], 3: [2, 4], 4: [2, 3],
  5: [6, 7], 6: [5, 7], 7: [5, 6],
  8: [9], 9: [8],
  10: [11], 11: [10],
  12: [13, 14], 13: [12],
  14: [15, 12], 15: [14],
  16: [17, 3], 17: [16, 9],
  18: [19, 6], 19: [18, 7],
  20: [21], 21: [20],
  22: [21], 23: [10],
  24: [25], 25: [24],
  26: [6, 18], 27: [28], 28: [27],
};

export const SOUND_PROMPTS = {
  audio_to_letter: [
    "Listen carefully \u2014 which letter matches this sound?",
    "Hear the sound and find the right letter",
    "Which letter sounds like this?",
    "Listen \u2014 can you spot the right letter?",
    "Which letter is making this sound?",
  ],
  contrast_audio: [
    "These sound similar \u2014 listen closely",
    "Listen carefully \u2014 which one sounds right?",
    "Can you tell which letter this is?",
    "Tricky pair \u2014 listen and choose",
  ],
  letter_to_sound: [
    "Which sound goes with this letter?",
    "What sound do you recognize for this letter?",
    "Match this letter to its sound",
  ],
  confused_contrast: [
    "These letters sound alike \u2014 listen for the difference",
    "Similar shapes, different sounds \u2014 which one?",
    "Listen and compare \u2014 which letter is it?",
  ],
  contrast_lesson: [
    "These sound similar \u2014 listen closely",
    "One is heavier, one is lighter",
    "Focus on how the sound starts",
    "Listen again and compare",
    "Can you hear the difference?",
    "Pay attention \u2014 which one is it?",
  ],
};

export function getKnownIds(lessonId) {
  const ids = [];
  for (const l of LESSONS) {
    if (l.id >= lessonId) break;
    ids.push(...(l.teachIds || []));
  }
  return [...new Set(ids)];
}

export function getDistractors(tid, pool, cnt) {
  const av = pool.filter(id => id !== tid);
  if (av.length >= cnt) return shuffle(av).slice(0, cnt).map(id => getLetter(id));
  const ex = ARABIC_LETTERS.filter(l => !pool.includes(l.id) && l.id !== tid).slice(0, cnt - av.length);
  return shuffle([...av.map(id => getLetter(id)), ...ex]).slice(0, cnt);
}

export function getConfusionDistractors(tid, pool, cnt) {
  const confusionIds = (SOUND_CONFUSION_MAP[tid] || []).filter(id => pool.includes(id));
  const otherPool = pool.filter(id => id !== tid && !confusionIds.includes(id));
  const picked = [];
  for (const cid of shuffle(confusionIds)) {
    if (picked.length >= cnt) break;
    const l = getLetter(cid);
    if (l) picked.push(l);
  }
  for (const oid of shuffle(otherPool)) {
    if (picked.length >= cnt) break;
    const l = getLetter(oid);
    if (l) picked.push(l);
  }
  if (picked.length < cnt) {
    const extra = ARABIC_LETTERS.filter(l => l.id !== tid && !picked.some(p => p.id === l.id));
    for (const l of shuffle(extra)) {
      if (picked.length >= cnt) break;
      picked.push(l);
    }
  }
  return picked.slice(0, cnt);
}

export function makeOpts(letters, cid) {
  const seen = new Set();
  const u = letters.filter(l => { if (seen.has(l.id)) return false; seen.add(l.id); return true; });
  return shuffle(u.map(l => ({ id: l.id, label: l.letter, isCorrect: l.id === cid })));
}

export function makeNameOpts(letters, cid) {
  const seen = new Set();
  const u = letters.filter(l => { if (seen.has(l.id)) return false; seen.add(l.id); return true; });
  return shuffle(u.map(l => ({ id: l.id, label: l.name, isCorrect: l.id === cid })));
}

export function makeSoundOpts(letters, cid) {
  const seen = new Set();
  const u = letters.filter(l => { if (seen.has(l.id)) return false; seen.add(l.id); return true; });
  return shuffle(u.map(l => ({ id: l.id, label: `"${l.transliteration}"`, sublabel: l.soundHint, isCorrect: l.id === cid })));
}

export function getSoundPrompt(type, hasConfusion) {
  if (hasConfusion && SOUND_PROMPTS.confused_contrast) {
    return pickRandom(SOUND_PROMPTS.confused_contrast);
  }
  return pickRandom(SOUND_PROMPTS[type] || SOUND_PROMPTS.audio_to_letter);
}

export function getLetterSoundPrompt(letter) {
  return pickRandom([
    `What sound does ${letter.name} make?`,
    `This is ${letter.name} \u2014 which sound matches it?`,
    `Which sound belongs to ${letter.name}?`,
    `Pick the sound for ${letter.name}`,
  ]);
}
