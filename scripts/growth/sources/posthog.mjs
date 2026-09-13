// PostHog, via HogQL.
//
// The one thing this does that posthog-pull.sh does not: check every query's
// result, not just the preflight. That script status-checks once in preflight
// and then pipes each query straight into python, printing `ERR …` and carrying
// on — so a 500 on one section gives exit 0 with that section silently absent.
// A wrapper that trusted the exit code would write a snapshot marked complete
// with a metric quietly missing, which is the stale-cockpit failure with more
// machinery behind it.

import { requireEnv, request, SourceError, STATUS } from "../env.mjs";
import { ROW_LIMIT } from "../../../src/growth/metricDefs.js";

const API = "https://us.posthog.com";

export async function pullPostHog(queries, { upperBound }) {
  const { POSTHOG_READ_KEY, POSTHOG_PROJECT_ID } = requireEnv([
    "POSTHOG_READ_KEY",
    "POSTHOG_PROJECT_ID",
  ]);

  const run = async (sql, what) => {
    const res = await request(`${API}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POSTHOG_READ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query: sql } }),
    }, { what: `PostHog ${what}` });

    const body = await res.json();
    // A 200 carrying a validation_error is the silent failure. Treat it as one.
    if (!body?.results) {
      throw new SourceError(
        STATUS.API,
        `PostHog ${what}: ${body?.detail ?? JSON.stringify(body).slice(0, 200)}`,
      );
    }
    // A full page is indistinguishable from a complete answer: PostHog says
    // nothing when it truncates. Refuse it rather than compute a rate over a
    // slice — unlimited, the session roll-up returned 95 of 1,418 rows.
    if (body.results.length >= ROW_LIMIT) {
      throw new SourceError(
        STATUS.API,
        `PostHog ${what}: hit the ${ROW_LIMIT}-row limit, so the result is truncated. Raise ROW_LIMIT or window the query.`,
      );
    }
    const columns = body.columns ?? [];
    return body.results.map((row) => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
  };

  // Preflight first, so a missing key or a blocked host fails in the first
  // second naming the actual cause rather than partway through.
  await run("SELECT 1", "preflight");

  const rows = {};
  const failures = [];
  for (const [name, sql] of Object.entries(queries)) {
    try {
      rows[name] = await run(sql, name);
    } catch (error) {
      if (error.status === STATUS.ENV || error.status === STATUS.AUTH) throw error;
      failures.push({ query: name, message: error.message });
    }
  }

  return {
    rows,
    status: failures.length ? STATUS.PARTIAL : STATUS.OK,
    failures,
    upperBound,
  };
}

// Raw rows arrive with PostHog's own field names and nulls. Normalise here so
// the pure functions in src/growth/compute.js see one shape and the fixtures in
// their tests are the shape that actually flows through.
export function toSessions(rows = []) {
  return rows.map((r) => ({
    personId: r.personId,
    sessionId: r.sessionId ?? "",
    startedAt: new Date(r.startedAt).toISOString(),
    src: r.src || null,
    // PostHog writes "$direct" rather than an empty string for typed-in visits.
    referrer: r.referrer && r.referrer !== "$direct" ? r.referrer : null,
    region: r.region || null,
    city: r.city || null,
    browser: r.browser || null,
    device: r.device || null,
    pageviews: Number(r.pageviews ?? 0),
    cardOpens: Number(r.cardOpens ?? 0),
    actionTaps: Number(r.actionTaps ?? 0),
    ctaTaps: Number(r.ctaTaps ?? 0),
    todayToggles: Number(r.todayToggles ?? 0),
    filterTaps: Number(r.filterTaps ?? 0),
    pinTaps: Number(r.pinTaps ?? 0),
    exceptions: Number(r.exceptions ?? 0),
  }));
}
