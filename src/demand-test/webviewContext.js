// In-app browser detection (D5 item 8 / D8, 2026-08-19). Q2's parents posts go
// into Facebook groups, so close to 100% of that channel's taps arrive inside
// Facebook's in-app browser — a context with its own storage jar, separate
// from Safari's or Chrome's. A reader who taps the group post, then comes back
// later in their real browser, is TWO people to the retention sensor. That
// deflates return rates on every webview-borne channel relative to the
// email-borne org channels, which is why cross-channel return comparisons
// already carry an asymmetry caveat (growth-engine §1, P1).
//
// This module does not fix that — nothing client-side can. It makes the
// asymmetry MEASURABLE: every event carries which app it was viewed in, so a
// Q2 vs org-channel comparison can be split rather than caveated. Same shape
// as the Safari-eviction ruling (2026-08-19): measure the bias, label the
// read, don't spend a trust asset removing it.
//
// Signature matching only. No fingerprinting — the user agent is a string the
// browser volunteers on every request; we keep one derived word from it.

// Facebook's markers, in the order they matter. FBAN/FBIOS are iOS; FB_IAB is
// the Android in-app browser; FBAV (app version) rides both. Any one of them
// is conclusive.
const FACEBOOK = /FBAN\/|FBIOS|FB_IAB|FBAV\//;

// Instagram's UA appends the literal app name plus a version. Word-boundary
// anchored so a URL or venue name containing "instagram" can never match — the
// UA is not user-controlled here, but the cost of the anchor is nothing.
const INSTAGRAM = /\bInstagram\b/;

// The generic Android WebView marker: `; wv)` in the platform section. Present
// in EVERY Android in-app browser including Facebook's, which is why it is
// checked last — "which app" is the answer Q2 needs, and `other` is only the
// fallback when no app claims the session.
const ANDROID_WEBVIEW = /;\s*wv\)/;

// Returns { inApp, app } — app is "facebook" | "instagram" | "other" | null.
// Never throws: this runs at boot before React exists (boot.js contract), and
// a throw there leaves #root empty. A missing property is the correct failure.
export function detectWebview(userAgent) {
  if (typeof userAgent !== "string" || userAgent === "") {
    return { inApp: false, app: null };
  }
  if (FACEBOOK.test(userAgent)) return { inApp: true, app: "facebook" };
  if (INSTAGRAM.test(userAgent)) return { inApp: true, app: "instagram" };
  if (ANDROID_WEBVIEW.test(userAgent)) return { inApp: true, app: "other" };
  return { inApp: false, app: null };
}

// The event-context shape. Returns {} for an ordinary browser rather than
// `webview: "none"` so the property exists only where it means something —
// a null-ish property on every desktop session would be noise in every query.
export function webviewEventContext(userAgent) {
  const { inApp, app } = detectWebview(userAgent);
  return inApp ? { webview: app } : {};
}
