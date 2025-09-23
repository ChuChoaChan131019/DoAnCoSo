import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Introduce from "../pages/Introduce.jsx";
import Footer from "../components/Footer.jsx";
import Jobs from "../pages/Jobs.jsx";
import CV from "../pages/CV.jsx";
import Companies from "../pages/Companies.jsx";

export default function AppRoutes({ user, setUser }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* Truyền cả user và setUser để Home có thể đưa xuống Navbar */}
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/home" element={<Home user={user} setUser={setUser} />} /> {/* alias */}

        {/* Login chỉ cần setUser */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/register" element={<Register />} />

        {/* Các page khác nếu có Navbar/IntroNavbar thì cũng cần user, setUser */}
        <Route path="/introduce" element={<Introduce user={user} setUser={setUser} />} />
        <Route path="/jobs" element={<Jobs user={user} setUser={setUser} />} />
        <Route path="/cv" element={<CV user={user} setUser={setUser} />} />
        <Route path="/companies" element={<Companies user={user} setUser={setUser} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}