// File: Jobs.jsx (ĐÃ CHỈNH SỬA)

import React, { useEffect, useMemo, useState } from "react";
import IntroNavbar from "../components/IntroNavbar";
import "./Jobs.css";
import IndustrySelect from "../components/IndustrySelect";
import LocationSelect from "../components/LocationSelect";
import ExperienceSelect from "../components/ExperienceSelect";
import SalarySelect from "../components/SalarySelect";
// ✅ Import Link để tạo liên kết bấm được
import { Link, useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:5000";

function toAbsUrl(u) {
  // ... (hàm giữ nguyên)
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return `${API_BASE}/uploads/${u}`;
}

function fmtVnd(n) {
  // ... (hàm giữ nguyên)
  if (n == null) return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  return num.toLocaleString("vi-VN") + " ₫";
}
function fmtDate(d) {
  // ... (hàm giữ nguyên)
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(+dt) ? d : dt.toLocaleDateString("vi-VN");
}
function useDebounce(value, ms = 400) {
  // ... (hàm giữ nguyên)
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function Jobs({ user, setUser }) {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [filters, setFilters] = useState({
    q: initialQ,
    location: "",
    salary: "",
    experience: "",
    categoryId: "",
    type: "",
  });
  const debouncedQ = useDebounce(filters.q);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((s) => ({ ...s, [name]: value }));
  };

  const salaryRange = useMemo(() => {
    switch (filters.salary) {
      case "Under 10m":
        return { smin: 0, smax: 10_000_000 };
      case "10-15m":
        return { smin: 10_000_000, smax: 15_000_000 };
      case "15-20m":
        return { smin: 15_000_000, smax: 20_000_000 };
      case "20m+":
        return { smin: 20_000_000, smax: null };
      default:
        return { smin: null, smax: null };
    }
  }, [filters.salary]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQ) params.set("q", debouncedQ);
        if (filters.location) params.set("location", filters.location);
        if (filters.experience) params.set("experience", filters.experience);
        if (filters.categoryId) params.set("categoryId", filters.categoryId);
        if (salaryRange.smin != null) params.set("salaryMin", salaryRange.smin);
        if (salaryRange.smax != null) params.set("salaryMax", salaryRange.smax);

        const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Fetch jobs failed");
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (e) {
        console.error(e);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    debouncedQ,
    filters.location,
    filters.experience,
    filters.categoryId,
    salaryRange,
  ]);

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      <main className="jobs-container">
        {/* ô tìm kiếm */}
        <div className="search-wrap">
          <input
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Search jobs, companies…"
          />
          <button className="search-icon" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="#4b0e0e"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* hàng filter */}
        <div className="filter-row">
          {/* ... (phần filter giữ nguyên) */}
          <div className="filter">
            <label htmlFor="filterLocation">Location</label>
            <LocationSelect
              inputId="filterLocation"
              value={filters.location}
              onChange={(v) => setFilters((s) => ({ ...s, location: v }))}
              placeholder="Địa điểm…"
              isClearable
            />
          </div>

          <div className="filter">
            <label htmlFor="filterSalary">Salary level</label>
            <SalarySelect
              inputId="filterSalary"
              value={filters.salary}
              onChange={(v) => setFilters((s) => ({ ...s, salary: v }))}
              placeholder="Mức lương…"
              isClearable
            />
          </div>

          <div className="filter">
            <label htmlFor="filterExperience">Experience</label>
            <ExperienceSelect
              inputId="filterExperience"
              value={filters.experience}
              onChange={(v) => setFilters((s) => ({ ...s, experience: v }))}
              placeholder="Kinh nghiệm..."
              isClearable
            />
          </div>

          <div className="filter">
            <label htmlFor="filterCat">Categories</label>
            <IndustrySelect
              inputId="filterCat"
              value={filters.categoryId}
              onChange={(id) =>
                setFilters((s) => ({ ...s, categoryId: id || "" }))
              }
              placeholder="Lĩnh vực…"
              isClearable
            />
          </div>
        </div>

        {/* list */}
        {loading ? (
          <section className="skeleton-list">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </section>
        ) : jobs.length === 0 ? (
          <p>Không có job nào khớp bộ lọc.</p>
        ) : (
          <section className="skeleton-list">
            {jobs.map((j) => (
              // ✅ BỌC TOÀN BỘ CÔNG VIỆC TRONG LINK
              <Link
                key={j.ID_Job}
                to={`/jobs/${j.ID_Job}`}
                className="job-card-link" // Thêm class để dễ style
                style={{ textDecoration: "none", color: "inherit" }} // Xóa style mặc định của Link
              >
                <article className="filter">
                  {" "}
                  {/* Giữ lại article để áp dụng style filter cũ */}
                  {/* layout bên trong thẻ, không đổi kích thước thẻ */}
                  <div className="job-row">
                    {/* Logo */}
                    <div className="job-logo">
                      <img
                        src={
                          j.Company_Logo
                            ? toAbsUrl(j.Company_Logo)
                            : "https://via.placeholder.com/84?text=Logo"
                        }
                        alt="Company Logo"
                      />
                    </div>

                    {/* Nội dung giữa */}
                    <div className="job-main">
                      <h3 className="job-company">{j.Company_Name || "—"}</h3>
                      <div className="job-title">{j.Name_Job}</div>
                      <div className="job-salary">
                        Mức lương: {fmtVnd(j.Salary)}
                      </div>
                    </div>

                    {/* Góc phải dưới */}
                    <div className="job-side">
                      <span className="job-location">
                        {j.Job_Location || "—"}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
