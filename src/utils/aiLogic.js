export function getNextEvent(events) {
  const now = new Date();

  const upcomingEvents = events
    .map((event) => ({
      ...event,
      dateTime: new Date(`${event.date}T${event.time}`),
    }))
    .filter((event) => event.dateTime >= now)
    .sort((a, b) => a.dateTime - b.dateTime);

  return upcomingEvents[0] || null;
}

export function findMatchingRoute(routes, nextEvent) {
  if (!nextEvent) return null;

  return routes.find(
    (route) => route.destinationId === nextEvent.locationId
  );
}

export function calculateLeaveTime(eventTime, travelTime) {
  const eventDate = new Date(eventTime);
  const leaveDate = new Date(eventDate.getTime() - travelTime * 60000);

  return leaveDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateSuggestion(nextEvent, matchingRoute) {
  if (!nextEvent) {
    return {
      title: "No upcoming events",
      message:
        "Your day is currently clear. Add an event to let FlowState help plan your next move.",
      leaveTime: null,
    };
  }

  if (!matchingRoute) {
    return {
      title: "Route needed",
      message: `You have ${nextEvent.title} at ${nextEvent.time}, but FlowState does not yet have a saved route to ${nextEvent.locationName}. Add a route so the app can calculate when you should leave.`,
      leaveTime: null,
    };
  }

  const eventDateTime = `${nextEvent.date}T${nextEvent.time}`;
  const leaveTime = calculateLeaveTime(eventDateTime, matchingRoute.travelTime);

  return {
    title: "AI Daily Suggestion",
    leaveTime,
    message: `Leave at ${leaveTime} because ${nextEvent.title} starts at ${nextEvent.time}, and your usual travel time to ${nextEvent.locationName} is ${matchingRoute.travelTime} minutes.`,
  };
}