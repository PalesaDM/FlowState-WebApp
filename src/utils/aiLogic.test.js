import { describe, expect, test } from "vitest";
import {
  calculateLeaveTime,
  detectScheduleGaps,
} from "./aiLogic";
import { toLocalDateString } from "./date";

describe("calculateLeaveTime", () => {
  test("subtracts travel time and buffer correctly", () => {
    const leaveTime = calculateLeaveTime(
      "2026-11-16",
      "09:00",
      25,
      10
    );

    expect(leaveTime).toContain("08:25");
  });
});

describe("detectScheduleGaps", () => {
  test("detects a 60 minute gap between two events", () => {
    const today = toLocalDateString();

    const events = [
      {
        id: 1,
        title: "Gym",
        date: today,
        time: "09:00",
        duration: 120,
      },
      {
        id: 2,
        title: "Lecture",
        date: today,
        time: "12:00",
        duration: 60,
      },
    ];

    const gaps = detectScheduleGaps(events);

    expect(gaps).toHaveLength(1);
    expect(gaps[0].gapMinutes).toBe(60);
  });
});