import React from "react";
import { createRoot } from "react-dom/client";
import { inject, track } from "@vercel/analytics";
import { bindTransport, setEventContext } from "./trackEvents.js";
import JulyApp from "./JulyApp.jsx";
import "./july.css";

// Pageviews + custom tap events (Track V validation instrumentation).
// In dev, @vercel/analytics logs to the console instead of sending.
inject();
bindTransport(track);

// Limited launch (2026-07-15): invite links carry ?src=<channel> (wave1,
// perri, …) so every event separates by acquisition channel in the dashboard.
const src = new URLSearchParams(window.location.search).get("src");
if (src) setEventContext({ src });

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JulyApp />
  </React.StrictMode>,
);
