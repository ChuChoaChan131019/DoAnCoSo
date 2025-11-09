import React, { useEffect, useState } from "react";
import "./ListCandidate.css";
import IntroNavbar from "../components/IntroNavbar";

export default function ListCandidate({ user, setUser }) {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy danh sách ứng viên từ backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/candidates/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setCandidates(data.candidates || []);
        else console.error(data.message);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // 🔹 Lọc theo từ khóa tìm kiếm
  const filteredCandidates = candidates.filter(
    (c) =>
      c.FullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.Address?.toLowerCase().includes(search.toLowerCase()) ||
      c.Email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      {/* Thanh tìm kiếm */}
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

      {/* Danh sách ứng viên */}
      <div className="candidate-list">
        {loading ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>Đang tải...</p>
        ) : filteredCandidates.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            Không tìm thấy ứng viên nào.
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
              {c.Resume_URL && (
                <a
                  href={`http://localhost:5000${c.Resume_URL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: "8px",
                    color: "#003763",
                    fontWeight: "bold",
                    textDecoration: "underline",
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