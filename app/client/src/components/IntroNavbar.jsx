import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./IntroNavbar.css";

export default function IntroNavbar({ user, setUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
    <button 
      onClick={() => setOpen(!open)} 
      className="username-btn"
    >
      👤 {user.username}
    </button>
    {open && (
      <div className="dropdown-menu">
        {user.role === "candidate" ? (
          <>
            <NavLink to="/myapply">📝 My Apply</NavLink>
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