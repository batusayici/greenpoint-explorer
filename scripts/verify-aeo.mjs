#!/usr/bin/env node
// AEO surface verifier (2026-08-13) — Layer 1 of the agent-testing scope.
//
// Checks what an AI CRAWLER receives: raw HTML, no JS. GPTBot, ClaudeBot,
// PerplexityBot and Googlebot's fetch phase all read exactly what this reads.
//
// Why it exists: the answer-engine surface was built well (typed JSON-LD per
// category, sitemap, RSS, llms.txt) and then held together by nothing but the
// unit tests on its builders. Those prove the FUNCTIONS are right; they cannot
// prove the built artefact in dist/ is. A prerender step that silently skipped
// a card, a sitemap that drifted from the live set, or a page shipping two
// canonicals would all pass `npm test` and reach production.
//
// Run against a fresh dist/: `npm run build && npm run verify:aeo`.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { AEO_ORIGIN, liveCards, lensPagePaths, LENS_PAGE_FLOOR } from "../src/demand-test/aeo.js";
import { LENS_PAGES } from "../src/demand-test/deepLink.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");

// A card page must read as prose, not as a headline. 25 words is the floor a
// genuinely thin card (title + when + where + one line) clears; the observed
// median is ~56. It is a smoke threshold, not a quality bar.
const MIN_CARD_WORDS = 25;

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);

const read = (p) => readFileSync(resolve(DIST, p), "utf8");

// Visible text = what a crawler renders. Scripts and styles are stripped, so
// JSON-LD deliberately does NOT count toward the word floor: structured data
// is a second channel, never a substitute for prose.
function visibleWords(html) {
  const body = html.slice(html.indexOf("<body"));
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function jsonLdBlocks(html, where) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.flatMap(({ 1: raw }) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      fail(where, `JSON-LD does not parse — ${error.message}`);
      return [];
    }
  });
}

// Per-type required fields. Each one is a fact the card GUARANTEES, so a
// missing one means the emitter regressed rather than that the data is thin.
const REQUIRED = {
  Event: (ld) => {
    // Either a single occurrence or a stated schedule — never neither, and the
    // truth rule means never a fabricated occurrence either.
    if (!ld.startDate && !ld.eventSchedule) return "Event has neither startDate nor eventSchedule";
    if (ld.eventSchedule) {
      if (!ld.eventSchedule.byDay?.length) return "eventSchedule states no byDay";
      // 2026-08-17: Google rejects an Event with no top-level startDate as a
      // critical error, so a recurring Event now states its FIRST occurrence —
      // which is sourced only if it lands on a stated day, within a week of
      // the window opening. Anything else is a fabricated occurrence.
      if (ld.eventSchedule.startDate && !ld.startDate)
        return "recurring Event with a window states no first occurrence";
      if (ld.startDate) {
        const day = new Date(ld.startDate);
        const weekday = new Intl.DateTimeFormat("en-US", {
          weekday: "long", timeZone: "America/New_York",
        }).format(day);
        if (!ld.eventSchedule.byDay.includes(`https://schema.org/${weekday}`))
          return `recurring Event's startDate falls on ${weekday}, not a stated byDay`;
        const windowOpen = new Date(`${ld.eventSchedule.startDate}T00:00:00-04:00`);
        const drift = day.getTime() - windowOpen.getTime();
        if (drift < 0 || drift >= 8 * 86400000)
          return "recurring Event's startDate is not the first occurrence of its window";
      }
    }
    return ld.location ? null : "Event has no location";
  },
  Offer: (ld) => (ld.validThrough ? null : "Offer has no validThrough"),
  NewsArticle: (ld) => (ld.publisher ? null : "NewsArticle names no publisher"),
  LocalBusiness: (ld) => (ld.address || ld.geo ? null : "LocalBusiness has neither address nor geo"),
};

// ---- the checks ------------------------------------------------------------

if (!existsSync(DIST)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(2);
}

const seed = JSON.parse(readFileSync(resolve(ROOT, "src/data/demand-test/cards.json"), "utf8"));
const live = liveCards(seed.cards, new Date());

// 1. Every live card has a page, with prose and valid typed JSON-LD.
for (const card of live) {
  const rel = `e/${card.id}/index.html`;
  const where = `/e/${card.id}`;
  if (!existsSync(resolve(DIST, rel))) {
    fail(where, "live card has no prerendered page");
    continue;
  }
  const html = read(rel);

  const words = visibleWords(html);
  if (words < MIN_CARD_WORDS) fail(where, `only ${words} visible words (min ${MIN_CARD_WORDS})`);

  const lds = jsonLdBlocks(html, where);
  if (lds.length !== 1) fail(where, `expected exactly 1 JSON-LD block, found ${lds.length}`);

  for (const ld of lds) {
    if (!ld["@context"]) fail(where, `JSON-LD ${ld["@type"]} lost its @context`);
    const problem = REQUIRED[ld["@type"]]?.(ld);
    if (problem) fail(where, problem);
  }

  // injectCardPage REPLACES the home canonical rather than appending — a second
  // canonical would make the page two indexable copies of itself.
  const canonicals = [...html.matchAll(/<link rel="canonical"/g)].length;
  if (canonicals !== 1) fail(where, `expected 1 canonical, found ${canonicals}`);
}

// 1b. The lens landing pages (2026-09-10). Same bar as a card page — prose, one
//     canonical, typed structured data — because they exist for the same reader:
//     a crawler that never runs the app. The extra check here is that a page was
//     written for every lens above the floor and for no lens below it, since the
//     sitemap trusts the same function.
const lensPaths = lensPagePaths(seed.cards, new Date());
for (const path of lensPaths) {
  const rel = `${path}/index.html`;
  const where = `/${path}`;
  if (!existsSync(resolve(DIST, rel))) {
    fail(where, "lens is above the floor but has no prerendered page");
    continue;
  }
  const html = read(rel);

  const words = visibleWords(html);
  if (words < MIN_CARD_WORDS) fail(where, `only ${words} visible words (min ${MIN_CARD_WORDS})`);

  const canonicals = [...html.matchAll(/<link rel="canonical"/g)].length;
  if (canonicals !== 1) fail(where, `expected 1 canonical, found ${canonicals}`);
  if (!html.includes(`<link rel="canonical" href="${AEO_ORIGIN}/${path}" />`)) {
    fail(where, "canonical does not point at this page");
  }

  // The head must be the LENS's, not the shell's. A page that ships the home
  // page's title is the exact failure these pages were built to end: every
  // group post previewing as the same generic headline.
  const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "";
  if (/^What's on in Greenpoint, Brooklyn this week/.test(title)) {
    fail(where, "still carries the home page title — the share preview would be generic");
  }
  const ogTitle = /<meta property="og:title" content="([^"]*)"/.exec(html)?.[1] ?? "";
  if (ogTitle !== title) fail(where, "og:title and <title> disagree");
  if (!/greenpoint/i.test(title)) {
    fail(where, 'title does not carry "Greenpoint" — the keyword search matches on');
  }

  const lds = jsonLdBlocks(html, where);
  if (lds.length !== 1) fail(where, `expected exactly 1 JSON-LD block, found ${lds.length}`);
  const itemList = lds.find((l) => l["@type"] === "ItemList");
  if (!itemList) fail(where, "lens page has no ItemList JSON-LD");
  else {
    for (const entry of itemList.itemListElement ?? []) {
      const item = entry.item;
      if (!item) fail(where, `ItemList position ${entry.position} carries no item`);
      else if (!item.startDate) fail(where, `ItemList item "${item.name}" carries no startDate`);
    }
  }
}

// A lens below the floor must not have been written — a stale page from an
// earlier build would keep being served and keep being announced.
for (const path of Object.keys(LENS_PAGES)) {
  if (lensPaths.includes(path)) continue;
  if (existsSync(resolve(DIST, path, "index.html"))) {
    fail(`/${path}`, `below the ${LENS_PAGE_FLOOR}-card floor but a page was written anyway`);
  }
}

// 2. Sitemap parity — no drift in either direction, and nothing listed that
//    isn't on disk (a 404 in the sitemap teaches a crawler to trust it less).
const sitemap = read("sitemap.xml");
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const cardUrls = live.map((c) => `${AEO_ORIGIN}/e/${encodeURIComponent(c.id)}`);
for (const url of cardUrls) if (!listed.has(url)) fail("sitemap.xml", `live card missing: ${url}`);
const lensUrls = lensPaths.map((p) => `${AEO_ORIGIN}/${p}`);
for (const url of lensUrls) {
  if (!listed.has(url)) fail("sitemap.xml", `built lens page missing: ${url}`);
}
for (const url of listed) {
  // A lens URL is announced only when its page was built — checked above from
  // both sides, so here we only need it not to be mistaken for a card.
  if (lensUrls.includes(url)) continue;
  if (!url.includes("/e/")) continue;
  if (!cardUrls.includes(url)) fail("sitemap.xml", `lists a card that is not live: ${url}`);
  const slug = decodeURIComponent(url.split("/e/")[1]);
  if (!existsSync(resolve(DIST, "e", slug, "index.html"))) {
    fail("sitemap.xml", `lists a URL with no file on disk: ${url}`);
  }
}

// 3. The home page's structured data must be able to ANSWER, not just link.
//    This is the check that would have caught the measured gap: entries that
//    carried a headline and a URL and nothing a question could be answered from.
const home = read("index.html");

// 3a. The home page must say something in PROSE, not only in JSON-LD. It
//     shipped a 51-byte body until 2026-08-13 and no check here noticed —
//     Bing did, as an `H1 tag missing` error.
const homeH1s = (home.match(/<h1[\s>]/g) ?? []).length;
if (homeH1s !== 1) fail("/", `expected exactly 1 <h1>, found ${homeH1s}`);
const homeWords = visibleWords(home);
if (homeWords < 10) fail("/", `only ${homeWords} visible words — the body is effectively empty`);

const homeLds = jsonLdBlocks(home, "/");
const list = homeLds.find((l) => l["@type"] === "ItemList");
if (!homeLds.some((l) => l["@type"] === "WebSite")) fail("/", "home page has no WebSite JSON-LD");
if (!list) {
  fail("/", "home page has no ItemList JSON-LD");
} else {
  for (const entry of list.itemListElement ?? []) {
    const item = entry.item;
    if (!item) fail("/", `ItemList position ${entry.position} carries no item`);
    else if (!item.startDate) fail("/", `ItemList item "${item.name}" carries no startDate`);
  }
}

// 4. robots.txt must not lock out the answer engines this whole surface is for.
const robots = read("robots.txt");
if (!/^user-agent:\s*\*/im.test(robots)) fail("robots.txt", "no wildcard User-agent group");
if (/^disallow:\s*\/\s*$/im.test(robots)) fail("robots.txt", "disallows the whole site");
for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Googlebot"]) {
  // A named group that disallows everything would silently undo the wildcard.
  const group = robots.match(new RegExp(`user-agent:\\s*${bot}[\\s\\S]*?(?=\\nuser-agent:|$)`, "i"));
  if (group && /^disallow:\s*\/\s*$/im.test(group[0])) fail("robots.txt", `${bot} is blocked`);
}

// 5. llms.txt must only point at surfaces that exist — a dead link in the file
//    whose entire job is orientation is worse than no file.
const llms = read("llms.txt");
for (const url of llms.match(/https:\/\/\S+/g) ?? []) {
  if (!url.startsWith(AEO_ORIGIN)) continue;
  // `/e/<slug>` is prose showing crawlers the URL SHAPE, not a link to follow.
  if (url.includes("<")) continue;
  const path = url.slice(AEO_ORIGIN.length).replace(/^\//, "").replace(/[.,)]$/, "");
  if (!path) continue;
  const onDisk = existsSync(resolve(DIST, path)) || existsSync(resolve(DIST, path, "index.html"));
  if (!onDisk) fail("llms.txt", `points at a surface that isn't in dist/: ${url}`);
}

// 6. The IndexNow key must actually SHIP. Without it at the site root the
//    protocol rejects every ping — and it fails silently, in a script that
//    deliberately never breaks the build, so nothing else would ever notice
//    that push-on-publish had stopped working.
const keyFiles = readdirSync(DIST).filter((f) => /^[a-f0-9]{8,128}\.txt$/i.test(f));
if (keyFiles.length !== 1) {
  fail("indexnow", `expected exactly 1 key file at the site root, found ${keyFiles.length}`);
} else {
  const name = keyFiles[0].replace(/\.txt$/i, "");
  const contents = read(keyFiles[0]).trim();
  if (contents !== name) {
    fail("indexnow", `key file ${keyFiles[0]} must contain exactly its own key, found "${contents.slice(0, 40)}"`);
  }
}

// 7. A dead /e/ link must ANSWER AS DEAD (2026-09-07). It used to answer 200
//    with the home page: vercel.json rewrote `/e/:slug` to `/` whenever no
//    prerendered file matched, so every expired card URL — 312 of them by the
//    time this was written, and 40-60 more each week — served identical bytes
//    under the home canonical. Google read them as copies of one page and
//    stopped indexing them ("Duplicate, Google chose different canonical than
//    user", mailed 2026-09-06).
//
//    Both halves are checked because either alone brings the bug back: the
//    rewrite must be gone, AND 404.html must exist for Vercel to serve in its
//    place. This reads vercel.json rather than dist/ — routing is the thing
//    that was wrong, and no artefact in dist/ can show it.
const vercelConfig = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf8"));
for (const rule of vercelConfig.rewrites ?? []) {
  if (String(rule.source).startsWith("/e/")) {
    fail(
      "vercel.json",
      `rewrite ${rule.source} -> ${rule.destination} makes every expired card URL answer 200 with another page; ` +
        "expired slugs must fall through to 404.html",
    );
  }
}

if (!existsSync(resolve(DIST, "404.html"))) {
  fail("/404.html", "missing — an unmatched path would get Vercel's bare error page, not the feed");
} else {
  const nf = read("404.html");
  // No canonical: declaring `/` here is what made these pages duplicates.
  const nfCanonicals = [...nf.matchAll(/<link rel="canonical"/g)].length;
  if (nfCanonicals !== 0) fail("/404.html", `must declare no canonical, found ${nfCanonicals}`);
  if (!/<meta name="robots" content="noindex"/.test(nf)) fail("/404.html", "missing noindex");
  // Prose, for the same reason every other page here needs it: a crawler that
  // does not run JS must be told what it landed on.
  if (visibleWords(nf) < 20) fail("/404.html", `only ${visibleWords(nf)} visible words`);
  if ([...nf.matchAll(/<h1[\s>]/g)].length !== 1) fail("/404.html", "expected exactly 1 <h1>");
  // The SPA has to boot from this shell — that is what puts the live feed and
  // the "That one's wrapped" notice under a reader who followed a stale link.
  if (!/<div id="root">/.test(nf) || !/<script[^>]+src="\/assets\//.test(nf)) {
    fail("/404.html", "not built from the app shell — the SPA will not boot, so the reader gets no feed");
  }
}

// ---- report ----------------------------------------------------------------

if (failures.length > 0) {
  console.error(`\n✖ AEO surface: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error("");
  process.exit(1);
}

console.log(
  `✓ AEO surface: ${live.length} card pages, ${listed.size} sitemap URLs, ` +
    `${list?.itemListElement?.length ?? 0} dated events on the home page, ` +
    `dead /e/ links fall through to 404.html`,
);
