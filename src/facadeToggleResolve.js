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
  if (fe == null) return { on: auto, variant: "relief" };
  if (fe === "lattice") return { on: true, variant: "lattice" };
  return { on: true, variant: "relief" }; // true | "standard"
}
