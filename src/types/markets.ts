export interface MarketRow {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  volume: number;
  marketCap: number;
  high52: number;
  low52: number;
}

export interface Sector {
  name: string;
  changePct: number;
}

export interface TickerSearchResult {
  symbol: string;
  name: string;
}

export type SortDirection = "asc" | "desc";
