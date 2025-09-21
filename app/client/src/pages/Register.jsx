// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [isCandidate, setIsCandidate] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const form = e.target;
    let payload = {};

    if (isCandidate) {
      const firstName = form[0].value.trim();
      const lastName = form[1].value.trim();
      payload = {
        username: `${firstName} ${lastName}`,
        email: form[2].value.trim(),
        password: form[3].value,
        role: "candidate",
      };
    } else {
      payload = {
        username: form[0].value.trim(), // Company name
        email: form[1].value.trim(),
        password: form[2].value,
        role: "employer",
      };
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Register success!");
        navigate("/login");
      } else {
        alert(data.error || "Register failed");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <div className="background"></div>

      <div className="register-wrapper">
        <div className="form-container">
          {/* Nút đóng */}
          <button className="close-btn" onClick={() => navigate("/home")}>
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
              <input type="password" placeholder="Confirm password" required />
              <button type="submit">Register now</button>
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </form>
          ) : (
            <form className="register-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="Company name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Confirm password" required />
              <button type="submit">Register now</button>
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}