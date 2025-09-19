import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
{/* <Link to="/">
        <img src="/logo.png" alt="Logo" width="250" />
      </Link> */}
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
            <Link to ="/home"><img src="/logo.png" alt="Logo" width="250" /></Link>
          
          <p className="contact-title">Call us:</p>
          <p>(+84) 919 384 332 </p>
          <p className="contact-title">Address:</p>
          <p>Da Lat city, Lam Dong</p>
          <p className="contact-title">Email: <a href="OiJobOii@gmail.com">OiJobOii@gmail.com</a> </p> 
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 </p>
      </div>
    </footer>
  );
}