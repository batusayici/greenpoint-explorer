import test from "node:test";
import assert from "node:assert/strict";
import {
  POSTHOG_CONFIG,
  createCaptureTransport,
  initPostHog,
} from "./posthogTransport.js";

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
