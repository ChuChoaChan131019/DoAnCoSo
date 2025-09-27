import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";
import IntroNavbar from "../components/IntroNavbar";

const init = {
  name: "",
  phone: "",
  location: "",
  foundedDate: "",
  email: "",
  describe: "",
};

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState(init);
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Prefill từ user (nếu có)
  useEffect(() => {
    if (user?.companyProfile) {
      const { name, phone, location, foundedDate, email, describe, logoUrl } =
        user.companyProfile;
      setForm({
        name: name || "",
        phone: phone || "",
        location: location || "",
        foundedDate: foundedDate ? foundedDate.slice(0, 10) : "",
        email: email || "",
        describe: describe || "",
      });
      setPreviewUrl(logoUrl || "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const setLogoFromFile = (file) => {
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      setErrors((er) => ({ ...er, logo: "Chỉ chấp nhận hình ảnh." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((er) => ({ ...er, logo: "Dung lượng ảnh tối đa 2MB." }));
      return;
    }
    setErrors((er) => ({ ...er, logo: "" }));
    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setLogoFromFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    setLogoFromFile(file);
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Vui lòng nhập tên công ty.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      er.email = "Email không hợp lệ.";
    if (form.phone && !/^[\d\s+\-()]{6,20}$/.test(form.phone))
      er.phone = "Số điện thoại không hợp lệ.";
    if (form.foundedDate && new Date(form.foundedDate) > new Date())
      er.foundedDate = "Ngày thành lập không thể ở tương lai.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("phone", form.phone.trim());
      fd.append("location", form.location.trim());
      fd.append("foundedDate", form.foundedDate || "");
      fd.append("email", form.email.trim());
      fd.append("describe", form.describe.trim());
      if (logoFile) fd.append("logo", logoFile);

      // const res = await fetch("/api/company/profile", { method: "POST", body: fd });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data?.message || "Lưu thất bại");

      await new Promise((r) => setTimeout(r, 500)); // giả lập
      alert("Lưu hồ sơ công ty thành công!");
      // setUser({ ...user, companyProfile: data });
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="profile-container">
      <IntroNavbar user={user} setUser={setUser} />
      <h2 className="section-title">My Profile</h2>

      <form className="company-form" onSubmit={handleSubmit} noValidate>
        {/* Upload row */}
        <div className="form-group upload-row">
          <label htmlFor="logo-upload">Upload Logo/Banner:</label>

          <input
            ref={fileInputRef}
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div
            className={`dropzone 
              ${dragging ? "dragging" : ""} 
              ${logoFile ? "has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
          >
            <div className="dropzone-text">
              {logoFile ? (
                <strong>{logoFile.name}</strong>
              ) : (
                <>
                  Click or drag file to this area to upload
                  <span className="dropzone-note">
                    {" "}
                    (PNG/JPG/SVG · max 2MB)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {errors.logo && <p className="error-text">{errors.logo}</p>}

        {previewUrl && (
          <div className="logo-preview">
            <img src={previewUrl} alt="Logo preview" className="fixed-logo" />
            <button
              type="button"
              className="clear-btn"
              onClick={clearLogo}
              aria-label="Clear selected logo"
              title="Bỏ chọn logo"
            >
              ✖
            </button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Company Name"
            value={form.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Company Location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="foundedDate">Founded Date:</label>
          <input
            id="foundedDate"
            name="foundedDate"
            type="date"
            value={form.foundedDate}
            onChange={handleChange}
            aria-invalid={!!errors.foundedDate}
          />
          {errors.foundedDate && (
            <span className="error-text">{errors.foundedDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Company Email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && <span className="error-text">{errors.email}</span>}

        <div className="form-group">
          <label htmlFor="describe">Describe:</label>
          <textarea
            id="describe"
            name="describe"
            placeholder="Company Description"
            rows={5}
            value={form.describe}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="save-button" disabled={submitting}>
          {submitting ? "Đang lưu..." : "Lưu"}
        </button>
      </form>
    </div>
  );
}
