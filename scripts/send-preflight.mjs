#!/usr/bin/env node
// Send pre-flight — run it the morning an outbound wave goes out.
//
// Standing rule since 2026-08-06, ratified: "never put a card count in
// outbound copy without regenerating it the morning it is sent." This is that
// rule with a command behind it, plus the three checks that were being done by
// hand next to it: the `src` row exists in channel-links.md, the link actually
// resolves on the canonical origin without losing its query, and prod is
// serving the deck the counts were computed from.
//
// Counting logic + its tests live in src/demand-test/sendPreflight.js. This
// file is the I/O shell: read the deck, hit the network, print, exit non-zero
// if anything a sender would rely on is untrue.
//
//   npm run preflight:send             full check (network)
//   npm run preflight:send -- --offline   counts only, no network
//
// Always via npm run: this makes plain `fetch` calls, so it inherits the
// 2026-08-10 proxy trap (undici ignores HTTPS_PROXY unless the process was
// STARTED with NODE_USE_ENV_PROXY=1, which the npm script sets). Same guard as
// the ingest scripts, same reason — an unproxied run in the sandbox gets
// intercepted, not honestly failed.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { assessSend, SEND_TARGETS } from "../src/demand-test/sendPreflight.js";
import { assertProxyAware } from "../src/demand-test/proxyDiagnosis.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const offline = process.argv.includes("--offline");
if (!offline) assertProxyAware();

const ORIGIN = "https://stoopwise.com";
const cardsRaw = JSON.parse(
  readFileSync(join(root, "src", "data", "demand-test", "cards.json"), "utf8"),
);
const cards = Array.isArray(cardsRaw) ? cardsRaw : cardsRaw.cards;
const linksDoc = readFileSync(join(root, "docs", "launch", "channel-links.md"), "utf8");

const failures = [];
const now = new Date();
const report = assessSend(cards, { now });

console.log(`\n  SEND PRE-FLIGHT — ${now.toISOString().slice(0, 10)} · deck ${report.deckSize} cards\n`);

// ---- 1. counts -------------------------------------------------------------
for (const t of report.targets) {
  // The tomorrow figure is NET, not a subtraction: tonight's cards leave the
  // window and the horizon advances a day, so it can hold steady or even rise.
  // Print both or the sender does the arithmetic wrong.
  const drop = t.droppingAfterToday.length
    ? `    ⚠ expires tonight: ${t.droppingAfterToday.join(", ")} — this line reads ${t.inWindowTomorrow} in the next 7d tomorrow`
    : "";
  console.log(`  ${t.label}  [src=${t.src}]`);
  console.log(
    `    ${t.total} cards · ${t.dated} dated · ${t.inWindow} in the next 7d · through ${t.through ?? "—"}`,
  );
  if (drop) console.log(drop);
  if (t.total === 0) failures.push(`${t.src}: 0 cards — do not send a count for this target`);
  console.log("");
}

// ---- 2. every src has a canonical row, and the row's link is the one used ---
// Copy-never-compose (channel-links.md preamble): a send that composes its own
// URL is how the Jul 15 round lost channel attribution outright.
for (const t of SEND_TARGETS) {
  const row = linksDoc
    .split("\n")
    .find((l) => l.includes(`\`${t.src}\``) && l.includes("http"));
  if (!row) {
    failures.push(`${t.src}: no row in channel-links.md — add the row before sending`);
    continue;
  }
  const url = row.match(/https?:\/\/\S+/)?.[0];
  if (!url?.startsWith(`${ORIGIN}/?src=${t.src}`)) {
    failures.push(`${t.src}: channel-links row points at ${url} — not ${ORIGIN}/?src=${t.src}`);
  }
}

// ---- 3. the links resolve, and the redirect chain keeps the src ------------
if (!offline) {
  for (const t of SEND_TARGETS) {
    const url = `${ORIGIN}/?src=${t.src}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      const kept = new URL(res.url).searchParams.get("src") === t.src;
      const ok = res.ok && kept;
      console.log(`  ${ok ? "✓" : "✗"} ${url} → ${res.status}${kept ? "" : " (src DROPPED)"}`);
      if (!ok) failures.push(`${t.src}: ${res.status}${kept ? "" : ", src lost in redirect"}`);
    } catch (err) {
      console.log(`  ✗ ${url} → ${err.message}`);
      failures.push(`${t.src}: unreachable (${err.message})`);
    }
  }

  // ---- 4. prod is serving the deck these counts describe -------------------
  // Counts read from a local cards.json that prod hasn't deployed yet would be
  // true in the repo and false in the recipient's browser.
  try {
    const xml = await fetch(`${ORIGIN}/sitemap.xml`).then((r) => r.text());
    const locs = (xml.match(/<loc>/g) ?? []).length;
    // The sitemap renders liveCards() plus /, /terms, /privacy (aeo.js) — not
    // deckSize, which also counts expired-but-retained news cards that never
    // leave cards.json (2026-08-19, Finding 1: this drifted -6 on a correctly
    // deployed prod once nine news cards aged past their 30-day shelf life).
    const expectedLocs = report.liveDeckSize + 3;
    const drift = locs - expectedLocs;
    const ok = Math.abs(drift) <= 5; // a card in flight
    console.log(
      `\n  ${ok ? "✓" : "✗"} prod sitemap ${locs} urls vs local live deck ${expectedLocs} (drift ${drift >= 0 ? "+" : ""}${drift})`,
    );
    if (!ok) failures.push(`prod sitemap drift ${drift} — is main deployed?`);
  } catch (err) {
    failures.push(`sitemap unreachable (${err.message})`);
  }
}

// ---- verdict ---------------------------------------------------------------
if (failures.length) {
  console.error(`\n  ✗ NOT CLEAR TO SEND — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`    · ${f}`);
  console.error("");
  process.exit(1);
}
console.log(
  "\n  ✓ clear to send — copy links from docs/launch/channel-links.md, and use the counts above verbatim.\n",
);
