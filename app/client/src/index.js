// client/src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Lấy thẻ <div id="root"> trong public/index.html
const container = document.getElementById("root");

// Tạo root và render App
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);