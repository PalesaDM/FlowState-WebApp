import { useState } from "react";

const EMPTY_FORM = {
  originId: "",
  destinationId: "",
  transportMode: "",
};

export default function RouteForm({
  locations,
  onAddRoute,
  editingRoute,
  onUpdateRoute,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(() =>
    editingRoute
      ? {
          originId: editingRoute.originId,
          destinationId: editingRoute.destinationId,
          transportMode: editingRoute.transportMode,
        }
      : EMPTY_FORM
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.originId || !formData.destinationId || !formData.transportMode) {
      alert("Please complete all route details.");
      return;
    }

    if (formData.originId === formData.destinationId) {
      alert("Start and destination cannot be the same.");
      return;
    }

    const origin = locations.find((loc) => loc.id === formData.originId);
    const destination = locations.find(
      (loc) => loc.id === formData.destinationId
    );

    if (editingRoute) {
      const updatedRoute = {
        ...editingRoute,
        originId: formData.originId,
        destinationId: formData.destinationId,
        originName: origin.name,
        destinationName: destination.name,
        originAddress: origin.address,
        destinationAddress: destination.address,
        transportMode: formData.transportMode,
      };

      onUpdateRoute(updatedRoute);
      return;
    }

    const newRoute = {
      id: crypto.randomUUID(),
      originId: formData.originId,
      destinationId: formData.destinationId,
      originName: origin.name,
      destinationName: destination.name,
      originAddress: origin.address,
      destinationAddress: destination.address,
      transportMode: formData.transportMode,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    onAddRoute(newRoute);
    setFormData(EMPTY_FORM);
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>{editingRoute ? "Edit Saved Route" : "Create Saved Route"}</h2>

      <label>
        Start Location
        <select
          name="originId"
          value={formData.originId}
          onChange={handleChange}
        >
          <option value="">Select start location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Destination
        <select
          name="destinationId"
          value={formData.destinationId}
          onChange={handleChange}
        >
          <option value="">Select destination</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Transport Mode
        <select
          name="transportMode"
          value={formData.transportMode}
          onChange={handleChange}
        >
          <option value="">Select transport mode</option>
          <option value="Walking">Walking</option>
          <option value="Taxi">Taxi</option>
          <option value="Bus">Bus</option>
          <option value="Car">Car</option>
          <option value="Train">Train</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit">
          {editingRoute ? "Save Changes" : "Save Route"}
        </button>

        {editingRoute && (
          <button
            type="button"
            className="secondary-auth-btn"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}