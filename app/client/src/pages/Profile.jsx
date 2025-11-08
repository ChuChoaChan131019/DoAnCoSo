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
  website: "",
};

function getToken() {
  try {
    // Ưu tiên đọc "auth" (do Login.jsx đang lưu)
    const rawAuth = localStorage.getItem("auth");
    if (rawAuth) {
      const a = JSON.parse(rawAuth);
      return a?.token || a?.accessToken || null;
    }
    // fallback cho các nơi cũ nếu có
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const u = JSON.parse(rawUser);
      return u?.token || u?.accessToken || null;
    }
    return null;
  } catch {
    return null;
  }
}


export default function Profile({ user, setUser }) {
  const [form, setForm] = useState(init);
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  // Prefill từ API /api/employer/me (đúng schema backend)
  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:5000/api/employer/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // map từ schema Employer -> form UI
        setForm({
          name: data.Company_Name || "",
          phone: data.Company_Phone || "",
          location: data.Company_Address || "",
          foundedDate: data.Founded_Date || "",
          email: data.Company_Email || "",
          describe: data.Company_Desciption || "",
          website: data.Company_Website || "",
        });
        if (data.Company_Logo) setPreviewUrl(data.Company_Logo);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
function normalizeDate(d) {
  if (!d) return "";
  // TH1: đã là "YYYY-MM-DD" rồi -> giữ nguyên
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  // TH2: là chuỗi kiểu "Tue Sep 02 ..." hoặc Date object -> convert
  const dt = new Date(d);
  if (isNaN(dt)) return ""; // không hợp lệ -> gửi rỗng
  return dt.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

const dateStr = normalizeDate(form.foundedDate);

const fd = new FormData();
fd.append("Company_Name", form.name.trim());
fd.append("Company_Phone", form.phone.trim());
fd.append("Company_Address", form.location.trim());
fd.append("Founded_Date", dateStr); // <<< dùng format chuẩn
fd.append("Company_Email", form.email.trim());
// Em bảo "để nguyên luôn" (đang dùng cột viết sai chính tả):
fd.append("Company_Desciption", form.describe.trim());
fd.append("Company_Website", (form.website || "").trim());
if (logoFile) fd.append("logo", logoFile);
else if (previewUrl) fd.append("Company_Logo", previewUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = getToken();
    if (!token) {
      alert("Bạn chưa đăng nhập.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      // map đúng key backend đang nhận (employerController.upsertMyEmployer)
      fd.append("Company_Name", form.name.trim());
      fd.append("Company_Phone", form.phone.trim());
      fd.append("Company_Address", form.location.trim());
      fd.append("Founded_Date", form.foundedDate || "");
      fd.append("Company_Email", form.email.trim());
      fd.append("Company_Desciption", form.describe.trim());
      fd.append("Company_Website", form.website.trim());
      // nếu chưa chọn file mới mà đang có logo cũ -> truyền lại để backend giữ nguyên
      if (!logoFile && previewUrl) fd.append("Company_Logo", previewUrl);
      if (logoFile) fd.append("logo", logoFile); // field name = 'logo' đúng route

      const res = await fetch("http://localhost:5000/api/employer/me", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Lưu thất bại");

      alert("Lưu hồ sơ công ty thành công!");
      // cập nhật lại preview nếu backend trả về đường dẫn mới
      if (data.Company_Logo) setPreviewUrl(data.Company_Logo);
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) return <div className="profile-container">Đang tải...</div>;

  return (
    <div className="cv-root">
      <IntroNavbar user={user} setUser={setUser} />
      <div className="cv-container">
        <form className="company-form" onSubmit={handleSubmit} noValidate>
          <h2 className="section-title">My Profile</h2>
        {/* Upload row */}
        <div className="form-group ">
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
            className={`dropzone ${dragging ? "dragging" : ""} ${
              logoFile ? "has-file" : ""
            }`}
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
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="website">Website:</label>
          <input
            id="website"
            name="website"
            type="text"
            placeholder="https://..."
            value={form.website}
            onChange={handleChange}
          />
        </div>

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
    </div>
  );
}
