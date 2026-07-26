import test from "node:test";
import assert from "node:assert/strict";
import {
  POSTHOG_CONFIG,
  buildInitConfig,
  createCaptureTransport,
  initPostHog,
} from "./posthogTransport.js";

// Regression (2026-07-21): posthog-js mutates the config it receives (writes
// the token into it). Passing the frozen contract object made that write fail
// silently — initialized instance, null token, every capture dropped. init
// must always get a fresh mutable copy.
test("buildInitConfig returns a mutable copy of the frozen contract", () => {
  const cfg = buildInitConfig();
  assert.deepEqual(cfg, { ...POSTHOG_CONFIG });
  assert.ok(!Object.isFrozen(cfg), "posthog-js must be able to write into its config");
  cfg.token = "phc_test";
  assert.equal(cfg.token, "phc_test");
  assert.notEqual(buildInitConfig(), cfg, "each call yields a fresh object");
});

test("createCaptureTransport forwards name + payload to posthog.capture", () => {
  const calls = [];
  const fake = { capture: (name, payload) => calls.push([name, payload]) };
  const transport = createCaptureTransport(fake);
  transport("card_open", { cardId: "sailor-and-siren", src: "wave1" });
  assert.deepEqual(calls, [
    ["card_open", { cardId: "sailor-and-siren", src: "wave1" }],
  ]);
});

test("initPostHog resolves null without a key (ships dark until the key lands)", async () => {
  assert.equal(await initPostHog(undefined), null);
  assert.equal(await initPostHog(""), null);
});

// The privacy contract is load-bearing for a neighborhood-trust product:
// no cookies, no autocapture, no session recording. A config drift here is a
// product decision, not a refactor — the test makes it one.
test("POSTHOG_CONFIG locks the privacy-light contract", () => {
  assert.equal(POSTHOG_CONFIG.autocapture, false);
  assert.equal(POSTHOG_CONFIG.disable_session_recording, true);
  assert.equal(POSTHOG_CONFIG.persistence, "localStorage");
  assert.equal(POSTHOG_CONFIG.capture_pageview, true);
  assert.equal(POSTHOG_CONFIG.capture_pageleave, false);
  assert.ok(Object.isFrozen(POSTHOG_CONFIG));
});

// Launch-readiness hard gate (2026-07-26): error monitoring active before the
// public push. Exception autocapture watches window.onerror/unhandledrejection
// — it reports crashes, not behavior, so the privacy-light contract above is
// untouched (still no interaction autocapture, no recording, no cookies).
test("POSTHOG_CONFIG enables exception capture (error-monitoring gate)", () => {
  assert.equal(POSTHOG_CONFIG.capture_exceptions, true);
});
