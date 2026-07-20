export const CATEGORY_COLORS = {
  "Academic / Work": "#637452",
  "Personal": "#bc967c",
  "Social": "#a3b18a",
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || "#8a8a8a";
}

export function toDateString(date) {
  return date.toISOString().split("T")[0];
}

export function getMonthGridDays(anchorDate) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export function getWeekDates(anchorDate) {
  const day = anchorDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(anchorDate);
  monday.setDate(anchorDate.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Expands base events into virtual occurrences within [rangeStart, rangeEnd].
// Recurring events are never duplicated in storage — only the base event
// persists, occurrences are computed here for display only. Editing or
// deleting any occurrence acts on the base event (the whole series).
export function expandRecurringEvents(events, rangeStart, rangeEnd) {
  const occurrences = [];

  events.forEach((event) => {
    const baseDate = new Date(`${event.date}T00:00`);

    if (!event.recurrence || event.recurrence === "none") {
      if (baseDate >= rangeStart && baseDate <= rangeEnd) {
        occurrences.push({ ...event, occurrenceDate: event.date });
      }
      return;
    }

    const step = event.recurrence === "daily" ? 1 : 7;
    const endLimit = event.recurrenceEndDate
      ? new Date(`${event.recurrenceEndDate}T00:00`)
      : rangeEnd;

    let cursor = new Date(baseDate);
    while (cursor <= rangeEnd && cursor <= endLimit) {
      if (cursor >= rangeStart) {
        occurrences.push({ ...event, occurrenceDate: toDateString(cursor) });
      }
      cursor.setDate(cursor.getDate() + step);
    }
  });

  return occurrences.sort((a, b) => {
    const dateA = new Date(`${a.occurrenceDate}T${a.time}`);
    const dateB = new Date(`${b.occurrenceDate}T${b.time}`);
    return dateA - dateB;
  });
}

export function buildSchedulingInsight(occurrencesInRange) {
  if (occurrencesInRange.length === 0) {
    return "No events in this view yet. Add one to see scheduling insights.";
  }

  const byDay = occurrencesInRange.reduce((acc, o) => {
    acc[o.occurrenceDate] = (acc[o.occurrenceDate] || 0) + 1;
    return acc;
  }, {});

  const [busiestDate, busiestCount] = Object.entries(byDay).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const conflictMap = {};
  occurrencesInRange.forEach((o) => {
    const key = `${o.occurrenceDate}T${o.time}`;
    conflictMap[key] = (conflictMap[key] || 0) + 1;
  });
  const hasConflict = Object.values(conflictMap).some((count) => count > 1);

  let insight = `Your busiest day in this view is ${busiestDate} with ${busiestCount} event${
    busiestCount === 1 ? "" : "s"
  }.`;

  if (hasConflict) {
    insight +=
      " Some events share the exact same date and time — you may want to reschedule one.";
  }

  return insight;
}