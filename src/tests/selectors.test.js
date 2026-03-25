import { describe, it, expect } from "vitest";
import { getCurrentLesson, getLearnedLetterIds, getPhaseCounts, getDueLetters } from "../lib/selectors.js";

describe("getCurrentLesson", () => {
  it("returns lesson 1 when nothing is completed", () => {
    const result = getCurrentLesson([]);
    expect(result.id).toBe(1);
  });

  it("returns lesson 2 when lesson 1 is completed", () => {
    const result = getCurrentLesson([1]);
    expect(result.id).toBe(2);
  });

  it("skips to the first uncompleted lesson", () => {
    const result = getCurrentLesson([1, 2, 3]);
    expect(result.id).toBe(4);
  });

  it("returns last lesson when all are completed", () => {
    const allIds = Array.from({ length: 83 }, (_, i) => i + 1);
    const result = getCurrentLesson(allIds);
    expect(result.id).toBe(83);
  });
});

describe("getLearnedLetterIds", () => {
  it("returns empty array when nothing completed", () => {
    expect(getLearnedLetterIds([])).toEqual([]);
  });

  it("returns teachIds from completed lessons", () => {
    // Lesson 1 teaches [1] (Alif)
    const result = getLearnedLetterIds([1]);
    expect(result).toContain(1);
  });

  it("deduplicates letter IDs across lessons", () => {
    // Lesson 1 teaches [1], lesson 2 teaches [2], lesson 3 teaches [1,2]
    const result = getLearnedLetterIds([1, 2, 3]);
    expect(result.length).toBe(2); // 1, 2
    expect(new Set(result).size).toBe(result.length); // no dupes
  });
});

describe("getPhaseCounts", () => {
  it("returns all zeros when nothing completed", () => {
    const counts = getPhaseCounts([]);
    expect(counts.p1Done).toBe(0);
    expect(counts.p2Done).toBe(0);
    expect(counts.p3Done).toBe(0);
    expect(counts.p1Total).toBeGreaterThan(0);
  });

  it("counts phase 1 completions correctly", () => {
    const counts = getPhaseCounts([1, 2, 3]);
    expect(counts.p1Done).toBe(3);
    expect(counts.p2Done).toBe(0);
  });

  it("returns correct totals", () => {
    const counts = getPhaseCounts([]);
    expect(counts.p1Total).toBe(43);
    expect(counts.p2Total).toBe(22);
    expect(counts.p3Total).toBe(18);
    expect(counts.p1Total + counts.p2Total + counts.p3Total).toBe(83);
  });
});

describe("getDueLetters", () => {
  it("returns empty array when no progress", () => {
    expect(getDueLetters({}, "2026-03-24")).toEqual([]);
  });

  it("returns empty for letters never seen", () => {
    const progress = {
      1: { correct: 3, attempts: 4, lastSeen: null, nextReview: null, intervalDays: 1, sessionStreak: 0 },
    };
    expect(getDueLetters(progress, "2026-03-24")).toEqual([]);
  });

  it("returns letters whose nextReview is today or earlier", () => {
    const progress = {
      1: { correct: 3, attempts: 4, lastSeen: "2026-03-23", nextReview: "2026-03-24", intervalDays: 1, sessionStreak: 1 },
      2: { correct: 5, attempts: 5, lastSeen: "2026-03-20", nextReview: "2026-03-22", intervalDays: 3, sessionStreak: 2 },
      3: { correct: 2, attempts: 3, lastSeen: "2026-03-24", nextReview: "2026-03-31", intervalDays: 7, sessionStreak: 3 },
    };
    const due = getDueLetters(progress, "2026-03-24");
    expect(due).toContain(1);
    expect(due).toContain(2);
    expect(due).not.toContain(3);
  });

  it("excludes old-format entries without SRS fields", () => {
    const progress = {
      1: { correct: 3, attempts: 4 },
    };
    expect(getDueLetters(progress, "2026-03-24")).toEqual([]);
  });
});
