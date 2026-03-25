export { shuffle, pickRandom } from "./shared.js";
export { generateRecognitionQs } from "./recognition.js";
export { generateSoundQs } from "./sound.js";
export { generateContrastQs } from "./contrast.js";
export { generateHarakatIntroQs, generateHarakatQs } from "./harakat.js";
export { getWrongExplanation, getContrastExplanation, getHarakatWrongExplanation } from "./explanations.js";

import { generateRecognitionQs } from "./recognition.js";
import { generateSoundQs } from "./sound.js";
import { generateContrastQs } from "./contrast.js";
import { generateHarakatIntroQs, generateHarakatQs } from "./harakat.js";
import { generateCheckpointQs } from "./checkpoint.js";
import { generateReviewQs } from "./review.js";

export function generateLessonQuestions(lesson, progress) {
  if (lesson.lessonMode === "checkpoint") return generateCheckpointQs(lesson, progress);
  if (lesson.lessonMode === "review") return generateReviewQs(lesson, progress);
  if (lesson.lessonMode === "contrast") return generateContrastQs(lesson);
  if (lesson.lessonMode === "harakat-intro") return generateHarakatIntroQs(lesson);
  if (lesson.lessonMode === "harakat" || lesson.lessonMode === "harakat-mixed") return generateHarakatQs(lesson);
  return lesson.lessonMode === "sound" ? generateSoundQs(lesson) : generateRecognitionQs(lesson);
}
