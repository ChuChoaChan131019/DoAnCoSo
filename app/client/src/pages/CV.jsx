import React, { useState, useRef } from "react";
import "./CV.css";
import IntroNavbar from "../components/IntroNavbar";

export default function CV({ user, setUser }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: user?.email || "",
    address: "",
    resume: null,
  });
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "resume") {
      setForm((p) => ({ ...p, resume: files?.[0] || null }));
    } else {
      setForm((p) => ({ ...p, [id]: value }));
    }
  };

  const handlePickFile = () => fileInputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setForm((p) => ({ ...p, resume: f }));
  };

  const handleDragOver = (e) => e.preventDefault();

  const clearFile = () =>
    setForm((p) => ({ ...p, resume: null }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      alert("Bạn cần đăng nhập trước!");
      return;
    }
    const fd = new FormData();
    fd.append("fullName", form.fullName.trim());
    fd.append("phone", form.phone.trim());
    fd.append("email", form.email.trim());
    fd.append("address", form.address.trim());
    if (form.resume) fd.append("resume", form.resume);

    try {
      setSaving(true);
      const res = await fetch("http://localhost:5000/api/candidate/profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");

      alert("Đã lưu CV thành công!");
      if (data.resumeUrl) {
        console.log("Resume URL:", `http://localhost:5000${data.resumeUrl}`);
      }
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cv-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="cv-container">
        <form className="cv-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter contact address"
            />
          </div>

          <div className="form-group upload-group">
            <label className="upload-label">Upload CV</label>

            {/* Ô upload: hiển thị tên file NGAY BÊN TRONG */}
            <div
              className={`upload-box ${form.resume ? "has-file" : ""}`}
              onClick={handlePickFile}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handlePickFile()
              }
            >
              {form.resume ? (
                <div className="file-chip">
                  <span className="file-name">
                    {form.resume.name}
                    {form.resume.size
                      ? ` • ${(form.resume.size / 1024).toFixed(0)} KB`
                      : ""}
                  </span>
                  <button
                    type="reset"
                    className="btn delete-btn"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      clearFile();
                    }}
                    aria-label="Remove file"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <p>Click or drag file to this area to upload(.pdf,.doc,.docx)</p>
              )}

              {/* input file ẩn */}
              <input
                id="resume"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn save-btn" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <input
              type="reset"
              value="Delete"
              className="btn delete-btn"
              onClick={() =>
                setForm({
                  fullName: "",
                  phone: "",
                  email: user?.email || "",
                  address: "",
                  resume: null,
                })
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
