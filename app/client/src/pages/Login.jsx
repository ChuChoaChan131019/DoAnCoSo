// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: validate + call API tại đây
    navigate("/"); // đổi sang trang em muốn
  };

  return (
    <div>
      <div className="background"></div>
      <div className="login-wrapper">
        <div className="left-text">
          <h1>Welcome to <br /> OiJobOii!</h1>
        </div>

        <div className="login-box">
          <a href="/home">
            <img src="/logo.png" alt="Logo" width="250" />
          </a>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />

            <a href="#">forgot your password ?</a>

            <button type="submit">Log in</button>

            <div className="or">OR</div>

            <button
              type="button"
              className="google-btn"
              onClick={() => alert("Google login chưa nối API")}
            >
              <img src="/logoGoogle.png" alt="Google logo" />
              <span>Log in with Google</span>
            </button>

            <p>Don't have an account? <a href="/register">Register</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}
