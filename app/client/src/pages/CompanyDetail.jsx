import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IntroNavbar from "../components/IntroNavbar";
import "./CompanyDetail.css";

export default function CompanyDetail({ user, setUser }) {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        // ✅ Nếu backend là /detail/:id thì dùng dòng này:
        const res = await fetch(`http://localhost:5000/api/companies/${id}`);
        // ❗ Nếu bạn đã đổi backend thành /:id thì sửa lại thành:
        // const res = await fetch(`http://localhost:5000/api/companies/${id}`);

        const data = await res.json();
        setCompany(data.company);
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết công ty:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!company) return <p>Không tìm thấy công ty.</p>;

  return (
    <div className="company-detail-root">
      <IntroNavbar user={user} setUser={setUser} />

      {/* ===== HEADER ===== */}
      <div className="company-detail-header">
        <div className="header-background-placeholder"></div>
        <div className="company-info-bar">
          {/* ✅ Chỉ hiện logo nếu có */}
          {company.Company_Logo && (
            <div className="company-logo-container">
              <img
                src={`http://localhost:5000/uploads/${company.Company_Logo.replace(
                  /^\/?uploads\//,
                  ""
                )}`}
                alt={company.Company_Name}
                className="detail-company-logo"
              />
            </div>
          )}
          <div className="company-header-text">
            <h1 className="detail-company-name">{company.Company_Name}</h1>
            <p className="detail-company-location">{company.Company_Address}</p>
          </div>
          <div className="company-job-count">{jobs.length} việc đang tuyển</div>
        </div>
      </div>

      {/* ===== NỘI DUNG CHÍNH ===== */}
      <div className="company-detail-content-container">
        {/* Giới thiệu công ty */}
        <div className="detail-section">
          <h2>Giới thiệu công ty</h2>
          <p>{company.Company_Description || "Chưa có mô tả"}</p>
        </div>

        {/* Thông tin chi tiết */}
        <div className="detail-section">
          <h2>Thông tin chi tiết</h2>
          <div className="detail-info-grid">
            <div className="info-item">
              <strong>Email:</strong> {company.Company_Email || "Chưa có"}
            </div>
            <div className="info-item">
              <strong>Website:</strong>{" "}
              {company.Company_Website ? (
                <a
                  href={company.Company_Website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {company.Company_Website}
                </a>
              ) : (
                "Chưa có"
              )}
            </div>
            <div className="info-item">
              <strong>Điện thoại:</strong> {company.Company_Phone || "Chưa có"}
            </div>
            <div className="info-item">
              <strong>Ngày thành lập:</strong>{" "}
              {company.Founded_Date
                ? new Date(company.Founded_Date).toLocaleDateString("vi-VN")
                : "Chưa có"}
            </div>
          </div>
        </div>

        {/* Việc làm đang tuyển */}
        <div className="detail-section recruitment-section">
          <h2>Việc làm đang tuyển</h2>
          {jobs.length > 0 ? (
            <div className="job-list">
              {jobs.map((job) => (
                <div className="job-card-detail" key={job.ID_Job}>
                  <div className="job-main-info">
                    <p className="job-name">{job.Name_Job}</p>
                    <p className="job-details-text">
                      {job.Job_Location || "Không xác định"}{" "}
                      <span className="job-separator">•</span>{" "}
                      {job.Salary || "Thỏa thuận"}
                    </p>
                  </div>
                  <div className="job-action">
                    <Link to={`/jobs/${job.ID_Job}`}>
                      <button className="apply-button">Xem chi tiết</button>
                    </Link>
                    <span className={`job-status ${job.Job_Status}`}>
                      {job.Job_Status === "opened" ? "Đang mở" : "Đã đóng"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Hiện chưa có việc nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
