import { Link } from "react-router-dom";
import "./introNavbar.css";

export default function IntroNavbar() {
  return (
    <header className="navbar1">
      {/* Logo */}
      <Link to="/">
        <img src="/logo.png" alt="Logo" width="250" />
      </Link>

    
      <nav >
        <ul>
          <li><Link to="/introduce">Introduce</Link></li>
          <li><Link to="/jobs">Jobs</Link></li>
          <li><Link to="/companies">Companies</Link></li>
          <li><Link to="/cv">CV</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </nav>

      {/* Login button */}
      <Link to="/login">
        <button className="login-btn">Log in</button>
      </Link>
    </header>
  );
}
