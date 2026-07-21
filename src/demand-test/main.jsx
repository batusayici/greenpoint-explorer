import React from "react";
import { createRoot } from "react-dom/client";
import { inject, track } from "@vercel/analytics";
import { bindTransport, setEventContext } from "./trackEvents.js";
import { createCaptureTransport, initPostHog } from "./posthogTransport.js";
import JulyApp from "./JulyApp.jsx";
import "./july.css";

// Pageviews via Vercel; custom tap events via PostHog (2026-07-21 transport
// decision — Vercel custom events are Pro-gated). Vercel's track stays bound
// as the default so dev keeps console logging and events flow the moment
// PostHog init resolves; taps fired in the gap follow the old path.
inject();
bindTransport(track);
initPostHog(import.meta.env.VITE_POSTHOG_KEY).then((posthog) => {
  if (posthog) bindTransport(createCaptureTransport(posthog));
});

// Limited launch (2026-07-15): invite links carry ?src=<channel> (wave1,
// perri, …) so every event separates by acquisition channel in the dashboard.
const src = new URLSearchParams(window.location.search).get("src");
if (src) setEventContext({ src });

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JulyApp />
  </React.StrictMode>,
);
