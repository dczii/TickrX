#!/usr/bin/env node
/**
 * Test Agent (Agent 3) — Claude agentic loop
 *
 * 1. Runs jest. If all pass → post coverage report, exit 0.
 * 2. If tests fail → enters a Claude tool-use loop:
 *    - Claude reads failing test + source files
 *    - Claude edits files to fix the failures
 *    - Claude re-runs tests to verify
 *    - Repeats up to MAX_FIX_ATTEMPTS times
 * 3. Posts a PR comment with the outcome (fixed / still failing + what was tried).
 * 4. Exits 0 if tests pass, exits 1 if still failing after all attempts.
 *
 * Usage: node scripts/test-agent.js [--pr <number>]
 */

const Anthropic = require("@anthropic-ai/sdk");
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const MAX_FIX_ATTEMPTS = 3;
const ROOT = process.cwd();
const prNumber = (() => {
  const i = process.argv.indexOf("--pr");
  return i !== -1 ? process.argv[i + 1] : null;
})();

// ─── Tool definitions ────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "read_file",
    description: "Read the full contents of a source or test file.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "File path relative to project root, e.g. src/components/Foo.tsx",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "list_files",
    description:
      "List TypeScript/TSX source and test files in the project (node_modules excluded).",
    input_schema: {
      type: "object",
      properties: {
        directory: {
          type: "string",
          description: "Directory to list from, e.g. src or __tests__. Defaults to src.",
        },
      },
      required: [],
    },
  },
  {
    name: "write_file",
    description:
      "Write or overwrite a file. Use this to fix source code or test files. Always write the complete file content.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "File path relative to project root." },
        content: { type: "string", description: "Complete new file content." },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "run_tests",
    description:
      "Re-run the jest test suite. Returns the full output including pass/fail counts and error details.",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// ─── Tool executor ────────────────────────────────────────────────────────────

function executeTool(name, input) {
  switch (name) {
    case "read_file": {
      const abs = path.join(ROOT, input.path);
      if (!fs.existsSync(abs)) return `File not found: ${input.path}`;
      const content = fs.readFileSync(abs, "utf8");
      // Truncate very large files
      return content.length > 20000 ? content.slice(0, 20000) + "\n[...truncated]" : content;
    }

    case "list_files": {
      const dir = input.directory || "src";
      const abs = path.join(ROOT, dir);
      if (!fs.existsSync(abs)) return `Directory not found: ${dir}`;
      const result = spawnSync(
        "find",
        [abs, "-not", "-path", "*/node_modules/*", "-name", "*.ts", "-o", "-name", "*.tsx"],
        { encoding: "utf8" }
      );
      const files = result.stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((f) => f.replace(ROOT + "/", ""));
      return files.join("\n") || "No files found.";
    }

    case "write_file": {
      const abs = path.join(ROOT, input.path);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, input.content, "utf8");
      return `✅ Written: ${input.path}`;
    }

    case "run_tests": {
      const result = spawnSync(
        "npx",
        ["jest", "--no-coverage", "--passWithNoTests", "--forceExit"],
        { encoding: "utf8", cwd: ROOT, timeout: 120_000 }
      );
      const output = (result.stdout + result.stderr).slice(0, 15000);
      const passed = result.status === 0;
      return `EXIT CODE: ${result.status}\n${passed ? "✅ TESTS PASS" : "❌ TESTS FAIL"}\n\n${output}`;
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

// ─── Jest runner ──────────────────────────────────────────────────────────────

function runJest(withCoverage = false) {
  const args = ["jest", "--passWithNoTests", "--forceExit"];
  if (withCoverage) args.push("--coverage", "--coverageReporters=json-summary,text");
  const result = spawnSync("npx", args, { encoding: "utf8", cwd: ROOT, timeout: 180_000 });
  return {
    passed: result.status === 0,
    output: (result.stdout + result.stderr).slice(0, 20000),
    status: result.status,
  };
}

// ─── Coverage report builder ─────────────────────────────────────────────────

function buildCoverageComment(attempts, agentSummary) {
  const summaryPath = path.join(ROOT, "coverage/coverage-summary.json");
  let coverageTable = "_No coverage data generated — add tests to `src/**/*.test.tsx`._";

  if (fs.existsSync(summaryPath)) {
    const data = JSON.parse(fs.readFileSync(summaryPath, "utf8")).total;
    const pct = (k) => `${data[k].pct}%`;
    const icon = (k, threshold = 80) => (data[k].pct >= threshold ? "✅" : "❌");
    coverageTable =
      `| Metric | % | Status |\n|---|---|---|\n` +
      `| Lines | ${pct("lines")} | ${icon("lines")} |\n` +
      `| Statements | ${pct("statements")} | ${icon("statements")} |\n` +
      `| Functions | ${pct("functions")} | ${icon("functions")} |\n` +
      `| Branches | ${pct("branches")} | ${icon("branches", 75)} |`;
  }

  const header =
    attempts === 0
      ? "✅ **Test Agent — All tests passed**"
      : `✅ **Test Agent — Fixed after ${attempts} attempt${attempts > 1 ? "s" : ""}**`;

  return `## ${header}\n\n### Coverage\n${coverageTable}${agentSummary ? `\n\n### What the agent fixed\n${agentSummary}` : ""}`;
}

// ─── Post PR comment ──────────────────────────────────────────────────────────

function postComment(body) {
  if (!prNumber) {
    console.log("No PR number — skipping comment.");
    return;
  }
  const escaped = body.replace(/'/g, "'\\''");
  try {
    spawnSync("gh", ["pr", "comment", prNumber, "--body", escaped], {
      encoding: "utf8",
      env: { ...process.env },
      stdio: "inherit",
    });
  } catch (err) {
    console.error("Failed to post comment:", err.message);
  }
}

// ─── Claude agentic fix loop ──────────────────────────────────────────────────

async function agentFixLoop(initialFailureOutput) {
  const client = new Anthropic.default();

  const messages = [
    {
      role: "user",
      content: `You are the TickrX Test Agent. Jest tests are failing. Your job is to fix them with minimal, targeted changes.

FAILING OUTPUT:
\`\`\`
${initialFailureOutput}
\`\`\`

Rules:
- TypeScript strict — no \`any\` types
- No inline styles — Tailwind classes only
- Prefer fixing source code over weakening test expectations
- Only import from packages listed in package.json
- After making fixes, always call run_tests to verify they pass
- If tests pass, stop — do not make further changes
- Max ${MAX_FIX_ATTEMPTS} calls to run_tests

Start by reading the relevant failing test files and the source files they test, then make your fix.`,
    },
  ];

  let testRunCount = 0;
  let fixSummary = [];
  let finalPassed = false;

  while (testRunCount < MAX_FIX_ATTEMPTS) {
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 8192,
      tools: TOOLS,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    // Collect any text the agent produces for the PR comment summary
    for (const block of response.content) {
      if (block.type === "text" && block.text.trim()) {
        fixSummary.push(block.text.trim());
      }
    }

    if (response.stop_reason === "end_turn") {
      console.log("Agent finished reasoning.");
      break;
    }

    if (response.stop_reason === "tool_use") {
      const toolResults = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        console.log(`→ Tool: ${block.name}`, JSON.stringify(block.input).slice(0, 120));

        if (block.name === "run_tests") testRunCount++;

        let result;
        try {
          result = executeTool(block.name, block.input);
        } catch (err) {
          result = `Tool error: ${err.message}`;
        }

        // Check if the run_tests call passed
        if (block.name === "run_tests" && result.includes("✅ TESTS PASS")) {
          finalPassed = true;
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: String(result),
        });
      }

      messages.push({ role: "user", content: toolResults });

      // Stop the loop early if tests already pass
      if (finalPassed) break;
    }
  }

  return {
    passed: finalPassed,
    attempts: testRunCount,
    summary: fixSummary.join("\n\n"),
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🧪 Test Agent starting...");

  // First run — with coverage
  const initial = runJest(true);

  if (initial.passed) {
    console.log("✅ All tests pass on first run.");
    const comment = buildCoverageComment(0, null);
    postComment(comment);
    process.exit(0);
  }

  console.log("❌ Tests failed. Entering Claude agentic fix loop...");

  let agentResult;
  try {
    agentResult = await agentFixLoop(initial.output);
  } catch (err) {
    console.error("Agent loop error:", err.message);
    agentResult = { passed: false, attempts: 0, summary: `Agent error: ${err.message}` };
  }

  if (agentResult.passed) {
    // Re-run with coverage to get final numbers
    runJest(true);
    const comment = buildCoverageComment(agentResult.attempts, agentResult.summary);
    postComment(comment);
    console.log(`✅ Tests fixed after ${agentResult.attempts} attempt(s).`);
    process.exit(0);
  } else {
    const comment =
      `## ❌ Test Agent — Could not auto-fix after ${agentResult.attempts} attempt(s)\n\n` +
      `**What was tried:**\n${agentResult.summary || "_No summary available_"}\n\n` +
      `**Original failure:**\n\`\`\`\n${initial.output.slice(0, 3000)}\n\`\`\`\n\n` +
      `Please review the failing tests and fix manually.`;
    postComment(comment);
    console.error("❌ Tests still failing after all fix attempts.");
    process.exit(1);
  }
}

main();
