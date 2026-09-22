import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LocationForm from "../components/LocationForm";
import { getLocations, saveLocations } from "../utils/storage";

export default function Locations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [locations, setLocations] = useState(() => getLocations());
  const [editingLocation, setEditingLocation] = useState(null);

  function handleAddLocation(newLocation) {
    const updatedLocations = [...locations, newLocation];
    setLocations(updatedLocations);
    saveLocations(updatedLocations);

    if (returnTo) {
      navigate(returnTo);
    }
  }

  function handleUpdateLocation(updatedLocation) {
    const updatedLocations = locations.map((location) =>
      location.id === updatedLocation.id ? updatedLocation : location
    );

    setLocations(updatedLocations);
    saveLocations(updatedLocations);
    setEditingLocation(null);

    if (returnTo) {
      navigate(returnTo);
    }
  }

  function handleDeleteLocation(id) {
    const updatedLocations = locations.filter((location) => location.id !== id);

    setLocations(updatedLocations);
    saveLocations(updatedLocations);

    if (editingLocation?.id === id) {
      setEditingLocation(null);
    }
  }

  function handleEditLocation(location) {
    setEditingLocation(location);
  }

  function handleCancelEdit() {
    setEditingLocation(null);
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

      <LocationForm
        key={editingLocation?.id ?? "new"}
        onAddLocation={handleAddLocation}
        editingLocation={editingLocation}
        onUpdateLocation={handleUpdateLocation}
        onCancelEdit={handleCancelEdit}
      />

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

                <div className="route-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditLocation(location)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteLocation(location.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}