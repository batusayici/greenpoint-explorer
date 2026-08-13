#!/usr/bin/env node
// AEO prerender (ops plan 3.6) — runs after `vite build` (see package.json).
// Reads dist/index.html as the shell (so hashed asset refs survive) and the
// live cards JSON, then writes the machine-readable surface into dist/:
//   dist/e/<slug>/index.html   per live card (raw facts + schema.org JSON-LD)
//   dist/sitemap.xml, dist/rss.xml, dist/events.ics, dist/llms.txt, dist/robots.txt
// Vercel serves real files before rewrites, so expired/unknown /e/ slugs still
// fall through to the SPA's dead-link notice. Freshness rides the deploy: every
// ingest PR merge rebuilds this surface from the refreshed cards.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  AEO_ORIGIN,
  liveCards,
  injectCardPage,
  injectHomePage,
  sitemapXml,
  rssXml,
  icsText,
  llmsTxt,
} from "../src/demand-test/aeo.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const now = new Date();

const template = readFileSync(resolve(DIST, "index.html"), "utf8");
const seed = JSON.parse(
  readFileSync(resolve(ROOT, "src/data/demand-test/cards.json"), "utf8"),
);

const live = liveCards(seed.cards, now);
for (const card of live) {
  const dir = resolve(DIST, "e", card.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), injectCardPage(template, card, AEO_ORIGIN));
}

// Home-page JSON-LD (2026-08-12 pre-seed QA): WebSite + this week's ItemList
// seated into the built shell — the root document answers "what's on in
// Greenpoint this week" without JS, same as the card pages.
writeFileSync(resolve(DIST, "index.html"), injectHomePage(template, seed.cards, AEO_ORIGIN, now));

writeFileSync(resolve(DIST, "sitemap.xml"), sitemapXml(seed.cards, AEO_ORIGIN, now));
writeFileSync(resolve(DIST, "rss.xml"), rssXml(seed.cards, AEO_ORIGIN, now));
writeFileSync(resolve(DIST, "events.ics"), icsText(seed.cards, AEO_ORIGIN, now));
writeFileSync(resolve(DIST, "llms.txt"), llmsTxt(AEO_ORIGIN));
writeFileSync(
  resolve(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${AEO_ORIGIN}/sitemap.xml\n`,
);

console.log(`AEO prerender: home JSON-LD + ${live.length} card pages + sitemap/rss/ics/llms.txt/robots.txt -> dist/`);
