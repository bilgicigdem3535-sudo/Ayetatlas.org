import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
const root = "dist/client/assets";
const files = [];
const walk = (dir) => readdirSync(dir).forEach((name) => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) walk(path);
  else files.push(path);
});
walk(root);
const sizes = files.map((path) => ({ bytes: statSync(path).size, ext: extname(path) }));
const js = sizes.filter((item) => item.ext === ".js");
const css = sizes.filter((item) => item.ext === ".css");
const limits = [["largest JavaScript chunk", Math.max(0, ...js.map((item) => item.bytes)), 260_000], ["all JavaScript", js.reduce((sum, item) => sum + item.bytes, 0), 900_000], ["all CSS", css.reduce((sum, item) => sum + item.bytes, 0), 180_000]];
let failed = false;
for (const [label, actual, limit] of limits) { const ok = actual <= limit; console.log(`${ok ? "PASS" : "FAIL"} ${label}: ${(actual / 1024).toFixed(1)} KiB / ${(limit / 1024).toFixed(1)} KiB`); failed ||= !ok; }
if (failed) process.exitCode = 1;
