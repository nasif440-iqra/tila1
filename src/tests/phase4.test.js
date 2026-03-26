import { describe, it, expect } from "vitest";
import { LESSONS, PHASE_3_COMPLETION_THRESHOLD } from "../data/lessons.js";
import { getLetter } from "../data/letters.js";

const phase4Lessons = LESSONS.filter(l => l.phase === 4);

describe("Phase 4 lesson definitions", () => {
  it("has exactly 21 lessons", () => {
    expect(phase4Lessons).toHaveLength(21);
  });

  it("all have phase: 4", () => {
    for (const l of phase4Lessons) {
      expect(l.phase).toBe(4);
    }
  });

  it("all have lessonType: hybrid", () => {
    for (const l of phase4Lessons) {
      expect(l.lessonType).toBe("hybrid");
    }
  });

  it("all have lessonMode: connected-forms", () => {
    for (const l of phase4Lessons) {
      expect(l.lessonMode).toBe("connected-forms");
    }
  });

  it("all have a scaffolding object with guided/buildup/free", () => {
    for (const l of phase4Lessons) {
      expect(l.scaffolding).toBeDefined();
      expect(typeof l.scaffolding.guided).toBe("number");
      expect(typeof l.scaffolding.buildup).toBe("number");
      expect(typeof l.scaffolding.free).toBe("number");
    }
  });

  it("scaffolding values sum to 100 for each lesson", () => {
    for (const l of phase4Lessons) {
      const sum = l.scaffolding.guided + l.scaffolding.buildup + l.scaffolding.free;
      expect(sum).toBe(100);
    }
  });

  it("first lesson is RTL direction (module 4.0)", () => {
    expect(phase4Lessons[0].module).toBe("4.0");
    expect(phase4Lessons[0].title).toContain("Right to Left");
  });

  it("last lesson is mastery check (module 4.20)", () => {
    const last = phase4Lessons[phase4Lessons.length - 1];
    expect(last.module).toBe("4.20");
    expect(last.title).toContain("Mastery");
  });

  it("mastery check teaches all 28 letters", () => {
    const mastery = phase4Lessons.find(l => l.module === "4.20");
    expect(mastery.teachIds).toHaveLength(28);
  });

  it("all teachIds reference valid letters", () => {
    for (const l of phase4Lessons) {
      for (const id of l.teachIds) {
        expect(getLetter(id)).toBeDefined();
      }
    }
  });

  it("breaker lessons (4.14-4.17) teach the 6 non-connectors", () => {
    const breakerLessons = phase4Lessons.filter(l =>
      ["4.14", "4.15", "4.16", "4.17"].includes(l.module)
    );
    const allBreakers = new Set(breakerLessons.flatMap(l => l.teachIds));
    expect([...allBreakers].sort((a, b) => a - b)).toEqual([1, 8, 9, 10, 11, 27]);
  });

  it("unique lesson IDs with no collisions", () => {
    const allIds = LESSONS.map(l => l.id);
    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });

  it("Phase 4 lessons appear after all Phase 3 lessons in array order", () => {
    let lastPhase3Idx = -1;
    let firstPhase4Idx = -1;
    for (let i = 0; i < LESSONS.length; i++) {
      if (LESSONS[i].phase === 3) lastPhase3Idx = i;
      if (LESSONS[i].phase === 4 && firstPhase4Idx === -1) firstPhase4Idx = i;
    }
    expect(firstPhase4Idx).toBeGreaterThan(lastPhase3Idx);
  });
});

describe("Phase 3 completion threshold", () => {
  it("is 12", () => {
    expect(PHASE_3_COMPLETION_THRESHOLD).toBe(12);
  });
});
