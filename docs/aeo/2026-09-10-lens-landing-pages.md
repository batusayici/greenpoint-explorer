# A real page per lens — scope

**Status:** scope, not a decision. Written 2026-09-10 at Batu's request, after the Facebook
preview test that day.

## What prompted it

Rana posts to two groups that are not about kids and two that are. Every one of those links
previews on Facebook as *"What's on in Greenpoint, Brooklyn this week — Stoopwise"*, because
`index.html` is one static file: `?lens=family_kids` changes what the app renders after JavaScript
runs, and Facebook only reads the head. A post to a parents group gets a card that says nothing
about kids.

The same gap shows up somewhere more expensive. Card pages prerender real prose; the home page
prerenders only JSON-LD, so a crawler that does not run JavaScript gets no readable text about the
neighbourhood at all (`environmental-dependencies.md`, Known gaps). Meanwhile every search query
that has found the site so far was somebody looking up a name they already had — nobody arrives by
asking a general question. A page that answers "what's on for kids in Greenpoint" is the missing
shape, and it is the same page that fixes the preview.

## The direction that does not work, and why it is worth writing down

The obvious first idea is to leave the URLs alone and rewrite the preview per `?lens=` with a
Vercel edge function. **It cannot work.** Facebook resolves a link to the `og:url` in its head and
keys its preview on that object — which is exactly what the 2026-09-10 test showed, when a query
string Facebook had never seen previewed correctly on the first post because it had already
scraped the root. One `og:url` means one preview, whatever the query string says. A distinct
preview requires a distinct URL, so the URL is the thing that has to change.

## The proposal

A prerendered page per lens at a real path, built by the same code that already builds card pages.

| | |
|---|---|
| Paths | `/kids` and `/civic` |
| Links become | `https://stoopwise.com/kids?src=parents` |
| Head | own title, description, `og:url`, canonical, and `og:title`/`og:description` |
| Body | prerendered prose listing that lens's live cards, the way `/e/<slug>` pages already do |
| Structured data | `ItemList` of that lens's live events, same builder as the home page |
| Preview image | reuse `og.png` for now — a per-lens image is a separate piece of work and should not hold this up |

**Two lenses, not ten.** `family_kids` carries 48 live cards and `civic` 20, so both have something
to show. `shopping` has 6. A thin page is worse than no page — it teaches a crawler the site has
little to say. Add a third only when one of these two has earned its clicks.

**Path names are Batu's call.** `/kids` and `/civic` are short and speakable, which matters for a
link that gets read aloud and typed. `/family-kids` would match the lens id exactly and cost
nothing in code. Recommendation: `/kids` and `/civic`.

## What has to change

1. **`deepLink.js`** — read a lens from the path the way `cardIdFromPath` reads a card id. `?lens=`
   keeps working, so links already sent do not break.
2. **`aeo.js`** — an `injectLensPage` beside `injectCardPage`, and the two lens URLs added to
   `sitemapXml`.
3. **`prerender-aeo.mjs`** — write `dist/kids/index.html` and `dist/civic/index.html`.
4. **`verify-aeo.mjs`** — the sitemap parity check currently treats every non-card URL that is not
   `/`, `/terms` or `/privacy` as an error, so it has to learn the lens paths. The 25-word prose
   floor should apply to them too, and the single-canonical check already will.
5. **`channel-links.md`** — the `civic-crowdsource` and `parents` rows move from a `?lens=` query
   string to the new paths. `src` values do not change, so no analytics history is orphaned.
6. **No new row in `environmental-dependencies.md`** — this adds no browser capability. Noted so
   the absence reads as a decision rather than an oversight.

## Risks

- **A lens page can go thin as its cards expire.** The build regenerates on every ingest, so it
  heals itself, but it can still be thin on a given day. Emit the page and list it in the sitemap
  only above a floor of live cards; below the floor, skip both. Both proposed lenses clear a floor
  of 10 comfortably today.
- **Two indexable copies of the same content.** `/kids` and `/?lens=family_kids` render the same
  view. The lens page carries a canonical pointing at itself; the root keeps its own. That is
  correct rather than merely tolerable, because the root is not lens-filtered without JavaScript.
- **The links get longer to say out loud.** `stoopwise.com/kids` is shorter than what Rana posts
  today.

## Size

Roughly half a day, most of it in the verifier and the tests rather than the page builder — the
page builder is a variation on `injectCardPage`, which already does every part of this for a card.

## Sequencing

The posts do not depend on this. Rana can send the generic card today and the lens pages can land
after, at which point the rows in `channel-links.md` change and later posts carry the better link.
Nothing about doing it in that order costs anything, because `src` values stay the same either way.
