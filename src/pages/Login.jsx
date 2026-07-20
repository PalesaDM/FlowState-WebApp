import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleLogin(e) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("flowstate_user"));

    if (!savedUser) {
      alert("No account found. Please sign up first.");
      setMode("signup");
      return;
    }

    localStorage.setItem("flowstate_active_user", savedUser.name);

    navigate("/dashboard");
  }

  function handleSignup(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please complete all sign up details.");
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("flowstate_user", JSON.stringify(newUser));
    localStorage.setItem("flowstate_active_user", newUser.name);

    navigate("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">FlowState</p>

        <h1>Your AI Daily Curator</h1>

        <p>
          Organize your routes, events, and routines into a smarter daily flow.
        </p>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active-auth-tab" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={mode === "signup" ? "active-auth-tab" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="e.g. nosipho@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Login to FlowState</button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <label>
              Full Name
              <input
                type="text"
                name="name"
                placeholder="e.g. Nosipho"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="e.g. nosipho@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Create Account</button>
          </form>
        )}
      </section>
    </main>
  );
}