// One .env.local reader and one failure vocabulary for every growth source.
//
// Three different .env.local parsers existed before this: posthog-pull.sh used
// a bash `source` (which also executes shell), tally-pull.mjs used a regex with
// no `export ` support, gsc-pull.mjs used one with it. They disagreed about
// which lines counted.
//
// The exit codes are posthog-pull.sh's, which gsc-pull.mjs deliberately
// mirrored. The growth-weekly skill's failure language is written against them,
// so they are a contract, not an implementation detail. tally-pull.mjs was the
// outlier at a bare 1; the client here brings it into line.

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export const EXIT = { ENV: 3, NETWORK: 4, AUTH: 5, API: 6 };

// The status a source reports into the snapshot. "partial" is the one that
// matters: PostHog can fail a single query and still exit 0, so a run that lost
// one section must not present itself as complete.
export const STATUS = {
  OK: "ok",
  ENV: "env",
  NETWORK: "network",
  AUTH: "auth",
  API: "api",
  PARTIAL: "partial",
};

export class SourceError extends Error {
  constructor(status, message, { exitCode } = {}) {
    super(message);
    this.name = "SourceError";
    this.status = status;
    this.exitCode = exitCode ?? EXIT[status.toUpperCase()] ?? EXIT.API;
  }
}

// Env wins over the file. In the cloud the vars are already exported and there
// is no .env.local at all, which is not an error.
export function loadEnvLocal(root = ROOT) {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (process.env[key] !== undefined) continue;
    let value = rawValue.trim();
    const q = value[0];
    if ((q === '"' || q === "'") && value.endsWith(q)) value = value.slice(1, -1);
    process.env[key] = value;
  }
}

export function requireEnv(names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    throw new SourceError(
      STATUS.ENV,
      `${missing.join(" and ")} unset. Local: add to .env.local. Cloud: add to the routine's environment.`,
    );
  }
  return Object.fromEntries(names.map((n) => [n, process.env[n]]));
}

// Every source turns a fetch into the same four failures, so the caller never
// has to know which API it was talking to.
export async function request(url, init, { what }) {
  let res;
  try {
    res = await fetch(url, init);
  } catch (error) {
    const hint = /CONNECT tunnel|403|407/.test(String(error?.cause ?? error))
      ? " Looks like an egress-policy denial — allowlist the host in this environment. Never route around it."
      : "";
    throw new SourceError(STATUS.NETWORK, `${what}: could not reach ${new URL(url).host}.${hint}`, {
      exitCode: EXIT.NETWORK,
    });
  }
  if (res.status === 401 || res.status === 403) {
    throw new SourceError(STATUS.AUTH, `${what}: HTTP ${res.status} — the key is rejected or lacks access.`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new SourceError(STATUS.API, `${what}: HTTP ${res.status} ${body.slice(0, 200)}`);
  }
  return res;
}
