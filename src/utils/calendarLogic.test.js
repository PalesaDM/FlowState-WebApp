import { describe, expect, test } from "vitest";
import { expandRecurringEvents } from "./calendarLogic";

describe("expandRecurringEvents", () => {
  test("expands a weekly recurring event into the selected range", () => {
    const events = [
      {
        id: 1,
        title: "Weekly Lecture",
        date: "2026-11-02",
        time: "13:00",
        recurrence: "weekly",
        recurrenceEndDate: "2026-11-30",
      },
    ];

    const rangeStart = new Date("2026-11-01T00:00");
    const rangeEnd = new Date("2026-11-30T23:59:59");

    const occurrences = expandRecurringEvents(
      events,
      rangeStart,
      rangeEnd
    );

    expect(occurrences).toHaveLength(5);
    expect(occurrences[0].occurrenceDate).toBe("2026-11-02");
    expect(occurrences[4].occurrenceDate).toBe("2026-11-30");
  });
});