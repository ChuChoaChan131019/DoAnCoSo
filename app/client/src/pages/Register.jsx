// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [isCandidate, setIsCandidate] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API đăng ký tại đây
    alert("Register success!");
    navigate("/login");
  };

  return (
    <div>
      <div className="background"></div>

      <div className="register-wrapper">
        <div className="form-container">
          {/* Nút đóng */}
          <button
            className="close-btn"
            onClick={() => navigate("/home")}
          >
            &times;
          </button>

          <h2 className="form-title">CREATE AN ACCOUNT</h2>

          <div className="form-header">
            <button
              className={isCandidate ? "active" : ""}
              onClick={() => setIsCandidate(true)}
              type="button"
            >
              Candidate
            </button>
            <button
              className={!isCandidate ? "active" : ""}
              onClick={() => setIsCandidate(false)}
              type="button"
            >
              Employer
            </button>
          </div>

          {/* Candidate Form */}
          {isCandidate ? (
            <form className="register-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <input
                type="password"
                placeholder="Confirm password"
                required
              />
              <button type="submit">Register now</button>
              <p>
                Already have an account?{" "}
                <a href="/login">Login</a>
              </p>
            </form>
          ) : (
            <form className="register-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="Company name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <input
                type="password"
                placeholder="Confirm password"
                required
              />
              <button type="submit">Register now</button>
              <p>
                Already have an account?{" "}
                <a href="/login">Login</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
