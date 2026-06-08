#!/usr/bin/env node
/**
 * Code Review Agent (Agent 6)
 * Uses Claude API to review PR diffs against COMPONENT_REGISTRY.md.
 * Posts structured review as a PR comment and exits 1 on NEEDS WORK.
 *
 * Usage: node scripts/claude-review.js --diff pr.diff --registry registry.md --pr <number>
 */

const Anthropic = require("@anthropic-ai/sdk");
const { execSync } = require("child_process");
const fs = require("fs");

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : null;
};

const diffPath = arg("--diff");
const registryPath = arg("--registry");
const prNumber = arg("--pr");

if (!diffPath || !registryPath || !prNumber) {
  console.error("Usage: claude-review.js --diff <path> --registry <path> --pr <number>");
  process.exit(1);
}

const diff = fs.readFileSync(diffPath, "utf8");
const registry = fs.readFileSync(registryPath, "utf8");

// Truncate very large diffs to avoid token limits
const MAX_DIFF_CHARS = 30_000;
const truncatedDiff =
  diff.length > MAX_DIFF_CHARS
    ? diff.slice(0, MAX_DIFF_CHARS) + "\n\n[...diff truncated for length...]"
    : diff;

async function review() {
  const client = new Anthropic.default();

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are a senior TypeScript / Next.js engineer reviewing a PR for TickrX, a stock trading web app.

Stack: Next.js 15, TypeScript strict, Tailwind CSS v4, lucide-react (icons), sonner (toasts), vaul (drawers), framer-motion.

COMPONENT REGISTRY (existing reusable components — flag if any are re-implemented in this PR):
${registry}

PR DIFF:
${truncatedDiff}

Review for:
1. Logic bugs and edge cases
2. Missing error handling on async/await calls
3. Hardcoded secrets or API keys
4. TypeScript \`any\` type misuse
5. Components that duplicate entries in the COMPONENT REGISTRY above
6. Missing or inadequate tests
7. Inline styles instead of Tailwind classes
8. Using a non-standard icon lib instead of lucide-react

Format your response EXACTLY as:

## Code Review

### Blocking issues
- [list each blocking issue, or write "None"]

### Warnings
- [list each warning, or write "None"]

### Suggestions
- [list each suggestion, or write "None"]

### Verdict
PASS or NEEDS WORK`,
      },
    ],
  });

  const body = response.content[0].text;
  const verdict = body.includes("NEEDS WORK") ? "NEEDS WORK" : "PASS";
  const emoji = verdict === "PASS" ? "✅" : "❌";

  const comment = `${emoji} **Code Review Agent — ${verdict}**\n\n${body}`;

  // Escape for shell
  const escaped = comment.replace(/'/g, "'\\''");
  execSync(`gh pr comment ${prNumber} --body '${escaped}'`, {
    env: { ...process.env },
    stdio: "inherit",
  });

  console.log(`Verdict: ${verdict}`);
  if (verdict === "NEEDS WORK") process.exit(1);
}

review().catch((err) => {
  console.error("Review failed:", err.message);
  process.exit(1);
});
