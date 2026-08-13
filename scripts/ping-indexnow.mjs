#!/usr/bin/env node
// IndexNow push-on-publish (2026-08-13).
//
// The product's edge is FRESHNESS — a verified feed that changes daily. Waiting
// for a crawler to notice spends that edge: Bing reported the site "Indexed
// successfully" but Google still rates most pages "Crawled – currently not
// indexed", and neither knows a card changed until it happens to look again.
// IndexNow inverts that — we tell them the moment a routine ships.
//
// The key is PUBLIC by design (the protocol verifies ownership by fetching it
// from the site root), so `public/<key>.txt` is committed on purpose. It is not
// a secret and must never be treated as one.
//
// Usage:
//   npm run ingest:indexnow             # only pings on a Vercel PRODUCTION build
//   npm run ingest:indexnow -- --dry-run   # print what would be sent
//   npm run ingest:indexnow -- --force     # ping from anywhere (manual re-push)
//   npm run ingest:indexnow -- --days 7    # widen the changed-window
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { AEO_ORIGIN, liveCards } from "../src/demand-test/aeo.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const DRY = has("--dry-run");
const FORCE = has("--force");
const DAYS = Number(args[args.indexOf("--days") + 1]) || 2;

// Only production deploys announce. A preview build shipping URLs that resolve
// to a different deployment would be telling search engines about content the
// canonical origin doesn't serve — and every local `npm run build` would ping.
const isProdDeploy = process.env.VERCEL_ENV === "production";
if (!isProdDeploy && !FORCE && !DRY) {
  console.log(`[indexnow] skipped — not a production deploy (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"})`);
  process.exit(0);
}

const keyFile = readdirSync(resolve(ROOT, "public")).find((f) => /^[a-f0-9]{8,128}\.txt$/i.test(f));
if (!keyFile) {
  console.error("[indexnow] no key file in public/ — expected <hex>.txt. Skipping.");
  process.exit(0); // never fail a build over an announcement
}
const key = keyFile.replace(/\.txt$/i, "");

const seed = JSON.parse(readFileSync(resolve(ROOT, "src/data/demand-test/cards.json"), "utf8"));
const now = new Date();
const cutoff = now.getTime() - DAYS * 86400000;

// Only what actually CHANGED. IndexNow is for announcing changes; re-submitting
// 159 unchanged URLs on every deploy is what gets a site's pings discounted.
// `updatedAt` is schema-required on every card, so this needs no git history —
// which matters because Vercel builds from a shallow clone.
const changed = liveCards(seed.cards, now).filter((c) => {
  const t = Date.parse(c.updatedAt ?? c.createdAt ?? "");
  return Number.isFinite(t) && t >= cutoff;
});

const urlList = [
  `${AEO_ORIGIN}/`, // the home page's ItemList changes whenever any card does
  ...changed.map((c) => `${AEO_ORIGIN}/e/${encodeURIComponent(c.id)}`),
];

console.log(`[indexnow] ${changed.length} card(s) changed in the last ${DAYS}d → ${urlList.length} URL(s)`);

if (DRY) {
  for (const u of urlList) console.log("  ", u);
  console.log(`[indexnow] dry run — key ${key}, nothing sent`);
  process.exit(0);
}

const body = {
  host: new URL(AEO_ORIGIN).host,
  key,
  keyLocation: `${AEO_ORIGIN}/${keyFile}`,
  urlList,
};

try {
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  // 200 accepted · 202 accepted, key validation pending · 4xx worth seeing.
  console.log(`[indexnow] ${res.status} ${res.statusText}`);
  if (!res.ok) console.error("[indexnow]", (await res.text()).slice(0, 300));
} catch (error) {
  // An announcement is not the deploy. A dead endpoint, a DNS blip or an
  // offline sandbox must never turn a good build red.
  console.error("[indexnow] ping failed — deploy continues", error.message);
}
