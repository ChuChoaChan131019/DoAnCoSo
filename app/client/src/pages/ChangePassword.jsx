import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import IntroNavbar from "../components/IntroNavbar";

const API_BASE = "http://localhost:5000";

export default function ChangePassword({ user, setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State quản lý form
  const [form, setForm] = useState({
    name: user?.username || user?.email || "",
    // ✅ CHUẨN HÓA TÊN TRƯỜNG THÀNH currentPassword
    currentPassword: "",
    newPassword: "",
    reenterPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    // ✅ Dùng tên id chính xác
    setForm({ ...form, [id]: value });
  };

  // ✅ SỬ DỤNG ASYNC/AWAIT CHÍNH XÁC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("⚠️ Bạn cần đăng nhập để thực hiện chức năng này.");
      return;
    }

    if (form.newPassword !== form.reenterPassword) {
      setError("⚠️ Mật khẩu mới nhập lại không khớp!");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("⚠️ Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Gửi token xác thực
        },
        body: JSON.stringify({
          // ✅ GỬI TÊN TRƯỜNG CHÍNH XÁC
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      } else {
        setError(data.message || data.error || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      console.error("❌ Error changing password:", err);
      setError("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <div className="jobs-root">
        <IntroNavbar user={user} setUser={setUser} />

        <div className="jobs-container">
          <form className="password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={form.name}
                disabled={!!user}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">Password</label>
              <input
                type="password"
                // ✅ SỬA ID ĐỂ KHỚP VỚI STATE currentPassword
                id="currentPassword"
                value={form.currentPassword}
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

            {/* ✅ HIỂN THỊ LỖI */}
            {error && (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}