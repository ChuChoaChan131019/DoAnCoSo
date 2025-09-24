import { Link, useNavigate } from "react-router-dom";
import {use, useState} from "react";
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
          <li><Link to="/introduce">Introduce</Link></li>
          <li><Link to="/jobs">Jobs</Link></li>
          <li><Link to="/companies">Companies</Link></li>
          <li><Link to="/cv">CV</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </nav>

      {user ? (
        <div className="user-box">
          <button onClick={()=>setOpen(!open)} className="username-btn">
            👤 {user.username}
          </button>
          {open && (
            <div className="dropdown-menu">
              <Link to="/myapply">My Apply</Link>
              <button onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login">
          <button className="login-btn">Log in</button>
        </Link>
      )}
    </header>
  );
}