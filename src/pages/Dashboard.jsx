import { useState } from "react";
import { getEvents, getRoutes } from "../utils/storage";
import {
  getNextEvent,
  findMatchingRoute,
  generateSuggestion,
} from "../utils/aiLogic";

export default function Dashboard() {
  const [events] = useState(() => getEvents());
  const [routes] = useState(() => getRoutes());

  const nextEvent = getNextEvent(events);
  const matchingRoute = findMatchingRoute(routes, nextEvent);
  const suggestion = generateSuggestion(nextEvent, matchingRoute);

  return (
    <main className="page">
      <section className="dashboard-hero">
        <p className="eyebrow">AI Daily Curator</p>
        <h1>Your FlowState Dashboard</h1>
        <p>
          FlowState reads your saved events and routes, then gives you a clear
          suggestion for what you should prepare for next.
        </p>
      </section>

      <section className="suggestion-card">
        <p className="eyebrow">{suggestion.title}</p>

        {suggestion.leaveTime && (
          <h2>Leave at {suggestion.leaveTime}</h2>
        )}

        <p>{suggestion.message}</p>
      </section>

      {nextEvent && (
        <section className="dashboard-grid">
          <article className="location-card">
            <p className="eyebrow">Next Event</p>
            <h3>{nextEvent.title}</h3>
            <p>
              {nextEvent.date} at {nextEvent.time}
            </p>
            <small>{nextEvent.locationName}</small>
          </article>

          <article className="location-card">
            <p className="eyebrow">Matched Route</p>

            {matchingRoute ? (
              <>
                <h3>
                  {matchingRoute.originName} →{" "}
                  {matchingRoute.destinationName}
                </h3>
                <p>{matchingRoute.transportMode}</p>
                <small>
                  Usual travel time: {matchingRoute.travelTime} minutes
                </small>
              </>
            ) : (
              <p>No matching route has been saved yet.</p>
            )}
          </article>
        </section>
      )}
    </main>
  );
}