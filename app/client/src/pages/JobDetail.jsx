// fileName: JobDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import IntroNavbar from "../components/IntroNavbar";
import "./JobDetail.css";
import { FaBriefcase, FaMapMarkerAlt, FaRegClock } from "react-icons/fa"; //lấy icon
// import { use } from "react"; // <--- Bỏ import không cần thiết này

/** ĐỔI NẾU CẦN: đọc từ .env hay file config chung của em */
const API_BASE = "http://localhost:5000";

function toAbsUrl(u) {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return `${API_BASE}/uploads/${u}`;
}
function fmtVnd(n) {
  if (n == null) return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  return num.toLocaleString("vi-VN") + " ₫";
}
function fmtDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(+dt) ? d : dt.toLocaleDateString("vi-VN");
}

export default function JobDetail({ user, setUser }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/api/jobs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Fetch job failed");
        setJob(data.job || null);
      } catch (e) {
        setErr(e.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Hàm xử lý logic ứng tuyển
  const handleApply = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để ứng tuyển!");
      navigate("/login");
    } else if (user.role !== "candidate") {
      alert("Chỉ ứng viên mới có thể ứng tuyển.");
    } else {
      // Chuyển hướng đến trang CV và truyền ID Job
      navigate(`/cv/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="jd-root">
        <IntroNavbar user={user} setUser={setUser} />
        <main className="jd-container">
          <p>Đang tải chi tiết công việc…</p>
        </main>
      </div>
    );
  }
  if (err || !job) {
    return (
      <div className="jd-root">
        <IntroNavbar user={user} setUser={setUser} />
        <main className="jd-container">
          <p className="jd-error">Lỗi: {err || "Không tìm thấy job"}</p>
        </main>
      </div>
    );
  }

  // Nếu có cột Job_Type/Employment_Type thì show lên badge; không có thì fallback "Program"
  const jobType = job.Job_Type || "Program";

  return (
    <div className="jd-root">
      <IntroNavbar user={user} setUser={setUser} />
      {/*  */}

      {/* ===== HERO ===== */}
      <header className="jd-hero">
        <div className="jd-hero-inner">
          <div className="jd-logo">
            <img
              src={
                job.Company_Logo
                  ? toAbsUrl(job.Company_Logo)
                  : "https://via.placeholder.com/96?text=Logo"
              }
              alt="Company Logo"
            />
          </div>

          <div className="jd-hero-main">
            <h1 className="jd-title">{job.Name_Job}</h1>

            <div className="jd-meta-row">
              <div className="jd-meta">
                <FaBriefcase className="jd-ico bw" />
                <span>{job.Name_Category || "—"}</span>
              </div>
              <div className="jd-meta">
                <FaMapMarkerAlt className="jd-ico bw" />
                <span>{job.Job_Location || "—"}</span>
              </div>
              <div className="jd-meta">
                <FaRegClock className="jd-ico bw" />
                <span>{fmtDate(job.Start_Date)}</span>
              </div>
            </div>

            {/* Giữ lại chỉ badge trạng thái */}
            {job.Job_Status && (
              <div className="jd-badges">
                <span className="jd-badge jd-badge--soft">
                  {job.Job_Status}
                </span>
              </div>
            )}
          </div>

          {/* Nút Ứng tuyển */}
          <div className="jd-hero-cta">
            <button className="jd-btn jd-btn--primary" onClick={handleApply}> {/* <-- Cập nhật */}
              Ứng tuyển
            </button>
          </div>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <main className="jd-container jd-grid">
        {/* LEFT: Description */}
        <section className="jd-left">
          <h2 className="jd-section-title">Mô tả</h2>
          <div className="jd-card">
            {job.Job_Description ? (
              <div className="jd-desc" style={{ whiteSpace: "pre-wrap" }}>
                {job.Job_Description}
              </div>
            ) : (
              <em>Chưa có mô tả chi tiết.</em>
            )}
          </div>
        </section>

        {/* RIGHT: Overview */}
        <aside className="jd-right">
          <div className="jd-right-scroll">
            <div className="jd-card jd-overview">
              <h3>Tổng quan</h3>
              <ul className="jd-overview-list">
                <li>
                  <span>Ngày đăng</span>
                  <strong>{fmtDate(job.Start_Date)}</strong>
                </li>
                <li>
                  <span>Vị trí</span>
                  <strong>{job.Job_Location || "—"}</strong>
                </li>
                <li>
                  <span>Ngày kết thúc</span>
                  <strong>{fmtDate(job.End_Date)}</strong>
                </li>
                <li>
                  <span>Kinh nghiệm</span>
                  <strong>{job.Experience || "—"}</strong>
                </li>
                <li>
                  <span>Mức lương</span>
                  <strong>{fmtVnd(job.Salary)}</strong>
                </li>
                <li>
                  <span>Trạng thái</span>
                  <strong>{job.Job_Status || "—"}</strong>
                </li>
              </ul>
              <button className="jd-btn jd-btn--full jd-btn--primary" onClick={handleApply}> {/* <-- Cập nhật */}
                Ứng tuyển ngay
              </button>
            </div>

            <Link
              to={`/companies/${job.ID_Employer || job.ID_Company || ""}`}
              className="jd-card jd-card-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h3>Về công ty</h3>
              <div className="jd-company">
                <img
                  src={
                    job.Company_Logo
                      ? toAbsUrl(job.Company_Logo)
                      : "https://via.placeholder.com/64?text=Logo"
                  }
                  alt=""
                />
                <div>
                  <div className="jd-company-name">
                    {job.Company_Name || "—"}
                  </div>
                  <div className="jd-company-loc">
                    <FaMapMarkerAlt className="jd-ico bw" />
                    <span>{job.Job_Location || "—"}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}