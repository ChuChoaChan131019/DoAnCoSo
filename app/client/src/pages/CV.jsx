import "./CV.css";
import IntroNavbar from "../components/IntroNavbar";

export default function CV() {
  return (
    <div className="cv-root">
      <IntroNavbar />

      <div className="cv-container">
        <form className="cv-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" placeholder="Enter full name" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="text" id="phone" placeholder="Enter phone number" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter email address" />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" placeholder="Enter contact address" />
          </div>

          <div className="form-group upload-group">
            <label className="upload-label">Upload CV</label>
            <div className="upload-box">
              <p>Click or drag file to this area to upload</p>
              <input type="file" />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="save-btn">Save</button>
            <button type="reset" className="delete-btn">Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}