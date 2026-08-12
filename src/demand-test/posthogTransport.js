// PostHog events transport (2026-07-21): Vercel Web Analytics custom events
// are Pro-gated (and collection was off for the Jul 15–21 window), so tap
// events move to PostHog's free tier through the existing bindTransport seam
// — the swap this seam was built for (DECISION_LOG 2026-07-03).
//
// Privacy-light contract for a neighborhood-trust product: no cookies
// (localStorage persistence keeps a stable anonymous id for retention),
// no autocapture, no session recording — named tap events + pageviews only.
// posthog-js is imported dynamically so this module stays `node --test`-able
// and the bundle pays for the vendor only when a key is configured.
export const POSTHOG_CONFIG = Object.freeze({
  api_host: "https://us.i.posthog.com",
  autocapture: false,
  capture_pageview: true,
  capture_pageleave: false,
  disable_session_recording: true,
  persistence: "localStorage",
  // Error monitoring (launch-readiness hard gate, 2026-07-26): autocapture
  // window.onerror + unhandledrejection into PostHog error tracking. Crashes,
  // not behavior — the privacy-light contract above is unchanged.
  capture_exceptions: true,
});

export function createCaptureTransport(posthog) {
  return (name, payload) => posthog.capture(name, payload);
}

// posthog-js MUTATES the config object it is given (it writes the token and
// merged defaults into it) — handing it the frozen contract object above made
// the token write fail silently and every capture drop. Always pass a copy.
export function buildInitConfig() {
  return { ...POSTHOG_CONFIG };
}

// Environment gate (2026-08-12): dev sessions were sending real events into
// the prod PostHog project, contaminating the R0 retention baseline. Only the
// serving origins may capture — localhost and Vercel preview deployments
// (unique per-branch *.vercel.app hosts) ship dark. Exact-match allowlist,
// never a suffix test: preview hosts share the vercel.app suffix.
const SERVING_HOSTS = Object.freeze(
  new Set([
    "stoopwise.com",
    "www.stoopwise.com",
    "greenpoint.life",
    "www.greenpoint.life",
    "greenpoint-explorer.vercel.app",
  ]),
);

export function posthogAllowedHost(hostname) {
  return SERVING_HOSTS.has(hostname);
}

// No key → resolve null and change nothing (the page ships dark until
// VITE_POSTHOG_KEY lands in the Vercel env / .env.local). Non-serving host →
// same dark ship, so dev/preview sessions never pollute prod analytics.
export async function initPostHog(key, hostname) {
  // Default resolved in-body so the module stays `node --test`-able (no
  // window at import or default-param evaluation time).
  const host =
    hostname ?? (typeof window === "undefined" ? "" : window.location.hostname);
  if (!key || !posthogAllowedHost(host)) return null;
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, buildInitConfig());
  return posthog;
}
