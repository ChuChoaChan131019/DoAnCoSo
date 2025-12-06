import React, { use, useEffect, useState } from "react";
import "./Companies.css";
import IntroNavbar from "../components/IntroNavbar";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API;

export default function Companies({ user, setUser }) {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Gọi API khi search thay đổi
  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        if (!API_BASE) throw new Error("API base URL is not configured.");

        const res = await fetch(
          `${API_BASE}/api/companies?search=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Lỗi khi load companies:", err);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="companies-root">
      <IntroNavbar user={user} setUser={setUser} />

      <div className="companies-container">
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

        <div className="company-grid">
          {companies.length > 0 ? (
            companies.map((c) => (
              <div
                key={c.ID_Employer}
                className="company-card"
                onClick={() => navigate(`/companies/${c.ID_Employer}`)}
              >
                <div className="company-header">
                  {c.Company_Logo ? (
                    <img
                      src={
                        c.Company_Logo
                          ? `${API_BASE}/uploads/${c.Company_Logo.replace(
                              /^\/?uploads\//,
                              ""
                            )}`
                          : "/default-logo.png"
                      }
                      alt={c.Company_Name}
                      className="company-logo"
                    />
                  ) : null}
                  <h3 className="company-name">{c.Company_Name}</h3>
                </div>
                <div className="company-footer">
                  <p className="company-address">{c.Company_Address}</p>
                  <p className="company-jobs">{c.JobCount} việc đang tuyển</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-result">Không tìm thấy công ty nào</p>
          )}
        </div>
      </div>
    </div>
  );
}
