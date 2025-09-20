import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Introduce from "../pages/Introduce.jsx";
import CV from "../pages/CV.jsx";
import Navbar from "../components/Navbar.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />        {/* alias */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/cv" element={<CV />} />       {/* thêm route cho CV */}
        <Route path="*" element={<Navigate to="/" />} /> {/* fallback */}
      </Routes>
    </BrowserRouter>
  );
}
