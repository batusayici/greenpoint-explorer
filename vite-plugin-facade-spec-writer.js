// Dev-only middleware: writes an edited face spec back to its JSON file.
//
// POST /__facade-spec  { file, faceKey, faceSpec }
//   - file: bare filename under src/data/facade-specs (no path separators)
//   - faceKey: "BIN:role" key under the spec's `faces`
//   - faceSpec: the replacement face object
//
// `apply: "serve"` keeps this out of the production build entirely.

import fs from "node:fs";
import path from "node:path";

const SPEC_DIR = "src/data/facade-specs";

export default function facadeSpecWriter() {
  return {
    name: "facade-spec-writer",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__facade-spec", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("method not allowed");
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            const { file, faceKey, faceSpec } = JSON.parse(body);
            if (!file || !faceKey || !faceSpec) throw new Error("missing file, faceKey, or faceSpec");
            if (file.includes("/") || file.includes("\\") || file.includes("..")) throw new Error("invalid file name");

            const full = path.resolve(process.cwd(), SPEC_DIR, file);
            const original = fs.readFileSync(full, "utf8");
            const json = JSON.parse(original);
            if (!json.faces || !(faceKey in json.faces)) throw new Error(`face ${faceKey} not found in ${file}`);

            json.faces[faceKey] = faceSpec;
            // Preserve the file's existing trailing-newline style so a save
            // produces only the coordinate diff, nothing spurious.
            const eof = original.endsWith("\n") ? "\n" : "";
            fs.writeFileSync(full, `${JSON.stringify(json, null, 2)}${eof}`);

            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: true, file, faceKey }));
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
