import React, { useState } from "react";
import "./MyJobs.css";
import IntroNavbar from "../components/IntroNavbar";

export default function MyJobs({ user, setUser }) {
  const [form, setForm] = useState({
    title: "",
    type: "",
    date: "",
    experience: "",
    location: "",
    salary: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form);
  };

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />

      {/* Danh sách job */}
      <div className="job-list">
        <div className="job-card">
          <h3>Tên công ty - Tên vị trí</h3>
          <div className="job-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="job-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>

        <div className="job-card">
          <h3>Tên công ty - Tên vị trí</h3>
          <div className="job-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="job-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>

        <div className="job-card">
          <h3>Tên công ty - Tên vị trí</h3>
          <div className="job-info">
            <p>Registration date</p>
            <p>Location</p>
          </div>
          <div className="job-info">
            <p>Salary level</p>
            <p>Type</p>
          </div>
        </div>
      </div>

      {/* Form nhập thông tin */}
      <div className="jobs-container">
        <form className="job-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter job title"
            />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Enter type"
            />
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Experience:</label>
            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Enter experience"
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>

          <div className="form-group">
            <label>Salary level:</label>
            <input
              type="text"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Enter salary"
            />
          </div>

          <div className="form-group">
            <label>Job Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities"
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="save-btn"
          >Save</button>
        </form>
      </div>
    </div>
  );
}
