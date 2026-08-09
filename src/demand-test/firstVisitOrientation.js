// First-visit orientation line (2026-08-08 external-audit item 4). The
// header tagline states the brand's values ("Know what's real. Take part.")
// but never says what the product literally is. A first-time visitor gets
// one plain sentence under it; every visit after, nothing — same
// device-local, no-fingerprinting flag as returnVisit.js (R0), but a
// separate key: this is "have they ever seen the line", not a visit tally.
//
// Checked and set at boot in main.jsx (like recordReturnVisit), not inside a
// React render — a render-time localStorage write is a side effect Strict
// Mode's dev-only double-invoke can run twice, which would flip the second
// call's result to false and hide the line on someone's actual first visit.
export const ORIENTATION_SEEN_KEY = "gl_seen_orientation";

export function shouldShowOrientation(storage) {
  try {
    if (storage.getItem(ORIENTATION_SEEN_KEY)) return false;
    storage.setItem(ORIENTATION_SEEN_KEY, "1");
    return true;
  } catch {
    return false; // private mode / storage unavailable — fail closed, never spam
  }
}
