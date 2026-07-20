import { useMemo, useRef, useState } from "react";
import EventForm from "../components/EventForm";
import { getLocations, getEvents, saveEvents } from "../utils/storage";
import {
  getCategoryColor,
  getMonthGridDays,
  getWeekDates,
  expandRecurringEvents,
  buildSchedulingInsight,
  toDateString,
} from "../utils/calendarLogic";

export default function Calendar() {
  const [locations] = useState(() => getLocations());
  const [events, setEvents] = useState(() => getEvents());
  const [viewMode, setViewMode] = useState("month");
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => toDateString(new Date()));
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  function persist(updatedEvents) {
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  }

  function handleAddEvent(newEvent) {
    persist(
      [...events, newEvent].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      })
    );
    setShowForm(false);
  }

  function handleUpdateEvent(updatedEvent) {
    persist(
      events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setEditingEvent(null);
    setShowForm(false);
  }

  function handleDeleteEvent(id) {
    persist(events.filter((event) => event.id !== id));
    if (editingEvent?.id === id) {
      setEditingEvent(null);
      setShowForm(false);
    }
  }

  function handleOpenAddForm() {
    setEditingEvent(null);
    setShowForm(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleEditEvent(event) {
    setEditingEvent(event);
    setShowForm(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleCloseForm() {
    setEditingEvent(null);
    setShowForm(false);
  }

  const { rangeStart, rangeEnd, label } = useMemo(() => {
    if (viewMode === "day") {
      const start = new Date(anchorDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return {
        rangeStart: start,
        rangeEnd: end,
        label: anchorDate.toLocaleDateString([], {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      };
    }

    if (viewMode === "week") {
      const week = getWeekDates(anchorDate);
      const start = new Date(week[0]);
      const end = new Date(week[6]);
      end.setHours(23, 59, 59, 999);
      return {
        rangeStart: start,
        rangeEnd: end,
        label: `${week[0].toLocaleDateString([], {
          day: "numeric",
          month: "short",
        })} – ${week[6].toLocaleDateString([], { day: "numeric", month: "short" })}`,
      };
    }

    const gridDays = getMonthGridDays(anchorDate);
    const start = new Date(gridDays[0]);
    const end = new Date(gridDays[41]);
    end.setHours(23, 59, 59, 999);
    return {
      rangeStart: start,
      rangeEnd: end,
      label: anchorDate.toLocaleDateString([], { month: "long", year: "numeric" }),
    };
  }, [viewMode, anchorDate]);

  const occurrencesInRange = useMemo(
    () => expandRecurringEvents(events, rangeStart, rangeEnd),
    [events, rangeStart, rangeEnd]
  );

  const selectedDayEvents = occurrencesInRange.filter(
    (o) => o.occurrenceDate === selectedDate
  );

  // Upcoming Events looks 60 days ahead regardless of the current view,
  // so recurring events still surface there even outside the visible range.
  const upcomingOccurrences = useMemo(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 60);
    return expandRecurringEvents(events, start, end);
  }, [events]);

  const todayString = toDateString(new Date());
  const nowTime = new Date().toTimeString().slice(0, 5);

  const upcomingEvents = upcomingOccurrences
    .filter((o) => `${o.occurrenceDate}T${o.time}` >= `${todayString}T${nowTime}`)
    .slice(0, 5);

  function navigate(direction) {
    const next = new Date(anchorDate);
    if (viewMode === "day") next.setDate(next.getDate() + direction);
    else if (viewMode === "week") next.setDate(next.getDate() + direction * 7);
    else next.setMonth(next.getMonth() + direction);
    setAnchorDate(next);
  }

  function goToToday() {
    const today = new Date();
    setAnchorDate(today);
    setSelectedDate(toDateString(today));
  }

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Daily Planning</p>
        <h1>Calendar</h1>
        <p>
          Add your daily commitments and link them to saved locations.
          FlowState uses these events to curate your day and suggest when to
          leave.
        </p>
      </section>

      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-controls">
            <div className="view-toggle">
              {["month", "week", "day"].map((mode) => (
                <button
                  key={mode}
                  className={viewMode === mode ? "active-view-btn" : ""}
                  onClick={() => setViewMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <div className="calendar-nav">
              <button onClick={() => navigate(-1)} aria-label="Previous">
                ‹
              </button>
              <span className="calendar-nav-label">{label}</span>
              <button onClick={() => navigate(1)} aria-label="Next">
                ›
              </button>
              <button className="secondary-auth-btn" onClick={goToToday}>
                Today
              </button>
            </div>

            <button className="add-event-btn" onClick={handleOpenAddForm}>
              + Add Event
            </button>

            <div className="category-legend">
              {["Academic / Work", "Personal", "Social"].map((cat) => (
                <span className="legend-item" key={cat}>
                  <span
                    className="legend-dot"
                    style={{ background: getCategoryColor(cat) }}
                  />
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {viewMode === "month" && (
            <div className="month-grid">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div className="month-grid-heading" key={d}>
                  {d}
                </div>
              ))}

              {getMonthGridDays(anchorDate).map((date) => {
                const dateString = toDateString(date);
                const isCurrentMonth = date.getMonth() === anchorDate.getMonth();
                const dayEvents = occurrencesInRange.filter(
                  (o) => o.occurrenceDate === dateString
                );

                return (
                  <button
                    key={dateString}
                    className={`month-cell${isCurrentMonth ? "" : " is-outside"}${
                      dateString === selectedDate ? " is-selected" : ""
                    }${dateString === todayString ? " is-today" : ""}`}
                    onClick={() => setSelectedDate(dateString)}
                  >
                    <span className="month-cell-number">{date.getDate()}</span>
                    <div className="month-cell-dots">
                      {dayEvents.slice(0, 3).map((e, i) => (
                        <span
                          key={`${e.id}-${i}`}
                          className="month-cell-dot"
                          style={{ background: getCategoryColor(e.category) }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {viewMode === "week" && (
            <div className="week-view">
              {getWeekDates(anchorDate).map((date) => {
                const dateString = toDateString(date);
                const dayEvents = occurrencesInRange.filter(
                  (o) => o.occurrenceDate === dateString
                );

                return (
                  <div
                    className={`week-column${
                      dateString === todayString ? " is-today" : ""
                    }${dateString === selectedDate ? " is-selected" : ""}`}
                    key={dateString}
                    onClick={() => setSelectedDate(dateString)}
                  >
                    <p className="week-column-heading">
                      {date.toLocaleDateString([], { weekday: "short" })}{" "}
                      {date.getDate()}
                    </p>

                    {dayEvents.length === 0 ? (
                      <p className="week-column-empty">—</p>
                    ) : (
                      dayEvents.map((e) => (
                        <div
                          key={`${e.id}-${e.occurrenceDate}`}
                          className="week-event-chip"
                          style={{ borderLeftColor: getCategoryColor(e.category) }}
                        >
                          <strong>{e.time}</strong>
                          <span>{e.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === "day" && (
            <div className="day-view">
              {selectedDayEvents.length === 0 ? (
                <p className="empty-state">No events on this day.</p>
              ) : (
                <div className="timeline-list">
                  {occurrencesInRange
                    .filter((o) => o.occurrenceDate === toDateString(anchorDate))
                    .map((e) => (
                      <article
                        className="timeline-card"
                        key={`${e.id}-${e.occurrenceDate}`}
                      >
                        <div
                          className="timeline-time"
                          style={{ borderRightColor: getCategoryColor(e.category) }}
                        >
                          <strong>{e.time}</strong>
                          <span>{e.category}</span>
                        </div>
                        <div>
                          <h3>{e.title}</h3>
                          <p>{e.locationName}</p>
                        </div>
                      </article>
                    ))}
                </div>
              )}
            </div>
          )}

          {showForm && (
            <div ref={formRef} className="event-form-wrapper">
              {locations.length === 0 ? (
                <p className="empty-state">
                  You need to add at least one saved location before creating
                  an event.
                </p>
              ) : (
                <EventForm
                  key={editingEvent?.id ?? "new"}
                  locations={locations}
                  editingEvent={editingEvent}
                  onAddEvent={handleAddEvent}
                  onUpdateEvent={handleUpdateEvent}
                  onCancelEdit={handleCloseForm}
                />
              )}
            </div>
          )}
        </div>

        <aside className="calendar-sidebar">
          <div className="dashboard-panel">
            <p className="eyebrow">Selected Day</p>
            <h2 className="panel-heading">
              {new Date(`${selectedDate}T00:00`).toLocaleDateString([], {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h2>

            {selectedDayEvents.length === 0 ? (
              <p className="empty-state">No events on this day.</p>
            ) : (
              <div className="upcoming-list">
                {selectedDayEvents.map((e) => (
                  <article className="upcoming-card" key={`${e.id}-${e.occurrenceDate}`}>
                    <span
                      className="upcoming-time"
                      style={{ color: getCategoryColor(e.category) }}
                    >
                      {e.time}
                    </span>
                    <div>
                      <h3>{e.title}</h3>
                      <small>{e.locationName}</small>
                      {e.recurrence && e.recurrence !== "none" && (
                        <p className="recurrence-tag">
                          Repeats {e.recurrence}
                        </p>
                      )}
                      <div className="event-detail-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditEvent(e)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEvent(e.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-panel">
            <p className="eyebrow">Coming Up</p>
            <h2 className="panel-heading">Upcoming Events</h2>

            {upcomingEvents.length === 0 ? (
              <p className="empty-state">Nothing else scheduled.</p>
            ) : (
              <div className="upcoming-list">
                {upcomingEvents.map((e) => (
                  <article className="upcoming-card" key={`${e.id}-${e.occurrenceDate}`}>
                    <span
                      className="upcoming-time"
                      style={{ color: getCategoryColor(e.category) }}
                    >
                      {e.occurrenceDate.slice(5)}
                    </span>
                    <div>
                      <h3>{e.title}</h3>
                      <small>
                        {e.time} · {e.locationName}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-panel">
            <p className="eyebrow">AI Insight</p>
            <h2 className="panel-heading">Scheduling</h2>
            <p>{buildSchedulingInsight(occurrencesInRange)}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}