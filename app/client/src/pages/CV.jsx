import "./CV.css";
import IntroNavbar from "../components/IntroNavbar";

export default function CV() {
  return (
    <div className="cv-root">
      <IntroNavbar />

      <div className="cv-container">
        <form className="cv-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Enter full name" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="text" id="phone" placeholder="Enter phone number" />
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
            <p className="upload-title">Upload CV</p>
            <div className="upload-box">
              <p>Click or drag file to this area to upload</p>
              <input type="file" />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn save-btn">Save</button>
            <input type="reset" value="Delete" className="btn delete-btn" />
          </div>
        </form>
      </div>
    </div>
  );
}