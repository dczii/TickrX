"use client";

import { useEffect, useState } from "react";

const WS_URL = "wss://socket.polygon.io/stocks";

interface PolygonTradeMessage {
  ev: string;
  sym: string;
  p: number;
}

/**
 * Live price map keyed by symbol. Connects to the Polygon.io WebSocket when
 * NEXT_PUBLIC_POLYGON_API_KEY is set; otherwise simulates gentle ticks so the
 * markets table stays animated in local/demo environments.
 */
export function usePriceTicks(
  symbols: string[],
  initial: Record<string, number>
): Record<string, number> {
  const [prices, setPrices] = useState<Record<string, number>>(initial);
  const key = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  const joined = symbols.join(",");

  useEffect(() => {
    if (!key) {
      const interval = setInterval(() => {
        setPrices((prev) => {
          const next = { ...prev };
          for (const symbol of symbols) {
            const base = prev[symbol] ?? initial[symbol] ?? 0;
            const drift = base * (Math.random() * 0.004 - 0.002);
            next[symbol] = Number((base + drift).toFixed(2));
          }
          return next;
        });
      }, 2000);
      return () => clearInterval(interval);
    }

    const socket = new WebSocket(WS_URL);
    socket.onopen = () => {
      socket.send(JSON.stringify({ action: "auth", params: key }));
      socket.send(
        JSON.stringify({ action: "subscribe", params: symbols.map((s) => `T.${s}`).join(",") })
      );
    };
    socket.onmessage = (event) => {
      const messages = JSON.parse(event.data) as PolygonTradeMessage[];
      setPrices((prev) => {
        const next = { ...prev };
        for (const msg of messages) {
          if (msg.ev === "T" && typeof msg.p === "number") {
            next[msg.sym] = msg.p;
          }
        }
        return next;
      });
    };
    return () => socket.close();
  }, [joined, key]);

  return prices;
}
