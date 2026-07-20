import { useState } from "react";

const defaultProfile = {
  name: "",
  email: "",
  preferredTransport: "Car",
  travelBuffer: 10,
  productivityGoal: "",
};

function getSavedProfile() {
  const savedProfile = localStorage.getItem("flowstate_user_profile");

  if (!savedProfile) {
    return defaultProfile;
  }

  try {
    return {
      ...defaultProfile,
      ...JSON.parse(savedProfile),
    };
  } catch {
    return defaultProfile;
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(getSavedProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: name === "travelBuffer" ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    localStorage.setItem(
      "flowstate_user_profile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "flowstate_active_user",
      profile.name || "User"
    );

    setIsEditing(false);
    setSaveMessage("Profile updated successfully.");

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  }

  function handleCancel() {
    setProfile(getSavedProfile());
    setIsEditing(false);
    setSaveMessage("");
  }

  return (
    <main className="page">
      <section className="profile-header dashboard-section">
        <div>
          <p className="eyebrow">Account</p>
          <h1>User Profile</h1>
          <p className="dashboard-subtext">
            Manage your personal preferences and planning settings.
          </p>
        </div>

        {!isEditing && (
          <button
            className="primary-auth-btn"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </section>

      {saveMessage && (
        <p className="profile-success-message">{saveMessage}</p>
      )}

      <section className="profile-layout dashboard-section">
        <div className="dashboard-panel profile-summary-card">
          <div className="profile-avatar">
            {(profile.name || "U").charAt(0).toUpperCase()}
          </div>

          <h2>{profile.name || "FlowState User"}</h2>
          <p>{profile.email || "No email added"}</p>

          <div className="profile-summary-list">
            <div>
              <span>Preferred transport</span>
              <strong>{profile.preferredTransport}</strong>
            </div>

            <div>
              <span>Travel buffer</span>
              <strong>{profile.travelBuffer} minutes</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <p className="eyebrow">Preferences</p>
          <h2 className="panel-heading">Planning Profile</h2>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="preferredTransport">
                Preferred transport
              </label>

              <select
                id="preferredTransport"
                name="preferredTransport"
                value={profile.preferredTransport}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="Car">Car</option>
                <option value="Taxi">Taxi</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Walking">Walking</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="travelBuffer">
                Default travel buffer
              </label>

              <select
                id="travelBuffer"
                name="travelBuffer"
                value={profile.travelBuffer}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="productivityGoal">
                Productivity goal
              </label>

              <textarea
                id="productivityGoal"
                name="productivityGoal"
                value={profile.productivityGoal}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Example: Complete one focused study session each day"
                rows="4"
              />
            </div>

            {isEditing && (
              <div className="profile-form-actions">
                <button className="primary-auth-btn" type="submit">
                  Save Changes
                </button>

                <button
                  className="secondary-auth-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}