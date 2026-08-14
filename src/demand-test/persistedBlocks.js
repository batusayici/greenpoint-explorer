// Persisted-evidence blocks — the part of a snapshot no fetch produces.
//
// A source's `<id>.txt` is what the fetcher read this run. Its
// `<id>.ingested.txt` baseline is supposed to be the EVIDENCE BASE: everything
// a live card's `sourceQuote` can be checked against. Those are not the same
// thing, because three kinds of evidence exist only in the baseline:
//
//   `## [DETAIL] <url>`                  a detail page the fetcher follows —
//                                        absent whenever that fetch FAILS
//   `## [R1 PERSISTED …]`                a page a run opened to resolve a
//                                        missing field, written down by hand
//   `## [IMAGE READ …]` / `## [NEWSLETTER PERSISTED …]`
//                                        a flyer or email that has no URL to
//                                        re-fetch at all
//
// Before 2026-08-13, `--mark-ingested` copied the fresh snapshot over the
// baseline, so any of those blocks missing from this run's fetch was DELETED —
// silently, at ship time, after every gate had already run green. On
// 2026-08-13 that cost 20 live cards their evidence in a single command:
// `ingest:quotes` read verified=35 mismatch=0 immediately before promotion and
// verified=30 mismatch=13 immediately after, with 7 more surfacing on `--all`,
// and nothing re-fetched in between. Four sources' detail fetches had failed
// that run ("detail: 0 page(s) persisted for kettl-tea, 1 failed"), which the
// fetcher correctly declines to write into the snapshot — but promoting that
// snapshot then destroyed the copy the previous baseline still held, so a
// transient failure became a permanent loss. Recovery was manual, out of git.
//
// The rule this encodes: PROMOTION MAY ADD EVIDENCE, NEVER REMOVE IT. A block
// whose header the new snapshot does not carry is appended to the promoted
// baseline instead of dropped. Live listing content still turns over normally —
// only these explicitly-marked blocks are carried.

const BLOCK_HEADER = /^## \[/;

/**
 * Split a snapshot into its leading body and its marked blocks.
 * A block runs from a `## [` line to just before the next one (or EOF).
 */
export function splitBlocks(text) {
  const lines = String(text ?? "").split("\n");
  const blocks = [];
  let body = [];
  let current = null;
  for (const line of lines) {
    if (BLOCK_HEADER.test(line)) {
      if (current) blocks.push(current);
      current = { header: line, lines: [line] };
    } else if (current) {
      current.lines.push(line);
    } else {
      body.push(line);
    }
  }
  if (current) blocks.push(current);
  return { body: body.join("\n"), blocks };
}

/**
 * The text to promote to `<id>.ingested.txt`: this run's snapshot, plus every
 * marked block the OLD baseline had that the new snapshot does not.
 *
 * Matching is on the header line, which is the block's identity — a `[DETAIL]`
 * header is its URL, and a hand-written header carries its own date. A block
 * the new fetch DID return wins, so a refreshed detail page replaces the stale
 * copy rather than accumulating beside it.
 *
 * Returns `{ text, carried }` — `carried` is the list of headers carried
 * forward, so the caller can say out loud what it rescued instead of doing it
 * silently, which is the failure mode this whole module exists to end.
 */
export function carryForwardBlocks(newSnapshot, oldBaseline) {
  const next = String(newSnapshot ?? "");
  if (!oldBaseline) return { text: next, carried: [] };

  const present = new Set(splitBlocks(next).blocks.map((b) => b.header.trim()));
  const carried = [];
  const chunks = [];
  for (const block of splitBlocks(oldBaseline).blocks) {
    if (present.has(block.header.trim())) continue;
    carried.push(block.header.trim());
    chunks.push(block.lines.join("\n").replace(/\s+$/, ""));
  }
  if (!chunks.length) return { text: next, carried: [] };

  const text = `${next.replace(/\s+$/, "")}\n\n${chunks.join("\n\n")}\n`;
  return { text, carried };
}
