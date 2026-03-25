// ── Audio unlock for mobile browsers ──
const audioContext = { unlocked: false };

export function unlockAudio() {
  if (audioContext.unlocked) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume().then(() => ctx.close()).catch(() => {});
  } catch (e) {}
  audioContext.unlocked = true;
}

// ── File-based sound playback ──
function playSound(filename, volume = 1.0) {
  try {
    const audio = new Audio(`/audio/effects/${filename}`);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (e) {}
}

// ── Named SFX exports ──
export function sfxCorrect()           { playSound('correct.wav'); }
export function sfxWrong()             { playSound('wrong.wav'); }
export function sfxComplete()          { playSound('lesson_complete.wav'); }
export function sfxCompletePerfect()   { playSound('lesson_complete_perfect.wav'); }
export function sfxPhaseComplete()     { playSound('phase_complete.wav'); }
export function sfxPhaseUnlock()       { playSound('phase_unlock.wav'); }
export function sfxMidLesson()         { playSound('mid_lesson_celebration.wav'); }
export function sfxStreakTier1()       { playSound('streak_tier1.wav'); }
export function sfxStreakTier2()       { playSound('streak_tier2.wav'); }
export function sfxStreakTier3()       { playSound('streak_tier3.wav'); }
export function sfxOnboardingComplete(){ playSound('onboarding_complete.wav'); }
export function sfxOnboardingAdvance() { playSound('onboarding_advance.wav'); }
export function sfxLessonStart()       { playSound('lesson_start.wav'); }
export function sfxNodeTap()           { playSound('lesson_node_tap.wav'); }
export function sfxAudioButton()       { playSound('audio_play_button.wav'); }
export function sfxTransition()        { playSound('screen_transition.wav'); }
export function sfxReviewDue()         { playSound('review_due.wav'); }
export function sfxWirdMilestone()     { playSound('wird_milestone.wav'); }
export function sfxTap()               { playSound('button_tap.wav'); }

// ── Letter audio (unchanged) ──
const LETTER_FILENAMES = {
  1: "alif", 2: "ba", 3: "ta", 4: "thaa", 5: "jeem", 6: "haa", 7: "khaa",
  8: "daal", 9: "dhaal", 10: "ra", 11: "zay", 12: "seen", 13: "sheen",
  14: "saad", 15: "daad", 16: "taa", 17: "dhaa", 18: "ain", 19: "ghain",
  20: "fa", 21: "qaf", 22: "kaf", 23: "laam", 24: "meem", 25: "noon",
  26: "ha", 27: "waw", 28: "ya",
};

const SOUND_FILENAME_OVERRIDES = {
  4: "tha",
  23: "lam",
};

function getAudioPath(id, audioType) {
  const base = LETTER_FILENAMES[id];
  if (!base) return null;
  if (audioType === "sound") {
    const filename = SOUND_FILENAME_OVERRIDES[id] || base;
    return `audio/sounds/${filename}.wav`;
  }
  return `audio/names/${base}.wav`;
}

let currentLetterAudio = null;

function stopCurrentLetterAudio() {
  if (currentLetterAudio) {
    currentLetterAudio.pause();
    currentLetterAudio.currentTime = 0;
    currentLetterAudio = null;
  }
}

export function playLetterAudio(id, audioType = "name") {
  stopCurrentLetterAudio();
  const src = getAudioPath(id, audioType);
  if (src) {
    const a = new Audio(src);
    currentLetterAudio = a;
    a.play().catch(() => {
      currentLetterAudio = null;
      if (audioType === "sound") {
        console.warn(`Sound audio missing for letter ${id}, no fallback to name audio.`);
        return;
      }
    });
    a.addEventListener("ended", () => {
      if (currentLetterAudio === a) currentLetterAudio = null;
    });
  } else {
    if (audioType === "sound") {
      console.warn(`No sound audio path for letter ${id}, skipping playback.`);
    }
  }
}
