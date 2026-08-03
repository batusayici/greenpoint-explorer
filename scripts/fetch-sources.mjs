#!/usr/bin/env node
// Track V — snapshot every ingest web source and emit a change report, so the
// weekly/daily ingest only spends model attention on sources that actually
// changed. This is the cost-structure fix (2026-07-25): the old agent-driven
// roster sweep re-read ~40 unchanged sites into a growing context every run.
//
// Usage: node scripts/fetch-sources.mjs [--only id,id] [--include-monthly] [--force]
//                                       [--no-browser] [--allow-degraded]
//        node scripts/fetch-sources.mjs --mark-ingested [--only id,id]
//
// Exit codes: 0 = the roster was readable. 1 = DEGRADED — errored sources
// exceeded 15%, or every browser fetch failed. A degraded run must not be
// ingested: expiry deletes regardless, so shipping one shrinks the deck while
// looking like a quiet week (2026-08-03 supply analysis, docs/growth/). Pass
// --allow-degraded to proceed knowingly.
//
// Roster: src/data/demand-test/ingest-sources.json (policy stays in SKILL.md).
// State:  .ingest-cache/ — state.json, <id>.txt latest snapshots,
//         <id>.ingested.txt baselines, <id>.diff.txt (lines added vs the
//         INGESTED baseline), changes.json. Only the *.ingested.txt baselines
//         are tracked in git (cloud ingest runs diff from a fresh checkout);
//         everything else in the cache is transient and gitignored.
//
// Change detection is against the last *ingested* snapshot, not the last
// fetch — otherwise a daily fetch would silently erode the diff before the
// ingest ever saw it. The ingest's ship step runs `--mark-ingested` (no
// network) to promote current snapshots to baselines after Batu's review.
//
// Fetch strategy per source: "auto" = plain HTTP with a browser UA, falling
// back to headless Chromium (playwright, optional dep) on 403/JS-thin pages;
// "browser" = straight to headless. Sources that fail both are reported as
// status "error" — the ingest run covers those few via the Browser pane.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES_PATH = join(ROOT, "src/data/demand-test/ingest-sources.json");
const CACHE_DIR = join(ROOT, ".ingest-cache");
const STATE_PATH = join(CACHE_DIR, "state.json");
const CHANGES_PATH = join(CACHE_DIR, "changes.json");

const args = process.argv.slice(2);
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx !== -1 ? new Set(args[onlyIdx + 1].split(",")) : null;
const INCLUDE_MONTHLY = args.includes("--include-monthly");
const FORCE = args.includes("--force");
const MARK_INGESTED = args.includes("--mark-ingested");
const NO_BROWSER = args.includes("--no-browser");
// A run that could not read its roster exits non-zero so a scheduled runner
// stops instead of shipping a thin run as if it were a quiet week. Pass
// --allow-degraded to proceed deliberately, which leaves that choice visible
// in the command rather than buried in the exit code.
const ALLOW_DEGRADED = args.includes("--allow-degraded");
const MAX_ERROR_RATE = 0.15;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const MIN_TEXT_CHARS = 500; // shorter than this after stripping → page is JS-thin, retry in browser
// Bot-wall pages return 200 with polite refusal text (e.g. WORD's IndieCommerce
// 403 cat page) — snapshotting those as content would mask a dead source.
const BLOCK_RE = /403 Forbidden|Access denied|Verify you are human|Just a moment|Attention Required|unable to access this resource|Pardon Our Interruption/i;

mkdirSync(CACHE_DIR, { recursive: true });
const state = existsSync(STATE_PATH) ? JSON.parse(readFileSync(STATE_PATH, "utf8")) : {};
const { sources } = JSON.parse(readFileSync(SOURCES_PATH, "utf8"));

// --mark-ingested: promote current snapshots to ingested baselines (no
// network). Run at ship time, after the review gate — including for sources
// whose extraction found nothing on-concept (they were reviewed too).
if (MARK_INGESTED) {
  let n = 0;
  for (const src of sources) {
    if (ONLY && !ONLY.has(src.id)) continue;
    const snapPath = join(CACHE_DIR, `${src.id}.txt`);
    if (!state[src.id]?.hash || !existsSync(snapPath)) continue;
    writeFileSync(join(CACHE_DIR, `${src.id}.ingested.txt`), readFileSync(snapPath));
    state[src.id].ingestedHash = state[src.id].hash;
    state[src.id].ingestedAt = new Date().toISOString();
    n++;
  }
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
  console.log(`marked ${n} sources ingested (baselines promoted)`);
  process.exit(0);
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", hellip: "…", times: "×", copy: "©", reg: "®", trade: "™", bull: "•", middot: "·" };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);

function htmlToText(html) {
  return decode(
    html
      .replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/article|\/header|\/footer)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

// --- optional headless-browser fallback ------------------------------------
let pw = null;
try { pw = await import("playwright"); } catch { /* not installed — plain fetch only */ }
let browser = null;

// Preflight the browser path before the roster, so a run that cannot use it
// says WHY in its first seconds instead of emitting 22 identical per-source
// errors an hour later (2026-08-03: the Monday run did exactly that, shipped
// 3 cards, and nothing downstream noticed). Three causes, three fixes — the
// same shape as posthog-pull.sh's preflight.
// The preflight proves the browser can reach the network at all, so its
// control URL must itself be reachable — on a Custom/allowlist environment,
// allowlist this host or the preflight false-alarms while the roster is fine.
// Override with GL_BROWSER_CONTROL_URL to point at a host already on the list.
const BROWSER_CONTROL_URL = process.env.GL_BROWSER_CONTROL_URL || "https://example.com/";

// Chromium does NOT inherit HTTPS_PROXY from the environment the way node's
// fetch does — Playwright only proxies when told to at launch (verified
// 2026-08-03: with HTTPS_PROXY pointed at a dead port, plain launch loads the
// control URL anyway; passing the same value to launch() correctly fails with
// ERR_PROXY_CONNECTION_FAILED). In a sandbox where all egress is proxied, that
// asymmetry is invisible and total: plain fetch works, every browser fetch is
// refused, and the run reports "no egress" per source. Pass it through.
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || null;
const NO_PROXY = process.env.NO_PROXY || process.env.no_proxy || null;
const launchOptions = PROXY
  ? { proxy: { server: PROXY, ...(NO_PROXY ? { bypass: NO_PROXY } : {}) } }
  : {};
async function preflightBrowser() {
  if (!pw) {
    return { ok: false, cause: "playwright-missing", fix: "npm i -D playwright && npx playwright install chromium" };
  }
  try {
    browser = await pw.chromium.launch(launchOptions);
  } catch (e) {
    const msg = String(e.message ?? e);
    const missingBinary = /Executable doesn't exist|browserType.launch.*install/i.test(msg);
    return {
      ok: false,
      cause: missingBinary ? "chromium-binary-missing" : "chromium-launch-failed",
      detail: msg.split("\n")[0],
      fix: missingBinary
        ? "npx playwright install chromium (in the routine's setup step — the npm package alone is not the browser)"
        : "check the sandbox's process//dev/shm limits; run with --no-browser to proceed plain-fetch-only",
    };
  }
  // The browser launched. Can it reach the network? This is the case that hit
  // us: Chromium runs fine and every navigation is refused by egress policy.
  let page;
  try {
    page = await browser.newPage({ userAgent: UA });
    await page.goto(BROWSER_CONTROL_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
    return { ok: true, proxy: PROXY ? "via HTTPS_PROXY" : "direct" };
  } catch (e) {
    return {
      ok: false,
      cause: "browser-egress-blocked",
      detail: String(e.message ?? e).split("\n")[0],
      proxy: PROXY ? `via HTTPS_PROXY (${PROXY})` : "direct (no HTTPS_PROXY set)",
      fix: PROXY
        ? `headless Chromium launched and was routed through ${PROXY}, but could not load ` +
          `${BROWSER_CONTROL_URL}. The proxy itself is refusing the CONNECT — allowlist the host at ` +
          "claude.ai/code (same class as the us.posthog.com denial, DECISION_LOG 2026-07-28). Never route around it."
        : `headless Chromium launched but could not load ${BROWSER_CONTROL_URL}, and no HTTPS_PROXY is set. ` +
          "If this environment proxies all egress, Chromium is connecting direct and being refused — " +
          "export HTTPS_PROXY in the routine so it gets passed through at launch.",
    };
  } finally {
    if (page) await page.close().catch(() => {});
  }
}
async function browserText(url) {
  if (NO_BROWSER) throw new Error("browser path disabled (--no-browser)");
  if (!pw) throw new Error("playwright not installed (npm i -D playwright && npx playwright install chromium)");
  // Preflight already diagnosed and reported the cause; don't re-attempt a
  // launch per source and bury that one diagnosis under N identical errors.
  if (browserPreflight && !browserPreflight.ok && !browserPreflight.skipped) {
    throw new Error(`browser unavailable (${browserPreflight.cause}) — see the BROWSER PREFLIGHT block above`);
  }
  if (!browser) browser = await pw.chromium.launch(launchOptions);
  const page = await browser.newPage({ userAgent: UA });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500); // let JS-rendered calendars settle
    const text = await page.evaluate(() => document.body?.innerText ?? "");
    return text.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
  } finally {
    await page.close();
  }
}

async function plainText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return htmlToText(await res.text());
}

async function fetchSource(src) {
  const attempts = src.fetch === "browser" ? ["browser"] : ["plain", "browser"];
  let lastErr = null;
  for (const method of attempts) {
    try {
      const text = method === "plain" ? await plainText(src.url) : await browserText(src.url);
      if (BLOCK_RE.test(text.slice(0, 800))) {
        lastErr = new Error(`bot-wall page via ${method} fetch`);
        continue;
      }
      if (method === "plain" && text.length < MIN_TEXT_CHARS && attempts.includes("browser")) {
        lastErr = new Error(`only ${text.length} chars via plain fetch (JS-thin?)`);
        continue;
      }
      return { text, method };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Which sources are in play this run, and does any of them require the browser?
const selected = sources.filter(
  (s) => (!ONLY || ONLY.has(s.id)) && (ONLY || s.cadence !== "monthly" || INCLUDE_MONTHLY),
);
const browserRequired = selected.some((s) => s.fetch === "browser");

let browserPreflight = { ok: true, skipped: true };
if (browserRequired && !NO_BROWSER) {
  browserPreflight = await preflightBrowser();
  if (browserPreflight.ok) {
    console.log(`browser preflight: ok (${browserPreflight.proxy})`);
  } else {
    const needing = selected.filter((s) => s.fetch === "browser");
    console.error(`\n=== BROWSER PREFLIGHT FAILED — ${browserPreflight.cause} ===`);
    if (browserPreflight.detail) console.error(`  ${browserPreflight.detail}`);
    console.error(`  Fix: ${browserPreflight.fix}`);
    console.error(
      `  Impact: ${needing.length} browser-only source(s) cannot be read this run` +
        `${needing.length ? ` — ${needing.map((s) => s.id).join(", ")}` : ""}.`,
    );
    console.error("  Plain-fetch sources continue below. This run is DEGRADED, not normal.\n");
  }
} else if (NO_BROWSER) {
  browserPreflight = { ok: false, cause: "disabled-by-flag", fix: "drop --no-browser to use the browser path" };
}

const results = [];
for (const src of sources) {
  if (ONLY && !ONLY.has(src.id)) continue;
  if (!ONLY && src.cadence === "monthly" && !INCLUDE_MONTHLY) {
    results.push({ id: src.id, url: src.url, status: "skipped_monthly" });
    continue;
  }

  const snapPath = join(CACHE_DIR, `${src.id}.txt`);
  const entry = { id: src.id, name: src.name, url: src.url, group: src.group, notes: src.notes || undefined };
  try {
    const { text, method } = await fetchSource(src);
    const h = hash(text);
    const prev = state[src.id] ?? {};
    entry.method = method;
    entry.textPath = `.ingest-cache/${src.id}.txt`;

    // Status is relative to the last INGESTED baseline, not the last fetch.
    const baselinePath = join(CACHE_DIR, `${src.id}.ingested.txt`);
    // Fresh checkouts have the committed baselines but no state.json — derive
    // the ingested hash from the baseline (snapshots are written text + "\n").
    if (prev.ingestedHash == null && existsSync(baselinePath)) {
      prev.ingestedHash = hash(readFileSync(baselinePath, "utf8").replace(/\n$/, ""));
    }
    if (prev.ingestedHash === h && !FORCE) {
      entry.status = "unchanged";
    } else {
      const baseline = existsSync(baselinePath) ? readFileSync(baselinePath, "utf8") : null;
      entry.status = baseline == null ? "new" : "changed";
      if (baseline != null) {
        const baseSet = new Set(baseline.split("\n"));
        const added = text.split("\n").filter((l) => !baseSet.has(l));
        const diffPath = join(CACHE_DIR, `${src.id}.diff.txt`);
        writeFileSync(diffPath, added.join("\n") + "\n");
        entry.diffPath = `.ingest-cache/${src.id}.diff.txt`;
        entry.addedLines = added.length;
      }
    }
    writeFileSync(snapPath, text + "\n");
    state[src.id] = { ...prev, hash: h, fetchedAt: new Date().toISOString(), method };
    console.log(`  ${entry.status.padEnd(9)} ${src.id} (${method}${entry.addedLines != null ? `, +${entry.addedLines} lines` : ""})`);
  } catch (e) {
    entry.status = "error";
    entry.error = String(e.message ?? e);
    console.warn(`  ERROR     ${src.id} — ${entry.error}`);
  }
  results.push(entry);
  await sleep(300);
}

if (browser) await browser.close();

writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
writeFileSync(
  CHANGES_PATH,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      playwright: !!pw,
      browserRequired,
      browserPreflight,
      sources: results,
    },
    null,
    2,
  ) + "\n",
);

const by = (s) => results.filter((r) => r.status === s).length;
console.log(
  `\n${results.length} sources → ${by("changed")} changed, ${by("new")} new, ${by("unchanged")} unchanged, ${by("error")} error, ${by("skipped_monthly")} skipped (monthly)`,
);
console.log(`report: ${CHANGES_PATH}`);

// Same two trips check-freshness applies, computed from this run's own report
// so the failure is loud at the point it happens, not a day later.
const { assessReach } = await import("../src/demand-test/freshness.js");
const reach = assessReach({ browserRequired, sources: results }, { maxErrorRate: MAX_ERROR_RATE });
const sourcesUnreachable = reach.attempted > 0 && reach.errorRate > reach.maxErrorRate;
const browserFetchDown = reach.browserRequired && !reach.browserOk;

console.log(
  `reach: ${reach.attempted - reach.errored}/${reach.attempted} sources read` +
    ` (${(reach.errorRate * 100).toFixed(0)}% error, ceiling ${(reach.maxErrorRate * 100).toFixed(0)}%)`,
);
if (!pw) console.log("note: playwright not installed — browser-only sources will error (npm i -D playwright && npx playwright install chromium)");

if (sourcesUnreachable || browserFetchDown) {
  console.error("\n=== DEGRADED RUN — the roster was not readable ===");
  if (sourcesUnreachable) console.error(`  ${reach.errored} of ${reach.attempted} sources errored.`);
  if (browserFetchDown) {
    console.error("  Every browser fetch failed; browser-only sources contributed nothing.");
    if (browserPreflight?.fix) console.error(`  Fix: ${browserPreflight.fix}`);
  }
  console.error(
    "  Do not ingest this as a normal week: expiry will still delete, so a degraded run\n" +
      "  shrinks the deck (2026-08-03 supply analysis). Fix the cause, or re-run with\n" +
      "  --allow-degraded to proceed knowingly.",
  );
  process.exit(ALLOW_DEGRADED ? 0 : 1);
}
process.exit(0);
