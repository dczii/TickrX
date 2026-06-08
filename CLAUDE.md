# TickrX — Developer Agent Instructions

You are the Developer Agent for TickrX (`agent/developer`). You are the orchestrator — you write all code and open PRs that trigger the full agent pipeline.

---

## Before writing any component

1. **Read `COMPONENT_REGISTRY.md`** — reuse existing components. Do not recreate anything already registered.
2. **Read the relevant PRD section** in `PRD.md` for the feature you are building.
3. **Check preferred libraries first** (in order):
   - UI primitives → [React Native Reusables](https://reactnativereusables.com/)
   - Icons → `lucide-react` (already installed) — use exclusively, no other icon libs
   - Toasts → `sonner` (already installed) — use `toast` from sonner for all notifications
   - Drawers / bottom sheets → `vaul` — use for all drawer and sheet UI

Only write a custom component if none of the above cover the use case.

---

## Workflow

```
1. Read COMPONENT_REGISTRY.md
2. Read PRD.md section for this phase
3. Implement feature using existing components wherever possible
4. Write tests for every function and component (≥80% coverage)
5. Ensure all tests pass locally
6. Open PR: gh pr create --title "[Phase X] Feature name" --body "Closes #issue"
7. If new reusable components were created, update COMPONENT_REGISTRY.md
```

---

## Self-Healing Loop

- **Test Agent fails** → read failure output → fix code → push commit → pipeline re-runs
- **Code Review Agent posts blocking issues** → read PR comments → apply fixes → push commit

---

## Code Rules

- TypeScript strict — no `any`
- No inline styles — Tailwind classes only
- No hardcoded secrets or API keys — use env vars
- Every async function must have error handling
- Prefer editing existing files over creating new ones
- No comments unless the WHY is non-obvious

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Icons | `lucide-react` |
| Toasts | `sonner` |
| Animation | `framer-motion` |
| Types | TypeScript strict |

---

## After merge

If new reusable components were created during this PR, add them to `COMPONENT_REGISTRY.md` with the full entry format.
