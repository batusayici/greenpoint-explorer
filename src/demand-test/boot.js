// Boot-time containment (2026-08-13). Same rule as FeatureBoundary, one phase
// earlier: NOTHING THAT RUNS BEFORE THE RENDER MAY PREVENT THE RENDER.
//
// The map bug had a twin hiding in main.jsx. Analytics wiring, the retention
// sensor and the orientation flag all run at module scope — before React
// exists — so a throw there is not something an error boundary can catch. It
// kills the module, createRoot() never runs, and #root stays empty. The home
// page has no prerendered body to fall back on (index.html ships a 51-byte
// body; the AEO injection there is JSON-LD, and only /e/<slug> pages carry
// real prerendered text), so the reader gets a genuinely blank page — worse
// than the crash screen, because nothing renders at all.
//
// Both helpers exist so this is testable under `node --test` like every other
// logic module, rather than living inline in a file that self-executes.

// window.localStorage THROWS on the PROPERTY READ — not on getItem — when the
// browser blocks site data (Chrome with cookies/site-data blocked raises
// SecurityError; Safari has historically done the same in Lockdown/private
// contexts). returnVisit.js and firstVisitOrientation.js both already guard
// their USE of storage with try/catch, which is why this was easy to miss:
// the thinking was there, one layer too deep to help. Reading the property is
// the dangerous part, so the guard belongs here, at the read.
//
// Returns null when storage is unreachable; the consumers treat a null store
// as "no storage" and fail closed.
export function safeStorage(name, win = globalThis) {
  try {
    return win[name] ?? null;
  } catch {
    return null;
  }
}

// Runs one boot side-effect in isolation. Per-step rather than one try/catch
// around the whole sequence, so a dead analytics vendor can't also cost the
// reader their first-visit orientation line — each passenger fails alone, the
// same contract the UI surfaces get from FeatureBoundary.
//
// Returns undefined on failure; callers supply their own fallback so the
// degraded value is chosen at the call site, where the meaning is known.
export function bootSafely(what, fn, { onError = console.error } = {}) {
  try {
    return fn();
  } catch (error) {
    // Never rethrow: the render is downstream of every one of these.
    onError(`[boot] ${what} failed — continuing without it`, error);
    return undefined;
  }
}
