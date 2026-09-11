#!/usr/bin/env node
// AEO prerender (ops plan 3.6) — runs after `vite build` (see package.json).
// Reads dist/index.html as the shell (so hashed asset refs survive) and the
// live cards JSON, then writes the machine-readable surface into dist/:
//   dist/e/<slug>/index.html   per live card (raw facts + schema.org JSON-LD)
//   dist/404.html              the dead-link page, served at a real 404
//   dist/sitemap.xml, dist/rss.xml, dist/events.ics, dist/llms.txt, dist/robots.txt
// A live card has a real file, so it is served whatever the routing does. An
// expired or unknown /e/ slug matches nothing and lands on 404.html — see
// injectNotFoundPage for why that replaced the old rewrite to `/`. Freshness
// rides the deploy: every ingest PR merge rebuilds this surface.
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
  injectNotFoundPage,
  injectLensPage,
  lensPagePaths,
} from "../src/demand-test/aeo.js";
import { weekSheetHtml, weekSheetGroups } from "../src/demand-test/weekSheet.js";

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

// Lens landing pages (2026-09-10): /kids and /civic. Written BEFORE the home
// page is rewritten below, because both read the same untouched `template`.
// lensPagePaths returns only the lenses stocked above the floor this build, so
// a thin week publishes nothing rather than an empty page — and the sitemap
// reads the same function, so it can never announce one that was not written.
const lensPaths = lensPagePaths(seed.cards, now);
for (const path of lensPaths) {
  const dir = resolve(DIST, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), injectLensPage(template, path, seed.cards, AEO_ORIGIN, now));
}

// Home-page JSON-LD (2026-08-12 pre-seed QA): WebSite + this week's ItemList
// seated into the built shell — the root document answers "what's on in
// Greenpoint this week" without JS, same as the card pages.
writeFileSync(resolve(DIST, "index.html"), injectHomePage(template, seed.cards, AEO_ORIGIN, now));

// The printable / screenshottable week (D5). Deliberately NOT in the sitemap and
// marked noindex: it is the same content as the feed in a print skin, and an
// answer engine should cite the real card pages, not a handout.
const weekDir = resolve(DIST, "week");
mkdirSync(weekDir, { recursive: true });
writeFileSync(
  resolve(weekDir, "index.html"),
  weekSheetHtml(seed.cards, AEO_ORIGIN, now, { vanityPath: "/market" }),
);
const weekCount = weekSheetGroups(seed.cards, now).reduce((n, g) => n + g.cards.length, 0);

// The dead-link page (2026-09-07). Vercel serves dist/404.html with a 404 for
// any path that matches no file, which is every expired and every invented /e/
// slug. Built from the same shell so the SPA boots and shows the live feed.
writeFileSync(resolve(DIST, "404.html"), injectNotFoundPage(template));

writeFileSync(resolve(DIST, "sitemap.xml"), sitemapXml(seed.cards, AEO_ORIGIN, now));
writeFileSync(resolve(DIST, "rss.xml"), rssXml(seed.cards, AEO_ORIGIN, now));
writeFileSync(resolve(DIST, "events.ics"), icsText(seed.cards, AEO_ORIGIN, now));
writeFileSync(resolve(DIST, "llms.txt"), llmsTxt(AEO_ORIGIN));
writeFileSync(
  resolve(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${AEO_ORIGIN}/sitemap.xml\n`,
);

console.log(
  `AEO prerender: home JSON-LD + ${live.length} card pages + /week sheet (${weekCount} dated) + 404 + sitemap/rss/ics/llms.txt/robots.txt -> dist/`,
);
