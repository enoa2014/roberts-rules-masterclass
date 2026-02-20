import fs from "node:fs";
import path from "node:path";

const required = [
  "apps/ecs/package.json",
  "apps/esa/package.json",
  "packages/ui/package.json",
  "packages/content/package.json",
  "tsconfig.base.json",
];

const missing = required.filter((p) => !fs.existsSync(path.join(process.cwd(), p)));
if (missing.length > 0) {
  console.error("Missing workspace files:\n" + missing.join("\n"));
  process.exit(1);
}
console.log("Workspace scaffolding OK");
