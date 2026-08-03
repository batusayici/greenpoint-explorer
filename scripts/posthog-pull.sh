#!/bin/bash
# Weekly growth pull — PostHog HogQL (see docs/growth/readouts/ and the
# growth-weekly skill).
#
# Reads POSTHOG_READ_KEY + POSTHOG_PROJECT_ID from the environment, falling back
# to .env.local (gitignored). The key is scoped query:read on this project only
# and must never gain a VITE_ prefix — Vite inlines VITE_ vars into the client
# bundle.
#
# Two exclusions, both deliberate:
#   1. Test src tags (verify/test/test31/posthog-verify) — our own transport checks.
#   2. Non-production hosts — localhost:* and LAN dev servers report to the same
#      PostHog project as production. On 2026-07-28 they were 34% of all events
#      and had been silently inflating every readout (readout 2026-07-28,
#      Finding 1). What gets dropped is printed, never silently discarded.
#
# Override the production host list at the greenpoint.life cutover if the origin
# set changes:  GL_PROD_HOSTS="greenpoint.life,www.greenpoint.life" ./scripts/posthog-pull.sh
set -euo pipefail
cd "$(dirname "$0")/.."

# .env.local is the local path; in cloud the vars are already exported.
if [ -f ./.env.local ]; then set -a; . ./.env.local; set +a; fi

: "${GL_PROD_HOSTS:=greenpoint-explorer.vercel.app,greenpoint.life,www.greenpoint.life}"

API="https://us.posthog.com"
REQ=/tmp/posthog-pull-req.json

# ---- preflight: fail loudly, in the first seconds, naming the actual cause ----
preflight () {
  if [ -z "${POSTHOG_READ_KEY:-}" ] || [ -z "${POSTHOG_PROJECT_ID:-}" ]; then
    echo "SENSOR DOWN (env): POSTHOG_READ_KEY and/or POSTHOG_PROJECT_ID unset." >&2
    echo "  Local: add them to .env.local.  Cloud: add them to the routine's environment." >&2
    exit 3
  fi

  printf '{"query":{"kind":"HogQLQuery","query":"SELECT 1"}}' > "$REQ"
  local body code curl_status
  body=$(curl -sS -w '\n%{http_code}' -X POST "$API/api/projects/$POSTHOG_PROJECT_ID/query/" \
    -H "Authorization: Bearer $POSTHOG_READ_KEY" -H "Content-Type: application/json" \
    -d @"$REQ" 2>&1) && curl_status=0 || curl_status=$?

  if [ "$curl_status" -ne 0 ]; then
    echo "SENSOR DOWN (network): could not reach $API — curl exit $curl_status." >&2
    echo "  $body" >&2
    case "$body" in
      *"CONNECT tunnel failed"*|*"403"*|*"407"*)
        echo "  Looks like an egress-policy denial. Confirm with:" >&2
        echo "    curl -sS \"\$HTTPS_PROXY/__agentproxy/status\"   # check recentRelayFailures" >&2
        echo "  Fix: allowlist us.posthog.com in this environment. Never route around it." >&2 ;;
    esac
    exit 4
  fi

  code=$(printf '%s' "$body" | tail -n1)
  case "$code" in
    200) : ;;
    401|403)
      echo "SENSOR DOWN (auth): PostHog returned HTTP $code." >&2
      echo "  The key is rejected or lacks query:read on project $POSTHOG_PROJECT_ID." >&2
      exit 5 ;;
    *)
      echo "SENSOR DOWN (api): PostHog returned HTTP $code." >&2
      printf '  %s\n' "$(printf '%s' "$body" | head -c 300)" >&2
      exit 6 ;;
  esac
}

preflight

q () {
  printf '{"query":{"kind":"HogQLQuery","query":%s}}' "$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$1")" > "$REQ"
  curl -s -X POST "$API/api/projects/$POSTHOG_PROJECT_ID/query/" \
    -H "Authorization: Bearer $POSTHOG_READ_KEY" -H "Content-Type: application/json" -d @"$REQ" \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
if 'results' not in d: print('ERR', json.dumps(d)[:300]); sys.exit()
for r in d['results']: print('  '+' | '.join(str(x) for x in r))"
}

# 'a,b,c' -> "'a','b','c'"
HOSTS_SQL=$(python3 -c "import sys; print(','.join(\"'\"+h.strip()+\"'\" for h in sys.argv[1].split(',') if h.strip()))" "$GL_PROD_HOSTS")

SRC_EXCL="coalesce(JSONExtractString(properties,'src'),'(none)') not in ('verify','test','test31','posthog-verify')"
PROD_ONLY="JSONExtractString(properties,'\$host') IN ($HOSTS_SQL)"
EXCL="$SRC_EXCL AND $PROD_ONLY"

echo "Production hosts: $GL_PROD_HOSTS"
echo "Excluding test src tags and every other host. All figures below are production only."

echo; echo "=== DROPPED — non-production traffic (audit, not a metric) ==="
q "SELECT JSONExtractString(properties,'\$host') AS host, count() AS events, count(DISTINCT distinct_id) AS ids FROM events WHERE $SRC_EXCL AND NOT ($PROD_ONLY) GROUP BY host ORDER BY events DESC"

echo; echo "=== FUNNEL (production) ==="
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
q "SELECT days, count() AS people FROM (SELECT distinct_id, uniq(toDate(timestamp)) AS days FROM events WHERE $EXCL GROUP BY distinct_id) GROUP BY days ORDER BY days"

echo; echo "=== ACTIVATION PROXY (>=2 card_open AND >=1 high-intent act) ==="
q "SELECT countIf(opens>=2 AND acts>=1) AS activated, count() AS people FROM (SELECT distinct_id, countIf(event='card_open') AS opens, countIf(event IN ('action_tap','cta_tap','today_toggle')) AS acts FROM events WHERE $EXCL GROUP BY distinct_id)"

echo; echo "=== WRL PROXY (return_visit weekIndex x visitCount) ==="
q "SELECT JSONExtractString(properties,'weekIndex') AS week_index, JSONExtractString(properties,'visitCount') AS visit_count, count() AS events FROM events WHERE event='return_visit' AND $EXCL GROUP BY week_index, visit_count ORDER BY week_index, visit_count"
