#!/usr/bin/env node
// Track V — verify every card's `sourceQuote` actually appears in its source's
// snapshot (Batu, DECISION_LOG 2026-08-12).
//
// WHY THIS EXISTS. `sourceQuote` has been schema-checked for PRESENCE since
// 2026-08-02, and presence was never the property that mattered.
// `dreams-on-command-there-are-people-here-0808` shipped to production quoting
//   "There Are People Here. July 11–August 8, 2026."
// — a string that appears nowhere in the source, which states September 8. The
// gallery's snapshot was byte-identical to the prior baseline, so no source
// changed under us: the quote was wrong when it was written, and the card told
// residents a running show had closed. A schema check cannot catch that. Only
// re-reading the source can.
//
//   node scripts/verify-quotes.mjs           → gate cards authored on/after
//     GATE_FROM; exit 1 on any MISMATCH. This is the run-time gate.
//   node scripts/verify-quotes.mjs --all     → sweep the whole deck, report
//     only (exit 0). Use to see the historical backlog, not to block a run.
//   node scripts/verify-quotes.mjs --verbose → also list OK and SKIP lines
//
// Exit codes: 0 = no mismatch in scope. 1 = at least one in-scope card's quote
// is not in its snapshot — that card must go to the hold pile, never to prod.
//
// WHY THE DATE CUTOFF, and what it means now. When this landed, `--all` over
// the whole deck reported ~33 of 89 checkable cards as mismatched — and they
// were overwhelmingly NOT fabrications. The snapshot was an incomplete evidence
// base by design: listings were captured, detail pages were not. Gating that
// would have produced a check so noisy it got ignored or widened until
// toothless, the failure mode that matters most for a truth gate.
//
// THAT BACKLOG IS NOW ZERO (2026-08-12). All 29 were re-checked against live
// sources: 17 were factually correct with evidence that had simply expired, and
// the rest were RECONSTRUCTIONS — real facts, composed strings — which were
// rewritten verbatim. `fetch-sources.mjs` now persists detail pages via the
// roster `detail` block, so the evidence arrives with the run that authors the
// card. So treat any `--all` mismatch as NEW DRIFT worth investigating, not as
// background noise.
//
// The cutoff still stands, deliberately: recurring cards decay by design. A
// venue listing rolls forward ("Thu Aug 6 … and 5 more" becomes "Thu Aug 13 …
// and 4 more") and its quote stops matching even though the card is right. That
// is a re-quote at the next verified-through check, not a reason to block a
// ship. The BLOCKING gate is therefore scoped to cards this run touched;
// `--all` is the health report.
//
// It can also only check cards whose source is a roster web source with a
// committed baseline. Newsletter-derived cards (Gmail) have no snapshot on disk
// and are reported as SKIP, not as pass — they are exactly as unverified as
// they were before this script existed, and the summary says so.
const GATE_FROM = "2026-08-12";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "demand-test");
const cacheDir = join(root, ".ingest-cache");
const verbose = process.argv.includes("--verbose");
const sweepAll = process.argv.includes("--all");

const seed = JSON.parse(readFileSync(join(dataDir, "cards.json"), "utf8"));
const sourcesRaw = JSON.parse(readFileSync(join(dataDir, "ingest-sources.json"), "utf8"));
const sources = Array.isArray(sourcesRaw) ? sourcesRaw : sourcesRaw.sources;

// Normalization is deliberately NARROW: whitespace and the unicode punctuation
// that HTML-to-text conversion rewrites (curly quotes, dashes, nbsp). Nothing
// else is forgiven — every other difference is the fabrication this catches, so
// widening this is how the check quietly stops working.
// Quote CHARACTERS are typography, not content: a source writing “CIBONE O'TE”
// and a card writing 'CIBONE O'TE' make the identical claim, and the same page
// renders them differently in feed vs. HTML. All quote marks fold to one token,
// the same reasoning that already folds en/em dashes. This does NOT forgive a
// changed word, number or date.
const norm = (s) =>
  s
    .replace(/[‘’ʼ'“”"]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .replace(/[   ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const hostOf = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

// Map a card to its roster source by host. `citeHost` exists because some
// sources are cited at their public domain while fetched at a feed URL
// (macha-studio cites machastudio.com, fetches /blogs/events.atom).
const byHost = new Map();
for (const s of sources) {
  for (const h of [hostOf(s.url), s.citeHost ? hostOf(`https://${s.citeHost}`) : null]) {
    if (h && !byHost.has(h)) byHost.set(h, s);
  }
}

const readSnapshot = (id) => {
  // Prefer the committed baseline (the tracked truth a reviewer can diff);
  // fall back to the working snapshot when a run has fetched but not marked.
  for (const name of [`${id}.ingested.txt`, `${id}.txt`]) {
    const p = join(cacheDir, name);
    if (existsSync(p)) return { text: readFileSync(p, "utf8"), file: name };
  }
  return null;
};

// A `sourceQuote` is frequently an ASSEMBLY of verbatim fragments, not one
// contiguous span — the library card splices `ts_title:` and
// `ds_event_start_date:` from two different records, Moon Bunny joins two camp
// sessions, the Kindred poster stitches lines off a flyer. That is legitimate
// and long-standing, so requiring one contiguous match would reject about half
// the honest deck. What must hold is that EVERY fragment is real. Checking
// fragment-wise is also the better diagnostic: it names the unsupported claim
// instead of just failing the card.
const FRAGMENT_MIN = 15; // shorter than this is too generic to be evidence
// `…` (and a bare " ... ") is an author's explicit ELISION marker — "text was
// omitted here" — which is exactly the standard quoting convention, and the BCC
// class cards use it: "Sewing 101: Tote Bag … In Greenpoint: Thurs, 8/13 at
// 6:30pm". Splitting on it honours the marker instead of demanding that two
// deliberately-separated spans be contiguous in the source.
const fragments = (quote) => {
  const out = [];
  for (const line of quote.split(/\n+|\s*(?:…|\.\.\.)\s*/)) {
    if (norm(line).length < FRAGMENT_MIN) continue;
    out.push(line);
  }
  return out.length ? out : [quote];
};
// Feed snapshots are field-labelled (`ts_title:`, `ts_body:`, `start_at:`), and
// authors keep those labels in the quote to show which field a claim came from.
// The label is snapshot STRUCTURE, not a claim, and it is frequently followed in
// the snapshot by different text than in the quote — `library-sensory-garden-0821`
// quotes `ts_body: Garden Educator will be on site from 3-4pm on Fridays`, which
// is verbatim in the source but sits mid-sentence inside a longer ts_body. So a
// leading label is stripped before matching. Deliberately narrow: only a leading
// `word:` is removed, never anything inside the claim.
const unlabel = (s) => s.replace(/^\s*[a-z][a-z0-9_]*:\s*/i, "");

// Trailing sentence punctuation an author added when lifting a fragment out of
// running text. `bandit-running-gpr` states "Saturdays at 9:30 am" with no stop;
// the card quotes "Saturdays at 9:30 am." A full stop is not a claim.
const detrail = (s) => s.replace(/[\s.,;:!]+$/, "");

// Only applied to a fragment that failed whole — splitting eagerly would break
// "St.", "$17.50" and bare domains into noise.
const sentences = (line) =>
  line
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"'])/)
    .filter((s) => norm(s).length >= FRAGMENT_MIN);

const results = { ok: [], mismatch: [], skip: [] };

for (const card of seed.cards) {
  if (!card.sourceQuote) continue;
  // Gate on TOUCHED, not just created: a card whose quote is rewritten by a run
  // is exactly as capable of carrying a fabricated line as a new one, and the
  // Dreams card was wrong from birth precisely because nobody re-read it. This
  // is a ratchet — once a run touches a legacy card, that card's evidence has
  // to be persisted or the card has to be held.
  if (!sweepAll && !(card.createdAt >= GATE_FROM || card.updatedAt >= GATE_FROM)) continue;
  // A card's evidence base is EVERY source it cites, not just the first.
  // `nb-chess-parkhouse-0806` quotes across a Greenpointers article AND an
  // Eventbrite listing; matching only the first host reported it unverifiable
  // and forced its Eventbrite half to be hand-copied into the Greenpointers
  // snapshot. Union the snapshots instead — cross-source quoting is normal and
  // the model should carry it.
  const hosts = [...new Set((card.sourceLinks ?? []).map((l) => hostOf(l.url)).filter(Boolean))];
  const srcs = [...new Set(hosts.map((h) => byHost.get(h)).filter(Boolean))];
  if (srcs.length === 0) {
    results.skip.push({ id: card.id, why: hosts.length ? `no roster source for ${hosts.join(", ")}` : "no source URL" });
    continue;
  }
  const snaps = srcs.map((s) => ({ s, snap: readSnapshot(s.id) })).filter((x) => x.snap);
  if (snaps.length === 0) {
    results.skip.push({ id: card.id, why: `no snapshot for ${srcs.map((s) => s.id).join(", ")}` });
    continue;
  }
  const src = snaps[0].s;
  const snap = snaps[0].snap;
  const hay = norm(snaps.map((x) => x.snap.text).join("\n"));
  const has = (s) =>
    [s, unlabel(s), detrail(s), detrail(unlabel(s))].some((v) => norm(v).length >= FRAGMENT_MIN && hay.includes(norm(v)));
  const missing = [];
  for (const frag of fragments(card.sourceQuote)) {
    if (has(frag)) continue;
    // Fall back to sentence granularity before calling it missing.
    const parts = sentences(frag);
    const bad = parts.filter((p) => !has(p));
    if (parts.length > 1 && bad.length === 0) continue;
    missing.push(...(parts.length > 1 ? bad : [frag]));
  }
  if (missing.length === 0) {
    results.ok.push({ id: card.id, src: srcs.map((x) => x.id).join("+") });
  } else {
    results.mismatch.push({ id: card.id, src: srcs.map((x) => x.id).join("+"), file: snaps.map((x) => x.snap.file).join("+"), missing });
  }
}

console.log(
  `[verify-quotes] sourceQuote vs. source snapshot — ${sweepAll ? "FULL SWEEP (report only)" : `gating cards created >= ${GATE_FROM}`}\n`,
);
if (verbose) {
  for (const r of results.ok) console.log(`  OK      ${r.id}  (${r.src})`);
  for (const r of results.skip) console.log(`  SKIP    ${r.id}  — ${r.why}`);
}
for (const r of results.mismatch) {
  console.log(`  MISMATCH ${r.id}  (${r.src} → .ingest-cache/${r.file})`);
  for (const m of r.missing) console.log(`           not in source: ${JSON.stringify(m.slice(0, 160))}`);
}

const checked = results.ok.length + results.mismatch.length;
console.log(
  `\n  verified=${results.ok.length} mismatch=${results.mismatch.length} ` +
    `unverifiable=${results.skip.length} (of ${checked + results.skip.length} quoted cards)`,
);

if (results.skip.length > 0 && !verbose) {
  console.log("  — unverifiable cards have no committed snapshot (newsletter-derived, or source not yet marked); re-run with --verbose to list them.");
}

if (results.mismatch.length > 0 && sweepAll) {
  console.log(
    "\n  Full sweep is REPORT-ONLY. Most of these predate evidence-persistence:\n" +
      "  the quote came from an R1 detail page or a flyer image that was never\n" +
      "  written into the snapshot. Do not 'fix' them by rewriting quotes to match\n" +
      "  the snapshot — that would launder the very thing this check exists to find.",
  );
}

if (results.mismatch.length > 0 && !sweepAll) {
  console.log(
    "\n  A quote that is not in the source cannot hold a card up. Hold every card\n" +
      "  listed above — do not ship it, do not 'fix' it by editing the quote to\n" +
      "  something the source does say without re-reading what the source claims.",
  );
  process.exit(1);
}
