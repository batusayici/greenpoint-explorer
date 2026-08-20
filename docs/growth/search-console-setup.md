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
permission **Full**.

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
environment. `GSC_SERVICE_ACCOUNT_JSON` accepts the key JSON **inline** as well
as a path — paste the whole file contents as the variable value.

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
