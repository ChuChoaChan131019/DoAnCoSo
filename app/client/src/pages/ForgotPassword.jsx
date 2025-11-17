import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/reset-password-direct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Password has been updated successfully!");
        navigate("/login");
      } else {
        alert(data.error || "Failed to reset password!");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div>
      <div className="background"></div>
      <div className="forgot-wrapper">
        <div className="forgot-box">
          <button className="close-btn" onClick={() => navigate("/login")}>
            &times;
          </button>

          <h2 className="form-title">RESET PASSWORD</h2>
          <p className="form-desc">
            Enter your email and new password to reset your account.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit">Reset Password</button>

            <p>
              Remembered your password? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
