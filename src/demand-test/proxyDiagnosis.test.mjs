import test from "node:test";
import assert from "node:assert/strict";
import { classifyFetchFailure, causeChain, isPolicyDenial, proxyAwarenessError } from "./proxyDiagnosis.js";

const PROXY = "http://127.0.0.1:45457";
const URL_ = "https://greenpointers.com/feed/";

// Build the nested shape undici actually produces. Verified empirically
// 2026-08-10 against a proxy answering 403 to every CONNECT.
const nest = (...messages) => {
  let err = null;
  for (const m of [...messages].reverse()) {
    const e = new Error(m);
    if (err) e.cause = err;
    err = e;
  }
  return err;
};

const denial403 = () =>
  nest("fetch failed", "Request was cancelled.", "Proxy response (403) !== 200 when HTTP Tunneling");

test("causeChain flattens more than one level — reading only e.cause.message is the bug", () => {
  const chain = causeChain(denial403());
  assert.ok(chain.includes("fetch failed"));
  assert.ok(chain.includes("Request was cancelled."));
  // The discriminating frame is the DEEPEST one. Level 1 is generic.
  assert.ok(chain.includes("Proxy response (403)"));
});

test("a real 403-to-CONNECT is a policy denial, and names the status", () => {
  const c = classifyFetchFailure({ url: URL_, error: denial403(), proxy: PROXY });
  assert.equal(c.kind, "policy-denied");
  assert.equal(c.status, 403);
  assert.equal(c.host, "greenpointers.com");
  assert.ok(isPolicyDenial(c));
  assert.match(c.message, /Allowlist the host/);
});

// THE REGRESSION THIS MODULE EXISTS FOR. The first classifier read one level of
// cause and treated "not obviously transient" as a denial, so a dead proxy made
// the run demand an allowlist for every target host in the roster — 59 hosts
// nobody had blocked.
test("a dead proxy is NOT a denial of the target host", () => {
  const err = nest("fetch failed", "connect ECONNREFUSED 127.0.0.1:45457");
  const c = classifyFetchFailure({ url: URL_, error: err, proxy: PROXY });
  assert.equal(c.kind, "proxy-unreachable");
  assert.ok(!isPolicyDenial(c), "must never reach the allowlist ask");
  assert.match(c.message, /NOT a denial/);
});

test("a timeout is transient, not a denial (greenpointtrashclub.org, 2026-08-10)", () => {
  const err = nest("fetch failed", "The operation was aborted due to timeout");
  const c = classifyFetchFailure({ url: "https://greenpointtrashclub.org/", error: err, proxy: PROXY });
  assert.equal(c.kind, "transient");
  assert.ok(!isPolicyDenial(c));
});

test("DNS failure is transient, not a denial", () => {
  const c = classifyFetchFailure({
    url: URL_,
    error: nest("fetch failed", "getaddrinfo ENOTFOUND greenpointers.com"),
    proxy: PROXY,
  });
  assert.equal(c.kind, "transient");
  assert.ok(!isPolicyDenial(c));
});

test("407 is a proxy credential problem, never a host allowlist problem", () => {
  const err = nest("fetch failed", "Request was cancelled.", "Proxy response (407) !== 200 when HTTP Tunneling");
  const c = classifyFetchFailure({ url: URL_, error: err, proxy: PROXY });
  assert.equal(c.kind, "proxy-auth");
  assert.equal(c.status, 407);
  assert.ok(!isPolicyDenial(c), "407 is global, not per-host — it must not inflate the ask");
});

test("a non-403 tunnel refusal is still a denial and carries its own status", () => {
  const err = nest("fetch failed", "Request was cancelled.", "Proxy response (502) !== 200 when HTTP Tunneling");
  const c = classifyFetchFailure({ url: URL_, error: err, proxy: PROXY });
  assert.equal(c.kind, "policy-denied");
  assert.equal(c.status, 502);
});

test("with no proxy in the path a denial is impossible and never claimed", () => {
  const c = classifyFetchFailure({ url: URL_, error: nest("fetch failed", "socket hang up"), proxy: null });
  assert.equal(c.kind, "unproxied");
  assert.ok(!isPolicyDenial(c));
});

test("an unrecognised failure says so instead of guessing denial", () => {
  const c = classifyFetchFailure({
    url: URL_,
    error: nest("fetch failed", "self-signed certificate in certificate chain"),
    proxy: PROXY,
  });
  assert.equal(c.kind, "unknown");
  assert.ok(!isPolicyDenial(c), "silence is better than a fabricated allowlist entry");
});

test("libcurl's wording is recognised too — it can only come from a curl probe", () => {
  // Node's fetch cannot emit this string; a run that captured it from a curl
  // side-probe should still classify it correctly rather than call it unknown.
  const c = classifyFetchFailure({
    url: URL_,
    error: new Error("CONNECT tunnel failed, response 403"),
    proxy: PROXY,
  });
  assert.equal(c.kind, "policy-denied");
  assert.equal(c.status, 403);
});

test("every kind is one of the documented set", () => {
  const kinds = new Set();
  for (const [err, proxy] of [
    [denial403(), PROXY],
    [nest("fetch failed", "connect ECONNREFUSED 127.0.0.1:45457"), PROXY],
    [nest("fetch failed", "timed out"), PROXY],
    [nest("fetch failed", "whatever"), PROXY],
    [nest("fetch failed", "whatever"), null],
  ]) {
    kinds.add(classifyFetchFailure({ url: URL_, error: err, proxy }).kind);
  }
  for (const k of kinds) {
    assert.ok(
      ["policy-denied", "proxy-auth", "proxy-unreachable", "transient", "unproxied", "unknown"].includes(k),
      `undocumented kind "${k}"`,
    );
  }
});

// --- the startup guard, shared by every fetching script -------------------
// geocode-demand-cards.mjs had the identical defect to fetch-sources.mjs and no
// guard at all, so it would have silently mis-geocoded through an intercepting
// proxy. These pin the four cases so the next script to fetch inherits them.

test("no proxy in the environment — nothing to bypass, so no complaint", () => {
  assert.equal(proxyAwarenessError({ proxy: null, envProxyFlag: undefined, nodeVersion: "22.22.2" }), null);
});

test("proxied but the flag is missing — refuse, and say how to fix it", () => {
  const msg = proxyAwarenessError({ proxy: "http://127.0.0.1:45457", envProxyFlag: undefined, nodeVersion: "22.22.2" });
  assert.match(msg, /REFUSING TO RUN/);
  assert.match(msg, /npm run/, "must name the fix, not just the fault");
});

test("proxied with the flag on a supporting Node — proceed", () => {
  for (const v of ["22.21.0", "22.22.2", "24.0.0", "25.6.1"]) {
    assert.equal(proxyAwarenessError({ proxy: "http://p:1", envProxyFlag: "1", nodeVersion: v }), null, v);
  }
});

test("the flag is INERT on an older Node — that must fail too, not pass", () => {
  // Accepting a flag that does nothing is the same silent bypass, so a set flag
  // is not sufficient on its own.
  for (const v of ["22.20.0", "20.11.0", "18.19.0", "23.5.0"]) {
    const msg = proxyAwarenessError({ proxy: "http://p:1", envProxyFlag: "1", nodeVersion: v });
    assert.match(msg ?? "", /inert/, `Node ${v} should be rejected`);
  }
});
