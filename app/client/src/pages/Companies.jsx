import React, { useState } from "react";
import "./Companies.css"; // import file css đã viết
import IntroNavbar from "../components/IntroNavbar";

export default function Companies() {
  const [search, setSearch] = useState("");

  // dữ liệu demo (bạn có thể thay bằng API)
  const jobList = [
    { id: 1, location: "Hà Nội", count: 12 },
    { id: 2, location: "TP.HCM", count: 20 },
    { id: 3, location: "Đà Nẵng", count: 8 },
    { id: 4, location: "Hải Phòng", count: 5 },
    { id: 5, location: "Cần Thơ", count: 9 },
    { id: 6, location: "Nha Trang", count: 7 },
  ];

  // lọc job theo search
  const filteredJobs = jobList.filter((job) =>
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobs-root">
      <IntroNavbar />
      <div className="jobs-container">
        {/* Thanh tìm kiếm */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm công ty..."
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

        {/* Lưới job card */}
        <div className="job-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-image"></div>
              <div className="job-info">
                <span className="badge">{job.location}</span>
                <span className="badge">{job.count} việc</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}