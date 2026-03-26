import { describe, it, expect } from "vitest";
import { buildLessonStages, advanceStage, computeHybridProgress } from "../components/lesson/useLessonHybrid.js";

// ── buildLessonStages ──────────────────────────────────────────────────────────

describe("buildLessonStages", () => {
  it("tags guided_reveal exercises as 'guided'", () => {
    const exercises = [{ type: "guided_reveal", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("guided");
  });

  it("tags form_intro exercises as 'guided'", () => {
    const exercises = [{ type: "form_intro", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("guided");
  });

  it("tags letter_in_context exercises as 'guided'", () => {
    const exercises = [{ type: "letter_in_context", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("guided");
  });

  it("tags tap_in_order exercises as 'guided'", () => {
    const exercises = [{ type: "tap_in_order", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("guided");
  });

  it("tags buildup exercises as 'buildup'", () => {
    const exercises = [{ type: "buildup", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("buildup");
  });

  it("tags buildup_pair exercises as 'buildup'", () => {
    const exercises = [{ type: "buildup_pair", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("buildup");
  });

  it("tags buildup_word exercises as 'buildup'", () => {
    const exercises = [{ type: "buildup_word", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("buildup");
  });

  it("tags free_read exercises as 'free'", () => {
    const exercises = [{ type: "free_read", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("free");
  });

  it("tags comprehension exercises as 'free'", () => {
    const exercises = [{ type: "comprehension", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("free");
  });

  it("tags spot_the_break exercises as 'free'", () => {
    const exercises = [{ type: "spot_the_break", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("free");
  });

  it("defaults unknown types to 'guided'", () => {
    const exercises = [{ type: "totally_unknown_type", id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("guided");
  });

  it("handles an empty array", () => {
    const result = buildLessonStages([]);
    expect(result).toEqual([]);
  });

  it("preserves all original exercise fields", () => {
    const exercises = [{ type: "guided_reveal", id: 42, arabic: "ب", extra: true }];
    const result = buildLessonStages(exercises);
    expect(result[0].id).toBe(42);
    expect(result[0].arabic).toBe("ب");
    expect(result[0].extra).toBe(true);
    expect(result[0].stage).toBe("guided");
  });

  it("does not mutate the original exercises array", () => {
    const exercises = [{ type: "buildup", id: 1 }];
    buildLessonStages(exercises);
    expect(exercises[0].stage).toBeUndefined();
  });

  it("handles a mixed array of all three stages", () => {
    const exercises = [
      { type: "guided_reveal" },
      { type: "buildup_pair" },
      { type: "free_read" },
      { type: "form_intro" },
      { type: "buildup_word" },
      { type: "spot_the_break" },
    ];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("guided");
    expect(result[1].stage).toBe("buildup");
    expect(result[2].stage).toBe("free");
    expect(result[3].stage).toBe("guided");
    expect(result[4].stage).toBe("buildup");
    expect(result[5].stage).toBe("free");
  });

  it("handles exercises with no type field as unknown → 'guided'", () => {
    const exercises = [{ id: 1 }];
    const result = buildLessonStages(exercises);
    expect(result[0].stage).toBe("guided");
  });
});

// ── advanceStage ───────────────────────────────────────────────────────────────

describe("advanceStage", () => {
  it("advances the index by 1", () => {
    const { index } = advanceStage(0, 5);
    expect(index).toBe(1);
  });

  it("returns done: false when not at the last exercise", () => {
    const { done } = advanceStage(3, 5);
    expect(done).toBe(false);
  });

  it("returns done: true when advancing past the last exercise", () => {
    // totalExercises = 5, currentIndex = 4 → next index = 5 >= 5 → done
    const { done, index } = advanceStage(4, 5);
    expect(index).toBe(5);
    expect(done).toBe(true);
  });

  it("returns done: true when already past the end", () => {
    const { done } = advanceStage(10, 5);
    expect(done).toBe(true);
  });

  it("returns done: true for a single-exercise lesson at index 0", () => {
    const { index, done } = advanceStage(0, 1);
    expect(index).toBe(1);
    expect(done).toBe(true);
  });

  it("handles advancing from index 0 of a long list", () => {
    const { index, done } = advanceStage(0, 100);
    expect(index).toBe(1);
    expect(done).toBe(false);
  });

  it("handles zero total exercises gracefully", () => {
    const { index, done } = advanceStage(0, 0);
    expect(index).toBe(1);
    expect(done).toBe(true);
  });
});

// ── computeHybridProgress ──────────────────────────────────────────────────────

describe("computeHybridProgress", () => {
  it("returns 0 at the start (index 0)", () => {
    expect(computeHybridProgress(0, 10)).toBe(0);
  });

  it("returns 100 when index equals totalExercises", () => {
    expect(computeHybridProgress(10, 10)).toBe(100);
  });

  it("returns 50 at the midpoint", () => {
    expect(computeHybridProgress(5, 10)).toBe(50);
  });

  it("is proportional in the middle", () => {
    expect(computeHybridProgress(3, 12)).toBeCloseTo(25, 5);
    expect(computeHybridProgress(9, 12)).toBeCloseTo(75, 5);
  });

  it("never exceeds 100", () => {
    expect(computeHybridProgress(15, 10)).toBe(100);
  });

  it("never goes below 0", () => {
    expect(computeHybridProgress(0, 5)).toBeGreaterThanOrEqual(0);
  });

  it("handles zero total exercises without throwing", () => {
    expect(computeHybridProgress(0, 0)).toBe(0);
  });

  it("handles a single-exercise lesson at start", () => {
    expect(computeHybridProgress(0, 1)).toBe(0);
  });

  it("handles a single-exercise lesson at end", () => {
    expect(computeHybridProgress(1, 1)).toBe(100);
  });

  it("returns an integer or float between 0 and 100", () => {
    const pct = computeHybridProgress(7, 20);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
    expect(pct).toBeCloseTo(35, 5);
  });
});
