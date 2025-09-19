import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar"; 
import "./Home.css";
import Footer from "../components/Footer";

export default function Home() {
  const railRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let speed = 0.7;
    let direction = 1;
    let rafId = null;

    const tick = () => {
      rail.scrollTop += speed * direction;
      if (rail.scrollTop + rail.clientHeight >= rail.scrollHeight) direction = -1;
      if (rail.scrollTop <= 0) direction = 1;
      rafId = requestAnimationFrame(tick);
    };

    const start = () => { if (rafId === null) rafId = requestAnimationFrame(tick); };
    const stop  = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } };

    rail.addEventListener("mouseenter", stop);
    rail.addEventListener("mouseleave", start);
    start();

    return () => { rail.removeEventListener("mouseenter", stop); rail.removeEventListener("mouseleave", start); stop(); };
  }, []);

  return (
    <div className="page home-root">
      <Navbar />

      <div className="container">
        <div className="main-content">
          <h1>Find Your Dream Job!</h1>
          <p>find work, build your future.</p>

          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <button className="apply-btn">APPLY NOW</button>
          </div>
        </div>

        <aside className="side-rail">
          <div className="rail-scroll" ref={railRef}>
            <a className="rail-card">UI/UX Designer — Figma</a>
            <a className="rail-card">Frontend Dev — React</a>
            <a className="rail-card">QA Tester — Postman</a>
            <a className="rail-card">Backend Node — Express</a>
            <a className="rail-card">Data Intern — SQL</a>
            <a className="rail-card">DevOps Intern — Docker</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
