import React from "react";
import { createRoot } from "react-dom/client";
import { inject, track } from "@vercel/analytics";
import { bindTransport } from "./trackEvents.js";
import JulyApp from "./JulyApp.jsx";
import "./july.css";

// Pageviews + custom tap events (Track V validation instrumentation).
// In dev, @vercel/analytics logs to the console instead of sending.
inject();
bindTransport(track);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JulyApp />
  </React.StrictMode>,
);
