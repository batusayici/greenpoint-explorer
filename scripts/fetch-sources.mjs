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
// "browser" = straight to headless; "feed" = plain HTTP against an RSS URL,
// which for a WordPress-style feed returns full post bodies and never needs
// the browser. Sources that fail every attempt are reported as status "error"
// — the ingest run covers those few via the Browser pane.
// Prefer "feed" wherever a source publishes one: it is the cheapest strategy,
// it carries more than the rendered page, and it is immune to the browser
// path being unavailable (2026-08-05).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { diffAgainstBaseline, resolveIngestedHash } from "../src/demand-test/sourceDiff.js";
import { decode, htmlToText } from "../src/demand-test/sourceText.js";
import { jsonToText, embeddedToText, expandUrlTemplate } from "../src/demand-test/sourceJson.js";
import { classifyFetchFailure, isPolicyDenial, assertProxyAware } from "../src/demand-test/proxyDiagnosis.js";
import { carryForwardBlocks } from "../src/demand-test/persistedBlocks.js";

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
// PROMOTION MAY ADD EVIDENCE, NEVER REMOVE IT (2026-08-13). Promotion used to
// copy the fresh snapshot straight over the baseline, which deleted every
// `## [DETAIL]` / `## [R1 PERSISTED]` / `## [IMAGE READ]` block this run's
// fetch happened not to return — a failed detail page, or a flyer that has no
// URL to fetch in the first place. That cost 20 live cards their evidence in
// one command on 2026-08-13 (ingest:quotes 35/0 before, 30/13 after, 7 more on
// --all), silently and after every gate had passed. See persistedBlocks.js.
if (MARK_INGESTED) {
  let n = 0;
  let rescued = 0;
  for (const src of sources) {
    if (ONLY && !ONLY.has(src.id)) continue;
    const snapPath = join(CACHE_DIR, `${src.id}.txt`);
    if (!state[src.id]?.hash || !existsSync(snapPath)) continue;
    const baselinePath = join(CACHE_DIR, `${src.id}.ingested.txt`);
    const old = existsSync(baselinePath) ? readFileSync(baselinePath, "utf8") : null;
    const { text, carried } = carryForwardBlocks(readFileSync(snapPath, "utf8"), old);
    if (carried.length) {
      rescued += carried.length;
      console.log(`  carried forward ${carried.length} persisted block(s) for ${src.id}:`);
      for (const header of carried) console.log(`    ${header}`);
    }
    writeFileSync(baselinePath, text);
    // The hash still tracks the FETCHED snapshot, not the promoted file: it is
    // what the next run's diff compares against, and carried-forward evidence
    // must not read as a change the source made.
    state[src.id].ingestedHash = state[src.id].hash;
    state[src.id].ingestedAt = new Date().toISOString();
    n++;
  }
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
  console.log(
    `marked ${n} sources ingested (baselines promoted)` +
      (rescued ? `; ${rescued} persisted block(s) carried forward` : ""),
  );
  process.exit(0);
}

// --- RSS feed ---------------------------------------------------------------
// A third fetch strategy alongside plain and browser. WordPress-style feeds
// MAY carry the full post body in <content:encoded>, so reading the feed can
// yield article text directly — more than the page it comes from, at plain
// fetch cost. Added 2026-08-05 for Greenpointers, whose front page is
// browser-only (JS-thin + bot-walled) but whose feed is plain-fetchable.
//
// "MAY", not "does" — and a publisher can revoke it under you (2026-08-12).
// Greenpointers now truncates `content:encoded` to a teaser ending "Continue
// reading — subscribe to unlock the full article." A paywall is invisible to
// this layer: the fetch is a clean 200, the diff looks healthy, and the run
// silently loses 23 of a roundup's 25 items. Nothing here can detect that, and
// it should not try to guess — the check belongs where the items are counted.
// The lesson for the roster is that `fetch: "feed"` buys plain-fetch ACCESS,
// never a guarantee of COMPLETENESS.
// Written for RSS 2.0, plus Atom (2026-08-08) — Shopify serves /blogs/<h>.atom
// and nothing else, so Atom support is what makes a Shopify blog readable at
// feed cost instead of scraping its (much thinner) rendered page.
const stripCdata = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
function xmlTag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? stripCdata(m[1]) : "";
}
// Atom puts the URL in an attribute (<link href="..."/>), not in the element
// body, so xmlTag cannot reach it. Prefer rel="alternate" — rel="self" is the
// feed's own address, which would make every entry cite the same URL.
function atomLink(entry) {
  const links = [...entry.matchAll(/<link\b([^>]*)\/?>/gi)].map(([, attrs]) => ({
    href: (attrs.match(/href=["']([^"']+)["']/i) ?? [])[1] ?? "",
    rel: (attrs.match(/rel=["']([^"']+)["']/i) ?? [])[1] ?? "alternate",
  }));
  return (links.find((l) => l.rel === "alternate") ?? links[0])?.href ?? "";
}
function feedToText(xml, opts = {}) {
  const atom = !/<item\b/i.test(xml) && /<entry\b/i.test(xml);
  let items = xml.match(atom ? /<entry\b[\s\S]*?<\/entry>/gi : /<item\b[\s\S]*?<\/item>/gi) ?? [];
  // Not throwing here would snapshot an error page as if it were content, the
  // same failure mode BLOCK_RE guards for on the plain path.
  if (!items.length) throw new Error("no <item>/<entry> entries — not an RSS or Atom feed?");
  // Opt-in item filter for citywide feeds (roster: `feed: { include: [...] }`,
  // same shape as the `json` block). Added 2026-08-08 for the NYC Parks
  // citywide events RSS — 1,888 items, of which only the Greenpoint parks
  // matter. Filtering here keeps the snapshot (and its daily diff) scoped to
  // the neighborhood instead of churning with the other 1,850 items. Matching
  // is a plain substring test against the raw item XML, so park names in
  // <event:parknames> match without parsing the namespace. Zero matches is a
  // legitimate quiet fortnight, not an error — the throw above already proved
  // the feed itself was real.
  if (Array.isArray(opts.include) && opts.include.length) {
    items = items.filter((item) => opts.include.some((s) => item.includes(s)));
  }
  return items
    .map((item) => {
      const title = decode(xmlTag(item, "title"));
      const link = decode(atom ? atomLink(item) : xmlTag(item, "link"));
      // Atom's <updated> is the POST time, not the event time. It is kept as
      // the item's date the same way pubDate is, but a card's event date must
      // still come out of the body — see the macha-studio roster note.
      const date = decode(atom ? xmlTag(item, "published") || xmlTag(item, "updated") : xmlTag(item, "pubDate"));
      const body = htmlToText(
        atom
          ? xmlTag(item, "content") || xmlTag(item, "summary")
          : xmlTag(item, "content:encoded") || xmlTag(item, "description"),
      );
      // RSS extension fields (e.g. NYC Parks' event: namespace — parknames,
      // startdate, starttime, location, coordinates). They carry the facts the
      // description omits; without them a feed item has no date or venue.
      const extras = [...item.matchAll(/<event:([\w-]+)(?:\s[^>]*)?>([\s\S]*?)<\/event:\1>/gi)]
        .map(([, k, v]) => ({ k, v: decode(stripCdata(v)).trim() }))
        .filter(({ v }) => v)
        .map(({ k, v }) => `${k}: ${v}`);
      return [title && `## ${title}`, link, date, body, ...extras].filter(Boolean).join("\n");
    })
    .join("\n\n");
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

// NEITHER client inherits HTTPS_PROXY on its own — corrected 2026-08-10, and
// the old comment here ("Chromium does not inherit it the way node's fetch
// does") was the false premise that misdirected three weeks of diagnosis.
// Chromium proxies only when told at launch (verified 2026-08-03). Node's
// global fetch is undici, which ignores the env vars unless the process was
// STARTED with NODE_USE_ENV_PROXY=1 — added in Node 22.21/24.0. Verified
// 2026-08-10: with HTTPS_PROXY pointed at a dead port, bare fetch still
// returned 200 (went direct); with the flag it correctly failed. Setting the
// var from inside the script does not work — undici reads it at startup.
//
// Why this is fatal rather than untidy: in the cloud sandbox direct egress is
// INTERCEPTED, not merely unproxied — nycgovparks answered 405 direct vs 200
// proxied. So an unproxied run does not just fail honestly, it can return
// mangled bodies that read downstream as genuine changes (brooklyn-craft-company
// produced a phantom diff that became `unchanged` once proxied). It also made
// the preflight's own tie-breaker unsound: it compared a DIRECT plain fetch
// against a PROXIED browser and blamed the proxy relay for the difference.
// With the flag on, that probe really does go through the same proxy and the
// comparison means what it says.
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || null;
const NO_PROXY = process.env.NO_PROXY || process.env.no_proxy || null;

// A proxied environment plus an unproxied fetch is the silent-corruption case
// above, so refuse the run rather than write a snapshot nobody can trust. Exit
// 1 is already the roster-unreadable contract in SKILL.md §0.2 — this composes
// with it instead of inventing a new failure mode. Shared with
// geocode-demand-cards.mjs, which had the same defect and no guard at all.
assertProxyAware();
const launchOptions = PROXY
  ? { proxy: { server: PROXY, ...(NO_PROXY ? { bypass: NO_PROXY } : {}) } }
  : {};
// Engines to try, in order. Firefox is a fallback for one specific observed
// failure: the cloud sandbox's proxy resets Chromium's CONNECT tunnel while
// accepting plain fetch's to the same host (2026-08-05). Firefox's network
// stack is entirely separate, so it may tunnel where Chromium cannot — and if
// it does, that is also the sharpest possible evidence for the platform bug
// report. Over a CONNECT tunnel the proxy sees only TLS bytes, so an engine
// that tunnels at all recovers the WebSocket-delivered sources too.
//
// Costs nothing where Firefox is absent: its launch throws, and we report
// Chromium's original diagnosis rather than the missing-binary noise. To make
// it do anything, the routine's setup must run `npx playwright install firefox`.
// GL_BROWSER_ENGINES overrides the order (also the test seam for this path).
const ENGINES = (process.env.GL_BROWSER_ENGINES || "chromium,firefox").split(",").map((s) => s.trim()).filter(Boolean);
let browserEngine = ENGINES[0];

function classifyLaunchFailure(engine, msg) {
  const missingBinary = /Executable doesn't exist|browserType.launch.*install/i.test(msg);
  return {
    ok: false,
    cause: missingBinary ? `${engine}-binary-missing` : `${engine}-launch-failed`,
    detail: msg.split("\n")[0],
    fix: missingBinary
      ? `npx playwright install ${engine} (in the routine's setup step — the npm package alone is not the browser)`
      : "check the sandbox's process//dev/shm limits; run with --no-browser to proceed plain-fetch-only",
  };
}

async function preflightEngine(engine) {
  let candidate = null;
  try {
    if (!pw[engine]) throw new Error(`Executable doesn't exist: playwright has no "${engine}" engine`);
    candidate = await pw[engine].launch(launchOptions);
  } catch (e) {
    if (candidate) await candidate.close().catch(() => {});
    return classifyLaunchFailure(engine, String(e.message ?? e));
  }
  // The browser launched. Can it reach the network? This is the case that hit
  // us: Chromium runs fine and every navigation is refused by egress policy.
  let page;
  try {
    page = await candidate.newPage({ userAgent: UA });
    await page.goto(BROWSER_CONTROL_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.close().catch(() => {});
    browser = candidate;
    browserEngine = engine;
    return { ok: true, engine, proxy: PROXY ? "via HTTPS_PROXY" : "direct" };
  } catch (e) {
    if (page) await page.close().catch(() => {});
    await candidate.close().catch(() => {});
    const detail = String(e.message ?? e).split("\n")[0];
    // Two failure shapes look identical from Chromium's side (it can't load
    // the control URL) but need different fixes, so tell them apart with the
    // one signal that distinguishes them: can plain fetch reach the SAME URL
    // through the SAME environment right now? (2026-08-05 — a run diagnosed
    // this by hand: curl/plain fetch reached the control host fine while
    // Chromium's CONNECT tunnel to that exact host was reset. The preflight
    // used to call that "browser-egress-blocked" and tell Batu to allowlist
    // the host — wrong fix, since the host was never blocked for plain
    // fetch. Only call it an allowlist gap when plain fetch is ALSO refused.)
    let plainReachable = null;
    if (PROXY) {
      try {
        const r = await fetch(BROWSER_CONTROL_URL, { signal: AbortSignal.timeout(10000) });
        plainReachable = r.ok;
      } catch {
        plainReachable = false;
      }
    }
    if (PROXY && plainReachable) {
      return {
        ok: false,
        cause: "browser-connect-reset",
        detail,
        engine,
        proxy: `via HTTPS_PROXY (${PROXY})`,
        fix:
          `plain fetch reached ${BROWSER_CONTROL_URL} fine through the same ${PROXY} — so this is NOT an ` +
          `allowlist gap (that would refuse plain fetch too). Headless ${engine}'s own CONNECT tunnel through ` +
          "the proxy is being refused/reset for a host plain fetch reaches without trouble. That points at the " +
          `proxy relay's handling of ${engine}'s CONNECT specifically, not a missing allowlist entry — report the ` +
          `exact symptom (plain fetch ok, ${engine} CONNECT reset) to platform support at claude.ai/code rather ` +
          "than re-requesting a host allowlist. Never route around it.",
      };
    }
    return {
      ok: false,
      cause: "browser-egress-blocked",
      detail,
      engine,
      proxy: PROXY ? `via HTTPS_PROXY (${PROXY})` : "direct (no HTTPS_PROXY set)",
      fix: PROXY
        ? `headless ${engine} launched and was routed through ${PROXY}, but could not load ` +
          `${BROWSER_CONTROL_URL}, and plain fetch through the same proxy failed too — the proxy is refusing ` +
          "this environment's egress outright. Allowlist the host at claude.ai/code (same class as the " +
          "us.posthog.com denial, DECISION_LOG 2026-07-28). Never route around it."
        : `headless ${engine} launched but could not load ${BROWSER_CONTROL_URL}, and no HTTPS_PROXY is set. ` +
          "If this environment proxies all egress, it is connecting direct and being refused — " +
          "export HTTPS_PROXY in the routine so it gets passed through at launch.",
    };
  }
}

async function preflightBrowser() {
  if (!pw) {
    return { ok: false, cause: "playwright-missing", fix: "npm i -D playwright && npx playwright install chromium" };
  }
  let primaryFailure = null;
  const alsoTried = [];
  for (const engine of ENGINES) {
    const result = await preflightEngine(engine);
    if (result.ok) {
      // A fallback engine succeeding is the headline, not a footnote: it means
      // the failure is engine-specific, which is exactly what the platform
      // report needs and what a human would otherwise have to work out by hand.
      if (primaryFailure) {
        result.fellBackFrom = { engine: ENGINES[0], cause: primaryFailure.cause };
        console.error(
          `\n=== BROWSER FELL BACK TO ${engine.toUpperCase()} ===\n` +
            `  ${ENGINES[0]} failed (${primaryFailure.cause}) but ${engine} reached ${BROWSER_CONTROL_URL}.\n` +
            `  The roster is fully readable this run. This asymmetry is evidence the failure is\n` +
            `  ${ENGINES[0]}-specific, not an egress policy — worth reporting as such.\n`,
        );
      }
      return result;
    }
    // Report the FIRST engine's diagnosis: it is the one that is supposed to
    // work, so its cause is the actionable one. Later engines missing their
    // binary is expected noise in an environment that never installed them.
    primaryFailure ??= result;
    if (result !== primaryFailure) alsoTried.push(`${engine}: ${result.cause}`);
  }
  return { ...primaryFailure, enginesTried: ENGINES, ...(alsoTried.length ? { alsoTried } : {}) };
}
// `opts` is used only by the detail-page path so existing source behaviour is
// byte-identical. `scroll` exists because lazily-mounted content is common on
// exactly the pages that hold the evidence: withfriends' /join renders its
// membership tiers on scroll, so a straight read captured the page shell and
// "Cancel renewal at any time." while every tier and price stayed invisible —
// a snapshot that looks fine and proves nothing.
async function browserText(url, opts = {}) {
  if (NO_BROWSER) throw new Error("browser path disabled (--no-browser)");
  if (!pw) throw new Error("playwright not installed (npm i -D playwright && npx playwright install chromium)");
  // Preflight already diagnosed and reported the cause; don't re-attempt a
  // launch per source and bury that one diagnosis under N identical errors.
  if (browserPreflight && !browserPreflight.ok && !browserPreflight.skipped) {
    throw new Error(`browser unavailable (${browserPreflight.cause}) — see the BROWSER PREFLIGHT block above`);
  }
  if (!browser) browser = await pw[browserEngine].launch(launchOptions);
  const page = await browser.newPage({ userAgent: UA });
  const readText = async () => {
    const text = await page.evaluate(() => document.body?.innerText ?? "");
    return text.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
  };
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500); // let JS-rendered calendars settle
    if (opts.scroll) {
      // Walk the page so intersection-observer content mounts, then return to
      // the top and let it settle before reading.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 250));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);
    }
    let text = await readText();
    // The remaining browser-only sources render from a WebSocket, and 2500ms is
    // sometimes not enough — observed 2026-08-05, when one run captured the
    // comedy club's shell (13 lines, no shows) while every other run got all 18.
    // Nothing caught it: MIN_TEXT_CHARS only guards the plain path, so an
    // unrendered page was accepted as a good fetch and would have read
    // downstream as "the source shrank" — the phantom-shrink signal this
    // pipeline is built to avoid. Wait once more, then fail loudly rather than
    // snapshot a page that simply had not loaded yet.
    if (text.length < MIN_TEXT_CHARS) {
      await page.waitForTimeout(5000);
      text = await readText();
    }
    if (text.length < MIN_TEXT_CHARS) {
      throw new Error(`only ${text.length} chars after 7.5s in ${browserEngine} — page never rendered`);
    }
    return text;
  } finally {
    await page.close();
  }
}

// A CONNECT proxy denies a host BEFORE any HTTP response exists, so an
// egress-policy block does not arrive as a status code — fetch just throws.
// Left unnamed, that surfaces as a bare "fetch failed" and, on an `auto`
// source, is then overwritten by the browser attempt's error (see fetchSource)
// — which is how four allowlist gaps spent 2026-08-10 disguised as browser
// failures. Tag it so the host lands on the allowlist ask instead.
const PROXY_DENIED = Symbol("proxy-denied");
// The classification itself lives in src/demand-test/proxyDiagnosis.js with a
// sibling test, because `scripts/` is outside the test glob and the first
// version of this logic shipped a bug that only a test would have caught: it
// read one level of `.cause` and treated "not obviously transient" as a denial,
// so pointing HTTPS_PROXY at a dead port made the run demand an allowlist for
// every target host in the roster. Only `policy-denied` may reach the ask.
function proxyFailure(url, e) {
  const c = classifyFetchFailure({ url, error: e, proxy: PROXY });
  const err = new Error(c.message);
  if (isPolicyDenial(c)) err[PROXY_DENIED] = c.host;
  return err;
}

async function rawGet(url, accept) {
  let res;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: accept, "Accept-Language": "en-US,en;q=0.9" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
  } catch (e) {
    // Classify in both cases: with no proxy in the path the classifier returns
    // `unproxied` and can never claim a denial, which is the guarantee we want
    // rather than a second branch that has to remember it.
    throw proxyFailure(url, e);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}
// A source normally names one `url`. `urls` (json strategy only) fetches
// several and concatenates them, which is how the Squarespace one-month-per-
// request calendars stop having a next-month blind spot near month end: the
// roster asks for {{month:+0}} and {{month:+1}} instead of a run having to
// remember to. When `urls` is present, `url` stays the human-facing page to
// cite on a card.
const sourceUrls = (src) => (Array.isArray(src.urls) && src.urls.length ? src.urls : [src.url]).map((u) => expandUrlTemplate(u));

const plainText = async (src) => htmlToText(await rawGet(sourceUrls(src)[0], "text/html,application/xhtml+xml"));
const feedText = async (src) => feedToText(await rawGet(sourceUrls(src)[0], "application/rss+xml,application/xml,text/xml"), src.feed ?? {});
const browserPage = async (src) => browserText(sourceUrls(src)[0]);

async function jsonText(src) {
  const blocks = [];
  for (const url of sourceUrls(src)) {
    const body = await rawGet(url, "application/json,text/plain,*/*");
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      throw new Error(`response was not JSON (${body.length} bytes) — endpoint moved or is behind a wall?`);
    }
    const text = jsonToText(data, src.json ?? {});
    if (text) blocks.push(text);
  }
  return blocks.join("\n\n");
}

const embeddedText = async (src) =>
  embeddedToText(await rawGet(sourceUrls(src)[0], "text/html,application/xhtml+xml"), src.embedded ?? {});

// Diagnostic only — the body is discarded. Answers one question about an
// already-failed source: is its host reachable at all, or is it egress-denied?
// A site bot-wall (an HTTP status, e.g. grownyc's 403) is NOT a denial and
// correctly returns null, so the two stay distinguishable in the report.
async function probeHostDenial(src) {
  try {
    await rawGet(sourceUrls(src)[0], "text/html,application/xhtml+xml");
    return null;
  } catch (e) {
    return e?.[PROXY_DENIED] ?? null;
  }
}

const ATTEMPTS = { browser: ["browser"], feed: ["feed"], json: ["json"], embedded: ["embedded"] }; // default: plain, then browser
const FETCHERS = { plain: plainText, feed: feedText, json: jsonText, embedded: embeddedText, browser: browserPage };

async function fetchSource(src) {
  const attempts = ATTEMPTS[src.fetch] ?? ["plain", "browser"];
  let lastErr = null;
  // An `auto` source tries plain then browser, and `throw lastErr` used to
  // keep only the browser's error — so a proxy denial on the plain attempt was
  // discarded and the source reported "browser unavailable". That mislabels an
  // allowlist gap as a browser outage, which inflates the browser-only count
  // and hides the one fix that would actually restore the source. A denial is
  // the more actionable diagnosis, so it outranks whatever the browser said.
  let denialErr = null;
  for (const method of attempts) {
    try {
      const text = await FETCHERS[method](src);
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
      if (e?.[PROXY_DENIED]) denialErr = e;
      lastErr = e;
    }
  }
  throw denialErr ?? lastErr;
}

const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- detail pages -----------------------------------------------------------
// THE PROBLEM THIS SOLVES (DECISION_LOG 2026-08-12). A roster source names a
// DISCOVERY surface — a listing, a feed, a JSON endpoint — but cards are
// authored from the DETAIL page one level down, and until now only the
// discovery surface was ever saved. So the run persisted the index and threw
// away the book: `brooklyn-craft-company`'s collection page carries class names
// and prices and NO DATES AT ALL, `go-green-bk` snapshots a listing while each
// recurring series lives on a per-event page, `film-noir-cinema` and
// `moon-bunny-aerial` snapshot JSON with no prose. 29 live cards ended up with
// quotes nobody could re-check, and the evidence expires in DAYS because
// listings roll forward. Verification is only possible if the evidence is
// captured in the same run that authors the card.
//
// Roster opt-in, because crawling every source would be slow and rude:
//   "detail": {
//     "match": "/event/",          // regex; harvested from feed/JSON text and listing hrefs
//     "urls": ["https://…/join"],  // or an explicit fixed page (a /summer-camps, a /join)
//     "limit": 8,                  // hard cap on pages followed per run (default 8)
//     "fetch": "browser",          // when the detail page is JS-rendered (default plain)
//     "delayMs": 400               // politeness gap between detail fetches
//   }
//
// Detail text is appended to the SNAPSHOT, so it is hashed, diffed and
// verifiable exactly like the listing. Failures are reported in changes.json
// and never written into the snapshot — a transient error must not flap the
// hash and make a source look "changed".
const DETAIL_LIMIT_DEFAULT = 8;
const absUrl = (href, base) => {
  try {
    const u = new URL(href, base);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
};

// Feeds and JSON already emit their item links into the snapshot text
// (feedToText writes the entry link; film-noir's JSON writes `fullUrl:
// /program/…`), so the cheapest harvest reads the text we just built. Relative
// paths resolve against the source URL.
function harvestFromText(text, base, re) {
  const out = [];
  for (const m of text.matchAll(/https?:\/\/[^\s<>"')\]]+|(?<=^|\s)\/[A-Za-z0-9._~\-/]{2,}/gm)) {
    const u = absUrl(m[0].replace(/[.,;]+$/, ""), base);
    if (u && re.test(u)) out.push(u);
  }
  return out;
}

// For a plain/browser listing the hrefs are lost by htmlToText, so re-read the
// listing once for its anchors. One extra GET on an opt-in source is cheaper
// than threading raw HTML through every fetcher.
async function harvestFromHrefs(base, re) {
  const html = await rawGet(base, "text/html,application/xhtml+xml");
  const out = [];
  for (const m of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const u = absUrl(decode(m[1]), base);
    if (u && re.test(u)) out.push(u);
  }
  return out;
}

async function detailText(src, listingText) {
  const cfg = src.detail;
  if (!cfg) return { block: "", fetched: 0, failed: [] };
  const base = sourceUrls(src)[0];
  const limit = Number.isInteger(cfg.limit) ? cfg.limit : DETAIL_LIMIT_DEFAULT;
  // A `urls` entry may be a string or { url, fetch } — the two pages a single
  // source needs are not always readable the same way. WORD needs the browser
  // for withfriends' scroll-mounted /join AND plain fetch for
  // wordbookstores.com/word-book-clubs, which bot-walls headless Chromium (302
  // chars, never rendered) but answers a plain request fine.
  const modeFor = new Map();
  const candidates = [];
  for (const entry of cfg.urls ?? []) {
    const raw = typeof entry === "string" ? entry : entry?.url;
    if (!raw) continue;
    const abs = absUrl(expandUrlTemplate(raw), base);
    if (!abs) continue;
    candidates.push(abs);
    if (typeof entry === "object" && entry.fetch) modeFor.set(abs, entry.fetch);
  }
  if (cfg.match) {
    const re = new RegExp(cfg.match);
    candidates.push(...harvestFromText(listingText, base, re));
    try {
      candidates.push(...await harvestFromHrefs(base, re));
    } catch (e) {
      // Non-fatal: the text harvest may already have found everything, and the
      // listing itself was fetched successfully or we would not be here.
      console.error(`  detail: href harvest failed for ${src.id} — ${e.message}`);
    }
  }
  // Drop the listing itself; a source that links to itself would otherwise
  // duplicate its whole snapshot inside its own detail section.
  // Sorted, not insertion-ordered: the detail text is part of the hashed
  // snapshot, so a stable order keeps the daily diff to real content changes
  // instead of link-order shuffle. Explicit `urls` keep their roster order and
  // come first — they are the fixed evidence pages (a /summer-camps, a /join),
  // so they must never be crowded out by the harvest hitting the cap.
  const pinned = (cfg.urls ?? [])
    .map((e) => absUrl(expandUrlTemplate(typeof e === "string" ? e : e?.url ?? ""), base))
    .filter(Boolean);
  // The base URL is dropped from the HARVEST (a page linking to itself would
  // duplicate its whole snapshot) but never from `urls`: pinning the base is
  // the sanctioned way to re-read a lazy page with the browser. Membership and
  // pricing pages (Held Space, Selformer, Clay Space) render 6KB of nav on
  // plain fetch — comfortably past MIN_TEXT_CHARS, so `auto` never escalates —
  // while every tier and price mounts on scroll and is silently absent.
  const harvested = [...new Set(candidates)].filter((u) => !pinned.includes(u) && u !== base).sort();
  const urls = [...new Set([...pinned, ...harvested])].slice(0, limit);

  const blocks = [];
  const failed = [];
  for (const u of urls) {
    try {
      const mode = modeFor.get(u) ?? cfg.fetch;
      const raw = mode === "browser" ? await browserText(u, { scroll: cfg.scroll !== false }) : htmlToText(await rawGet(u, "text/html,application/xhtml+xml"));
      const text = raw.trim();
      if (!text) {
        failed.push({ url: u, why: "empty" });
      } else if (BLOCK_RE.test(text.slice(0, 800))) {
        failed.push({ url: u, why: "bot-wall" });
      } else {
        blocks.push(`## [DETAIL] ${u}\n${text}`);
      }
    } catch (e) {
      failed.push({ url: u, why: e.message });
    }
    await sleep(cfg.delayMs ?? 400);
  }
  return {
    block: blocks.length ? `\n\n${blocks.join("\n\n")}` : "",
    fetched: blocks.length,
    failed,
  };
}

// Which sources are in play this run, and does any of them require the browser?
const selected = sources.filter(
  (s) => (!ONLY || ONLY.has(s.id)) && (ONLY || s.cadence !== "monthly" || INCLUDE_MONTHLY),
);
const browserRequired = selected.some((s) => s.fetch === "browser");

let browserPreflight = { ok: true, skipped: true };
if (browserRequired && !NO_BROWSER) {
  browserPreflight = await preflightBrowser();
  if (browserPreflight.ok) {
    console.log(`browser preflight: ok (${browserPreflight.engine}, ${browserPreflight.proxy})`);
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
    const { text: listingText, method } = await fetchSource(src);
    // Detail pages are part of the snapshot, not a side file: they must be
    // hashed, diffed and re-checkable exactly like the listing they came from.
    const detail = await detailText(src, listingText);
    const text = listingText + detail.block;
    if (src.detail) {
      entry.detail = { fetched: detail.fetched, ...(detail.failed.length ? { failed: detail.failed } : {}) };
      const note = detail.failed.length ? `, ${detail.failed.length} failed` : "";
      console.log(`  detail: ${detail.fetched} page(s) persisted for ${src.id}${note}`);
    }
    const h = hash(text);
    const prev = state[src.id] ?? {};
    entry.method = method;
    entry.textPath = `.ingest-cache/${src.id}.txt`;

    // Status is relative to the last INGESTED baseline, not the last fetch.
    // The baseline FILE is the committed truth (it is the one tracked part of
    // the cache); state.json is a gitignored cache and loses to it — a pull
    // that brings new baselines beside a stale state made sources report
    // "changed" against text they matched byte for byte (2026-08-03).
    const baselinePath = join(CACHE_DIR, `${src.id}.ingested.txt`);
    const baseline = existsSync(baselinePath) ? readFileSync(baselinePath, "utf8") : null;
    const ingestedHash = resolveIngestedHash({
      baselineText: baseline,
      stateIngestedHash: prev.ingestedHash,
      hash,
    });

    if (ingestedHash === h && !FORCE) {
      entry.status = "unchanged";
    } else {
      entry.status = baseline == null ? "new" : "changed";
      if (baseline != null) {
        const d = diffAgainstBaseline(baseline, text);
        const diffPath = join(CACHE_DIR, `${src.id}.diff.txt`);
        writeFileSync(diffPath, d.added.join("\n") + "\n");
        entry.diffPath = `.ingest-cache/${src.id}.diff.txt`;
        entry.addedLines = d.addedLines;
        entry.removedLines = d.removedLines;
        entry.reorderedOnly = d.reorderedOnly;
      }
    }
    writeFileSync(snapPath, text + "\n");
    state[src.id] = { ...prev, hash: h, ingestedHash: ingestedHash ?? prev.ingestedHash, fetchedAt: new Date().toISOString(), method };
    // A source that only shrank has +0 added and would otherwise read as noise;
    // show the removals so an emptying calendar is legible.
    const delta =
      entry.addedLines == null
        ? ""
        : `, +${entry.addedLines}/-${entry.removedLines} lines${entry.reorderedOnly ? " (reordered only)" : ""}`;
    console.log(`  ${entry.status.padEnd(9)} ${src.id} (${method}${delta})`);
  } catch (e) {
    entry.status = "error";
    entry.error = String(e.message ?? e);
    let denied = e?.[PROXY_DENIED] ?? null;
    // A `browser`-strategy source never makes a plain attempt, so a denial on
    // its host cannot surface above — and when the browser is also down, every
    // one of them reports "browser unavailable" regardless of whether its host
    // is reachable at all. Two of the four allowlist gaps missed on 2026-08-10
    // (jumpcomedy.com, leavesbookstore.com) hid in exactly that blind spot. We
    // cannot read the source either way, but WHICH fix applies still matters,
    // so spend one diagnostic request to tell the two apart. Only runs for a
    // source that has already failed, so it costs nothing on a healthy run.
    if (!denied && PROXY && /browser unavailable/.test(entry.error)) {
      denied = await probeHostDenial(src);
      if (denied) entry.error += ` — and its host is egress-denied (${denied}), so the browser is not the only blocker`;
    }
    if (denied) entry.proxyDeniedHost = denied;
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

// A browser outage is reported whether or not it is fatal. It stopped being
// fatal on its own on 2026-08-05: when this clause was written (2026-08-03) 22
// of 48 sources were browser-only, so "every browser fetch failed" meant losing
// ~46% of the roster. After the feed/json migrations only a handful still need
// the browser, and the same clause would halt a run that read 42 of 48 sources
// fine. Coverage is the thing we actually care about, and the error-rate ceiling
// already measures it — a failed browser source counts as an error like any
// other. Keeping a second, drifting proxy for the same question only produced
// false alarms, so the ceiling is now the single rule.
// The allowlist ask, assembled by the run rather than by hand. On 2026-08-10
// the ask was compiled by eye from the error list and came up four hosts
// short, because an `auto` source whose plain fetch was denied reported only
// "browser unavailable". Every denial is now tagged at the throw site, so this
// block is exhaustive by construction. It prints the host actually connected
// to, which is the one the allowlist needs: happy-medium.co 307-redirects to
// www.happy-medium.co, and allowlisting the bare host alone leaves it denied.
const deniedHosts = [...new Set(results.filter((r) => r.proxyDeniedHost).map((r) => r.proxyDeniedHost))].sort();
if (deniedHosts.length) {
  console.error("\n=== EGRESS DENIED — the proxy refused these hosts ===");
  console.error(`  ${deniedHosts.length} host(s), affecting ${results.filter((r) => r.proxyDeniedHost).length} source(s):`);
  for (const h of deniedHosts) {
    const ids = results.filter((r) => r.proxyDeniedHost === h).map((r) => r.id).join(", ");
    console.error(`    ${h}  →  ${ids}`);
  }
  console.error("  These are NOT site bot-walls and NOT the browser path: the tunnel was refused,");
  console.error("  so no HTTP response ever existed (a site bot-wall returns a status, e.g. 403,");
  console.error("  and is reported as one). Timeouts are excluded — they are not denials.");
  console.error("  Allowlist these at claude.ai/code; the proxy's own status endpoint records");
  console.error("  the reason per host. Never route around a policy denial.");
}

if (browserFetchDown) {
  console.error("\n=== BROWSER PATH DOWN — browser-only sources contributed nothing ===");
  if (browserPreflight?.fix) console.error(`  Fix: ${browserPreflight.fix}`);
  console.error(
    `  ${sourcesUnreachable ? "This run is degraded (see below)." : "Roster coverage is still within the ceiling, so this run continues."}`,
  );
}

if (sourcesUnreachable) {
  console.error("\n=== DEGRADED RUN — the roster was not readable ===");
  console.error(`  ${reach.errored} of ${reach.attempted} sources errored.`);
  console.error(
    "  Do not ingest this as a normal week: expiry will still delete, so a degraded run\n" +
      "  shrinks the deck (2026-08-03 supply analysis). Fix the cause, or re-run with\n" +
      "  --allow-degraded to proceed knowingly.",
  );
  process.exit(ALLOW_DEGRADED ? 0 : 1);
}
process.exit(0);
