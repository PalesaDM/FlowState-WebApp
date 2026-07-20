function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

export function estimateTravelTime(route) {
  const mode = route.transportMode;

  const sameArea =
    route.originAddress &&
    route.destinationAddress &&
    route.originAddress.toLowerCase() === route.destinationAddress.toLowerCase();

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

export function calculateLeaveTime(eventDate, eventTime, travelTime) {
  const eventDateTime = new Date(`${eventDate}T${eventTime}`);
  const leaveDate = new Date(eventDateTime.getTime() - travelTime * 60000);

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

export function findRouteToEvent(routes, event) {
  return routes.find((route) => route.destinationId === event.locationId);
}

export function buildDailyPlan(events, routes) {
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
    const leaveTime = calculateLeaveTime(event.date, event.time, travelTime);

    return {
      ...event,
      hasRoute: true,
      route: matchingRoute,
      travelTime,
      leaveTime,
      message: `Leave at ${leaveTime}. FlowState estimates a ${travelTime}-minute ${matchingRoute.transportMode.toLowerCase()} trip to ${event.locationName}.`,
    };
  });
}