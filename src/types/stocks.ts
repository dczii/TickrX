export type Suggestion = "BUY" | "SELL" | "HOLD";

export type StockPick = {
  name: string;
  symbol: string;
  current_price: number | string;
  change_24h: number | string;
  volume_24h: number | string;
  reasoning: string;
  suggestion: Suggestion;
};

export type Body = {
  limit?: number; // default 10
  target_gain_pct?: number; // default 5
  indicators?: string[]; // e.g. ["RSI","MACD","MA20/50","Volume"]
  risk?: "low" | "medium" | "high";
  universe?: "US" | "GLOBAL"; // default "US"
};

export type StocksApiResponse = {
  generated_at: string; // ISO timestamp
  target_gain_pct: number; // e.g. 5
  risk: string; // "low" | "medium" | "high"
  universe: string; // "US" | "GLOBAL"
  picks: StockPick[];
  notes?: string | null;
};
