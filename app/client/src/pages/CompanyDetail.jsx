import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IntroNavbar from "../components/IntroNavbar";
import "./CompanyDetail.css";

export default function CompanyDetail({ user, setUser }) {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thêm 2 state này cho show more
  const INITIAL_SHOW = 4; // số job hiển thị ban đầu, bạn chỉnh tùy ý
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/companies/${id}`);
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

  // Biến này chứa job list hiển thị tùy trạng thái showAll
  const jobsToShow = showAll ? jobs : jobs.slice(0, INITIAL_SHOW);

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="jobs-container">
        {/* ---------- BANNER ---------- */}
        <div className="company-banner">
          <div className="company-banner-inner"></div>

          <div className="company-banner-bottom">
            {/* Logo */}
            <div className="banner-left">
              <div className="avatar">
                {company.Company_Logo && (
                  <img
                    src={`http://localhost:5000/uploads/${company.Company_Logo.replace(
                      /^\/?uploads\//,
                      ""
                    )}`}
                    alt={company.Company_Name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Tên công ty và địa chỉ */}
            <div className="banner-center">
              <div className="company-name">{company.Company_Name}</div>
              <div className="company-location">
                {company.Company_Address || "Chưa cập nhật địa chỉ"}
              </div>
            </div>

            {/* Số lượng việc */}
            <div className="banner-right">
              <div className="company-jobs">{jobs.length} việc đang tuyển</div>
            </div>
          </div>
        </div>

        {/* ---------- GIỚI THIỆU ---------- */}
        <div className="section">
          <div className="section-title">Giới thiệu công ty</div>
          <div className="introduce-box">
            {company.Company_Description || "Chưa có mô tả công ty."}
          </div>
        </div>

        {/* ---------- THÔNG TIN CHI TIẾT ---------- */}
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

        {/* ---------- JOB LIST ---------- */}
        <div className="section">
          <div className="section-title">Việc làm đang tuyển</div>

          {jobs.length > 0 ? (
            <>
              <div className="jobs-list">
                {jobsToShow.map((job) => (
                  <div className="job-card" key={job.ID_Job}>
                    <div className="job-left">
                      <div className="job-title">{job.Name_Job}</div>

                      <div className="job-meta-type">
                        <span className="job-location">
                          📍 {job.Job_Location || "Không xác định"}
                        </span>
                        <span className="job-type">
                          💼 {job.Type_Job || "Toàn thời gian"}
                        </span>
                      </div>

                      <div className="job-meta">
                        💰 {job.Salary ? `${job.Salary} VND` : "Thỏa thuận"}
                      </div>

                      <div className="job-deadline">
                        ⏰ Hạn nộp:{" "}
                        {job.Expired_Date
                          ? new Date(job.Expired_Date).toLocaleDateString("vi-VN")
                          : "Chưa có"}
                      </div>
                    </div>

                    <div className="job-right">
                      <Link to={`/jobs/${job.ID_Job}`}>
                        <button className="apply-btn">Xem chi tiết</button>
                      </Link>
                      <span className="badge">
                        {job.Job_Status === "opened" ? "Đang mở" : "Đã đóng"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút Show more / Show less */}
              {jobs.length > INITIAL_SHOW && (
                <div className="show-more-wrap">
                  <button
                    className="show-more"
                    onClick={() => setShowAll((s) => !s)}
                  >
                    {showAll
                      ? "Hiển thị ít hơn"
                      : `Xem thêm (${jobs.length - INITIAL_SHOW})`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Hiện chưa có việc nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
