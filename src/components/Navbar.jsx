import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <h2>FlowState</h2>
      </div>

      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/locations">
          Locations
        </NavLink>

        <NavLink to="/routes">
          Routes
        </NavLink>

        <NavLink to="/calendar">
          Calendar
        </NavLink>


      </nav>
    </header>
  );
}