import React, { useState } from "react";
import "./ListCandidate.css"; 
import IntroNavbar from "../components/IntroNavbar";

export default function ListCandidate({ user, setUser }) {
  const [search, setSearch] = useState("");

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        {/* Icon tìm kiếm đưa lên trước */}
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

        {/* Ô input */}
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm công ty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Nút sort by */}
        <button className="sort-btn">Sort by</button>
      </div>

      {/* Danh sách job */}
      <div className="candidate-list">
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
        <div className="candidate-card">
          <h3>Tên ứng viên - Tên vị trí</h3>
          <div className="candidate-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="candidate-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
      </div>
    </div>
  );
}