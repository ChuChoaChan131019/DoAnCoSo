import React, { useState } from "react";
import "./ChangePassword.css"; // chứa CSS riêng cho form
import IntroNavbar from "../components/IntroNavbar";

export default function ChangePassword({ user, setUser }) {
  // State quản lý form
  const [form, setForm] = useState({
    name: "",
    password: "",
    newPassword: "",
    reenterPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.reenterPassword) {
      alert("⚠️ Mật khẩu nhập lại không khớp!");
      return;
    }
    alert("✅ Đổi mật khẩu thành công!");
  };

  return (
    <div className="change-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="change-container">
        <form className="password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New password</label>
            <input
              type="password"
              id="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reenterPassword">Reenter new password</label>
            <input
              type="password"
              id="reenterPassword"
              value={form.reenterPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="save-btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}