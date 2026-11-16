import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, getRoutes } from "../utils/storage";
import { buildDailyPlan, generateAssistantSummary, } from "../utils/aiLogic";
import { getProfile } from "../utils/profile";
import { toLocalDateString } from "../utils/date";
import { expandRecurringEvents } from "../utils/calendarLogic";

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}



function buildDailyBrief(dailyPlan) {
  if (dailyPlan.length === 0) {
    return "Your day is completely open. Add an event and FlowState will start building today's plan around it.";
  }

  const count = dailyPlan.length;
  const plural = count === 1 ? "commitment" : "commitments";
  const first = dailyPlan[0];
  const last = dailyPlan[dailyPlan.length - 1];
  const withRoutes = dailyPlan.filter((item) => item.hasRoute);

  let brief = `You have ${count} ${plural} today.`;

  if (first.leaveTime) {
    brief += ` Leaving by ${first.leaveTime} keeps you on track for ${first.title}.`;
  }

  const lastHour = Number(last.time?.split(":")[0]);
  if (!Number.isNaN(lastHour) && lastHour < 14) {
    brief += " Your afternoon looks free, a good window for personal tasks.";
  }

  if (withRoutes.length < count) {
    brief += " Add routes for your other stops so FlowState can estimate travel for those too.";
  }

  return brief;
}



function getCountdownLabel(event, now) {
  if (!event?.date || !event?.time) return null;
  const target = new Date(`${event.date}T${event.time}`);
  const diffMs = target - now;

  if (diffMs <= 0) return "Happening now";

  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `in ${minutes}m`;
  if (minutes === 0) return `in ${hours}h`;
  return `in ${hours}h ${minutes}m`;
}

export default function Dashboard() {
  const [events, setEvents] = useState(() => getEvents());
  const [routes, setRoutes] = useState(() => getRoutes());
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    function refreshDashboardData() {
      setEvents(getEvents());
      setRoutes(getRoutes());
    }

    refreshDashboardData();
    window.addEventListener("focus", refreshDashboardData);

    const tick = setInterval(() => setNow(new Date()), 30000);

    return () => {
      window.removeEventListener("focus", refreshDashboardData);
      clearInterval(tick);
    };
  }, []);

  const profile = getProfile();

  const currentHour = new Date().getHours();
  let greeting = "Good Evening";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  }

  const userName = 
  profile.name ||
  localStorage.getItem("flowstate_active_user") ||
  "User";

  const todayLabel = new Date().toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const dailyPlan = buildDailyPlan(
    events,
    routes,
    profile.travelBuffer
  );
  const assistant = generateAssistantSummary(
    events, 
    routes,
    profile.travelBuffer
);
  const upcomingDailyPlan = dailyPlan.filter((item) => {
  const eventDateTime = new Date(`${item.date}T${item.time}`);
  return eventDateTime >= now;
});

const nextEvent = upcomingDailyPlan[0] || null;
const upcomingEvents = upcomingDailyPlan.slice(1, 5);
  const weekDates = getWeekDates();
  const todayString = toLocalDateString();

  const weekStart = new Date(weekDates[0]);
weekStart.setHours(0, 0, 0, 0);

const weekEnd = new Date(weekDates[6]);
weekEnd.setHours(23, 59, 59, 999);

const weekOccurrences = expandRecurringEvents(
  events,
  weekStart,
  weekEnd
);

  return (
    <main className="page">
      {/* HERO — Greeting + AI Daily Brief merged */}
      <section className="dashboard-hero dashboard-section">
        <p className="eyebrow">FlowState</p>
        <h1>
          {greeting}, {userName}
        </h1>
        <p className="dashboard-subtext">{todayLabel}</p>
        <p className="dashboard-subtext dashboard-brief">{buildDailyBrief(dailyPlan)}</p>
      </section>

      {/* ROW 2 — Daily Companion | Today's Timeline | Calendar Snapshot */}
      <section className="dashboard-row dashboard-row-3 dashboard-section">
        {/* Daily Companion */}
        <div className="dashboard-panel">
          <p className="eyebrow">Daily Companion</p>
          <h2 className="panel-heading">Flow Assistant</h2>

          
       <div className="commute-suggestion">
        <h3>{assistant.title}</h3>

        <p>{assistant.message}</p>

        {assistant.workload && (
          <div className="assistant-workload">
            <strong>Today's workload:</strong>{""}
            {assistant.workload.level}
            </div>
        )}

        {assistant.advice?.length > 0 && (
          <div className="assistant-advice">
            <h4>Today's Advice</h4>

            <ul>
              {assistant.advice.map((tip, index) => (
               <li key={index}>{tip}</li>
              ))}
            </ul>
       </div>
        )}
        </div>
        </div>

        {/* Today's Timeline */}
        <div className="dashboard-panel">
          <p className="eyebrow">Schedule</p>
          <h2 className="panel-heading">Today's Timeline</h2>

          {dailyPlan.length === 0 ? (
            <p className="empty-state">
              No timetable yet. Add events dated for today to see your
              AI-curated daily plan.
            </p>
          ) : (
            <div className="timeline-list">
              {dailyPlan.map((item) => (
                <article className="timeline-card" key={item.id}>
                  <div className="timeline-time">
                    <strong>{item.time}</strong>
                    <span>{item.category}</span>
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.locationName}</p>

                    {item.leaveTime && (
                      <p>
                        <strong>Leave:</strong> {item.leaveTime}
                      </p>
                    )}

                    {item.travelTime && (
                      <p>
                        <strong>Travel:</strong> {item.travelTime} min
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Calendar Snapshot */}
        <div className="dashboard-panel">
          <p className="eyebrow">This Week</p>
          <h2 className="panel-heading">Calendar Snapshot</h2>

          <div className="calendar-snapshot">
            {weekDates.map((date) => {
              const dateString = toLocalDateString(date);
              const dayEventCount = weekOccurrences.filter(
                (event) => event.occurenceDate === dateString
              ).length;
              const isToday = dateString === todayString;

              return (
                <div
                  className={`day-chip${isToday ? " is-today" : ""}`}
                  key={dateString}
                >
                  <span className="day-chip-label">
                    {date.toLocaleDateString([], { weekday: "short" })}
                  </span>
                  <span className="day-chip-number">{date.getDate()}</span>
                  {dayEventCount > 0 && (
                    <span
                      className="day-chip-dot"
                      aria-label={`${dayEventCount} events`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="calendar-snapshot-summary">
            {weekOccurrences.length}{""}
            {weekOccurrences.length === 1 ? "event" : "events"} this week
          </p>
        </div>
      </section>

      {/* ROW 3 — Next Journey | Upcoming Events */}
      <section className="dashboard-row dashboard-row-2 dashboard-section">
        {/* Next Journey */}
        {nextEvent ? (
          <div className="suggestion-card">
            <p className="eyebrow">Next Journey</p>
            <h2>{nextEvent.title}</h2>

            <p>
              {nextEvent.time} · {getCountdownLabel(nextEvent, now)}
            </p>
            <p>{nextEvent.locationName}</p>

            {nextEvent.leaveTime && (
              <p>
                <strong>Leave by:</strong> {nextEvent.leaveTime}
              </p>
            )}

            <Link
              className="secondary-auth-btn edit-link"
              to={`/calendar?event=${nextEvent.id}`}
            >
              Edit
            </Link>
          </div>
        ) : (
          <div className="suggestion-card">
            <p className="eyebrow">Your day is open</p>
            <h2>No events scheduled for today</h2>
            <p>
              Add an event for today in the Calendar so FlowState can create
              your daily timetable.
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="dashboard-panel">
          <p className="eyebrow">Coming Up</p>
          <h2 className="panel-heading">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <p className="empty-state">Nothing else scheduled after this.</p>
          ) : (
            <div className="upcoming-list">
              {upcomingEvents.map((item) => (
                <article className="upcoming-card" key={item.id}>
                  <span className="upcoming-time">{item.time}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <small>{item.locationName}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section quick-actions">
        <Link className="quick-action-btn" to="/calendar">
          Add Event
        </Link>
        <Link className="quick-action-btn" to="/locations">
          Add Location
        </Link>
        <Link className="quick-action-btn" to="/routes">
          Add Route
        </Link>
      </section>
    </main>
  );
}