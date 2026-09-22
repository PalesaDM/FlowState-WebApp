import { useState } from "react";
import { geocodeAddress } from "../utils/geocoding";
import FormError from "./FormError";

const EMPTY_FORM = { name: "", category: "", address: "" };

export default function LocationForm({
  onAddLocation,
  editingLocation,
  onUpdateLocation,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(() =>
    editingLocation
      ? {
          name: editingLocation.name,
          category: editingLocation.category,
          address: editingLocation.address,
        }
      : EMPTY_FORM
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

    if (!formData.name.trim() || !formData.category || !formData.address.trim()) {
      setError("Please fill in all location details.");
      return;
    }

    setIsSaving(true);

    const addressChanged =
      !editingLocation || editingLocation.address !== formData.address;

    let coords = editingLocation
      ? { lat: editingLocation.lat, lng: editingLocation.lng }
      : null;

    if (addressChanged) {
      coords = await geocodeAddress(formData.address);

      if (!coords) {
        setError(
          "We couldn't find that address on the map. It'll still be saved, but travel estimates involving it will use a rough estimate instead of live data."
        );
      }
    }

    if (editingLocation) {
      const updatedLocation = {
        ...editingLocation,
        ...formData,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      };

      onUpdateLocation(updatedLocation);
      setIsSaving(false);
      return;
    }

    const newLocation = {
      id: crypto.randomUUID(),
      ...formData,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      createdAt: new Date().toISOString(),
    };

    onAddLocation(newLocation);
    setFormData(EMPTY_FORM);
    setIsSaving(false);
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>{editingLocation ? "Edit Saved Location" : "Add Saved Location"}</h2>

      <FormError message={error} />

      <label>
        Location Name
        <input
          type="text"
          name="name"
          placeholder="e.g. Home"
          value={formData.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Category
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select category</option>
          <option value="Home">Home</option>
          <option value="University">University</option>
          <option value="Work">Work</option>
          <option value="Gym">Gym</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>
        Address / Area
        <input
          type="text"
          name="address"
          placeholder="e.g. Braamfontein, Johannesburg"
          value={formData.address}
          onChange={handleChange}
        />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving
            ? "Locating..."
            : editingLocation
            ? "Save Changes"
            : "Save Location"}
        </button>

        {editingLocation && (
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