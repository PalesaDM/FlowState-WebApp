import { useState } from "react";
import EventForm from "../components/EventForm";
import { getLocations, getEvents, saveEvents } from "../utils/storage";

export default function Calendar() {
  const [locations] = useState(() => getLocations());
  const [events, setEvents] = useState(() => getEvents());

  function handleAddEvent(newEvent) {
    const updatedEvents = [...events, newEvent].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }

  function handleDeleteEvent(id) {
    const updatedEvents = events.filter((event) => event.id !== id);

    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Daily Planning</p>
        <h1>Calendar</h1>
        <p>
          Add your daily commitments and link them to saved locations. FlowState
          will later use these events to curate your day and suggest when to
          leave.
        </p>
      </section>

      {locations.length === 0 ? (
        <p className="empty-state">
          You need to add at least one saved location before creating an event.
        </p>
      ) : (
        <EventForm locations={locations} onAddEvent={handleAddEvent} />
      )}

      <section className="location-list">
        <h2>Your Events</h2>

        {events.length === 0 ? (
          <p className="empty-state">
            No events yet. Add your first event to start building your daily
            plan.
          </p>
        ) : (
          <div className="card-grid">
            {events.map((event) => (
              <article className="location-card" key={event.id}>
                <p className="eyebrow">{event.category}</p>

                <h3>{event.title}</h3>

                <p>
                  {event.date} at {event.time}
                </p>

                <small>Location: {event.locationName}</small>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}