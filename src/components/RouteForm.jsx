import { useState } from "react";
import { getLiveTravelTime } from "../utils/routing";
import { estimateTravelTime } from "../utils/aiLogic";
import { getProfile } from "../utils/profile";
import FormError from "./FormError";

function getEmptyForm() {
  const profile = getProfile();

  return {
    originId: "",
    destinationId: "",
    transportMode: profile.preferredTransport || "Car",
  };
}

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
      : getEmptyForm()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.originId || !formData.destinationId || !formData.transportMode) {
      setError("Please complete all route details.");
      return;
    }

    if (formData.originId === formData.destinationId) {
      setError("Start and destination cannot be the same.");
      return;
    }

    const origin = locations.find((loc) => loc.id === formData.originId);
    const destination = locations.find((loc) => loc.id === formData.destinationId);

    setIsSaving(true);

    const originCoords = origin.lat && origin.lng ? { lat: origin.lat, lng: origin.lng } : null;
    const destinationCoords = destination.lat && destination.lng ? { lat: destination.lat, lng: destination.lng } : null;

    const liveTravelTime = await getLiveTravelTime(originCoords, destinationCoords, formData.transportMode);

    const routeData = {
      originId: formData.originId,
      destinationId: formData.destinationId,
      originName: origin.name,
      destinationName: destination.name,
      originAddress: origin.address,
      destinationAddress: destination.address,
      transportMode: formData.transportMode,
      estimatedTravelTimeMin:
        liveTravelTime ??
        estimateTravelTime({
          transportMode: formData.transportMode,
          originAddress: origin.address,
          destinationAddress: destination.address,
        }),
      travelTimeSource: liveTravelTime !== null ? "live" : "estimated",
    };

    if (editingRoute) {
      onUpdateRoute({ ...editingRoute, ...routeData });
      setIsSaving(false);
      return;
    }

    const newRoute = { id: crypto.randomUUID(), ...routeData, usageCount: 0, createdAt: new Date().toISOString() };
    onAddRoute(newRoute);
    setFormData(getEmptyForm());
    setIsSaving(false);
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>{editingRoute ? "Edit Saved Route" : "Create Saved Route"}</h2>

      <FormError message={error} />

      <label>
        Start Location
        <select name="originId" value={formData.originId} onChange={handleChange}>
          <option value="">Select start location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </label>

      <label>
        Destination
        <select name="destinationId" value={formData.destinationId} onChange={handleChange}>
          <option value="">Select destination</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </label>

      <label>
        Transport Mode
        <select name="transportMode" value={formData.transportMode} onChange={handleChange}>
          <option value="">Select transport mode</option>
          <option value="Walking">Walking</option>
          <option value="Taxi">Taxi</option>
          <option value="Bus">Bus</option>
          <option value="Car">Car</option>
          <option value="Train">Train</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Calculating route..." : editingRoute ? "Save Changes" : "Save Route"}
        </button>
        {editingRoute && (
          <button type="button" className="secondary-auth-btn" onClick={onCancelEdit}>Cancel</button>
        )}
      </div>
    </form>
  );
}