import { useState } from "react";
import { geocodeAddress } from "../utils/geocoding";

export default function LocationForm({ onAddLocation }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.address) {
      alert("Please fill in all location details.");
      return;
    }

    setIsSaving(true);
    const coords = await geocodeAddress(formData.address);

    if (!coords) {
      alert(
        "We couldn't find that address on the map. It'll still be saved, but travel estimates involving it will use a rough estimate instead of live data."
      );
    }

    const newLocation = {
      id: crypto.randomUUID(),
      ...formData,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      createdAt: new Date().toISOString(),
    };

    onAddLocation(newLocation);
    setFormData({ name: "", category: "", address: "" });
    setIsSaving(false);
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>Add Saved Location</h2>

      <label>
        Location Name
        <input type="text" name="name" placeholder="e.g. Home" value={formData.name} onChange={handleChange} />
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
        <input type="text" name="address" placeholder="e.g. Braamfontein, Johannesburg" value={formData.address} onChange={handleChange} />
      </label>

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Locating..." : "Save Location"}
      </button>
    </form>
  );
}