import { useState } from "react";
import RouteForm from "../components/RouteForm";
import {
  getLocations,
  getRoutes,
  saveRoutes,
} from "../utils/storage";

export default function Routes() {
  const [locations] = useState(() => getLocations());
  const [routes, setRoutes] = useState(() => getRoutes());

  function handleAddRoute(newRoute) {
    const updatedRoutes = [...routes, newRoute];

    setRoutes(updatedRoutes);
    saveRoutes(updatedRoutes);
  }

  function handleDeleteRoute(id) {
    const updatedRoutes = routes.filter((route) => route.id !== id);

    setRoutes(updatedRoutes);
    saveRoutes(updatedRoutes);
  }

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">FlowState Setup</p>
        <h1>Route Memory</h1>
        <p>
          Create routes between your saved places. FlowState will remember these
          routes and later use them to calculate when you should leave for an
          event.
        </p>
      </section>

      {locations.length < 2 ? (
        <p className="empty-state">
          You need at least two saved locations before creating a route.
        </p>
      ) : (
        <RouteForm locations={locations} onAddRoute={handleAddRoute} />
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
                  Usual travel time: {route.travelTime} minutes
                </small>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRoute(route.id)}
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