// Change classification for the ingest fetcher (2026-08-03).
//
// Two defects this fixes, both found while chasing "changed, +0 lines" runs:
//
// 1. The ingested baseline lives in git (.ingest-cache/*.ingested.txt is the
//    one tracked part of the cache); state.json does not. So a checkout or a
//    pull can hand you a NEW baseline beside a STALE state.ingestedHash. The
//    old code trusted state and only consulted the baseline when state was
//    empty, which made four sources report "changed" against a file they were
//    byte-identical to — every run, forever. The baseline file is the
//    committed truth; state is a cache, and it loses.
//
// 2. "+0 added lines" was read as noise. It is two different things: nothing
//    happened, or items DISAPPEARED (bpl-north-brooklyn-calendar dropped 12
//    events with nothing added). Counting removals separately keeps a shrunk
//    source legible instead of looking like churn — the ingest should know
//    when a calendar empties out.

// Lines present in `text` that the baseline never had. Duplicates count: two
// new identical listings are two additions, which is what a reader sees.
export function diffAgainstBaseline(baselineText, text) {
  const baseSet = new Set(baselineText.split("\n"));
  const textSet = new Set(text.split("\n"));
  const added = text.split("\n").filter((l) => !baseSet.has(l));
  const removed = baselineText.split("\n").filter((l) => !textSet.has(l));
  return {
    added,
    addedLines: added.length,
    removedLines: removed.length,
    // Same line set, different bytes — pure reordering. Worth naming so it is
    // never mistaken for a source going quiet.
    reorderedOnly: added.length === 0 && removed.length === 0 && baselineText !== text,
  };
}

// The hash the current fetch is compared against. Baseline file first, state
// second, null when neither exists (a genuinely new source).
export function resolveIngestedHash({ baselineText, stateIngestedHash, hash }) {
  if (baselineText != null) return hash(baselineText.replace(/\n$/, ""));
  return stateIngestedHash ?? null;
}
