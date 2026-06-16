const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Scope coverage to unit-testable application logic. Excluded: Next.js
  // pages/route handlers (validated by `next build` + the middleware test),
  // Supabase client wrappers (thin runtime glue), and TradingView/legacy
  // widgets that only inject external scripts.
  collectCoverageFrom: [
    "src/lib/auth.ts",
    "src/lib/nav.ts",
    "src/lib/portfolio.ts",
    "src/lib/markets.ts",
    "src/lib/watchlist.ts",
    "src/lib/charts.ts",
    "src/lib/demoData.ts",
    "src/components/layout/**/*.{ts,tsx}",
    "src/components/markets/ChangeChip.tsx",
    "src/components/markets/PriceTick.tsx",
    "src/components/markets/DataTable.tsx",
    "src/components/markets/SectorHeatmap.tsx",
    "src/components/markets/SearchModal.tsx",
    "src/components/charts/**/*.tsx",
    "src/components/ui/**/*.tsx",
    "src/components/portfolio/HoldingsTable.tsx",
    "src/components/leaderboard/LeaderboardView.tsx",
    "src/components/stock/OrderTicketPanel.tsx",
    "!src/**/*.d.ts",
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/apps/"],
  modulePathIgnorePatterns: ["<rootDir>/apps/"],
};

module.exports = createJestConfig(customConfig);
