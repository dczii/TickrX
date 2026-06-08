#!/usr/bin/env node
/**
 * Component Memory Agent scanner (Agent 2)
 * Runs on merge to main — detects new reusable components in the diff
 * and appends them to COMPONENT_REGISTRY.md.
 *
 * Triggered by .github/workflows/component-memory.yml
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REGISTRY_PATH = path.join(__dirname, "..", "COMPONENT_REGISTRY.md");
const COMPONENTS_GLOB = "src/components/**/*.tsx";

function getExportedComponents(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const matches = [];

  // Match: export default function Foo or export function Foo
  for (const m of src.matchAll(/export\s+(?:default\s+)?function\s+([A-Z][a-zA-Z]+)/g)) {
    matches.push(m[1]);
  }
  // Match: export default memo(function Foo
  for (const m of src.matchAll(/export\s+default\s+memo\(function\s+([A-Z][a-zA-Z]+)/g)) {
    matches.push(m[1]);
  }
  // Match: export const Foo = ...
  for (const m of src.matchAll(/export\s+const\s+([A-Z][a-zA-Z]+)\s*=/g)) {
    matches.push(m[1]);
  }

  return [...new Set(matches)];
}

function getRegisteredComponents() {
  const registry = fs.readFileSync(REGISTRY_PATH, "utf8");
  const matches = registry.matchAll(/^## ([A-Z][a-zA-Z]+)/gm);
  return new Set([...matches].map((m) => m[1]));
}

function main() {
  const registered = getRegisteredComponents();
  const files = execSync(`git ls-files ${COMPONENTS_GLOB}`, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);

  const newComponents = [];

  for (const file of files) {
    const components = getExportedComponents(file);
    for (const name of components) {
      if (!registered.has(name)) {
        newComponents.push({ name, file });
      }
    }
  }

  if (newComponents.length === 0) {
    console.log("No new components found.");
    return;
  }

  console.log(`Found ${newComponents.length} new component(s):`);

  let append = "";
  const today = new Date().toISOString().split("T")[0];

  for (const { name, file } of newComponents) {
    console.log(` - ${name} (${file})`);
    append += `
---

## ${name}

- **File:** \`${file}\`
- **Props:**
  \`\`\`typescript
  // TODO: add props interface
  \`\`\`
- **Usage:**
  \`\`\`tsx
  <${name} />
  \`\`\`
- **Used in:** TODO
- **Last updated:** ${today}
- **Notes:** Auto-detected by Component Memory Agent — fill in props and usage.
`;
  }

  fs.appendFileSync(REGISTRY_PATH, append);
  console.log("COMPONENT_REGISTRY.md updated.");
}

main();
