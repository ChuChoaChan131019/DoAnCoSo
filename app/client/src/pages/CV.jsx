// fileName: CV.jsx

import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CV.css";
import IntroNavbar from "../components/IntroNavbar";

const API_BASE = process.env.REACT_APP_API;

export default function CV({ user, setUser }) {
  const { jobId } = useParams(); // Lấy ID Job từ URL
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: user?.email || "",
    address: "",
    resume: null,
  });
  // State để lưu tên file CV đã upload 
  const [existingResumeName, setExistingResumeName] = useState(null);

  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Load profile ứng viên hiện tại
  useEffect(() => {
    if (!user || user.role !== "candidate") {
      alert("Bạn cần đăng nhập với vai trò Ứng viên!");
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        if (!API_BASE) throw new Error("API base URL is not configured.");

        const res = await fetch(`${API_BASE}/api/candidate/profile/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();

        // Cập nhật form với dữ liệu hiện tại
        setForm((p) => ({
          ...p,
          fullName: data.FullName || "",
          phone: data.Phonenumber || "",
          email: data.Email || user.email || "",
          address: data.Address || "",
        }));

        if (data.Resume_URL) {
          // Hiển thị tên file đã upload (xử lý tên file từ URL)
          const fileName = data.Resume_URL.split("/").pop();
          setExistingResumeName(fileName);
        } else {
          setExistingResumeName(null);
        }
      } catch (e) {
        console.error("Lỗi khi tải profile:", e);
      }
    };
    loadProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "resume") {
      setForm((p) => ({ ...p, resume: files?.[0] || null }));
      setExistingResumeName(null); // Khi chọn file mới, xóa tên file cũ
    } else {
      setForm((p) => ({ ...p, [id]: value }));
    }
  };

  const handlePickFile = () => fileInputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setForm((p) => ({ ...p, resume: f }));
      setExistingResumeName(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const clearFile = () => {
    setForm((p) => ({ ...p, resume: null }));
    setExistingResumeName(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token || user.role !== "candidate") {
      alert("Bạn cần đăng nhập với vai trò Ứng viên trước!");
      return;
    }

    const isApplying = !!jobId;
    if (isApplying && !form.resume && !existingResumeName) {
      alert("Vui lòng upload CV/Hồ sơ trước khi gửi ứng tuyển!");
      return;
    }

    if (!API_BASE) {
        alert("API base URL is not configured (REACT_APP_API missing).");
        return;
    }

    // ========= LƯU PROFILE & UPLOAD CV ==========
    const fd = new FormData();
    fd.append("fullName", form.fullName.trim());
    fd.append("phone", form.phone.trim());
    fd.append("email", form.email.trim());
    fd.append("address", form.address.trim());
    if (form.resume) fd.append("resume", form.resume);

    try {
      setSaving(true);

      // GỌI API LƯU PROFILE 
      const profileRes = await fetch(`${API_BASE}/api/candidate/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: fd,
      });
      const profileText = await profileRes.text();

      if (!profileRes.ok) {
        let errorData = { message: "Upload failed" };
        try {
          errorData = JSON.parse(profileText);
        } catch (e) {
          console.error(
            "Lỗi: Phản hồi không phải JSON:",
            profileText.slice(0, 100) + "..."
          );
          throw new Error(
            "Lỗi Server (Status: " +
              profileRes.status +
              "): " +
              (profileText.includes("<!DOCTYPE")
                ? "Phản hồi HTML/Lỗi Server"
                : profileText)
          );
        }
        throw new Error(
          errorData?.message ||
            `Lưu hồ sơ thất bại (Status: ${profileRes.status})`
        );
      }

      const profileData = JSON.parse(profileText);

      if (profileData.resumeUrl) {
        const fileName = profileData.resumeUrl.split("/").pop();
        setExistingResumeName(fileName);
        console.log("Resume URL:", `${API_BASE}${profileData.resumeUrl}`);
      }

      // =========== GỬI ỨNG TUYỂN (NẾU CÓ jobId) ==========
      if (isApplying) {
        // GỌI API ỨNG TUYỂN MỚI
        const applyRes = await fetch(`${API_BASE}/api/apply/job/${jobId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const applyData = await applyRes.json();

        if (!applyRes.ok) {
          throw new Error(applyData?.message || "Gửi ứng tuyển thất bại");
        }

        alert(
          `🎉 Ứng tuyển thành công cho Job ID: ${jobId}! Vui lòng kiểm tra trang 'MyApply'.`
        );
        navigate("/jobs"); // Chuyển hướng về trang danh sách việc làm sau khi ứng tuyển
      } else {
        // Chỉ lưu profile
        alert("Đã lưu CV thành công!");
      }
    } catch (err) {
      console.error(err);
      alert(
        (isApplying ? "Gửi ứng tuyển thất bại: " : "Lưu thất bại: ") +
          err.message
      );
    } finally {
      setSaving(false);
    }
  };

  const fileToShow = form.resume || existingResumeName;
  const fileNameToShow = form.resume?.name || existingResumeName;
  const fileSizeToShow = form.resume?.size;

  const isApplying = !!jobId;

  return (
    <div className="cv-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="cv-container">
        <form className="cv-form" onSubmit={handleSubmit}>
          {isApplying && (
            <h2
              style={{
                width: "100%",
                textAlign: "center",
                color: "#1a365d",
                marginBottom: "16px",
              }}
            >
              Ứng tuyển cho Job ID: **{jobId}**
            </h2>
          )}

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
              readOnly={!!user?.email} // Email được khóa nếu đã đăng nhập
              style={{ backgroundColor: user?.email ? "#f0f0f0" : "#ffffff" }}
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
              className={`upload-box ${fileToShow ? "has-file" : ""}`}
              onClick={handlePickFile}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handlePickFile()
              }
            >
              {fileToShow ? (
                <div className="file-chip">
                  <span className="file-name">
                    {fileNameToShow}
                    {fileSizeToShow
                      ? ` • ${(fileSizeToShow / 1024).toFixed(0)} KB`
                      : ""}
                    {!fileSizeToShow && existingResumeName && " (Đã lưu)"}
                  </span>
                  <button
                    type="button"
                    className="file-remove"
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
                <p>
                  Click or drag file to this area to upload(.pdf,.doc,.docx)
                </p>
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
              {saving ? "Đang xử lý..." : isApplying ? "Gửi ứng tuyển" : "Save"}
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
