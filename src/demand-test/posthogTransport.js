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
});

export function createCaptureTransport(posthog) {
  return (name, payload) => posthog.capture(name, payload);
}

// No key → resolve null and change nothing (the page ships dark until
// VITE_POSTHOG_KEY lands in the Vercel env / .env.local).
export async function initPostHog(key) {
  if (!key) return null;
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, POSTHOG_CONFIG);
  return posthog;
}
