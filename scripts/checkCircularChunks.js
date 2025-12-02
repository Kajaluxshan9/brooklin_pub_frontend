// Detect circular imports between ESM chunks in dist/assets
// Usage: node scripts/checkCircularChunks.js
// Exits with code 0 if no cycles were found, non-zero if cycles exist.

const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "dist", "assets");
if (!fs.existsSync(assetsDir)) {
  console.error("No dist/assets directory found; run `npm run build` first.");
  process.exit(2);
}

const reImport = /import\s+[^;]+\s+from\s+['"]\.\/(.+?\.js)['"]/g;

function buildGraph() {
  const graph = new Map();
  const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
  const filenames = new Set(files);

  for (const file of files) {
    const full = path.join(assetsDir, file);
    const content = fs.readFileSync(full, "utf8");
    const deps = new Set();
    let match;
    while ((match = reImport.exec(content)) !== null) {
      // match[1] is './xxx.js' relative name; some imports can be other chunks.
      // Normalize to filename only
      const imp = match[1].split("/").pop();
      if (filenames.has(imp)) deps.add(imp);
    }
    graph.set(file, Array.from(deps));
  }
  return graph;
}

function detectCycles(graph) {
  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Map();
  for (const k of graph.keys()) color.set(k, WHITE);

  const cycles = [];
  const stack = [];

  function dfs(node) {
    color.set(node, GRAY);
    stack.push(node);
    for (const neighbor of graph.get(node) || []) {
      if (color.get(neighbor) === GRAY) {
        // Found a cycle
        const idx = stack.indexOf(neighbor);
        cycles.push(stack.slice(idx).concat(neighbor));
      } else if (color.get(neighbor) === WHITE) {
        dfs(neighbor);
      }
    }
    stack.pop();
    color.set(node, BLACK);
  }

  for (const node of graph.keys()) {
    if (color.get(node) === WHITE) dfs(node);
  }
  return cycles;
}

function main() {
  const graph = buildGraph();
  const cycles = detectCycles(graph);
  if (cycles.length === 0) {
    console.log("No chunk-level circular imports found. ✅");
    process.exit(0);
  }

  console.error("Detected circular imports between chunks: ⚠️");
  for (const cycle of cycles) {
    console.error("- " + cycle.join(" -> "));
  }
  process.exit(1);
}

main();
