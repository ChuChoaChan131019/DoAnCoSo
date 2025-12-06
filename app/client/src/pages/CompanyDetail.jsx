import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaRegClock,
} from "react-icons/fa";
import IntroNavbar from "../components/IntroNavbar";
import "./CompanyDetail.css";

const API_BASE = process.env.REACT_APP_API;

export default function CompanyDetail({ user, setUser }) {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const INITIAL_SHOW = 4;
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!API_BASE) throw new Error("API base URL is not configured.");

        const res = await fetch(`${API_BASE}/api/companies/${id}`);
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

  const jobsToShow = showAll ? jobs : jobs.slice(0, INITIAL_SHOW);

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="jobs-container">
        {/* ---------- BANNER ---------- */}
        <div className="company-banner">
          <div className="company-banner-inner"></div>

          <div className="company-banner-bottom">
            <div className="banner-left">
              <div className="avatar">
                {company.Company_Logo && (
                  <img
                    src={`${API_BASE}/uploads/${company.Company_Logo.replace(
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

            <div className="banner-center">
              <div className="company-name">{company.Company_Name}</div>
              <div className="company-location">
                {company.Company_Address || "Chưa cập nhật địa chỉ"}
              </div>
            </div>

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

        <div className="section">
          <div className="section-title">Việc làm đang tuyển</div>

          {jobs.length > 0 ? (
            <>
              <div className="jobs-list">
                {jobsToShow.map((job) => {
                  const deadline = job.End_Date ?? job.Expired_Date ?? null;
                  return (
                    <div className="job-card" key={job.ID_Job}>
                      <div className="job-left">
                        <div className="job-title">{job.Name_Job}</div>

                        <div className="job-meta-type">
                          <span className="job-location">
                            <FaMapMarkerAlt className="jd-ico bw" />{" "}
                            {job.Job_Location || "Không xác định"}
                          </span>
                        </div>

                        <div className="job-meta">
                          <FaMoneyBillWave className="jd-ico bw" />{" "}
                          {job.Salary
                            ? `${job.Salary.toLocaleString("vi-VN")} VND`
                            : "Thỏa thuận"}
                        </div>

                        <div className="job-deadline">
                          <FaRegClock className="jd-ico bw" /> Ngày kết thúc :{" "}
                          {deadline
                            ? new Date(deadline).toLocaleDateString("vi-VN")
                            : "Chưa có"}
                        </div>
                      </div>

                      <div className="job-right">
                        <Link to={`/jobs/${job.ID_Job}`}>
                          <button className="view-btn">Xem chi tiết</button>
                        </Link>
                        <span className="badge">
                          {job.Job_Status === "opened" ? "Đang mở" : "Đã đóng"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

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
