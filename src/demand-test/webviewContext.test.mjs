import test from "node:test";
import assert from "node:assert/strict";
import { detectWebview, webviewEventContext } from "./webviewContext.js";

// Real user-agent strings. Kept verbatim because the whole module is a
// signature match — a paraphrased UA would test nothing.
const UA = {
  fbIOS:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22F76 [FBAN/FBIOS;FBDV/iPhone16,2;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]",
  fbAndroid:
    "Mozilla/5.0 (Linux; Android 15; Pixel 8 Build/AP4A.250105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/132.0.6834.163 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/499.0.0.48.76;]",
  instagramIOS:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22F76 Instagram 355.0.0.29.106 (iPhone16,2; iOS 18_5; en_US; en-US; scale=3.00; 1179x2556; 700000000)",
  androidWebview:
    "Mozilla/5.0 (Linux; Android 15; Pixel 8 Build/AP4A.250105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/132.0.6834.163 Mobile Safari/537.36",
  mobileSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  desktopChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
};

test("Facebook's iOS in-app browser is identified as facebook", () => {
  assert.deepEqual(detectWebview(UA.fbIOS), { inApp: true, app: "facebook" });
});

test("Facebook's Android in-app browser is identified as facebook", () => {
  // FB_IAB must win over the generic Android `wv` marker also present here —
  // Q2's whole point is knowing WHICH app, not just that it was in-app.
  assert.deepEqual(detectWebview(UA.fbAndroid), { inApp: true, app: "facebook" });
});

test("Instagram's in-app browser is identified as instagram", () => {
  assert.deepEqual(detectWebview(UA.instagramIOS), { inApp: true, app: "instagram" });
});

test("a generic Android webview is in-app but unattributed", () => {
  assert.deepEqual(detectWebview(UA.androidWebview), { inApp: true, app: "other" });
});

test("ordinary mobile Safari is not a webview", () => {
  assert.deepEqual(detectWebview(UA.mobileSafari), { inApp: false, app: null });
});

test("desktop Chrome is not a webview", () => {
  assert.deepEqual(detectWebview(UA.desktopChrome), { inApp: false, app: null });
});

test("a missing or malformed user agent never throws", () => {
  // This runs at boot, before React exists (boot.js contract) — a throw here
  // would leave #root empty, which is worse than losing the property.
  for (const bad of [undefined, null, "", 42, {}]) {
    assert.deepEqual(detectWebview(bad), { inApp: false, app: null });
  }
});

test("webviewEventContext emits the property only inside an app", () => {
  assert.deepEqual(webviewEventContext(UA.fbIOS), { webview: "facebook" });
  assert.deepEqual(webviewEventContext(UA.instagramIOS), { webview: "instagram" });
  assert.deepEqual(webviewEventContext(UA.androidWebview), { webview: "other" });
  // Ordinary browsers get no property at all — a "none" on every desktop
  // session would be noise in every query that filters on it.
  assert.deepEqual(webviewEventContext(UA.mobileSafari), {});
  assert.deepEqual(webviewEventContext(undefined), {});
});
