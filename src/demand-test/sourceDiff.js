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

// A field-labelled snapshot (blank-line-separated blocks of `key: value`
// lines — the BPL Solr index, feather.rsvp, Squarespace JSON dumps) must be
// diffed at RECORD granularity: a low-cardinality status flag flipping on one
// record adds no line the snapshot didn't already have somewhere, so a
// line-set diff reports nothing (2026-08-17, is_event_canceled). At record
// granularity the changed record surfaces whole, once as a removal and once
// as an addition.
const FIELD_LINE = /^[\w.-]+: /;

function splitRecords(text) {
  return text.split(/\n{2,}/).filter((b) => b.trim() !== "");
}

function isFieldLabelled(blocks) {
  if (blocks.length < 2) return false;
  const labelled = blocks.filter(
    (b) => b.split("\n").filter((l) => FIELD_LINE.test(l)).length >= 2
  );
  return labelled.length >= blocks.length * 0.8;
}

// Multiset diff over arbitrary units (lines or whole records). Duplicates
// count: a second copy of an existing unit is one addition, which is what a
// reader sees.
function multisetDiff(baseUnits, textUnits) {
  const counts = new Map();
  for (const u of baseUnits) counts.set(u, (counts.get(u) ?? 0) + 1);
  const added = [];
  for (const u of textUnits) {
    const n = counts.get(u) ?? 0;
    if (n > 0) counts.set(u, n - 1);
    else added.push(u);
  }
  let removedCount = 0;
  for (const n of counts.values()) removedCount += n;
  return { added, removedCount };
}

export function diffAgainstBaseline(baselineText, text) {
  const baseBlocks = splitRecords(baselineText);
  const textBlocks = splitRecords(text);
  const recordMode = isFieldLabelled(baseBlocks) || isFieldLabelled(textBlocks);
  const baseUnits = recordMode ? baseBlocks : baselineText.split("\n");
  const textUnits = recordMode ? textBlocks : text.split("\n");
  const { added, removedCount } = multisetDiff(baseUnits, textUnits);
  return {
    added,
    addedLines: added.length,
    removedLines: removedCount,
    recordMode,
    // Same unit set, different bytes — pure reordering. Worth naming so it is
    // never mistaken for a source going quiet.
    reorderedOnly: added.length === 0 && removedCount === 0 && baselineText !== text,
  };
}

// The hash the current fetch is compared against. Baseline file first, state
// second, null when neither exists (a genuinely new source).
export function resolveIngestedHash({ baselineText, stateIngestedHash, hash }) {
  if (baselineText != null) return hash(baselineText.replace(/\n$/, ""));
  return stateIngestedHash ?? null;
}
