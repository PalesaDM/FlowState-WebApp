import { useState } from "react";

export default function RouteForm({ locations, onAddRoute }) {
  const [formData, setFormData] = useState({
    originId: "",
    destinationId: "",
    travelTime: "",
    transportMode: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.originId ||
      !formData.destinationId ||
      !formData.travelTime ||
      !formData.transportMode
    ) {
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

    const newRoute = {
      id: crypto.randomUUID(),
      originId: formData.originId,
      destinationId: formData.destinationId,
      originName: origin.name,
      destinationName: destination.name,
      travelTime: Number(formData.travelTime),
      transportMode: formData.transportMode,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    onAddRoute(newRoute);

    setFormData({
      originId: "",
      destinationId: "",
      travelTime: "",
      transportMode: "",
    });
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>Create Saved Route</h2>

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
        Usual Travel Time
        <input
          type="number"
          name="travelTime"
          placeholder="e.g. 25"
          value={formData.travelTime}
          onChange={handleChange}
          min="1"
        />
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
          <option value="Other">Other</option>
        </select>
      </label>

      <button type="submit">Save Route</button>
    </form>
  );
}