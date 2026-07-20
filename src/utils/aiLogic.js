function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

export function estimateTravelTime(route) {
  const mode = route.transportMode;

  const sameArea =
    route.originAddress &&
    route.destinationAddress &&
    route.originAddress.toLowerCase() ===
      route.destinationAddress.toLowerCase();

  if (sameArea) {
    if (mode === "Walking") return 10;
    if (mode === "Taxi") return 15;
    if (mode === "Car") return 8;
    if (mode === "Bus") return 20;

    return 15;
  }

  if (mode === "Walking") return 35;
  if (mode === "Taxi") return 30;
  if (mode === "Car") return 25;
  if (mode === "Bus") return 45;
  if (mode === "Train") return 50;

  return 30;
}

export function calculateLeaveTime(
  eventDate,
  eventTime,
  travelTime,
  bufferMinutes = 10
) {
  const eventDateTime = new Date(`${eventDate}T${eventTime}`);

  const totalPreparationTime =
    Number(travelTime) + Number(bufferMinutes);

  const leaveDate = new Date(
    eventDateTime.getTime() - totalPreparationTime * 60000
  );

  return leaveDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTodayEvents(events) {
  const today = getTodayDateString();

  return events
    .filter((event) => event.date === today)
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);

      return dateA - dateB;
    });
}

export function getUpcomingEvents(events) {
  const now = new Date();

  return events
    .filter((event) => {
      const eventDateTime = new Date(
        `${event.date}T${event.time}`
      );

      return eventDateTime >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);

      return dateA - dateB;
    });
}

export function getNextEvent(events) {
  return getUpcomingEvents(events)[0] || null;
}

export function findRouteToEvent(routes, event) {
  return routes.find(
    (route) => route.destinationId === event.locationId
  );
}

export function detectScheduleGaps(events) {
  const todayEvents = getTodayEvents(events);
  const gaps = [];

  for (let index = 0; index < todayEvents.length - 1; index += 1) {
    const currentEvent = todayEvents[index];
    const nextEvent = todayEvents[index + 1];

    const currentStart = new Date(
      `${currentEvent.date}T${currentEvent.time}`
    );

    const currentDuration =
      Number(currentEvent.duration) || 60;

    const currentEnd = new Date(
      currentStart.getTime() + currentDuration * 60000
    );

    const nextStart = new Date(
      `${nextEvent.date}T${nextEvent.time}`
    );

    const gapMinutes = Math.floor(
      (nextStart.getTime() - currentEnd.getTime()) / 60000
    );

    if (gapMinutes > 0) {
      gaps.push({
        afterEvent: currentEvent.title,
        beforeEvent: nextEvent.title,
        gapMinutes,
      });
    }
  }

  return gaps;
}

export function detectBackToBackEvents(events) {
  const todayEvents = getTodayEvents(events);
  const conflicts = [];

  for (let index = 0; index < todayEvents.length - 1; index += 1) {
    const currentEvent = todayEvents[index];
    const nextEvent = todayEvents[index + 1];

    const currentStart = new Date(
      `${currentEvent.date}T${currentEvent.time}`
    );

    const currentDuration =
      Number(currentEvent.duration) || 60;

    const currentEnd = new Date(
      currentStart.getTime() + currentDuration * 60000
    );

    const nextStart = new Date(
      `${nextEvent.date}T${nextEvent.time}`
    );

    const gapMinutes = Math.floor(
      (nextStart.getTime() - currentEnd.getTime()) / 60000
    );

    if (gapMinutes >= 0 && gapMinutes <= 15) {
      conflicts.push({
        firstEvent: currentEvent.title,
        secondEvent: nextEvent.title,
        gapMinutes,
      });
    }
  }

  return conflicts;
}

export function calculateDailyWorkload(events) {
  const todayEvents = getTodayEvents(events);
  const eventCount = todayEvents.length;

  if (eventCount >= 6) {
    return {
      level: "High",
      message:
        "Your day is heavily scheduled. Prepare in advance and protect short breaks between commitments.",
    };
  }

  if (eventCount >= 3) {
    return {
      level: "Moderate",
      message:
        "Your day is moderately busy. Prioritise your most important task and prepare for upcoming events.",
    };
  }

  if (eventCount >= 1) {
    return {
      level: "Light",
      message:
        "Your schedule is manageable. You may have time for focused work or personal development.",
    };
  }

  return {
    level: "Open",
    message:
      "Your schedule is open today. Consider planning one meaningful task to maintain momentum.",
  };
}

export function generateProductivityAdvice(events) {
  const todayEvents = getTodayEvents(events);
  const gaps = detectScheduleGaps(events);
  const backToBackEvents = detectBackToBackEvents(events);
  const workload = calculateDailyWorkload(events);

  const advice = [workload.message];

  if (backToBackEvents.length > 0) {
    const firstConflict = backToBackEvents[0];

    advice.push(
      `${firstConflict.firstEvent} and ${firstConflict.secondEvent} are scheduled close together. Prepare what you need in advance and allow time to move between them.`
    );
  }

  const usefulGap = gaps.find(
    (gap) =>
      gap.gapMinutes >= 45 &&
      gap.gapMinutes <= 180
  );

  if (usefulGap) {
    advice.push(
      `You have a ${usefulGap.gapMinutes}-minute gap between ${usefulGap.afterEvent} and ${usefulGap.beforeEvent}. Consider using it for focused work, revision, rest, or a short personal task.`
    );
  }

  if (todayEvents.length === 1) {
    advice.push(
      "You only have one scheduled event today. Use the remaining time for preparation, exercise, study, or another personal priority."
    );
  }

  return advice;
}

export function buildDailyPlan(
  events,
  routes,
  bufferMinutes = 10
) {
  const todayEvents = getTodayEvents(events);

  return todayEvents.map((event) => {
    const matchingRoute = findRouteToEvent(routes, event);

    if (!matchingRoute) {
      return {
        ...event,
        hasRoute: false,
        travelTime: null,
        leaveTime: null,
        message: `You have ${event.title} at ${event.time}, but FlowState needs a saved route to ${event.locationName} before it can estimate your travel time.`,
      };
    }

    const travelTime = estimateTravelTime(matchingRoute);

    const leaveTime = calculateLeaveTime(
      event.date,
      event.time,
      travelTime,
      bufferMinutes
    );

    return {
      ...event,
      hasRoute: true,
      route: matchingRoute,
      travelTime,
      leaveTime,
      message: `Leave by ${leaveTime}. FlowState estimates a ${travelTime}-minute ${matchingRoute.transportMode.toLowerCase()} trip to ${event.locationName}, including a ${bufferMinutes}-minute preparation buffer.`,
    };
  });
}

export function generateAssistantSummary(
  events,
  routes,
  bufferMinutes = 10
) {
  const nextEvent = getNextEvent(events);
  const advice = generateProductivityAdvice(events);
  const workload = calculateDailyWorkload(events);

  if (!nextEvent) {
    return {
      title: "Your schedule is clear",
      message:
        "You have no upcoming events. Consider using the available time to plan your next priority.",
      nextEvent: null,
      leaveTime: null,
      travelTime: null,
      workload,
      advice,
    };
  }

  const matchingRoute = findRouteToEvent(
    routes,
    nextEvent
  );

  if (!matchingRoute) {
    return {
      title: "FlowState Assistant",
      message: `Your next event is ${nextEvent.title} at ${nextEvent.time}. Add a saved route to ${nextEvent.locationName} so FlowState can calculate when you should leave.`,
      nextEvent,
      leaveTime: null,
      travelTime: null,
      workload,
      advice,
    };
  }

  const travelTime = estimateTravelTime(
    matchingRoute
  );

  const leaveTime = calculateLeaveTime(
    nextEvent.date,
    nextEvent.time,
    travelTime,
    bufferMinutes
  );

  return {
    title: "FlowState Assistant",
    message: `Your next event is ${nextEvent.title} at ${nextEvent.time}. Leave by ${leaveTime} for the estimated ${travelTime}-minute journey, with a ${bufferMinutes}-minute preparation buffer included.`,
    nextEvent,
    matchingRoute,
    leaveTime,
    travelTime,
    workload,
    advice,
  };
}