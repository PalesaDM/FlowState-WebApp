import { useState } from "react";
import LocationForm from "../components/LocationForm";
import { getLocations, saveLocations } from "../utils/storage";

export default function Locations() {
  const [locations, setLocations] = useState(() => getLocations());

  function handleAddLocation(newLocation) {
    const updatedLocations = [...locations, newLocation];

    setLocations(updatedLocations);
    saveLocations(updatedLocations);
  }

  function handleDeleteLocation(id) {
    const updatedLocations = locations.filter((location) => location.id !== id);

    setLocations(updatedLocations);
    saveLocations(updatedLocations);
  }

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">FlowState Setup</p>
        <h1>Saved Locations</h1>
        <p>
          Add the places you visit often. These locations will later be used to
          create routes, plan events, and generate AI daily suggestions.
        </p>
      </section>

      <LocationForm onAddLocation={handleAddLocation} />

      <section className="location-list">
        <h2>Your Saved Places</h2>

        {locations.length === 0 ? (
          <p className="empty-state">
            No saved locations yet. Add your first location to begin.
          </p>
        ) : (
          <div className="card-grid">
            {locations.map((location) => (
              <article className="location-card" key={location.id}>
                <h3>{location.name}</h3>
                <p>{location.category}</p>
                <small>{location.address}</small>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteLocation(location.id)}
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