# Canonical channel links — copy, never compose

**Why this file exists:** two consecutive measurement windows were degraded by
untagged links (Jul 15 invites went out bare → channel attribution for the
whole friends round is unrecoverable; see the friends-round readout, Finding 1).
The fix is mechanical: **every outbound link is copied from this table.** If a
channel isn't here, add the row first, then send.

Origin is the live product URL. **After the greenpoint.life cutover, regenerate
every row** (redirects preserve query params — verified for `/july.html` — but
new sends should carry the canonical origin).

| Channel | `src` | Link (copy exactly) |
|---|---|---|
| Personal re-invites (wave 2) | `wave2` | https://greenpoint-explorer.vercel.app/?src=wave2 |
| Michael follow-up | `michael` | https://greenpoint-explorer.vercel.app/?src=michael |
| Laura & Edmond follow-up | `laura-edmond` | https://greenpoint-explorer.vercel.app/?src=laura-edmond |
| Perri / Shop Small Greenpoint | `perri` | https://greenpoint-explorer.vercel.app/?src=perri |
| Reddit (r/Greenpoint etc.) | `reddit` | https://greenpoint-explorer.vercel.app/?src=reddit |
| Local Facebook/WhatsApp groups | `fbgroups` | https://greenpoint-explorer.vercel.app/?src=fbgroups |
| II-C QR window card | `qr` | https://greenpoint-explorer.vercel.app/?src=qr |
| Greenpointers (held for now) | `gpters` | https://greenpoint-explorer.vercel.app/?src=gpters |
| Transport/testing (excluded from all pulls) | `verify` | https://greenpoint-explorer.vercel.app/?src=verify |

## Pre-send checklist (every outbound message, no exceptions)

1. Link copied from the table above — never hand-typed, never bare.
2. New channel → add the row here **first** (kebab-case `src`, committed).
3. Within a day of sending, spot-check the `src` shows up:
   `./scripts/posthog-pull.sh` → Channels table.

## Rules

- `src` values are lowercase kebab-case, stable forever (they're the analytics
  join key — renaming one orphans its history).
- One `src` per channel, not per message. Wave-level granularity (`wave2`) only
  for personal batches where the channel *is* the wave.
- `verify` (and legacy `test`/`test31`/`posthog-verify`) are reserved for
  testing and excluded by `scripts/posthog-pull.sh`.
- Caveat known from the friends round: messaging apps strip referrers, so
  `src` is the **only** attribution signal we get. An untagged link is an
  unattributable link, permanently.
