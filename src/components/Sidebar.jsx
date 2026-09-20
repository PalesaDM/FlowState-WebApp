import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/locations", label: "Locations" },
  { to: "/routes", label: "Routes" },
  { to: "/calendar", label: "Calendar" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("flowstate_active_user");
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>FlowState</h2>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className="sidebar-link">
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-link secondary-auth-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}