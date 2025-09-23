// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [isCandidate, setIsCandidate] = useState(true);
  const navigate = useNavigate();

  // ✅ API URL
  const API = process.env.REACT_APP_API || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    let payload = {};

    if (isCandidate) {
      const firstName = form.elements.firstName.value.trim();
      const lastName = form.elements.lastName.value.trim();
      const email = form.elements.email.value.trim();
      const password = form.elements.password.value;
      const confirmPassword = form.elements.confirmPassword.value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      payload = {
        username: `${firstName} ${lastName}`,
        email,
        password,
        role: "candidate",
      };
    } else {
      const companyName = form.elements.companyName.value.trim();
      const email = form.elements.email.value.trim();
      const password = form.elements.password.value;
      const confirmPassword = form.elements.confirmPassword.value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      payload = {
        username: companyName,
        email,
        password,
        role: "employer",
      };
    }

    try {
      console.log("🔗 API URL:", `${API}/api/auth/register`);
      console.log("📤 Payload:", payload);

      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📡 Status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server did not return JSON");
      }

      console.log("📥 Response:", data);

      if (res.ok) {
        alert("Register success!");
        navigate("/login");
      } else {
        alert(data.error || "Register failed");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong: " + err.message);
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

          {/* Tabs chọn Candidate / Employer */}
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
              <input type="text" name="firstName" placeholder="First Name" required />
              <input type="text" name="lastName" placeholder="Last Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <input type="password" name="confirmPassword" placeholder="Confirm password" required />
              <button type="submit">Register now</button>
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </form>
          ) : (
            <form className="register-form" onSubmit={handleSubmit}>
              <input type="text" name="companyName" placeholder="Company name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <input type="password" name="confirmPassword" placeholder="Confirm password" required />
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