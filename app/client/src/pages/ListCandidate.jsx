// fileName: ListCandidate.jsx

import React, { useEffect, useState, useCallback } from "react";
import "./ListCandidate.css"; // Đảm bảo import file CSS
import IntroNavbar from "../components/IntroNavbar";

const API_BASE = process.env.REACT_APP_API;

const API_LIST_URL = `${API_BASE}/api/candidate/list`;
const API_STATUS_URL = `${API_BASE}/api/apply/status`;

export default function ListCandidate({ user, setUser }) {
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => user?.token || null;

  // Hàm nhóm đơn ứng tuyển theo ứng viên
  const groupApplicationsByCandidate = (apps) => {
    const grouped = {};
    apps.forEach((app) => {
      const id = app.ID_Candidate;
      if (!grouped[id]) {
        grouped[id] = {
          ...app,
          applications: [],
        };
      }
      grouped[id].applications.push({
        ID_Job: app.ID_Job,
        Name_Job: app.Name_Job,
        Job_Location: app.Job_Location,
        Date_Applied: app.Date_Applied,
        Application_Status: app.Application_Status,
      });
    });
    return Object.values(grouped);
  };

  // Hàm FETCH danh sách đơn ứng tuyển
  const fetchApplications = useCallback(async () => {
    const currentToken = getToken();

    if (!API_BASE) {
      console.error("API base URL is not configured.");
      setApplications([]);
      setLoading(false);
      return;
    }

    if (!currentToken || user.role !== "employer") {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(API_LIST_URL, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setApplications(data.applications || []);
      } else {
        console.error(
          "Fetch applications failed (Server Error):",
          data.message
        );
        setApplications([]);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [user.role, user.token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ✅ HÀM XỬ LÝ CHẤP NHẬN/TỪ CHỐI (Giữ nguyên logic)
  const handleStatusUpdate = async (jobId, candidateId, newStatus) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${
          newStatus === "hired" ? "CHẤP NHẬN" : "TỪ CHỐI"
        } đơn ứng tuyển này?`
      )
    ) {
      return;
    }

    const token = getToken();
    if (!token) return alert("Lỗi xác thực.");

    try {
      const res = await fetch(`${API_STATUS_URL}/${jobId}/${candidateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Cập nhật state cục bộ để giao diện mượt hơn:
        setApplications((prevApps) =>
          prevApps.map((app) => {
            if (app.ID_Job === jobId && app.ID_Candidate === candidateId) {
              return { ...app, Application_Status: newStatus };
            }
            return app;
          })
        );
      } else {
        alert(`Thất bại: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Lỗi kết nối máy chủ khi cập nhật trạng thái.");
    }
  };

  const groupedCandidates = groupApplicationsByCandidate(applications);

  const filteredCandidates = groupedCandidates.filter(
    (c) =>
      c.FullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.Address?.toLowerCase().includes(search.toLowerCase()) ||
      c.Email?.toLowerCase().includes(search.toLowerCase())
  );

  if (user && user.role !== "employer") {
    return (
      <div className="jobs-root">
        <IntroNavbar user={user} setUser={setUser} />
        <div
          style={{ padding: "20px", textAlign: "center", marginTop: "50px" }}
        >
          <h2 style={{ color: "red" }}>
            Bạn không có quyền truy cập trang này.
          </h2>
          <p>Chức năng này chỉ dành cho tài khoản Employer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="search-container">
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

        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm ứng viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="sort-btn">Sort by</button>
      </div>

      <div className="candidate-list">
        {loading ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            Đang tải...
          </p>
        ) : filteredCandidates.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            Không tìm thấy ứng viên nào phù hợp.
          </p>
        ) : (
          filteredCandidates.map((c) => (
            <div className="candidate-card" key={c.ID_Candidate}>
              <h3>{c.FullName || "Chưa có tên"}</h3>
              <div className="candidate-info">
                <p>
                  <strong>Đăng ký:</strong>{" "}
                  {new Date(c.DateCreate).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {c.Address || "—"}
                </p>
              </div>
              <div className="candidate-info">
                <p>
                  <strong>Email:</strong> {c.Email || "—"}
                </p>
                <p>
                  <strong>SĐT:</strong> {c.Phonenumber || "—"}
                </p>
              </div>

              <h4
                style={{
                  margin: "15px 0 5px 0",
                  borderTop: "1px solid #cce",
                  paddingTop: "10px",
                  fontSize: "16px",
                }}
              >
                Đơn ứng tuyển ({c.applications.length})
              </h4>

              {/* ✅ SỬ DỤNG CLASS CSS TỪ ĐÂY */}
              <div className="candidate-applications-scroll">
                {c.applications.map((app, index) => (
                  <div
                    key={`${app.ID_Job}-${index}`}
                    className={`application-item status-${app.Application_Status}`}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      {app.Name_Job} ({app.Job_Location})
                    </p>
                    <p
                      style={{
                        margin: "3px 0",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      Trạng thái:
                      <strong
                        style={{
                          color:
                            app.Application_Status === "hired"
                              ? "green"
                              : app.Application_Status === "rejected"
                              ? "red"
                              : "orange",
                          marginLeft: "5px",
                        }}
                      >
                        {app.Application_Status.toUpperCase()}
                      </strong>
                    </p>
                    <p
                      style={{
                        margin: "3px 0 8px 0",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      Ngày nộp:{" "}
                      {new Date(app.Date_Applied).toLocaleDateString("vi-VN")}
                    </p>

                    {app.Application_Status === "pending" && (
                      <div className="application-actions">
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              app.ID_Job,
                              c.ID_Candidate,
                              "hired"
                            )
                          }
                          className="btn-hired"
                        >
                          ✅ Chấp nhận
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              app.ID_Job,
                              c.ID_Candidate,
                              "rejected"
                            )
                          }
                          className="btn-rejected"
                        >
                          ❌ Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {c.Resume_URL && (
                <a
                  href={`${API_BASE}${c.Resume_URL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: "12px",
                    color: "#003763",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    display: "block",
                  }}
                >
                  📄 Xem CV
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
