import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        console.error(" Error parsing saved user data");
        localStorage.removeItem("user");
      }
    }
  }, []);

  return <AppRoutes user={user} setUser={setUser} />;
}
