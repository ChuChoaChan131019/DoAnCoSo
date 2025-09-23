import { NavLink, useNavigate } from "react-router-dom";
import "./IntroNavbar.css";

export default function IntroNavbar({user, setUser}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); 
  };

  return (
    <header className="navbar1">
      {/* Logo */}
      <NavLink to="/">
        <img src="/logo.png" alt="Logo" width="250" />
      </NavLink>

      <nav>
        <ul>
          <li><NavLink to="/introduce">Introduce</NavLink></li>
          <li><NavLink to="/jobs">Jobs</NavLink></li>
          <li><NavLink to="/companies">Companies</NavLink></li>
          <li><NavLink to="/cv">CV</NavLink></li>
          <li><NavLink to="/faq">FAQ</NavLink></li>
        </ul>
      </nav>

      {user ? (
        <div className="user-box">
          <span>👋 {user.username}</span>
          <button onClick={handleLogout} className="login-btn">Log out</button>
        </div>
      ) : (
        <NavLink to="/login">
          <button className="login-btn">Log in</button>
        </NavLink>
      )}
    </header>
  );
}
