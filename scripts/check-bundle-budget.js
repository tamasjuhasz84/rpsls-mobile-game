import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const ASSETS_DIR = path.join(DIST_DIR, "assets");

const budget = {
  totalJsKb: 500,
  totalCssKb: 180,
  largestJsChunkKb: 500,
  totalAssetsKb: 2500,
};

function toKb(bytes) {
  return bytes / 1024;
}

function collectFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function sumSize(files) {
  return files.reduce((acc, file) => acc + fs.statSync(file).size, 0);
}

function formatKb(value) {
  return `${value.toFixed(2)} KB`;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(
    "[bundle-budget] dist directory not found. Run `npm run build` first."
  );
  process.exit(1);
}

if (!fs.existsSync(ASSETS_DIR)) {
  console.error(
    "[bundle-budget] dist/assets directory not found. Build output is unexpected."
  );
  process.exit(1);
}

const allAssets = collectFiles(ASSETS_DIR);
const jsFiles = allAssets.filter((file) => file.endsWith(".js"));
const cssFiles = allAssets.filter((file) => file.endsWith(".css"));

const totalJsKb = toKb(sumSize(jsFiles));
const totalCssKb = toKb(sumSize(cssFiles));
const totalAssetsKb = toKb(sumSize(allAssets));

const largestJsChunkKb = toKb(
  jsFiles.reduce((largest, file) => {
    const fileSize = fs.statSync(file).size;
    return Math.max(largest, fileSize);
  }, 0)
);

const report = [
  {
    metric: "Total JS",
    value: totalJsKb,
    budget: budget.totalJsKb,
  },
  {
    metric: "Total CSS",
    value: totalCssKb,
    budget: budget.totalCssKb,
  },
  {
    metric: "Largest JS chunk",
    value: largestJsChunkKb,
    budget: budget.largestJsChunkKb,
  },
  {
    metric: "Total assets",
    value: totalAssetsKb,
    budget: budget.totalAssetsKb,
  },
];

console.log("[bundle-budget] Build budget report");
for (const item of report) {
  console.log(
    `- ${item.metric}: ${formatKb(item.value)} / budget ${formatKb(item.budget)}`
  );
}

const failures = report.filter((item) => item.value > item.budget);
if (failures.length > 0) {
  console.error("[bundle-budget] Budget check failed:");
  for (const item of failures) {
    console.error(
      `  - ${item.metric} exceeded by ${formatKb(item.value - item.budget)}`
    );
  }
  process.exit(1);
}

console.log("[bundle-budget] Budget check passed.");
