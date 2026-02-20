import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const src = path.join(repoRoot, "apps", "ecs", "public", "reading-legacy");
const dst = path.join(repoRoot, "apps", "esa", "public", "reading-legacy");
const themeInitSrc = path.join(repoRoot, "apps", "ecs", "public", "theme-init.js");
const themeInitDst = path.join(repoRoot, "apps", "esa", "public", "theme-init.js");

if (!fs.existsSync(src)) {
  console.error(`[sync] source missing: ${src}`);
  process.exit(1);
}

fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });

function copyDir(from, to) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const dstPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(dstPath, { recursive: true });
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

copyDir(src, dst);
if (fs.existsSync(themeInitSrc)) {
  fs.copyFileSync(themeInitSrc, themeInitDst);
}
console.log("[sync] esa assets copied");
