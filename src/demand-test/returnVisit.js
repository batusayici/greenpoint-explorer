// R0 retention sensor (growth-engine 2026-07-25, pulled forward from ops-plan
// Phase 4): privacy-light return-visit measurement. PostHog runs cookieless so
// visitor identity rotates — this localStorage first-seen + visit count is the
// only retention signal we have. No fingerprinting: two timestamps-worth of
// state, all on the visitor's own device, surfaced as primitive event props.
// Storage objects are injected so the module runs under node --test.
export const RETURN_VISIT_KEYS = Object.freeze({
  firstSeen: "gl_first_seen",
  visitCount: "gl_visit_count",
  sessionMark: "gl_session_seen",
});

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Returns { visitCount, weekIndex } once per browser session (the sessionMark
// keeps reloads from inflating the count), null on a repeat call or when
// storage is unavailable (private mode) — analytics must never break the app.
export function recordReturnVisit({ local, session, now }) {
  try {
    if (session.getItem(RETURN_VISIT_KEYS.sessionMark)) return null;
    session.setItem(RETURN_VISIT_KEYS.sessionMark, "1");

    let firstSeen = Number(local.getItem(RETURN_VISIT_KEYS.firstSeen));
    let visitCount = Number(local.getItem(RETURN_VISIT_KEYS.visitCount));
    if (!Number.isFinite(firstSeen) || firstSeen <= 0 || !Number.isFinite(visitCount)) {
      firstSeen = now;
      visitCount = 0;
    }
    visitCount += 1;
    local.setItem(RETURN_VISIT_KEYS.firstSeen, String(firstSeen));
    local.setItem(RETURN_VISIT_KEYS.visitCount, String(visitCount));

    const weekIndex = Math.max(0, Math.floor((now - firstSeen) / WEEK_MS));
    return { visitCount, weekIndex };
  } catch {
    return null;
  }
}
