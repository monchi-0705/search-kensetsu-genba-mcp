import * as esbuild from "esbuild";
import { chmod } from "node:fs/promises";

const outfile = "bin/cli.js";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile,
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: [],
});

await chmod(outfile, 0o755);
console.log(`Built ${outfile}`);
