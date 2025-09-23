import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // đọc user từ localStorage khi app load
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return <AppRoutes user={user} setUser={setUser} />;
}