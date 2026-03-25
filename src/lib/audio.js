let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  return audioCtx;
}

function playTone(f, d, t = "sine", v = 0.12) {
  const c = getAudioCtx(); if (!c) return;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = t; o.frequency.value = f; g.gain.value = v;
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
  o.connect(g); g.connect(c.destination);
  o.start(c.currentTime); o.stop(c.currentTime + d);
}

function playChord(a, b, d, v = 0.07) {
  const c = getAudioCtx(); if (!c) return;
  [a, b].forEach(f => {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "sine"; o.frequency.value = f; g.gain.value = v;
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime); o.stop(c.currentTime + d);
  });
}

// --- SFX ---
export function sfxTap() { playTone(880, 0.04, "sine", 0.04); }
export function sfxCorrect() { playChord(523, 659, 0.12, 0.07); setTimeout(() => playChord(659, 784, 0.14, 0.07), 100); setTimeout(() => playChord(784, 1047, 0.18, 0.08), 200); }
export function sfxWrong() { playTone(300, 0.18, "triangle", 0.05); setTimeout(() => playTone(260, 0.2, "triangle", 0.04), 120); }
export function sfxStreak() { playTone(784, 0.08, "sine", 0.06); setTimeout(() => playTone(1047, 0.08, "sine", 0.06), 70); setTimeout(() => playTone(1318, 0.12, "sine", 0.07), 140); }
export function sfxRecord() { playTone(440, 0.08, "sine", 0.06); }
export function sfxComplete() { playChord(523, 659, 0.14, 0.06); setTimeout(() => playChord(659, 784, 0.14, 0.06), 120); setTimeout(() => playChord(784, 1047, 0.14, 0.07), 240); setTimeout(() => playChord(1047, 1318, 0.22, 0.08), 360); }
export function sfxTransition() { playChord(440, 554, 0.2, 0.04); setTimeout(() => playChord(554, 659, 0.25, 0.05), 150); }

// --- Streak tier SFX ---
export function sfxStreakTier1() {
  // Single clean chime
  const c = getAudioCtx(); if (!c) return;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = "sine"; o.frequency.value = 880;
  const now = c.currentTime;
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.3, now + 0.005);
  g.gain.setValueAtTime(0.3, now + 0.08);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  o.connect(g); g.connect(c.destination);
  o.start(now); o.stop(now + 0.28);
}

export function sfxStreakTier2() {
  // Two ascending notes 120ms apart with echo
  const c = getAudioCtx(); if (!c) return;
  const now = c.currentTime;
  const playNote = (freq, offset, vol, dur) => {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "sine"; o.frequency.value = freq;
    const t = now + offset;
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.setValueAtTime(vol, t + dur * 0.4);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur);
  };
  playNote(880, 0, 0.3, 0.15);
  playNote(880, 0, 0.15, 0.18); // echo at half volume
  playNote(1100, 0.12, 0.35, 0.2);
  playNote(1100, 0.12, 0.17, 0.24); // echo at half volume
}

export function sfxStreakTier3() {
  // Three ascending notes — mini fanfare + warm harmonic
  const c = getAudioCtx(); if (!c) return;
  const now = c.currentTime;
  const playNote = (freq, offset, vol, dur, type = "sine") => {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.value = freq;
    const t = now + offset;
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.setValueAtTime(vol, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12 + 0.25);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + 0.37);
  };
  playNote(880, 0, 0.3, 0.37);
  playNote(1100, 0.13, 0.35, 0.37);
  playNote(1320, 0.28, 0.4, 0.37);
  playNote(660, 0.28, 0.15, 0.37, "triangle"); // warm harmonic on note 3
}

// --- Audio path resolution ---
// Base filenames shared by both name and sound audio
const LETTER_FILENAMES = {
  1: "alif", 2: "ba", 3: "ta", 4: "thaa", 5: "jeem", 6: "haa", 7: "khaa",
  8: "daal", 9: "dhaal", 10: "ra", 11: "zay", 12: "seen", 13: "sheen",
  14: "saad", 15: "daad", 16: "taa", 17: "dhaa", 18: "ain", 19: "ghain",
  20: "fa", 21: "qaf", 22: "kaf", 23: "laam", 24: "meem", 25: "noon",
  26: "ha", 27: "waw", 28: "ya",
};

// Sound files that differ in filename from the name files
const SOUND_FILENAME_OVERRIDES = {
  4: "tha",   // name: thaa.wav, sound: tha.wav
  23: "lam",  // name: laam.wav, sound: lam.wav
};

// audioType: "name" | "sound"
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

function playSynthesizedFallback(id) {
  const f = 260 + (id * 18);
  playTone(f, 0.3, "sine", 0.1);
  setTimeout(() => playTone(f * 1.5, 0.2, "sine", 0.08), 200);
}

// audioType: "name" (default) | "sound"
// When audioType is "sound" and audio is missing, does NOT fall back to name audio.
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
      playSynthesizedFallback(id);
    });
    a.addEventListener("ended", () => {
      if (currentLetterAudio === a) currentLetterAudio = null;
    });
  } else {
    if (audioType === "sound") {
      console.warn(`No sound audio path for letter ${id}, skipping playback.`);
      return;
    }
    playSynthesizedFallback(id);
  }
}
