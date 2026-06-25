// Recognizable-silhouette SIGNATURE contract (define-only). A per-BIN, evidence-
// bound override of a few typological signatures on top of the generic kit base.
// This module only VALIDATES the data shape so the contract is checkable; it does
// NOT apply signatures and is NOT wired into any renderer (that is a later build
// pass). Application rule (documented, not coded here): a present signature key
// wins over the base for that aspect; absent keys fall through to the kit.
const ALLOWED_KEYS = new Set(["cornice", "corner", "color"]);

export function isValidSignature(obj) {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.bin !== "string" || obj.bin.length === 0) return false;
  const sig = obj.signatures;
  if (!sig || typeof sig !== "object") return false;
  const keys = Object.keys(sig);
  if (keys.length === 0) return false;
  return keys.every((k) => ALLOWED_KEYS.has(k) && sig[k] != null);
}
