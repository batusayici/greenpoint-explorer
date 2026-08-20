#!/usr/bin/env node
// Weekly search pull — Google Search Console Search Analytics API.
//
// Why this exists: until 2026-08-19 the only GSC numbers we ever had were the
// one snapshot Batu read off the web UI by hand (learning log L2026-08-17), so
// every weekly readout carried search as "⚠ pending". A blank line every week
// is not a trend. This makes the search half of Loop C a deterministic sensor,
// same shape as ./scripts/posthog-pull.sh.
//
// Auth is a Google Cloud service account with the Search Console API enabled,
// added as a user on the property in Search Console itself (Settings → Users
// and permissions → Add user → the service account's client_email, Full).
// Granting the API in Cloud is NOT enough — the property grant is separate and
// is the step people skip. Setup: docs/growth/search-console-setup.md.
//
// Env (from the environment, falling back to .env.local — gitignored):
//   GSC_SITE_URL              e.g. sc-domain:stoopwise.com   (or https://stoopwise.com/)
//   GSC_SERVICE_ACCOUNT_JSON  path to the key file, or the JSON itself (cloud)
//   GSC_DAYS                  window length, default 7
//   GSC_END                   window end YYYY-MM-DD, default today-3 (see lag)
//
// Never VITE_-prefix any of these: Vite inlines VITE_ vars into the client
// bundle, and this key can read the whole property.
//
// Exit codes match posthog-pull.sh so the growth-weekly fallback language is
// one contract: 3 env, 4 network, 5 auth, 6 api.
import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { assertProxyAware } from "../src/demand-test/proxyDiagnosis.js";

// Node's global fetch ignores HTTPS_PROXY unless the process was STARTED with
// NODE_USE_ENV_PROXY=1, and in the cloud sandbox an unproxied call is
// intercepted rather than failing honestly. Always `npm run growth:gsc`.
assertProxyAware();

// .env.local is the local path; in cloud the vars are already exported.
if (existsSync("./.env.local")) {
  for (const line of readFileSync("./.env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/s, "$2");
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

const die = (code, ...lines) => {
  for (const l of lines) console.error(l);
  process.exit(code);
};

const SITE = process.env.GSC_SITE_URL;
const KEY_SRC = process.env.GSC_SERVICE_ACCOUNT_JSON;
if (!SITE || !KEY_SRC) {
  die(3,
    "SENSOR DOWN (env): GSC_SITE_URL and/or GSC_SERVICE_ACCOUNT_JSON unset.",
    "  Local: add them to .env.local.  Cloud: add them to the routine's environment.",
    "  Setup, start to finish: docs/growth/search-console-setup.md");
}

let key;
try {
  const raw = KEY_SRC.trim().startsWith("{") ? KEY_SRC : readFileSync(KEY_SRC, "utf8");
  key = JSON.parse(raw);
} catch (e) {
  die(3, `SENSOR DOWN (env): could not read GSC_SERVICE_ACCOUNT_JSON — ${e.message}`,
    "  It is either a path to the key file or the key JSON itself.");
}
if (!key.client_email || !key.private_key) {
  die(3, "SENSOR DOWN (env): key JSON has no client_email/private_key — that is not a service-account key.");
}

// ---- dates -----------------------------------------------------------------
// GSC finalises data on a lag; the last 2–3 days read low and would show as a
// fake decline week over week. Default the window to end 3 days back and say so.
const iso = (d) => d.toISOString().slice(0, 10);
const shift = (dateStr, days) => {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return iso(d);
};
const DAYS = Number(process.env.GSC_DAYS || 7);
const END = process.env.GSC_END || shift(iso(new Date()), -3);
const START = shift(END, -(DAYS - 1));
const PRIOR_END = shift(START, -1);
const PRIOR_START = shift(PRIOR_END, -(DAYS - 1));

// ---- auth ------------------------------------------------------------------
const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o))
  .toString("base64url");

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const input = `${b64({ alg: "RS256", typ: "JWT" })}.${b64(claim)}`;
  const sig = createSign("RSA-SHA256").update(input).end()
    .sign(key.private_key).toString("base64url");

  let res;
  try {
    res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${input}.${sig}`,
      }),
    });
  } catch (e) {
    die(4, `SENSOR DOWN (network): could not reach oauth2.googleapis.com — ${e.message}`,
      "  If this is the cloud routine, allowlist oauth2.googleapis.com and",
      "  searchconsole.googleapis.com in its environment. Never route around it.");
  }
  const body = await res.text();
  if (!res.ok) {
    die(5, `SENSOR DOWN (auth): token exchange returned HTTP ${res.status}.`,
      `  ${body.slice(0, 300)}`,
      "  Usual causes: the Search Console API is not enabled on the key's Cloud",
      "  project, the key was revoked, or — for 'invalid_grant: account not",
      "  found' — the client_email in the key file no longer exists.");
  }
  return JSON.parse(body).access_token;
}

// ---- query -----------------------------------------------------------------
const TOKEN = await accessToken();
const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;

async function query(body) {
  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    die(4, `SENSOR DOWN (network): could not reach searchconsole.googleapis.com — ${e.message}`);
  }
  const text = await res.text();
  if (res.status === 401 || res.status === 403) {
    die(5, `SENSOR DOWN (auth): Search Console returned HTTP ${res.status} for ${SITE}.`,
      `  ${text.slice(0, 300)}`,
      `  Almost always the property grant, not the API: add ${key.client_email}`,
      "  under Search Console → Settings → Users and permissions.",
      "  Also check GSC_SITE_URL — a domain property is 'sc-domain:stoopwise.com',",
      "  a URL-prefix property is 'https://stoopwise.com/' with the trailing slash.");
  }
  if (!res.ok) {
    die(6, `SENSOR DOWN (api): Search Console returned HTTP ${res.status}.`,
      `  ${text.slice(0, 300)}`);
  }
  return JSON.parse(text).rows || [];
}

const totals = async (start, end) => {
  const rows = await query({ startDate: start, endDate: end, dataState: "final" });
  const r = rows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  return { clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position };
};
const byDim = (dims, start, end, rowLimit = 25) =>
  query({ startDate: start, endDate: end, dimensions: dims, rowLimit, dataState: "final" });

// ---- report ----------------------------------------------------------------
const pct = (n) => `${(n * 100).toFixed(1)}%`;
const num = (n) => (Math.round(n * 10) / 10).toString();
const delta = (now, prior) => {
  if (prior === 0) return now === 0 ? "  =" : "  new";
  const d = ((now - prior) / prior) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}%`;
};

console.log(`Property: ${SITE}`);
console.log(`Window:   ${START} → ${END} (${DAYS}d)   prior: ${PRIOR_START} → ${PRIOR_END}`);
console.log("Data ends 3 days back on purpose — GSC finalises on a lag and the last");
console.log("two days always read low. Override with GSC_END=YYYY-MM-DD.");

const [now, prior] = [await totals(START, END), await totals(PRIOR_START, PRIOR_END)];
console.log("\n=== TOTALS (this window vs prior) ===");
console.log(`  clicks       ${num(now.clicks)}  (prior ${num(prior.clicks)}, ${delta(now.clicks, prior.clicks)})`);
console.log(`  impressions  ${num(now.impressions)}  (prior ${num(prior.impressions)}, ${delta(now.impressions, prior.impressions)})`);
console.log(`  CTR          ${pct(now.ctr)}  (prior ${pct(prior.ctr)})`);
console.log(`  avg position ${num(now.position)}  (prior ${num(prior.position)}) — lower is better`);

// Two heuristic splits. Both are rough on purpose: the raw query list below is
// the real evidence, and the whole question L2026-08-17 raised is whether
// anyone reaches us on generic intent rather than by looking up a place they
// already know. Read the list, don't trust the buckets.
const BRAND = /stoopwise|greenpoint\s*(life|explorer)/i;
const GENERIC = /things to do|what'?s (on|happening)|events?|this (weekend|week)|tonight|today|near me|new (restaurant|bar|shop|opening)|kids|free|calendar|guide/i;

const queries = await byDim(["query"], START, END, 100);
console.log("\n=== QUERIES (top 25 of " + queries.length + ") ===");
console.log("  clicks | impr | ctr | pos | query");
for (const r of queries.slice(0, 25)) {
  const tag = BRAND.test(r.keys[0]) ? "[brand]" : GENERIC.test(r.keys[0]) ? "[generic]" : "";
  console.log(`  ${r.clicks} | ${r.impressions} | ${pct(r.ctr)} | ${num(r.position)} | ${r.keys[0]} ${tag}`);
}
const bucket = (test) => {
  const rows = queries.filter((r) => test(r.keys[0]));
  return `${rows.length} queries, ${rows.reduce((a, r) => a + r.impressions, 0)} impr, ${rows.reduce((a, r) => a + r.clicks, 0)} clicks`;
};
console.log("\n  Split (heuristic — verify against the list above):");
console.log(`    brand-name        ${bucket((q) => BRAND.test(q))}`);
console.log(`    generic-intent    ${bucket((q) => !BRAND.test(q) && GENERIC.test(q))}`);
console.log(`    place-name/other  ${bucket((q) => !BRAND.test(q) && !GENERIC.test(q))}`);

const pages = await byDim(["page"], START, END, 100);
const short = (u) => u.replace(/^https?:\/\/[^/]+/, "") || "/";
console.log("\n=== PAGES (top 25 of " + pages.length + ") ===");
console.log("  clicks | impr | ctr | pos | page");
for (const r of pages.slice(0, 25)) {
  console.log(`  ${r.clicks} | ${r.impressions} | ${pct(r.ctr)} | ${num(r.position)} | ${short(r.keys[0])}`);
}

// The 8/17 read was that these are mostly a position problem, but they out-impress
// pages that do convert, so their titles and snippets are worth a look.
const zero = pages.filter((r) => r.clicks === 0 && r.impressions >= 10);
console.log("\n=== HIGH-IMPRESSION, ZERO-CLICK PAGES (≥10 impr, 0 clicks) ===");
if (!zero.length) console.log("  none");
for (const r of zero) console.log(`  ${r.impressions} impr | pos ${num(r.position)} | ${short(r.keys[0])}`);

const days = await byDim(["date"], START, END, DAYS);
console.log("\n=== DAILY ===");
for (const r of days) console.log(`  ${r.keys[0]} | ${r.clicks} clicks | ${r.impressions} impr | pos ${num(r.position)}`);
