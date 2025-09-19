import { NavLink } from "react-router-dom";
import "./introNavbar.css";

export default function IntroNavbar() {
  return (
    <header className="navbar1">
      {/* Logo */}
      <NavLink to="/">
        <img src="/logo.png" alt="Logo" width="250" />
      </NavLink>

      <nav>
        <ul>
          <li>
            <NavLink to="/introduce" className={({ isActive }) => (isActive ? "active-link" : "")}> Introduce </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active-link" : "")} > Jobs </NavLink>
          </li>
         <li>
            <NavLink to="/company" className={({ isActive }) => (isActive ? "active-link" : "")} > Companies </NavLink>
          </li>
          <li>
            <NavLink to="/cv" className={({ isActive }) => (isActive ? "active-link" : "")} > CV </NavLink>
          </li>
          <li>
            <NavLink to="/faq" className={({ isActive }) => (isActive ? "active-link" : "")} > FAQ </NavLink>
          </li>
        </ul>
      </nav>

      <NavLink to="/login">
        <button className="login-btn">Log in</button>
      </NavLink>
    </header>
  );
}
