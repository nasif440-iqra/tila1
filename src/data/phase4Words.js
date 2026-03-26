/**
 * Context words for Phase 4 connected forms lessons.
 *
 * Each entry shows a specific letter in a specific position inside a real word.
 * Used in GuidedReveal's contextWord feature to show letters in real-world context.
 *
 * All words are Quranic vocabulary or common Arabic words
 * that would appear in an Islamic learning context.
 *
 * Key format: "letterId:position" where position is initial/medial/final/isolated
 */
export const PHASE4_CONTEXT_WORDS = {
  // Ba (id:2)
  "2:initial": { arabic: "\u0628\u0650\u0633\u0652\u0645\u0650", transliteration: "bismi", meaning: "In the name of", surahRef: "Al-Fatihah 1:1" },
  "2:medial": { arabic: "\u0643\u064E\u0628\u0650\u064A\u0631", transliteration: "kabir", meaning: "Great", surahRef: "Common Quran word" },
  "2:final": { arabic: "\u0643\u064E\u062A\u064E\u0628\u064E", transliteration: "kataba", meaning: "He wrote", surahRef: "Common Quran word" },

  // Ta (id:3)
  "3:initial": { arabic: "\u062A\u064E\u0628\u064E\u0627\u0631\u064E\u0643\u064E", transliteration: "tabaraka", meaning: "Blessed is", surahRef: "Al-Mulk 67:1" },
  "3:medial": { arabic: "\u0643\u064E\u062A\u064E\u0628\u064E", transliteration: "kataba", meaning: "He wrote", surahRef: "Common Quran word" },
  "3:final": { arabic: "\u0628\u064E\u064A\u0652\u062A", transliteration: "bayt", meaning: "House", surahRef: "Common Quran word" },

  // Tha (id:4)
  "4:initial": { arabic: "\u062B\u064F\u0645\u0651\u064E", transliteration: "thumma", meaning: "Then", surahRef: "Common Quran word" },

  // Jeem (id:5)
  "5:initial": { arabic: "\u062C\u064E\u0646\u0651\u064E\u0629", transliteration: "jannah", meaning: "Paradise", surahRef: "Common Quran word" },
  "5:medial": { arabic: "\u0633\u064E\u062C\u064E\u062F\u064E", transliteration: "sajada", meaning: "He prostrated", surahRef: "Common Quran word" },

  // Haa (id:6)
  "6:initial": { arabic: "\u062D\u064E\u0645\u0652\u062F", transliteration: "hamd", meaning: "Praise", surahRef: "Al-Fatihah 1:2" },
  "6:medial": { arabic: "\u0631\u064E\u062D\u0652\u0645\u064E\u0629", transliteration: "rahmah", meaning: "Mercy", surahRef: "Common Quran word" },

  // Khaa (id:7)
  "7:initial": { arabic: "\u062E\u064E\u0644\u064E\u0642\u064E", transliteration: "khalaqa", meaning: "He created", surahRef: "Al-Alaq 96:1" },

  // Seen (id:12)
  "12:initial": { arabic: "\u0633\u064E\u0644\u064E\u0645\u064E", transliteration: "salama", meaning: "Peace", surahRef: "Root of Salaam" },
  "12:medial": { arabic: "\u0628\u0650\u0633\u0652\u0645\u0650", transliteration: "bismi", meaning: "In the name of", surahRef: "Al-Fatihah 1:1" },

  // Sheen (id:13)
  "13:initial": { arabic: "\u0634\u064E\u0645\u0652\u0633", transliteration: "shams", meaning: "Sun", surahRef: "Ash-Shams 91:1" },

  // Saad (id:14)
  "14:initial": { arabic: "\u0635\u064E\u0644\u064E\u0627\u0629", transliteration: "salah", meaning: "Prayer", surahRef: "Common Quran word" },

  // Daad (id:15)
  "15:medial": { arabic: "\u0631\u064E\u0645\u064E\u0636\u064E\u0627\u0646", transliteration: "ramadan", meaning: "Ramadan", surahRef: "Al-Baqarah 2:185" },

  // Taa (id:16)
  "16:medial": { arabic: "\u0645\u064F\u0633\u0652\u0637\u064E\u0641\u064E\u0649", transliteration: "mustafa", meaning: "Chosen one", surahRef: "Common Islamic term" },

  // Ain (id:18)
  "18:initial": { arabic: "\u0639\u064E\u0628\u064E\u062F\u064E", transliteration: "abada", meaning: "He worshipped", surahRef: "Common Quran word" },
  "18:medial": { arabic: "\u0646\u064E\u0639\u0652\u0628\u064F\u062F\u064F", transliteration: "na'budu", meaning: "We worship", surahRef: "Al-Fatihah 1:5" },

  // Ghain (id:19)
  "19:initial": { arabic: "\u063A\u064E\u0641\u064F\u0648\u0631", transliteration: "ghafur", meaning: "Forgiving", surahRef: "Common Quran word" },

  // Fa (id:20)
  "20:initial": { arabic: "\u0641\u064E\u0644\u064E\u0642", transliteration: "falaq", meaning: "Daybreak", surahRef: "Al-Falaq 113:1" },

  // Qaf (id:21)
  "21:initial": { arabic: "\u0642\u064F\u0644\u0652", transliteration: "qul", meaning: "Say", surahRef: "Al-Ikhlas 112:1" },

  // Kaf (id:22)
  "22:initial": { arabic: "\u0643\u064E\u062A\u064E\u0628\u064E", transliteration: "kataba", meaning: "He wrote", surahRef: "Common Quran word" },

  // Lam (id:23)
  "23:initial": { arabic: "\u0644\u064E\u0643\u064F\u0645\u0652", transliteration: "lakum", meaning: "For you", surahRef: "Common Quran word" },
  "23:medial": { arabic: "\u0633\u064E\u0644\u064E\u0645\u064E", transliteration: "salama", meaning: "Peace", surahRef: "Root of Salaam" },

  // Meem (id:24)
  "24:initial": { arabic: "\u0645\u0650\u0646\u0652", transliteration: "min", meaning: "From", surahRef: "Common Quran word (3,226 times)" },
  "24:medial": { arabic: "\u0633\u064E\u0645\u0650\u064A\u0639", transliteration: "sami'", meaning: "All-Hearing", surahRef: "Common Quran word" },

  // Noon (id:25)
  "25:initial": { arabic: "\u0646\u064F\u0648\u0631", transliteration: "nur", meaning: "Light", surahRef: "An-Nur 24:35" },
  "25:medial": { arabic: "\u0623\u064E\u0646\u0652\u0639\u064E\u0645\u0652", transliteration: "an'am", meaning: "He blessed", surahRef: "Al-Fatihah 1:7" },

  // Ha (id:26)
  "26:initial": { arabic: "\u0647\u064F\u0648\u064E", transliteration: "huwa", meaning: "He (is)", surahRef: "Al-Ikhlas 112:1" },
  "26:medial": { arabic: "\u0627\u0644\u0644\u0651\u064E\u0647\u064F", transliteration: "allahu", meaning: "Allah", surahRef: "Throughout the Quran" },

  // Ya (id:28)
  "28:initial": { arabic: "\u064A\u064E\u0648\u0652\u0645", transliteration: "yawm", meaning: "Day", surahRef: "Al-Fatihah 1:4" },
  "28:medial": { arabic: "\u062F\u0650\u064A\u0646", transliteration: "din", meaning: "Religion / Judgement", surahRef: "Al-Fatihah 1:4" },

  // Alif (id:1) — non-connector
  "1:isolated": { arabic: "\u0623\u064E\u062D\u064E\u062F\u064C", transliteration: "ahad", meaning: "One", surahRef: "Al-Ikhlas 112:1" },
  "1:final": { arabic: "\u0642\u064E\u0627\u0644\u064E", transliteration: "qaala", meaning: "He said", surahRef: "Common Quran word" },

  // Daal (id:8) — non-connector
  "8:final": { arabic: "\u0623\u064E\u062D\u064E\u062F\u064C", transliteration: "ahad", meaning: "One", surahRef: "Al-Ikhlas 112:1" },

  // Dhaal (id:9) — non-connector
  "9:isolated": { arabic: "\u0630\u064E\u0644\u0650\u0643\u064E", transliteration: "dhalika", meaning: "That", surahRef: "Al-Baqarah 2:2" },

  // Ra (id:10) — non-connector
  "10:final": { arabic: "\u0646\u064F\u0648\u0631", transliteration: "nur", meaning: "Light", surahRef: "An-Nur 24:35" },

  // Zay (id:11) — non-connector
  "11:final": { arabic: "\u0639\u064E\u0632\u0650\u064A\u0632", transliteration: "aziz", meaning: "Mighty", surahRef: "Common Quran word" },

  // Waw (id:27) — non-connector
  "27:isolated": { arabic: "\u0648\u064E\u0644\u064E\u0645\u0652", transliteration: "walam", meaning: "And not", surahRef: "Al-Ikhlas 112:3" },
};

/**
 * Get a context word for a letter in a specific position.
 * Returns null if no context word is available.
 */
export function getContextWord(letterId, position) {
  return PHASE4_CONTEXT_WORDS[`${letterId}:${position}`] || null;
}

/**
 * Get any available context word for a letter (any position).
 * Prefers initial > medial > final > isolated for connectors.
 */
export function getAnyContextWord(letterId) {
  const preferred = ["initial", "medial", "final", "isolated"];
  for (const pos of preferred) {
    const word = getContextWord(letterId, pos);
    if (word) return { ...word, position: pos };
  }
  return null;
}
