// Dev-only middleware: merges a per-BIN facade override back into its JSON file.
//
// POST /__facade-override  { bin, override }
//   - bin: the building BIN key under the file's `overrides` object
//   - override: object of fields to merge (family, tint, windowTint, doorTint, ...)
//
// `apply: "serve"` keeps this out of the production build entirely.

import fs from "node:fs";
import path from "node:path";

const OVERRIDE_FILE = "src/data/facade-overrides/greenpoint-corridor.v0.1.json";

export default function facadeOverrideWriter() {
  return {
    name: "facade-override-writer",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__facade-override", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("method not allowed");
          return;
        }
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          try {
            const { bin, override } = JSON.parse(body);
            if (!bin || typeof bin !== "string") throw new Error("missing or invalid bin");
            if (bin.includes("/") || bin.includes("\\") || bin.includes("..")) throw new Error("invalid bin");
            if (!override || typeof override !== "object") throw new Error("missing override object");

            const full = path.resolve(process.cwd(), OVERRIDE_FILE);
            const original = fs.readFileSync(full, "utf8");
            const json = JSON.parse(original);
            if (!json.overrides || typeof json.overrides !== "object") json.overrides = {};

            json.overrides[bin] = { ...(json.overrides[bin] ?? {}), ...override };

            const eof = original.endsWith("\n") ? "\n" : "";
            fs.writeFileSync(full, `${JSON.stringify(json, null, 2)}${eof}`);

            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: true, bin }));
          } catch (error) {
            res.statusCode = 400;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: false, error: String(error.message || error) }));
          }
        });
      });
    },
  };
}
