// Run: node --test src/visualSystem/signatureContract.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { isValidSignature } from "./signatureContract.js";

const HERE = dirname(fileURLToPath(import.meta.url));

test("the committed example matches the contract shape", () => {
  const ex = JSON.parse(
    readFileSync(join(HERE, "../data/facade-signatures/EXAMPLE.signature.v0.1.json"), "utf8"),
  );
  assert.equal(isValidSignature(ex), true);
});

test("rejects missing bin or empty signatures", () => {
  assert.equal(isValidSignature({ signatures: { cornice: "x" } }), false);
  assert.equal(isValidSignature({ bin: "1", signatures: {} }), false);
});

test("rejects unknown signature keys", () => {
  assert.equal(isValidSignature({ bin: "1", signatures: { roofline: "x" } }), false);
});

test("rejects null signature values", () => {
  assert.equal(isValidSignature({ bin: "1", signatures: { color: null } }), false);
});
