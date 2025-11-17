// File: Home.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";
const toAbsUrl = (u) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return `${API_BASE}/uploads/${u}`;
};

export default function Home({ user, setUser }) {
  const railRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // hiệu ứng tự cuộn: giữ nguyên
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let speed = 0.7,
      direction = 1,
      rafId = null;
    const tick = () => {
      rail.scrollTop += speed * direction;
      if (rail.scrollTop + rail.clientHeight >= rail.scrollHeight - 0.7)
        direction = -1;
      if (rail.scrollTop <= 0) direction = 1;
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    rail.addEventListener("mouseenter", stop);
    rail.addEventListener("mouseleave", start);
    start();
    return () => {
      rail.removeEventListener("mouseenter", stop);
      rail.removeEventListener("mouseleave", start);
      stop();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs?status=opened&limit=6`);
        const data = await res.json();
        setJobs(Array.isArray(data?.jobs) ? data.jobs : []);
      } catch (e) {
        console.error(e);
        setJobs([]);
      }
    })();
  }, []);

  const handleSearch = () => {
    const q = keyword.trim();
    if (q) {
      navigate(`/jobs?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/jobs`); 
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <div className="page home-root">
      <Navbar user={user} setUser={setUser} />

      <div className="container">
        <div className="main-content">
          <h1>Find Your Dream Job!</h1>
          <p>find work, build your future.</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="apply-btn" onClick={handleSearch}>
              SEARCH
            </button>
          </div>
        </div>

        <aside className="side-rail">
          <div className="rail-scroll" ref={railRef}>
            {jobs.length === 0 ? (
              <>
                <a className="rail-card"></a>
                <a className="rail-card"></a>
                <a className="rail-card"></a>
                <a className="rail-card"></a>
                <a className="rail-card"></a>
                <a className="rail-card"></a>
              </>
            ) : (
              jobs.map((j) => (
                <Link
                  key={j.ID_Job}
                  className="rail-card"
                  to={`/jobs/${j.ID_Job}`}
                >
                  <div className="home-job-row">
                    <div className="home-job-logo">
                      <img
                        src={
                          j.Company_Logo
                            ? toAbsUrl(j.Company_Logo)
                            : "https://via.placeholder.com/84?text=Logo"
                        }
                        alt="logo"
                      />
                    </div>

                    <div className="home-job-main">
                      <div className="home-job-company" title={j.Company_Name}>
                        <span className="marquee">{j.Company_Name}</span>
                      </div>

                      <div className="home-job-title" title={j.Name_Job}>
                        <span className="marquee">{j.Name_Job}</span>
                      </div>
                    </div>

                    <div className="home-job-side">
                      <span className="home-job-location">
                        {j.Job_Location || "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}