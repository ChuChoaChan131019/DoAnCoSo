import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Introduce from "../pages/Introduce.jsx";
import Footer from "../components/Footer.jsx";
import Jobs from "../pages/Jobs.jsx";
import CV from "../pages/CV.jsx";
import Companies from "../pages/Companies.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />        {/* alias */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/companies" element={<Companies/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
