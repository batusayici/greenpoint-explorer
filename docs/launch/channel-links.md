# Canonical channel links — copy, never compose

**Why this file exists:** two consecutive measurement windows were degraded by
untagged links (Jul 15 invites went out bare → channel attribution for the
whole friends round is unrecoverable; see the friends-round readout, Finding 1).
The fix is mechanical: **every outbound link is copied from this table.** If a
channel isn't here, add the row first, then send.

Origin is the live product URL. **Rows regenerated on `stoopwise.com` at the
2026-08-06 Stoopwise rename** (previously `greenpoint.life` at the 2026-08-02
cutover, and `greenpoint-explorer.vercel.app` before that). Links already sent
on either older host keep working — both stay served and redirect here, and
redirects preserve query params (verified for `/july.html`) — but every new send
carries the canonical origin. Analytics consequence: prod traffic now arrives
under **three** `$host` values, so a `$host`-filtered pull must count all of them
or it will under-report every pre-rename channel. `GL_PROD_HOSTS` in
`scripts/posthog-pull.sh` already lists all five hostnames.

| Channel | `src` | Link (copy exactly) | Note |
|---|---|---|---|
| Weekly digest (R1 control arm) | `digest` | https://stoopwise.com/?src=digest | **new 2026-07-28** · ⚠ **the trailing backtick has now cost two sends** — 7 of 15 arrivals on 2026-08-25 (47%) and 4 of 13 on 2026-09-01 (31%), all landing on an orphan ``digest` `` tag that matches no row here. The 8/25 link was copied out of a readout draft that wrapped it in code formatting; the 9/1 send repeated it because it was composed from the 8/25 email, which still carried the bad URL. **Copy the cell above and nothing around it, and compose each weekly note as a NEW message — never a reply or forward of the previous one**, or the broken link travels with it. |
| Follow — Family & Kids (R1 treatment) | `follow-family-kids` | https://stoopwise.com/?src=follow-family-kids | **new 2026-08-03** |
| Follow — Food & Drink (R1 treatment) | `follow-food-drink` | https://stoopwise.com/?src=follow-food-drink | **new 2026-08-03** |
| Follow — Arts & Culture (R1 treatment) | `follow-arts-culture` | https://stoopwise.com/?src=follow-arts-culture | **new 2026-08-03** |
| Follow — News (R1 treatment) | `follow-news` | https://stoopwise.com/?src=follow-news | **new 2026-08-03** |
| Follow — a place (R1 treatment) | `follow-place` | https://stoopwise.com/?src=follow-place | **new 2026-08-03** · one row for all place-follows — a per-place `src` would fragment the join key |
| **Parents-group posts (Q2) — Rana, every group** | `parents` | **https://stoopwise.com/kids?src=parents** | **new 2026-07-28 · superseded 2026-08-19 · REVIVED 2026-09-08 · link changed 2026-09-11, and this is the one to send.** Batu ruled on Sep 8 that the moms groups are tracked as one source, not one per group, so the reason the row was retired is gone and it has never been sent (0 events all-time), so its history is clean. Rana writes her own words; the only fixed part is this link. `/kids` is a real page, not a filtered home page (2026-09-11): it lands readers on the Family & Kids view, and it is the reason her posts preview as *"Kids' events in Greenpoint, Brooklyn this week"* instead of the generic site headline. The old `?src=parents&lens=family_kids` still works and still lands on the same view, so anything already sent is fine — it just previews generically. Verified in the Facebook in-app browser: the chip comes up active, and the signup ask carries both the lens and this channel. **Groups covered, from Rana 2026-09-10: North Brooklyn Education, Brooklyn Baby Hui, and the rest of her parents groups.** Her other two — North Brooklyn Civic Crowdsource and Greenpoint Sharing — are not about kids and have their own rows below. |
| Q2 parents — one row per group | `parents-<group-slug>` | *(retired — do not compose)* | **scheme set 2026-08-25, RETIRED 2026-09-08.** Batu's call: the moms groups are one source. No `parents-<slug>` row was ever created and none should be — send `parents` above. The scheme is recorded here so a link found in an old draft can be recognised as one that was never issued. |
| Q2 parents — Brooklyn Baby Hui | `parents-hui` | *(superseded — do not send)* | **new 2026-08-19, superseded 2026-09-08** by the one-source ruling. Never sent (0 events all-time). Brooklyn Baby Hui is still a group worth Rana's post; it just carries the `parents` link like the rest. |
| **Q2 groups — North Brooklyn Civic Crowdsource (Rana)** | `civic-crowdsource` | **https://stoopwise.com/civic?src=civic-crowdsource** | **new 2026-09-10 · link changed 2026-09-11.** Rana names this group and Greenpoint Sharing as her two that are not about kids, so the `parents` link is wrong for both — it lands readers on the Family & Kids view. This one gets its own row and the `civic` lens: the group is about the neighborhood's civic questions, which is the layer that answers them. `/civic` is a real page as of 2026-09-11, so it previews as *"Community meetings and volunteering in Greenpoint, Brooklyn"* rather than the generic site headline. |
| **Q2 groups — Greenpoint Sharing (Rana)** | `gp-sharing` | **https://stoopwise.com/?src=gp-sharing** | **new 2026-09-10.** No lens — a sharing group has no one layer, so the general feed is the offer. **Check the group's posting rules before Rana sends:** several Greenpoint sharing and Buy Nothing groups ban outside links outright (Buy Nothing rule 8 is already noted on the `fbgroups` row), and neither Rana nor this table has confirmed this one's. If links are barred, this is an answer-post channel like `fbgroups`, not a link drop. No lens page for the same reason there is no lens: this one previews as the general site headline, which is correct for it. |
| Q1 org seeding — Greenpoint Library | `org-gp-library` | https://stoopwise.com/?src=org-gp-library | **new 2026-07-28** |
| Q1 org seeding — Film Noir Cinema | `org-film-noir` | https://stoopwise.com/?src=org-film-noir | **new 2026-07-28** |
| Q1 org seeding — Brooklyn Craft Company | `org-brooklyn-craft` | https://stoopwise.com/?src=org-brooklyn-craft | **new 2026-07-28** |
| Q1 org seeding — Town Square BK | `org-town-square` | https://stoopwise.com/?src=org-town-square | **new 2026-08-15** — swapped in for Film Noir (seeding roster, ratified); Film Noir's row stays for its Tier-2 send |
| Friends & family WhatsApp re-invite | `friends-family` | https://stoopwise.com/?src=friends-family | **new 2026-08-13** · sneak-peek group, excluding the 3 named below (they keep their own rows) |
| Personal re-invites (wave 2) | `wave2` | https://stoopwise.com/?src=wave2 | |
| Michael follow-up | `michael` | https://stoopwise.com/?src=michael | |
| Laura & Edmond follow-up | `laura-edmond` | https://stoopwise.com/?src=laura-edmond | |
| Perri / Shop Small Greenpoint | `perri` | https://stoopwise.com/?src=perri | |
| Action City Comics (Eric, in-person visit follow-up) | `action-city-comics` | https://stoopwise.com/?src=action-city-comics | **new 2026-08-17** — sent, retroactively added here after the fact |
| Reddit (r/Greenpoint etc.) | `reddit` | https://stoopwise.com/?src=reddit | |
| Local Facebook/WhatsApp groups | `fbgroups` | https://stoopwise.com/?src=fbgroups | **answer posts, not link drops** (D3, 2026-08-17) — reply to real "anything this weekend?" threads with 3 specific picks + this link as the citation. Entry points: Greenpoint & Williamsburg Community Group (16K, rule: *"free community events are always allowed"*) and Greenpoint Neighbors! NYC (7K, public, no posted rules). Never post in Greenpoint, Brooklyn, NY 11222 (no-links rule) or Buy Nothing (rule 8) |
| Nextdoor | `nextdoor` | https://stoopwise.com/?src=nextdoor | **new 2026-08-17 (D3)** — 6 Greenpoint sub-neighborhoods; reach unpublished |
| Instagram carousel (P9 medium test) | `ig` | https://stoopwise.com/?src=ig | **new 2026-08-17 (D3)** — trigger moved off "Oct 6 on failure" to now; the medium question is tested while its answer can still shape September |
| Q1 org seeding — WORD Bookstore (arts wave) | `org-word` | https://stoopwise.com/?src=org-word | **new 2026-08-17 (D3)** — arts wave, after Film Noir |
| Q1 org seeding — Flower Cat (arts wave) | `org-flower-cat` | https://stoopwise.com/?src=org-flower-cat | **new 2026-08-17 (D3)** — arts wave, after Film Noir |
| Market hand-outs (McCarren Sat / McGolrick Sun) | `market` | https://stoopwise.com/?src=market | **new 2026-08-17 (D4)** — printed `/week` sheet handed person-to-person. Hand-to-hand is legal; poles and parks postings are not (§10-119, 56 RCNY §1-05(c)) |
| The Greenline (St. Nicks Alliance print) | `greenline` | https://stoopwise.com/?src=greenline | **new 2026-08-17 (D4)** — 5,000 free print copies, the only confirmed print distribution in the neighborhood |
| II-C QR window card | `qr` | https://stoopwise.com/?src=qr | |
| Greenpointers (held for now) | `gpters` | https://stoopwise.com/?src=gpters | |
| Transport/testing (excluded from all pulls) | `verify` | https://stoopwise.com/?src=verify | |
| Card share button | `share` | *(generated by the product)* | **product-generated — never send by hand.** `cardActions.js` retags the `/e/` deep link `?src=share`, so a recipient's visit is attributable. Documented 2026-07-28 after 2 real visitors arrived on it. |

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
