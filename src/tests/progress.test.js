import { describe, it, expect } from "vitest";
import { getTodayDateString, getDayDifference, recalculateWirdOnAppOpen, recordPractice } from "../lib/progress.js";

describe("getTodayDateString", () => {
  it("returns a valid YYYY-MM-DD string", () => {
    const result = getTodayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getDayDifference", () => {
  it("returns 0 for same day", () => {
    expect(getDayDifference("2024-03-15", "2024-03-15")).toBe(0);
  });

  it("returns 1 for one day apart", () => {
    expect(getDayDifference("2024-03-16", "2024-03-15")).toBe(1);
  });

  it("returns 2 for two days apart", () => {
    expect(getDayDifference("2024-03-17", "2024-03-15")).toBe(2);
  });

  it("returns negative for reversed dates", () => {
    expect(getDayDifference("2024-03-15", "2024-03-17")).toBe(-2);
  });
});

describe("recalculateWirdOnAppOpen", () => {
  const today = getTodayDateString();
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const twoDaysAgo = (() => {
    const d = new Date(); d.setDate(d.getDate() - 2);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  it("does NOT increment wird on app open", () => {
    const prog = { lastPracticeDate: today, currentWird: 3, longestWird: 5, todayLessonCountDate: today, todayLessonCount: 1 };
    const { result } = recalculateWirdOnAppOpen(prog);
    expect(result.currentWird).toBe(3);
  });

  it("preserves wird when practiced yesterday", () => {
    const prog = { lastPracticeDate: yesterday, currentWird: 3, longestWird: 5, todayLessonCountDate: yesterday, todayLessonCount: 2 };
    const { result } = recalculateWirdOnAppOpen(prog);
    expect(result.currentWird).toBe(3);
  });

  it("resets wird when gap >= 2 days", () => {
    const prog = { lastPracticeDate: twoDaysAgo, currentWird: 5, longestWird: 10, todayLessonCountDate: twoDaysAgo, todayLessonCount: 2 };
    const { result } = recalculateWirdOnAppOpen(prog);
    expect(result.currentWird).toBe(0);
    expect(result.longestWird).toBe(10); // preserved
  });

  it("resets todayLessonCount on new day", () => {
    const prog = { lastPracticeDate: yesterday, currentWird: 2, longestWird: 5, todayLessonCountDate: yesterday, todayLessonCount: 3 };
    const { result } = recalculateWirdOnAppOpen(prog);
    expect(result.todayLessonCount).toBe(0);
    expect(result.todayLessonCountDate).toBe(today);
  });
});

describe("recordPractice", () => {
  const today = getTodayDateString();
  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const twoDaysAgo = (() => {
    const d = new Date(); d.setDate(d.getDate() - 2);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  it("increments wird on consecutive day practice", () => {
    const prog = { lastPracticeDate: yesterday, currentWird: 3, longestWird: 5, todayLessonCountDate: today, todayLessonCount: 0 };
    const result = recordPractice(prog);
    expect(result.currentWird).toBe(4);
    expect(result.longestWird).toBe(5);
  });

  it("resets wird after gap of 2+ days", () => {
    const prog = { lastPracticeDate: twoDaysAgo, currentWird: 5, longestWird: 10, todayLessonCountDate: today, todayLessonCount: 0 };
    const result = recordPractice(prog);
    expect(result.currentWird).toBe(1);
    expect(result.longestWird).toBe(10);
  });

  it("does NOT double-increment wird on same day", () => {
    const prog = { lastPracticeDate: today, currentWird: 3, longestWird: 5, todayLessonCountDate: today, todayLessonCount: 1 };
    const result = recordPractice(prog);
    expect(result.currentWird).toBe(3); // unchanged
    expect(result.todayLessonCount).toBe(2); // but lesson count increments
  });

  it("sets wird to 1 on first-ever practice", () => {
    const prog = { lastPracticeDate: null, currentWird: 0, longestWird: 0, todayLessonCountDate: today, todayLessonCount: 0 };
    const result = recordPractice(prog);
    expect(result.currentWird).toBe(1);
    expect(result.longestWird).toBe(1);
  });

  it("updates longestWird when current exceeds it", () => {
    const prog = { lastPracticeDate: yesterday, currentWird: 5, longestWird: 5, todayLessonCountDate: today, todayLessonCount: 0 };
    const result = recordPractice(prog);
    expect(result.currentWird).toBe(6);
    expect(result.longestWird).toBe(6);
  });
});
