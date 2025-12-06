// fileName: MyApply.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MyApply.css";
import IntroNavbar from "../components/IntroNavbar";

const API_BASE = process.env.REACT_APP_API;

function toAbsUrl(u) {
  if (!u) return "";
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

export default function MyApply({ user, setUser }) {
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Nếu chưa đăng nhập, chuyển hướng người dùng
      setLoading(false);
      return;
    }

    // Chỉ cho ứng viên
    if (user.role !== "candidate") {
      setError("Chức năng này chỉ dành cho Ứng viên.");
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      try {
        if (!API_BASE) {
          throw new Error("API base URL is not configured.");
        }

        const res = await fetch(`${API_BASE}/api/apply/mine`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Lỗi khi tải danh sách ứng tuyển");
        }

        setApplications(data.applications);
        setError(null);
      } catch (err) {
        console.error("Lỗi fetch applications:", err);
        setError(err.message);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchApplications, 300);
    return () => clearTimeout(timeout);
  }, [user]);

  const filteredApplications = applications.filter((app) => {
    const lowerSearch = search.toLowerCase();
    return (
      app.Name_Job.toLowerCase().includes(lowerSearch) ||
      app.Company_Name.toLowerCase().includes(lowerSearch) ||
      app.Job_Location.toLowerCase().includes(lowerSearch)
    );
  });

  if (!user) {
    return (
      <div className="jobs-root">
        <IntroNavbar user={user} setUser={setUser} />
        <p
          className="jobs-container"
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          Vui lòng đăng nhập để xem danh sách ứng tuyển.
        </p>
      </div>
    );
  }
  if (user.role !== "candidate") {
    return (
      <div className="jobs-root">
        <IntroNavbar user={user} setUser={setUser} />
        <p
          className="jobs-container"
          style={{ textAlign: "center", marginTop: "50px", color: "red" }}
        >
          Chức năng này chỉ dành cho Ứng viên.
        </p>
      </div>
    );
  }

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm công ty, vị trí, hoặc địa điểm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      <div className="job-list">
        {loading && (
          <p
            className="jobs-container"
            style={{ gridColumn: "1 / -1", textAlign: "center" }}
          >
            Đang tải danh sách ứng tuyển...
          </p>
        )}
        {error && (
          <p
            className="jobs-container"
            style={{ gridColumn: "1 / -1", textAlign: "center", color: "red" }}
          >
            Lỗi: {error}
          </p>
        )}

        {!loading && filteredApplications.length === 0 && (
          <p
            className="jobs-container"
            style={{ gridColumn: "1 / -1", textAlign: "center" }}
          >
            Bạn chưa ứng tuyển công việc nào.
          </p>
        )}

        {filteredApplications.map((app) => (
          <Link
            to={`/jobs/${app.ID_Job}`}
            key={app.ID_Job}
            className="job-card-link"
            style={{ textDecoration: "none" }}
          >
            <div className="job-card">
              <h3 style={{ margin: 0 }}>
                {app.Company_Name} - {app.Name_Job}
              </h3>
              <div className="job-info">
                <p>Ngày ứng tuyển:</p>
                <p>{fmtDate(app.Date_Applied)}</p>
              </div>
              <div className="job-info">
                <p>Mức lương:</p>
                <p>{fmtVnd(app.Salary)}</p>
              </div>
              <div className="job-info">
                <p>Địa điểm:</p>
                <p>{app.Job_Location}</p>
              </div>
              <div className="job-info">
                <p>Trạng thái:</p>
                <p
                  style={{
                    fontWeight: "bold",
                    color:
                      app.Application_Status === "pending"
                        ? "#ff9800"
                        : app.Application_Status === "hired"
                        ? "#4caf50"
                        : "#f44336",
                  }}
                >
                  {app.Application_Status.toUpperCase()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
