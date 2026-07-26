#!/bin/bash
# Checkpoint data pull — PostHog HogQL (see docs/launch/2026-07-29-checkpoint-readout.md).
# Reads POSTHOG_READ_KEY + POSTHOG_PROJECT_ID from .env.local (gitignored). The
# key is scoped query:read on this project only and must never gain a VITE_
# prefix — Vite inlines VITE_ vars into the client bundle.
# Excludes src='verify' (the 2026-07-26 transport check) so counts are testers.
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env.local; set +a

q () {
  printf '{"query":{"kind":"HogQLQuery","query":%s}}' "$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$1")" > /tmp/qq.json
  curl -s -X POST "https://us.posthog.com/api/projects/$POSTHOG_PROJECT_ID/query/" \
    -H "Authorization: Bearer $POSTHOG_READ_KEY" -H "Content-Type: application/json" -d @/tmp/qq.json \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
if 'results' not in d: print('ERR', json.dumps(d)[:300]); sys.exit()
for r in d['results']: print('  '+' | '.join(str(x) for x in r))"
}

EXCL="coalesce(JSONExtractString(properties,'src'),'(none)') != 'verify'"

echo "=== FUNNEL (all real traffic) ==="
q "SELECT event, count() AS taps, count(DISTINCT distinct_id) AS people FROM events WHERE $EXCL GROUP BY event ORDER BY taps DESC"

echo; echo "=== CHANNELS (?src=) ==="
q "SELECT coalesce(JSONExtractString(properties,'src'),'(none)') AS src, count(DISTINCT distinct_id) AS people, countIf(event='\$pageview') AS views, countIf(event='card_open') AS card_opens, countIf(event='action_tap') AS actions, countIf(event='cta_tap') AS ctas FROM events WHERE $EXCL GROUP BY src ORDER BY people DESC"

echo; echo "=== FILTER TAPS (lens pull) ==="
q "SELECT coalesce(JSONExtractString(properties,'filter'),JSONExtractString(properties,'filterId'),'?') AS lens, count() AS taps, count(DISTINCT distinct_id) AS people FROM events WHERE event='filter_tap' AND $EXCL GROUP BY lens ORDER BY taps DESC"

echo; echo "=== TOP CARDS OPENED ==="
q "SELECT JSONExtractString(properties,'cardId') AS card, count() AS opens FROM events WHERE event='card_open' AND $EXCL GROUP BY card ORDER BY opens DESC LIMIT 12"

echo; echo "=== RETENTION (distinct people per day) ==="
q "SELECT toDate(timestamp) AS day, count(DISTINCT distinct_id) AS people, count() AS events FROM events WHERE $EXCL GROUP BY day ORDER BY day"

echo; echo "=== REPEAT VISITORS (people with events on >1 day) ==="
q "SELECT days, count() AS people FROM (SELECT distinct_id, count(DISTINCT toDate(timestamp)) AS days FROM events WHERE $EXCL GROUP BY distinct_id) GROUP BY days ORDER BY days"
