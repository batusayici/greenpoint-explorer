# Search Console pull — one-time setup

`npm run growth:gsc` reads Google Search Console through the API so the Tuesday
readout carries real search numbers instead of "⚠ pending". It needs a Google
service account that you create once. Everything below is on Batu's Google
account — the script can't do any of it, and no part of it should be handed to
an agent, because step 2 produces a live private key.

**Time: about ten minutes.**

## 1. Create the service account

1. <https://console.cloud.google.com/> → pick or create a project (name it
   anything; `stoopwise` is fine).
2. APIs & Services → Library → search **Google Search Console API** → Enable.
3. APIs & Services → Credentials → Create credentials → **Service account**.
   Name it `gsc-read`. No roles needed — this account gets its permission from
   Search Console, not from Cloud IAM.

## 2. Make a key

On the new service account → Keys → Add key → Create new key → **JSON**. The
file downloads once and cannot be re-downloaded.

Move it out of Downloads and next to the repo, e.g.
`~/.config/stoopwise/gsc-service-account.json`. Do **not** put it in the repo
directory — `*service-account*.json` is gitignored, but a key that never enters
the working tree can't be committed by accident.

## 3. Grant it on the property — the step everyone skips

Enabling the API is not access. Open
<https://search.google.com/search-console> → Settings → **Users and permissions**
→ Add user → paste the service account's `client_email` (it looks like
`gsc-read@stoopwise.iam.gserviceaccount.com`, and it's in the key file) →
permission **Restricted** — verified sufficient 2026-09-07.

Do not grant Full. The script asks only for the `webmasters.readonly` scope and
makes one read call, so Full buys nothing and costs a lot: it would let anyone
holding the key use the Removals tool to pull the site out of Google's index
for ~6 months, which is the single worst thing that could happen to a project
betting on search and answer-engine visibility. The key is pasted into a cloud
routine environment that warns it is readable by anyone using it, so assume the
key is only as safe as the permission behind it. Give the service account no
GCP IAM roles either (step 1) — it then has no access to anything in the Cloud
project. If the key is ever exposed, delete it in GCP → service account → Keys;
revocation is instant and a replacement takes a minute.

Without this, the script fails with `SENSOR DOWN (auth): … HTTP 403` and tells
you to come back here.

## 4. Point the script at it

Add to `.env.local` (gitignored):

```
GSC_SITE_URL=sc-domain:stoopwise.com
GSC_SERVICE_ACCOUNT_JSON=/Users/batusayici/.config/stoopwise/gsc-service-account.json
```

`GSC_SITE_URL` must match the property type exactly: a domain property is
`sc-domain:stoopwise.com`; a URL-prefix property is `https://stoopwise.com/`
**with** the trailing slash. If you're not sure which one you verified, the
Search Console property switcher shows it.

Then:

```bash
npm run growth:gsc
```

Always through `npm run` — the script refuses to start otherwise, because Node's
fetch ignores `HTTPS_PROXY` unless the process starts with `NODE_USE_ENV_PROXY=1`
and an unproxied run in the cloud sandbox returns mangled bodies rather than
honest failures (DECISION_LOG 2026-08-10).

## 5. Cloud routine (do this when the readout runs unattended)

The weekly readout routine at claude.ai/code needs the same two values in its
environment. A path is useless there — the cloud routine has no filesystem with
your key on it — so `GSC_SERVICE_ACCOUNT_JSON` takes the key JSON **inline**.

**It must be minified to a single line first.** The downloaded key file is
pretty-printed across ~28 lines, and the environment editor parses a paste as
`.env` lines, so a multi-line paste fails on line 2 with
`Couldn't parse ""type": "service_account",". Use KEY=value format.` Put the
one-line form on the clipboard with:

```bash
node -e 'process.stdout.write(JSON.stringify(require(process.env.HOME+"/.config/stoopwise/gsc-service-account.json")))' | pbcopy
```

Then paste that as the value. The script accepts it because it treats a value
starting with `{` as the key itself and anything else as a path.

The routine's environment also has to allow egress to `oauth2.googleapis.com`
and `searchconsole.googleapis.com`. If it doesn't, the script says so by name;
allowlist them, never route around the proxy.

## Why a service account and not OAuth

An OAuth flow needs a browser and a human click every time the refresh token
lapses, which is exactly the failure that left search unmeasured for the first
month. A service account has no interactive step, so a scheduled run can't be
blocked on Batu being awake.

## Related

- `scripts/gsc-pull.mjs` — the pull itself
- `docs/aeo/citation-check.md` — the other half of Loop C, deliberately manual
- `docs/learning-log.md` L2026-08-17 — the hand-read baseline this replaces
