// Run: node --test src/storefrontSignatures.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { signatureFor, tokenColor, SIGNATURE_TOKEN_NAMES } from "./storefrontSignatures.js";
import { SIGNATURE_PALETTE } from "./visualSystem/palette.js";

test("resolves Elder Greene by curation key", () => {
  const sig = signatureFor("elder-greene");
  assert.ok(sig, "expected a signature for elder-greene");
  assert.equal(sig.category, "bar");
  assert.equal(sig.signature.awning.profile, "straight");
  assert.equal(sig.signature.awning.stripe, "pinstripe");
  assert.equal(sig.signature.awning.wrapCorner, true);
});

test("resolves by matchName, case-insensitively", () => {
  const a = signatureFor("Elder Greene");
  const b = signatureFor("elder greene");
  assert.ok(a && b);
  assert.equal(a.key, "elder-greene");
  assert.equal(b.key, "elder-greene");
});

test("returns null for an unknown shop (falls through to kit default)", () => {
  assert.equal(signatureFor("no-such-shop"), null);
  assert.equal(signatureFor(null), null);
  assert.equal(signatureFor(undefined), null);
});

test("tintTokens resolve to in-palette colors (no-miss)", () => {
  const sig = signatureFor("elder-greene");
  const tokens = [
    sig.signature.awning.tintToken,
    sig.signature.frame.tintToken,
    sig.signature.transom.tintToken,
    sig.signature.blade.tintToken,
  ];
  const palette = new Set(Object.values(SIGNATURE_PALETTE));
  for (const t of tokens) {
    const c = tokenColor(t);
    assert.equal(typeof c, "number", `token ${t} should resolve to a number`);
    assert.ok(palette.has(c), `token ${t} -> 0x${c.toString(16)} must be an in-palette tone`);
  }
});

test("every tintToken used in the data is a known SIGNATURE_PALETTE name", () => {
  const sig = signatureFor("elder-greene");
  const used = [
    sig.signature.awning.tintToken,
    sig.signature.frame.tintToken,
    sig.signature.transom.tintToken,
    sig.signature.blade.tintToken,
  ];
  for (const t of used) {
    assert.ok(SIGNATURE_TOKEN_NAMES.has(t), `${t} must be a declared signature token`);
  }
});

test("tokenColor returns undefined for an unknown token name", () => {
  assert.equal(tokenColor("not-a-token"), undefined);
});
