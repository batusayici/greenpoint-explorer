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
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { AEO_ORIGIN, liveCards } from "../src/demand-test/aeo.js";

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
      if (ld.startDate) return "recurring Event asserts a startDate it cannot source";
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

// 2. Sitemap parity — no drift in either direction, and nothing listed that
//    isn't on disk (a 404 in the sitemap teaches a crawler to trust it less).
const sitemap = read("sitemap.xml");
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const cardUrls = live.map((c) => `${AEO_ORIGIN}/e/${encodeURIComponent(c.id)}`);
for (const url of cardUrls) if (!listed.has(url)) fail("sitemap.xml", `live card missing: ${url}`);
for (const url of listed) {
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

// ---- report ----------------------------------------------------------------

if (failures.length > 0) {
  console.error(`\n✖ AEO surface: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error("");
  process.exit(1);
}

console.log(
  `✓ AEO surface: ${live.length} card pages, ${listed.size} sitemap URLs, ` +
    `${list?.itemListElement?.length ?? 0} dated events on the home page`,
);
