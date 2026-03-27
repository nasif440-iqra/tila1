// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BuildUpReader from "../components/lesson/BuildUpReader.jsx";

// Mock audio modules so tests don't try to play sounds
vi.mock("../lib/tts.js", () => ({
  playGeneratedArabicAudio: vi.fn(() => Promise.resolve()),
}));
vi.mock("../lib/audio.js", () => ({
  playLetterAudio: vi.fn(() => Promise.resolve()),
  sfxTap: vi.fn(),
}));

// Mock framer-motion to avoid animation complexity in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, whileTap, ...rest }) =>
      React.createElement("div", rest, children),
    button: ({ children, initial, animate, exit, transition, whileTap, ...rest }) =>
      React.createElement("button", rest, children),
  },
  AnimatePresence: ({ children }) => children,
}));

describe("BuildUpReader targetId regression", () => {
  const EXERCISE = {
    type: "buildup",
    segments: [
      { arabic: "\u0628\u064E", sound: "ba", letterId: 2 },
      { arabic: "\u0633\u064E", sound: "sa", letterId: 12 },
      { arabic: "\u0645\u064E", sound: "ma", letterId: 24 },
    ],
    fullWord: {
      arabic: "\u0628\u064E\u0633\u064E\u0645\u064E",
      transliteration: "ba-sa-ma",
      ttsText: "\u0628\u064E\u0633\u064E\u0645\u064E",
    },
    explanation: "Test word",
  };

  it("reports the last segment letterId (first revealed in RTL) as targetId on completion", () => {
    const onComplete = vi.fn();
    render(<BuildUpReader exercise={EXERCISE} onComplete={onComplete} />);

    // Advance through all segments: click "Next" for each step until "I can read it"
    const segments = EXERCISE.segments;
    for (let i = 0; i < segments.length - 1; i++) {
      const nextBtn = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextBtn);
    }

    // Now on the full word step — click "I can read it"
    const completeBtn = screen.getByRole("button", { name: /i can read it/i });
    fireEvent.click(completeBtn);

    expect(onComplete).toHaveBeenCalledOnce();
    const payload = onComplete.mock.calls[0][0];
    expect(payload.correct).toBe(true);
    // targetId must be the last segment (first in reading order), NOT segments[0]
    expect(payload.targetId).toBe(segments[segments.length - 1].letterId);
    expect(payload.targetId).toBe(24);
  });
});
