// Pure resolution of structural facade toggles → render decisions. No Three.js,
// Node-testable. Precedence: explicit per-BIN field → existing default.

export function resolveHasCornice(params) {
  if (params?.hasCornice != null) return params.hasCornice;
  return params?.components?.["cornice"] !== false;
}

// fireEscape: returns { on, variant } where variant is the geometry term
// ("relief" | "lattice"). `auto` is the heuristic result (wantsFireEscape).
export function resolveFireEscape(params, auto) {
  const fe = params?.fireEscape;
  if (fe === false) return { on: false, variant: "relief" };
  if (fe === "lattice") return { on: true, variant: "lattice" };
  if (fe != null) return { on: true, variant: "relief" }; // true | "standard"
  // fe is null/undefined — check legacy fireEscapeVariant
  const fev = params?.fireEscapeVariant;
  if (fev != null) return { on: auto, variant: fev === "lattice" ? "lattice" : "relief" };
  return { on: auto, variant: "relief" };
}

export function resolveHasStoop(params, auto) {
  if (params?.hasStoop != null) return params.hasStoop;
  return auto;
}
