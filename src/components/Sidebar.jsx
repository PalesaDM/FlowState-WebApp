import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/locations", label: "Locations" },
  { to: "/routes", label: "Routes" },
  { to: "/calendar", label: "Calendar" },
  { to: "/profile", label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>FlowState</h2>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
           key={item.to} 
           to={item.to} 
           className={({ isActive }) =>
            `sidebar-link${isActive ? " active" : ""}`
          }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}