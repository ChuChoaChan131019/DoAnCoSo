import React, { useEffect, useRef, useState } from "react";
import "./CV.css";
import IntroNavbar from "../components/IntroNavbar";
import IndustrySelect from "../components/IndustrySelect";
import ExperienceSelect from "../components/ExperienceSelect";
import LocationSelect from "../components/LocationSelect";

/* ===== API base + lấy token (như trước) ===== */
const API_BASE = "http://localhost:5000";

function getToken() {
  try {
    const rawAuth = localStorage.getItem("user");
    if (rawAuth) {
      const a = JSON.parse(rawAuth);
      return a?.token || a?.accessToken || null;
    }
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

/* (optional) Map ID_Category -> label để hiển thị đẹp */
const CATEGORY_LABELS = {
  "000001": "Công nghệ thông tin",
  "000002": "Kế toán",
  "000003": "Marketing",
  "000004": "Thiết kế đồ hoạ",
  "000005": "Nhân sự",
};

/* ===== State bám CSDL Job ===== */
const init = {
  title: "", // -> Name_Job
  categoryId: "", // -> ID_Category (varchar(6))
  startDate: "", // -> Start_Date (YYYY-MM-DD)
  endDate: "", // -> End_Date   (YYYY-MM-DD)
  experience: "", // -> Experience (varchar)
  location: "", // -> Job_Location
  salary: "", // -> Salary (DECIMAL)
  description: "", // -> Job_Description
  status: "opened", // -> Job_Status enum("opened","closed")
};

export default function MyJobs({ user, setUser }) {
  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Danh sách job */
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  /* NEW: theo dõi job đang “được chọn để chỉnh sửa” */
  const [selectedJobId, setSelectedJobId] = useState(null);
  const formRef = useRef(null);

  /* Load danh sách job của employer */
  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        if (!token) {
          setLoadingJobs(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/jobs/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data?.jobs)) {
          setJobs(data.jobs);
        }
      } catch (e) {
        console.error("Load jobs failed:", e);
      } finally {
        setLoadingJobs(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /* IndustrySelect trả về ID_Category (vd: “000123”) */
  const handleCategoryChange = (id) => {
    setForm((f) => ({
      ...f,
      categoryId: id ? String(id).padStart(6, "0") : "",
    }));
  };

  /* Chuẩn hoá YYYY-MM-DD */
  const normalizeDate = (d) => {
    if (!d) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const dt = new Date(d);
    return isNaN(dt) ? "" : dt.toISOString().slice(0, 10);
  };

  /* Validate */
  const validate = () => {
    const er = {};
    if (!form.title.trim()) er.title = "Vui lòng nhập Job Title.";
    if (!form.categoryId)
      er.categoryId = "Vui lòng chọn Category (ID_Category).";

    const sd = normalizeDate(form.startDate);
    const ed = normalizeDate(form.endDate);
    if (!sd) er.startDate = "Vui lòng chọn Start Date.";
    if (!ed) er.endDate = "Vui lòng chọn End Date.";
    if (sd && ed && new Date(sd) > new Date(ed)) {
      er.endDate = "End Date phải >= Start Date.";
    }

    if (form.salary !== "") {
      const num = Number(form.salary);
      if (Number.isNaN(num) || num < 0) {
        er.salary = "Salary phải là số không âm (DECIMAL).";
      }
    }

    if (!["opened", "closed"].includes(form.status)) {
      er.status = "Trạng thái không hợp lệ (opened/closed).";
    }

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  /* ===== Click vào 1 job-card → đổ xuống form để chỉnh ===== */
  const pickJobToEdit = (job) => {
    setSelectedJobId(job.ID_Job || null);
    setForm({
      title: job.Name_Job || "",
      categoryId: job.ID_Category || "",
      startDate: normalizeDate(job.Start_Date) || "",
      endDate: normalizeDate(job.End_Date) || "",
      experience: job.Experience || "",
      location: job.Job_Location || "",
      salary: job.Salary == null ? "" : String(job.Salary),
      description: job.Job_Description || "",
      status: job.Job_Status || "opened",
    });

    // kéo xuống form cho tiện
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  /* ===== Submit: hiện tại vẫn là TẠO MỚI (POST) =====
     Nếu sau này bạn có API PUT /api/jobs/:id thì bật đoạn TODO (3 dòng) ở dưới.
  */
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
      const payload = {
        Name_Job: (form.title || "").trim(),
        ID_Category: form.categoryId,
        Start_Date: normalizeDate(form.startDate),
        End_Date: normalizeDate(form.endDate),
        Experience: (form.experience || "").trim(),
        Job_Location: (form.location || "").trim(),
        Salary: form.salary === "" ? null : Number(form.salary),
        Job_Description: (form.description || "").trim(),
        Job_Status: form.status,
      };

      const isEditing = !!selectedJobId;
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${API_BASE}/api/jobs/${selectedJobId}`
        : `${API_BASE}/api/jobs`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message ||
            (isEditing ? "Cập nhật thất bại" : "Tạo mới thất bại")
        );

      if (isEditing) {
        // Thay job trong danh sách
        setJobs((old) =>
          old.map((j) =>
            j.ID_Job === selectedJobId ? { ...j, ...data.Job } : j
          )
        );
        alert("Cập nhật job thành công!");
      } else {
        // Thêm job mới vào đầu danh sách
        if (data?.Job) setJobs((old) => [data.Job, ...old]);
        alert(`Tạo job thành công! Mã: ${data?.Job?.ID_Job || "N/A"}`);
      }

      // Reset form
      setForm(init);
      setSelectedJobId(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Helpers format hiển thị */
  const fmtVnd = (n) => (n == null ? "—" : Number(n).toLocaleString("vi-VN"));
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");
  const catLabel = (id) => CATEGORY_LABELS[id] || id || "—";

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      {/* Danh sách job */}
      <div className="myjob-list">
        {loadingJobs ? (
          <div className="myjob-card">Đang tải danh sách job…</div>
        ) : jobs.length === 0 ? (
          <div className="myjob-card">
            Chưa có job nào. Tạo job mới ở bên dưới nhé.
          </div>
        ) : (
          jobs.map((j) => (
            <button
              key={j.ID_Job}
              type="button"
              className={`myjob-card myjob-card--clickable ${
                selectedJobId === j.ID_Job ? "is-selected" : ""
              }`}
              onClick={() => pickJobToEdit(j)}
              title="Nhấn để đổ dữ liệu xuống form"
            >
              <h3>{j.Name_Job || "Tên công việc"}</h3>

              <div className="myjob-info">
                <p>Registration date</p>
                <p>
                  {fmtDate(j.Start_Date)} → {fmtDate(j.End_Date)}
                </p>
              </div>

              <div className="myjob-info">
                <p>Location</p>
                <p>{j.Job_Location || "—"}</p>
              </div>

              <div className="myjob-info">
                <p>Salary level</p>
                <p>{fmtVnd(j.Salary)} ₫</p>
              </div>

              <div className="myjob-info">
                <p>Type</p>
                <p>{catLabel(j.ID_Category)}</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Form nhập / chỉnh sửa */}
      <div className="myjob-container" ref={formRef}>
        <form className="cv-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Job Title:</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Tên công việc"
              value={form.title}
              onChange={handleChange}
              aria-invalid={!!errors.title}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Type:</label>
            <IndustrySelect
              className="industry-select"
              value={form.categoryId}
              onChange={handleCategoryChange}
              placeholder="Chọn lĩnh vực"
              isClearable
              inputId="categoryId"
            />
            {errors.categoryId && (
              <span className="error-text">{errors.categoryId}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              aria-invalid={!!errors.startDate}
            />
            {errors.startDate && (
              <span className="error-text">{errors.startDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              aria-invalid={!!errors.endDate}
            />
            {errors.endDate && (
              <span className="error-text">{errors.endDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience:</label>
            <ExperienceSelect
              className="industry-select"
              value={form.experience}
              onChange={(v) => setForm((f) => ({ ...f, experience: v }))}
              inputId="experience"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <LocationSelect
              className="industry-select"
              value={form.location}
              onChange={(v) => setForm((f) => ({ ...f, location: v }))}
              inputId="location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary :</label>
            <input
              id="salary"
              name="salary"
              type="number"
              step="0.01"
              min="0"
              placeholder="VD: 15000000"
              value={form.salary}
              onChange={handleChange}
              aria-invalid={!!errors.salary}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description:</label>
            <textarea
              className="description-textarea"
              id="description"
              name="description"
              placeholder="Mô tả công việc"
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              aria-invalid={!!errors.status}
            >
              <option value="opened">Mở</option>
              <option value="closed">Đóng</option>
            </select>
          </div>

          <div className="btn-group">
            <button type="submit" className=" save-btn" disabled={submitting}>
              {selectedJobId
                ? submitting
                  ? "Đang lưu sửa..."
                  : "Lưu thay đổi"
                : submitting
                ? "Đang lưu..."
                : "Lưu"}
            </button>

            {selectedJobId && (
              <button
                type="submit"
                className="save-button btn-reset"
                onClick={() => {
                  setForm(init);
                  setSelectedJobId(null);
                }}
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}