import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  date: "",
  time: "",
  category: "",
  locationId: "",
  recurrence: "none",
  recurrenceEndDate: "",
};

export default function EventForm({
  locations,
  onAddEvent,
  editingEvent,
  onUpdateEvent,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(() =>
    editingEvent
      ? {
          title: editingEvent.title,
          date: editingEvent.date,
          time: editingEvent.time,
          category: editingEvent.category,
          locationId: editingEvent.locationId,
          recurrence: editingEvent.recurrence || "none",
          recurrenceEndDate: editingEvent.recurrenceEndDate || "",
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

    if (editingEvent) {
      const updatedEvent = {
        ...editingEvent,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        category: formData.category,
        locationId: formData.locationId,
        locationName: selectedLocation.name,
        recurrence: formData.recurrence,
        recurrenceEndDate:
          formData.recurrence === "none" ? "" : formData.recurrenceEndDate,
      };

      onUpdateEvent(updatedEvent);
      return;
    }

    const newEvent = {
      id: crypto.randomUUID(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      category: formData.category,
      locationId: formData.locationId,
      locationName: selectedLocation.name,
      recurrence: formData.recurrence,
      recurrenceEndDate:
        formData.recurrence === "none" ? "" : formData.recurrenceEndDate,
      createdAt: new Date().toISOString(),
    };

    onAddEvent(newEvent);
    setFormData(EMPTY_FORM);
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>{editingEvent ? "Edit Event" : "Add Daily Event"}</h2>

      {editingEvent?.recurrence && editingEvent.recurrence !== "none" && (
        <p className="recurrence-warning">
          This event repeats. Changes here apply to the entire series.
        </p>
      )}

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

      <label>
        Repeats
        <select
          name="recurrence"
          value={formData.recurrence}
          onChange={handleChange}
        >
          <option value="none">Does not repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>

      {formData.recurrence !== "none" && (
        <label>
          Repeat Until
          <input
            type="date"
            name="recurrenceEndDate"
            value={formData.recurrenceEndDate}
            onChange={handleChange}
          />
        </label>
      )}

      <div className="form-actions">
        <button type="submit">
          {editingEvent ? "Save Changes" : "Save Event"}
        </button>

        <button
          type="button"
          className="secondary-auth-btn"
          onClick={onCancelEdit}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}