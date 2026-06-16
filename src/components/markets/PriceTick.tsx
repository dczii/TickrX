"use client";

import { useEffect, useRef, useState } from "react";

import { formatPrice } from "@/lib/markets";

interface PriceTickProps {
  price: number;
  flashDuration?: number;
}

type Flash = "up" | "down" | null;

/**
 * Price cell that briefly flashes green/red when its value changes — used to
 * surface live WebSocket ticks in the markets table.
 */
export default function PriceTick({ price, flashDuration = 600 }: PriceTickProps) {
  const prevPrice = useRef(price);
  const [flash, setFlash] = useState<Flash>(null);

  useEffect(() => {
    if (price === prevPrice.current) {
      return;
    }
    setFlash(price > prevPrice.current ? "up" : "down");
    prevPrice.current = price;

    const timer = setTimeout(() => setFlash(null), flashDuration);
    return () => clearTimeout(timer);
  }, [price, flashDuration]);

  const flashClass =
    flash === "up"
      ? "bg-accent-soft text-accent"
      : flash === "down"
        ? "bg-danger-soft text-danger"
        : "";

  return (
    <span
      data-flash={flash ?? "none"}
      className={`inline-block rounded px-1 font-mono tabular-nums transition-colors duration-300 ${flashClass}`}
    >
      ${formatPrice(price)}
    </span>
  );
}
