// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ API URL
  const API = process.env.REACT_APP_API || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("🔗 API URL:", `${API}/api/auth/login`);

      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/"); // chuyển sang trang chính
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div>
      <div className="background"></div>
      <div className="login-wrapper">
        <div className="left-text">
          <h1>
            Welcome to <br /> OiJobOii!
          </h1>
        </div>

        <div className="login-box">
          <a href="/home">
            <img src="/logo.png" alt="Logo" width="250" />
          </a>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <a href="#">Forgot your password?</a>

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

            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}