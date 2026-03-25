import { getLetter } from "../../data/letters.js";
import { shuffle, pickRandom, makeOpts, makeSoundOpts, SOUND_PROMPTS } from "./shared.js";

export function generateContrastQs(lesson) {
  const teach = (lesson.teachIds || []).map(id => getLetter(id));
  const qs = [];

  for (const t of teach) {
    qs.push({ type: "audio_to_letter", prompt: pickRandom(SOUND_PROMPTS.contrast_lesson), targetId: t.id, hasAudio: true, options: makeOpts(teach, t.id) });
  }

  for (const t of teach) {
    qs.push({ type: "letter_to_sound", prompt: t.letter, promptSubtext: pickRandom(SOUND_PROMPTS.contrast_lesson), targetId: t.id, optionMode: "sound", options: makeSoundOpts(teach, t.id) });
  }

  for (const t of shuffle([...teach])) {
    qs.push({ type: "audio_to_letter", prompt: pickRandom(SOUND_PROMPTS.contrast_lesson), targetId: t.id, hasAudio: true, options: makeOpts(teach, t.id) });
  }

  for (const t of teach) {
    qs.push({ type: "letter_to_sound", prompt: t.letter, promptSubtext: `Which sound is ${t.name}?`, targetId: t.id, optionMode: "sound", options: makeSoundOpts(teach, t.id) });
  }

  return qs.slice(0, 6);
}
