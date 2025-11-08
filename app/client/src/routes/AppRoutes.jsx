import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Introduce from "../pages/Introduce.jsx";
import Footer from "../components/Footer.jsx";
import Jobs from "../pages/Jobs.jsx";
import CV from "../pages/CV.jsx";
import Companies from "../pages/Companies.jsx";
import FAQ from "../pages/FAQ.jsx";
import MyApply from "../pages/MyApply.jsx";
import Profile from "../pages/Profile.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import CompanyDetail from "../pages/CompanyDetail.jsx";
import ListCandidate from "../pages/ListCandidate.jsx";
import MyJobs from "../pages/MyJobs.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import JobDetail from "../pages/JobDetail.jsx";

export default function AppRoutes({ user, setUser }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* Truyền cả user và setUser để Home có thể đưa xuống Navbar */}
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route
          path="/home"
          element={<Home user={user} setUser={setUser} />}
        />{" "}
        {/* alias */}
        {/* Login chỉ cần setUser */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        {/* Các page khác nếu có Navbar/IntroNavbar thì cũng cần user, setUser */}
        <Route
          path="/introduce"
          element={<Introduce user={user} setUser={setUser} />}
        />
        <Route path="/jobs" element={<Jobs user={user} setUser={setUser} />} />
        <Route path="/cv" element={<CV user={user} setUser={setUser} />} />
        <Route
          path="/companies"
          element={<Companies user={user} setUser={setUser} />}
        />
        <Route path="/faq" element={<FAQ user={user} setUser={setUser} />} />
        <Route
          path="/MyApply"
          element={<MyApply user={user} setUser={setUser} />}
        />
        <Route
          path="/profile"
          element={<Profile user={user} setUser={setUser} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/companies/:id"
          element={<CompanyDetail user={user} setUser={setUser} />}
        />
        <Route
          path="/listcandidate"
          element={<ListCandidate user={user} setUser={setUser} />}
        />
        <Route
          path="/myJobs"
          element={<MyJobs user={user} setUser={setUser} />}
        />
        <Route
          path="/changepassword"
          element={<ChangePassword user={user} setUser={setUser} />}
        />
        <Route
          path="/jobdetail"
          element={<JobDetail user={user} setUser={setUser} />}
        />
        {/* Route for individual job pages (used by links like /jobs/:id) */}
        <Route
          path="/jobs/:id"
          element={<JobDetail user={user} setUser={setUser} />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
