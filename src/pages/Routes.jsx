import { useState } from "react";
import RouteForm from "../components/RouteForm";
import {
  getLocations,
  getRoutes,
  saveRoutes,
} from "../utils/storage";
import { estimateTravelTime } from "../utils/aiLogic";

export default function Routes() {
  const [locations] = useState(() => getLocations());
  const [routes, setRoutes] = useState(() => getRoutes());
  const [editingRoute, setEditingRoute] = useState(null);

  function handleAddRoute(newRoute) {
    const updatedRoutes = [...routes, newRoute];
    setRoutes(updatedRoutes);
    saveRoutes(updatedRoutes);
  }

  function handleUpdateRoute(updatedRoute) {
    const updatedRoutes = routes.map((route) =>
      route.id === updatedRoute.id ? updatedRoute : route
    );

    setRoutes(updatedRoutes);
    saveRoutes(updatedRoutes);
    setEditingRoute(null);
  }

  function handleDeleteRoute(id) {
    const updatedRoutes = routes.filter((route) => route.id !== id);
    setRoutes(updatedRoutes);
    saveRoutes(updatedRoutes);

    if (editingRoute?.id === id) {
      setEditingRoute(null);
    }
  }

  function handleEditRoute(route) {
    setEditingRoute(route);
  }

  function handleCancelEdit() {
    setEditingRoute(null);
  }

  const modeCounts = routes.reduce((acc, route) => {
    acc[route.transportMode] = (acc[route.transportMode] || 0) + 1;
    return acc;
  }, {});

  const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0];

  const averageTravelTime =
    routes.length === 0
      ? null
      : Math.round(
          routes.reduce((sum, route) => sum + estimateTravelTime(route), 0) /
            routes.length
        );

  const locationsWithoutRoute = locations.filter(
    (location) =>
      !routes.some(
        (route) =>
          route.originId === location.id || route.destinationId === location.id
      )
  );

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">FlowState Setup</p>
        <h1>Route Memory</h1>
        <p>
          Create routes between your saved places. FlowState will remember
          these routes and later use them to calculate when you should leave
          for an event.
        </p>
      </section>

      <div className="routes-layout">
        <div className="routes-main">
          {locations.length < 2 ? (
            <p className="empty-state">
              You need at least two saved locations before creating a route.
            </p>
          ) : (
            <RouteForm
              key={editingRoute?.id ?? "new"}
              locations={locations}
              editingRoute={editingRoute}
              onAddRoute={handleAddRoute}
              onUpdateRoute={handleUpdateRoute}
              onCancelEdit={handleCancelEdit}
            />
          )}

          <section className="location-list">
            <h2>Your Saved Routes</h2>

            {routes.length === 0 ? (
              <p className="empty-state">
                No saved routes yet. Create your first regular route.
              </p>
            ) : (
              <div className="card-grid">
                {routes.map((route) => (
                  <article className="location-card" key={route.id}>
                    <h3>
                      {route.originName} → {route.destinationName}
                    </h3>

                    <p>{route.transportMode}</p>

                    <small>
                      FlowState will estimate travel time based on this route
                      and transport mode.
                    </small>

                    <div className="route-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditRoute(route)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="routes-sidebar">
          <div className="dashboard-panel">
            <p className="eyebrow">Overview</p>
            <h2 className="panel-heading">Travel Statistics</h2>

            <div className="stat-row">
              <span>Saved routes</span>
              <strong>{routes.length}</strong>
            </div>

            <div className="stat-row">
              <span>Avg. estimated travel</span>
              <strong>
                {averageTravelTime !== null ? `${averageTravelTime} min` : "—"}
              </strong>
            </div>

            <div className="stat-row">
              <span>Most used mode</span>
              <strong>{topMode ? topMode[0] : "—"}</strong>
            </div>
          </div>

          <div className="dashboard-panel">
            <p className="eyebrow">AI Insight</p>
            <h2 className="panel-heading">Recommendation</h2>

            {routes.length === 0 ? (
              <p className="empty-state">
                Add a route and FlowState will start surfacing patterns here.
              </p>
            ) : (
              <>
                {topMode && (
                  <p>
                    Most of your saved routes use {topMode[0].toLowerCase()} —
                    FlowState leans on this when estimating new travel times.
                  </p>
                )}

                {locationsWithoutRoute.length > 0 && (
                  <p>
                    {locationsWithoutRoute.length} saved{" "}
                    {locationsWithoutRoute.length === 1
                      ? "location has"
                      : "locations have"}{" "}
                    no route yet — add one so FlowState can plan travel there.
                  </p>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}