import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Login success:", data);
        // Nếu cần lưu thông tin người dùng:
        // localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/"); // chuyển sang trang chính
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong");
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