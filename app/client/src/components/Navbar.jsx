import { Link,NavLink, useNavigate } from "react-router-dom";
import { useState} from "react";
import "./Navbar.css";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // trở về trang chủ
  };

  return (
    <header className="navbar">
      <Link to="/">
        <img src="/logo.png" alt="Logo" width="250" />
      </Link>

      <nav>
        <ul>
          <li>
            <NavLink
              to="/introduce"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Introduce
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jobs"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/companies"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Companies
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cv"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              CV
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/faq"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              FAQ
            </NavLink>
          </li>
        </ul>
      </nav>

      {user ? (
        <div className="user-box">
          <button onClick={() => setOpen(!open)} className="username-btn">
            👤 {user.username}
          </button>
          {open && (
            <div className="dropdown-menu">
              {user.role === "candidate" ? (
                <>
                  <NavLink to="/myapply">📝 My Apply</NavLink>
                  <NavLink to="/changepassword">🔐 Change Password</NavLink>
                  <button onClick={handleLogout}>🔙 Logout</button>
                </>
              ) : user.role === "employer" ? (
                <>
                  <NavLink to="/myjobs">💼 My Jobs</NavLink>
                  <NavLink to="/profile">👤 Profile</NavLink>
                  <NavLink to="/listcandidate">📝 List Candidate</NavLink>
                  <NavLink to="/changepassword">🔐 Change Password</NavLink>
                  <button onClick={handleLogout}>🔙 Logout</button>
                </>
              ) : (
                <>
                  <p>Unknown role</p>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <NavLink to="/login">
          <button className="login-btn">Log in</button>
        </NavLink>
      )}
    </header>
  );
}