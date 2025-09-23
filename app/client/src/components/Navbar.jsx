import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

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
          <button onClick={handleLogout} className="username-btn">
            👤 {user.username}
          </button>
        </div>
      ) : (
        <Link to="/login">
          <button className="login-btn">Log in</button>
        </Link>
      )}
    </header>
  );
}