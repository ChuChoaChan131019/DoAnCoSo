import React,{ useEffect, useState } from "react";
import IntroNavbar from "../components/IntroNavbar";
import "./JobDetail.css";

export default function JobDetail({ user, setUser}) {
  return (
    <div className="change-root">
      <IntroNavbar user={user} setUser={setUser} />

      <main className="change-container">
        {/* Description */}
        <section className="change-text">
            <h1>Job Description</h1>
            <div className="Description-box">
              
              <h2>Mô tả công việc</h2>
                <div className="Description-text">
                  <ul>
                    <li>Giả vờ là có đi</li>
                  </ul>
                </div>
              <h2>Yêu cầu công việc</h2>
                <div className="Description-text">
                  <ul>
                    <li>Giả vờ là nó cũng có đi</li>
                  </ul>
                </div>
              <h2>Quyền lợi được hưởng</h2>
                <div className="Description-text">
                  <ul>
                    <li>Có nha</li>
                  </ul>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}