import React from "react";
import { createRoot } from "react-dom/client";
import JulyApp from "./JulyApp.jsx";
import "./july.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JulyApp />
  </React.StrictMode>,
);
