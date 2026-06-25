// src/storefrontSignatures.js
// Pure, Node-runnable resolver for the per-storefront SIGNATURE layer (R2 —
// recognizable storefronts). Reads storefront-signatures.v0.1.json and resolves
// a storefront's curation key (or name) to its signature, with color token NAMES
// resolved against SIGNATURE_PALETTE so the no-miss rule holds. No Three.js.
//
// Application rule (mirrors signatureContract.js): a present signature wins over
// the kit default for that shop; an absent shop falls through (signatureFor →ull).
import { SIGNATURE_PALETTE } from "./visualSystem/palette.js";
import DATA from "./data/facade-signatures/storefront-signatures.v0.1.json" with { type: "json" };

// The set of valid token names a signature may reference (the keys of the
// re-exposed II-C palette tones). Exported so a verifier/test can assert the data
// never references a token outside the palette.
export const SIGNATURE_TOKEN_NAMES = new Set(Object.keys(SIGNATURE_PALETTE));

// Resolve a signature color token NAME → numeric II-C palette value.
// Returns undefined for an unknown name (caller decides the fallback).
export function tokenColor(name) {
  if (typeof name !== "string") return undefined;
  return Object.prototype.hasOwnProperty.call(SIGNATURE_PALETTE, name)
    ? SIGNATURE_PALETTE[name]
    : undefined;
}

const _norm = (s) => (typeof s === "string" ? s.trim().toLowerCase() : "");

// Index the data once: by exact key and by normalized matchName/name.
const _byKey = new Map();
const _byName = new Map();
for (const entry of DATA.storefronts ?? []) {
  if (entry.key) _byKey.set(entry.key, entry);
  if (entry.matchName) _byName.set(_norm(entry.matchName), entry);
}

// Look up a storefront signature by its curation key first, then by a
// case-insensitive name match. Returns the raw entry (token names intact) or
// null when no signature exists — the caller then renders the kit default.
export function signatureFor(keyOrName) {
  if (typeof keyOrName !== "string" || keyOrName.length === 0) return null;
  return _byKey.get(keyOrName) ?? _byName.get(_norm(keyOrName)) ?? null;
}
