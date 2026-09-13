import React from "react";
import { createRoot } from "react-dom/client";
import { inject, track } from "@vercel/analytics";
import { EVENTS, bindTransport, setEventContext, trackEvent } from "./trackEvents.js";
import { createCaptureTransport, initPostHog } from "./posthogTransport.js";
import { recordReturnVisit } from "./returnVisit.js";
import { shouldShowOrientation } from "./firstVisitOrientation.js";
import { webviewEventContext } from "./webviewContext.js";
import JulyApp from "./JulyApp.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { safeStorage, bootSafely } from "./boot.js";
import "./july.css";

// Everything above the render is a PASSENGER (2026-08-13). None of it is the
// product, all of it runs before React exists — so a throw here is past the
// reach of any error boundary and would leave #root empty. Each step is
// isolated; see boot.js for why per-step rather than one big try/catch.

// Pageviews via Vercel; custom tap events via PostHog (2026-07-21 transport
// decision — Vercel custom events are Pro-gated). Vercel's track stays bound
// as the default so dev keeps console logging and events flow the moment
// PostHog init resolves; taps fired in the gap follow the old path.
bootSafely("analytics transport", () => {
  inject();
  bindTransport(track);
});

// R0 retention sensor: record at boot (before any await, so a fast tab close
// still counts the visit), but fire after PostHog init settles — a boot-time
// event fired in the transport gap would land in Vercel's Pro-gated custom
// events and vanish. Once per session; reloads don't inflate the count.
// safeStorage, not window.localStorage: the PROPERTY READ throws when the
// browser blocks site data, and this line runs before React can catch anything.
const visit =
  bootSafely("return-visit sensor", () =>
    recordReturnVisit({
      local: safeStorage("localStorage"),
      session: safeStorage("sessionStorage"),
      now: Date.now(),
    }),
  ) ?? null;
const showOrientation =
  bootSafely("orientation flag", () => shouldShowOrientation(safeStorage("localStorage"))) ?? false;
bootSafely("posthog", () => {
  initPostHog(import.meta.env.VITE_POSTHOG_KEY)
    .then((posthog) => {
      if (posthog) bindTransport(createCaptureTransport(posthog));
      if (visit) {
        trackEvent(EVENTS.RETURN_VISIT, {
          visitCount: visit.visitCount,
          weekIndex: visit.weekIndex,
        });
      }
    })
    // The .then body runs after boot, so bootSafely's try/catch is long gone by
    // then — an unhandled rejection here would surface as a page-level error.
    .catch((error) => console.error("[boot] posthog init rejected", error));
});

// Limited launch (2026-07-15): invite links carry ?src=<channel> (wave1,
// perri, …) so every event separates by acquisition channel in the dashboard.
//
// The in-app-browser tag rides the SAME call on purpose (2026-08-19).
// setEventContext REPLACES the context rather than merging into it, so a
// second call would silently drop the channel tag — the one property every
// experiment read depends on. One call, one object, both properties.
bootSafely("channel tag", () => {
  const src = new URLSearchParams(window.location.search).get("src");
  const context = {
    ...(src ? { src } : {}),
    ...webviewEventContext(navigator.userAgent),
  };
  if (Object.keys(context).length > 0) setEventContext(context);
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <JulyApp showOrientation={showOrientation} />
    </ErrorBoundary>
  </React.StrictMode>,
);
