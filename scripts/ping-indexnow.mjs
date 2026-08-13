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
import { cardsToAnnounce } from "../src/demand-test/indexNow.js";

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
const ledger = JSON.parse(readFileSync(resolve(ROOT, "src/data/demand-test/ingest-ledger.json"), "utf8"));
const now = new Date();

// Content changes come from INGEST RUNS, not from deploys — so the last run is
// the cutoff, not a wall-clock window. See src/demand-test/indexNow.js for the
// two ways this was wrong before it was right. `--days N` overrides for a
// deliberate manual re-push.
const changed = cardsToAnnounce(liveCards(seed.cards, now), {
  lastRunAt: has("--days") ? null : ledger.lastRunAt,
  now,
  fallbackDays: DAYS,
});

if (changed.length === 0) {
  // The fix for the 403: a deploy that changed no content has nothing to
  // announce, and saying so anyway is what got the second ping rejected.
  console.log(`[indexnow] no cards changed since the last ingest run (${ledger.lastRunAt}) — nothing to announce`);
  process.exit(0);
}

const urlList = [
  `${AEO_ORIGIN}/`, // the home page's ItemList changes whenever any card does
  ...changed.map((c) => `${AEO_ORIGIN}/e/${encodeURIComponent(c.id)}`),
];

console.log(`[indexnow] ${changed.length} card(s) changed since ${ledger.lastRunAt} → ${urlList.length} URL(s)`);

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
  if (res.status === 403) {
    // Verified 2026-08-13: the key file resolves and a fresh submission of the
    // same shape returns 200, so a 403 here means these URLs were already
    // announced — not a broken key. Named explicitly so it can't be mistaken
    // for the failure it looks like.
    console.error("[indexnow] 403 — already announced, or the key is not resolving. Check that " +
      `${AEO_ORIGIN}/${keyFile} returns the key before assuming duplication.`);
  } else if (!res.ok) {
    console.error("[indexnow]", (await res.text()).slice(0, 300));
  }
} catch (error) {
  // An announcement is not the deploy. A dead endpoint, a DNS blip or an
  // offline sandbox must never turn a good build red.
  console.error("[indexnow] ping failed — deploy continues", error.message);
}
