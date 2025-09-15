export type Pick = {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  pct_1h: number;
  pct_24h: number;
  volume24h: number;
  why: string;
};

export type Crypto10ApiResponse =
  | {
      timestamp: string;
      source: "coingecko";
      candidates: any[];
      picks: Pick[];
      note?: string;
    }
  | { error: string; detail?: string };

export type CGCoin = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  change24h: number;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
};
