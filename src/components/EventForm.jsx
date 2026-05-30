import { useState } from "react";

export default function EventForm({ locations, onAddEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    category: "",
    locationId: "",
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
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.category ||
      !formData.locationId
    ) {
      alert("Please complete all event details.");
      return;
    }

    const selectedLocation = locations.find(
      (location) => location.id === formData.locationId
    );

    const newEvent = {
      id: crypto.randomUUID(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      category: formData.category,
      locationId: formData.locationId,
      locationName: selectedLocation.name,
      createdAt: new Date().toISOString(),
    };

    onAddEvent(newEvent);

    setFormData({
      title: "",
      date: "",
      time: "",
      category: "",
      locationId: "",
    });
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>Add Daily Event</h2>

      <label>
        Event Title
        <input
          type="text"
          name="title"
          placeholder="e.g. Lecture, Gym, Meeting"
          value={formData.title}
          onChange={handleChange}
        />
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </label>

      <label>
        Time
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
      </label>

      <label>
        Category
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select category</option>
          <option value="Academic / Work">Academic / Work</option>
          <option value="Personal">Personal</option>
          <option value="Social">Social</option>
        </select>
      </label>

      <label>
        Linked Location
        <select
          name="locationId"
          value={formData.locationId}
          onChange={handleChange}
        >
          <option value="">Select location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Save Event</button>
    </form>
  );
}