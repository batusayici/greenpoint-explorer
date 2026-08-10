// Classify a failed `fetch` in a CONNECT-proxied environment (2026-08-10).
//
// Why this is its own module and not three lines inside `fetch-sources.mjs`:
// the ingest has now been bitten TWICE by diagnostic logic that was never
// tested. The browser preflight's tie-breaker compared an unproxied plain fetch
// against a proxied Chromium and blamed the proxy relay (DECISION_LOG
// 2026-08-05, corrected 2026-08-10). Then the first version of this classifier
// decided "not obviously transient, therefore an egress-policy denial", which
// reported `greenpointtrashclub.org` as denied when it had merely timed out,
// and — verified against a dead proxy — reported the TARGET host as denied when
// it was the PROXY that was unreachable. A run that demands an allowlist for a
// host nobody blocked sends Batu to claude.ai/code with a fabricated list.
//
// So the rule here is: **claim a denial only from evidence that says denial.**
// Match positively on the tunnel-refusal signature; everything else is named
// for what it actually is, or left unclassified. `scripts/` is outside the test
// glob, so the logic lives here with a sibling test instead.
//
// The signature is undici's, confirmed empirically against a proxy that answers
// 403 to every CONNECT:
//
//   [0] TypeError: fetch failed
//   [1] Error: Request was cancelled.                        <- generic, useless
//   [2] AbortError: Proxy response (403) !== 200 when HTTP Tunneling
//
// Level 1 is identical for any cancellation, which is exactly why reading only
// `e.cause.message` cannot tell a denial from a dead proxy. Note also that
// "CONNECT tunnel failed, response 403" is *libcurl's* wording and Node's fetch
// can never emit it — if it shows up it came from a curl probe, not the script.
// It is matched anyway so a caller can classify an error captured from one.

// undici's refusal, plus curl's for errors captured out of band.
const TUNNEL_REFUSED_RE = /Proxy response \((\d{3})\) !== 200 when HTTP Tunneling|CONNECT tunnel failed, response (\d{3})/i;
// Slow, cancelled, or unresolvable is not a policy decision. A denial arrives
// immediately and deterministically; these do not, and they need different
// fixes (retry, widen the timeout, check DNS) than an allowlist entry.
const TRANSIENT_RE = /timeout|timed out|aborted|abortError|ETIMEDOUT|ENOTFOUND|EAI_AGAIN/i;
// The proxy process itself being unreachable. Distinct from a host denial and
// the distinction is the whole point: this one fix is "the proxy is down or
// misconfigured", never "allowlist the target".
const UNREACHABLE_RE = /ECONNREFUSED|EHOSTUNREACH|ENETUNREACH|ECONNRESET|socket hang up/i;

// Flatten the cause chain — the discriminating frame is two or three deep, and
// reading one level is what made the first version wrong.
export function causeChain(error, max = 8) {
  const parts = [];
  for (let e = error, n = 0; e != null && n < max; e = e.cause, n += 1) {
    parts.push(String(e?.message ?? e));
  }
  return parts.join(" | ");
}

const hostOf = (u) => {
  try {
    return new URL(u).host;
  } catch {
    return null;
  }
};

/**
 * @returns {{kind: string, host: string|null, status: number|null, chain: string, message: string}}
 *   kind is one of:
 *     "policy-denied"     — the proxy refused the tunnel to this host. THE ONLY
 *                           kind that belongs on an allowlist ask.
 *     "proxy-auth"        — 407: the proxy wants credentials. Global, not per-host.
 *     "proxy-unreachable" — the proxy itself could not be contacted.
 *     "transient"         — timeout / abort / DNS.
 *     "unproxied"         — no proxy in the path, so no denial is possible.
 *     "unknown"           — genuinely unclassified. Say so rather than guess.
 */
export function classifyFetchFailure({ url, error, proxy }) {
  const chain = causeChain(error);
  const host = hostOf(url);
  const base = { host, status: null, chain };

  if (!proxy) {
    return { ...base, kind: "unproxied", message: `could not fetch ${host}: ${chain}` };
  }

  const refused = TUNNEL_REFUSED_RE.exec(chain);
  if (refused) {
    const status = Number(refused[1] ?? refused[2]);
    if (status === 407) {
      return {
        ...base,
        kind: "proxy-auth",
        status,
        message:
          `the proxy demanded authentication (407) for ${host} — this is a proxy credential ` +
          "problem, not a host allowlist problem",
      };
    }
    return {
      ...base,
      kind: "policy-denied",
      status,
      message:
        `the proxy refused the tunnel to ${host} (answered ${status} to CONNECT), so no HTTP ` +
        "response ever existed — an egress-policy denial. Allowlist the host for this environment",
    };
  }

  // Order matters: a dead proxy also fails "immediately and deterministically",
  // so it must be excluded BEFORE any not-transient-therefore-denied reasoning.
  const proxyHost = hostOf(proxy);
  const proxyNamed = proxyHost != null && chain.includes(proxyHost.split(":")[0]);
  if (UNREACHABLE_RE.test(chain) && (proxyNamed || !TRANSIENT_RE.test(chain))) {
    return {
      ...base,
      kind: "proxy-unreachable",
      message:
        `could not reach the proxy at ${proxy} while fetching ${host} — the proxy is down or ` +
        `misconfigured. This is NOT a denial of ${host}; do not allowlist it on this evidence`,
    };
  }

  if (TRANSIENT_RE.test(chain)) {
    return { ...base, kind: "transient", message: `could not reach ${host} through the proxy: ${chain}` };
  }

  // No positive evidence of a denial. Previous versions guessed "denial" here
  // and that guess is the whole reason this module exists.
  return {
    ...base,
    kind: "unknown",
    message: `could not fetch ${host} through the proxy, cause unclassified: ${chain}`,
  };
}

// The only kind that may be added to the allowlist ask.
export const isPolicyDenial = (c) => c.kind === "policy-denied";

// ---------------------------------------------------------------------------
// Startup guard, shared by every script that fetches (2026-08-10).
//
// Node's global fetch ignores HTTPS_PROXY unless the process was STARTED with
// NODE_USE_ENV_PROXY=1, so in a proxied sandbox an unguarded script egresses
// direct — and direct egress there is INTERCEPTED, not merely unproxied, so it
// returns mangled bodies rather than honest failures. That silent bypass cost
// three weeks. `fetch-sources.mjs` grew a guard first; `geocode-demand-cards.mjs`
// had the same defect and no guard, which is why this is shared rather than
// copied: the next script to fetch should not have to rediscover it.
//
// Returns the message to print, or null when the environment is sound.
export function proxyAwarenessError({ proxy, envProxyFlag, nodeVersion }) {
  if (!proxy) return null; // no proxy in the path, nothing to bypass

  const [major, minor] = String(nodeVersion).split(".").map(Number);
  // NODE_USE_ENV_PROXY landed in 22.21 and 24.0. Older runtimes ACCEPT the flag
  // and silently ignore it, which is the same bug wearing a hat — so a set flag
  // on an old runtime has to fail too, not pass.
  const supported = major >= 24 || (major === 22 && minor >= 21);

  if (envProxyFlag !== "1") {
    return (
      "\n=== REFUSING TO RUN — plain fetch would bypass the proxy ===\n" +
      `  HTTPS_PROXY is set (${proxy}) but NODE_USE_ENV_PROXY is not "1", so every\n` +
      "  fetch would egress direct and be intercepted — mangled bodies, not honest errors.\n" +
      "  Fix: invoke through `npm run` (the ingest scripts set the flag), or export\n" +
      "  NODE_USE_ENV_PROXY=1 before invoking node directly."
    );
  }
  if (!supported) {
    return (
      "\n=== REFUSING TO RUN — NODE_USE_ENV_PROXY is inert on this Node ===\n" +
      `  Node ${nodeVersion} predates the flag (needs 22.21+ or 24+), so it is accepted\n` +
      "  and silently does nothing — the same bypass wearing a hat.\n" +
      "  Fix: upgrade the runtime, or install undici and set a ProxyAgent dispatcher."
    );
  }
  return null;
}

// Convenience for scripts: read the ambient environment and exit(1) on a bad one.
export function assertProxyAware(env = process.env, nodeVersion = process.versions.node) {
  const msg = proxyAwarenessError({
    proxy: env.HTTPS_PROXY || env.https_proxy || null,
    envProxyFlag: env.NODE_USE_ENV_PROXY,
    nodeVersion,
  });
  if (msg) {
    console.error(msg);
    process.exit(1);
  }
}
