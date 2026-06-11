#!/usr/bin/env node
/**
 * Security Agent (Agent 5) — Claude agentic loop
 *
 * 1. Runs all security checks: npm audit, custom secret patterns, .env guard.
 * 2. Feeds all raw findings to Claude.
 * 3. Claude uses tools to read flagged files for context, triages findings:
 *    - Real issue vs false positive
 *    - Auto-fixable (npm audit fix) vs needs manual fix
 * 4. Attempts npm audit fix for safe vulnerabilities.
 * 5. Posts an intelligent, contextualized PR comment.
 * 6. Exits 1 only on confirmed real issues that can't be auto-fixed.
 *
 * Usage: node scripts/security-agent.js [--pr <number>]
 */

const Anthropic = require("@anthropic-ai/sdk");
const { spawnSync, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const prNumber = (() => {
  const i = process.argv.indexOf("--pr");
  return i !== -1 ? process.argv[i + 1] : null;
})();

// ─── Security checks ──────────────────────────────────────────────────────────

function runNpmAudit() {
  const result = spawnSync("npm", ["audit", "--json"], { encoding: "utf8", cwd: ROOT });
  try {
    const data = JSON.parse(result.stdout);
    return { raw: result.stdout, parsed: data, exitCode: result.status };
  } catch {
    return { raw: result.stdout + result.stderr, parsed: null, exitCode: result.status };
  }
}

function runSecretScan() {
  const patterns = [
    // Polygon, Firebase, Anthropic, generic API keys
    /(?:POLYGON_API_KEY|ANTHROPIC_API_KEY|FIREBASE_API_KEY)\s*=\s*["'][^$'"][^'"]{4,}/,
    /sk-[a-zA-Z0-9]{20,}/,
    /AIza[0-9A-Za-z-_]{35}/,
    /(?:password|passwd|secret)\s*=\s*["'][^'"]{4,}/i,
  ];

  const findings = [];
  const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (
        entry.isDirectory() &&
        !["node_modules", ".next", ".git", "coverage"].includes(entry.name)
      ) {
        scanDir(fullPath);
      } else if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
        // Skip env example files intentionally
        if (entry.name.includes(".env.example") || entry.name.includes(".env.sample")) continue;
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
              findings.push({
                file: fullPath.replace(ROOT + "/", ""),
                match: match[0].slice(0, 80) + (match[0].length > 80 ? "..." : ""),
                pattern: pattern.toString(),
              });
            }
          }
        } catch {
          // skip unreadable files
        }
      }
    }
  }

  scanDir(path.join(ROOT, "src"));
  scanDir(path.join(ROOT, "scripts"));
  scanDir(path.join(ROOT, "functions"));

  return findings;
}

function checkEnvFiles() {
  try {
    const tracked = execSync("git ls-files", { encoding: "utf8", cwd: ROOT });
    const envFiles = tracked
      .split("\n")
      .filter((f) => /^\.env(\.|$)/.test(f) && !f.includes("example") && !f.includes("sample"));
    return envFiles;
  } catch {
    return [];
  }
}

function checkGitignore() {
  const gitignorePath = path.join(ROOT, ".gitignore");
  if (!fs.existsSync(gitignorePath)) return false;
  const content = fs.readFileSync(gitignorePath, "utf8");
  return content.includes(".env");
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "read_file",
    description: "Read a source file to understand context around a security finding.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "File path relative to project root." },
      },
      required: ["path"],
    },
  },
  {
    name: "run_npm_audit_fix",
    description:
      "Run `npm audit fix` to automatically patch safe (non-breaking) vulnerabilities. Only use if Claude determines the vulnerable packages can be safely updated.",
    input_schema: {
      type: "object",
      properties: {
        force: {
          type: "boolean",
          description: "Pass --force flag. Only use if confident it won't break the app.",
        },
      },
      required: [],
    },
  },
  {
    name: "read_package_json",
    description: "Read package.json to understand dependency versions and context.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "check_file_in_gitignore",
    description: "Check whether a given file pattern is listed in .gitignore.",
    input_schema: {
      type: "object",
      properties: {
        pattern: { type: "string", description: "e.g. .env or *.pem" },
      },
      required: ["pattern"],
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
      return content.length > 15000 ? content.slice(0, 15000) + "\n[...truncated]" : content;
    }

    case "run_npm_audit_fix": {
      const args = ["audit", "fix"];
      if (input.force) args.push("--force");
      const result = spawnSync("npm", args, { encoding: "utf8", cwd: ROOT });
      return `Exit code: ${result.status}\n${(result.stdout + result.stderr).slice(0, 5000)}`;
    }

    case "read_package_json": {
      const abs = path.join(ROOT, "package.json");
      return fs.readFileSync(abs, "utf8");
    }

    case "check_file_in_gitignore": {
      const gitignorePath = path.join(ROOT, ".gitignore");
      if (!fs.existsSync(gitignorePath)) return ".gitignore not found";
      const content = fs.readFileSync(gitignorePath, "utf8");
      const found = content.includes(input.pattern);
      return found
        ? `✅ "${input.pattern}" IS in .gitignore`
        : `❌ "${input.pattern}" is NOT in .gitignore`;
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

// ─── Post PR comment ──────────────────────────────────────────────────────────

function postComment(body) {
  if (!prNumber) {
    console.log("No PR number — printing comment:\n", body);
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

// ─── Claude agentic triage loop ───────────────────────────────────────────────

async function agentTriageLoop(findings) {
  const client = new Anthropic.default();

  const messages = [
    {
      role: "user",
      content: `You are the TickrX Security Agent. Review the findings below and triage each one.

PROJECT: Next.js 15 app, TypeScript, deployed to Vercel. Source files in src/. No server-side secrets should ever appear in src/.

FINDINGS:
${JSON.stringify(findings, null, 2)}

Your tasks:
1. For each npm audit vulnerability: read package.json, determine if it's in devDependencies or production, assess real risk in a Next.js Vercel context, decide if \`npm audit fix\` is safe to run.
2. For each secret scan finding: read the flagged file to see if it's a real hardcoded secret or a false positive (e.g. a variable name, env reference like process.env.X, or a comment).
3. For .env findings: check .gitignore to understand if it's truly exposed.
4. Run \`npm audit fix\` if you determine it's safe (no --force unless very confident).
5. After your investigation, produce a final report.

Format your final report EXACTLY as:

## Security Report

### npm audit
[summary of vulnerabilities, their real risk, and what was fixed/remains]

### Secret scan
[for each finding: REAL ISSUE or FALSE POSITIVE, with brief explanation]

### Environment files
[status]

### Verdict
PASS or BLOCK

### Reason (if BLOCK)
[what must be fixed manually]`,
    },
  ];

  const MAX_TURNS = 10;
  let turns = 0;
  let finalReport = null;
  let verdict = "PASS";

  while (turns < MAX_TURNS) {
    turns++;

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      tools: TOOLS,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    // Capture the final text report
    for (const block of response.content) {
      if (block.type === "text" && block.text.includes("## Security Report")) {
        finalReport = block.text;
        verdict = block.text.includes("BLOCK") ? "BLOCK" : "PASS";
      }
    }

    if (response.stop_reason === "end_turn") break;

    if (response.stop_reason === "tool_use") {
      const toolResults = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        console.log(`→ Tool: ${block.name}`, JSON.stringify(block.input).slice(0, 100));
        let result;
        try {
          result = executeTool(block.name, block.input);
        } catch (err) {
          result = `Tool error: ${err.message}`;
        }
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: String(result) });
      }
      messages.push({ role: "user", content: toolResults });
    }
  }

  return { verdict, report: finalReport };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔒 Security Agent starting...");

  // Gather all findings
  const audit = runNpmAudit();
  const secretFindings = runSecretScan();
  const exposedEnvFiles = checkEnvFiles();
  const envInGitignore = checkGitignore();

  const findings = {
    npmAudit: {
      exitCode: audit.exitCode,
      summary: audit.parsed
        ? {
            critical: audit.parsed.metadata?.vulnerabilities?.critical ?? 0,
            high: audit.parsed.metadata?.vulnerabilities?.high ?? 0,
            moderate: audit.parsed.metadata?.vulnerabilities?.moderate ?? 0,
            low: audit.parsed.metadata?.vulnerabilities?.low ?? 0,
          }
        : "Could not parse audit JSON",
      raw: audit.raw.slice(0, 8000),
    },
    secretScan: {
      count: secretFindings.length,
      findings: secretFindings,
    },
    envFiles: {
      trackedEnvFiles: exposedEnvFiles,
      envInGitignore,
    },
  };

  // Short-circuit: if nothing found, post clean report and exit
  const allClean =
    audit.exitCode === 0 && secretFindings.length === 0 && exposedEnvFiles.length === 0;

  if (allClean) {
    console.log("✅ All security checks passed.");
    const cleanReport =
      `## ✅ Security Agent — Clean\n\n` +
      `| Check | Status |\n|---|---|\n` +
      `| npm audit | ✅ No vulnerabilities |\n` +
      `| Secret scan | ✅ No secrets found |\n` +
      `| Environment files | ✅ No .env files committed |`;
    postComment(cleanReport);
    process.exit(0);
  }

  console.log("⚠️ Findings detected — entering Claude triage loop...");
  console.log(
    "Findings:",
    JSON.stringify(findings.npmAudit.summary),
    secretFindings.length,
    "secrets"
  );

  let agentResult;
  try {
    agentResult = await agentTriageLoop(findings);
  } catch (err) {
    console.error("Agent loop error:", err.message);
    agentResult = {
      verdict: "BLOCK",
      report: `## ❌ Security Agent — Error\nAgent loop failed: ${err.message}\n\nRaw findings:\n\`\`\`json\n${JSON.stringify(findings, null, 2).slice(0, 3000)}\n\`\`\``,
    };
  }

  const emoji = agentResult.verdict === "PASS" ? "✅" : "❌";
  const header = `## ${emoji} Security Agent — ${agentResult.verdict}`;
  const comment = agentResult.report
    ? agentResult.report.replace("## Security Report", header)
    : `${header}\n\nNo report generated — check workflow logs.`;

  postComment(comment);

  if (agentResult.verdict === "BLOCK") {
    console.error("❌ Security Agent blocked the PR.");
    process.exit(1);
  } else {
    console.log("✅ Security Agent passed.");
    process.exit(0);
  }
}

main();
