import React, { useState } from "react";
import IntroNavbar from "../components/IntroNavbar"; 
import "./Jobs.css";

export default function Jobs({ user, setUser }) {
  // state bộ lọc
  const [filters, setFilters] = useState({
    q: "",
    location: "",
    salary: "",
    experience: "",
    all: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((s) => ({ ...s, [name]: value }));
  };

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
          <div className="filter">
            <label>Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option>Hà Nội</option>
              <option>TP.HCM</option>
              <option>Đà Lạt</option>
              <option>Đà Nẵng</option>
            </select>
          </div>

          <div className="filter">
            <label>Salary level</label>
            <select
              name="salary"
              value={filters.salary}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option>Under 10m</option>
              <option>10-15m</option>
              <option>15-20m</option>
              <option>20m+</option>
            </select>
          </div>

          <div className="filter">
            <label>Experience</label>
            <select
              name="experience"
              value={filters.experience}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option>Intern</option>
              <option>0-1 year</option>
              <option>2-3 years</option>
              <option>3+ years</option>
            </select>
          </div>

          <div className="filter">
            <label>Categories</label>
            <select name="all" value={filters.all} onChange={handleChange}>
              <option value="">All</option>
              <option>Development</option>
              <option>Digital</option>
              <option>Design</option>
              <option>Logistic</option>
            </select>
          </div>

          <div className="filter">
            <label>Type</label>
            <select name="type" value={filters.type} onChange={handleChange}>
              <option value="">All</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Freelance</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        <section className="skeleton-list">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </section>
      </main>
    </div>
  );
}
