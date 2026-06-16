"use client";

import { useState } from "react";
import { toast } from "sonner";

import { formatUsd } from "@/lib/markets";

interface OrderTicketPanelProps {
  symbol: string;
  price: number;
  buyingPower: number;
}

type Side = "buy" | "sell";
type OrderType = "market" | "limit";
type InputMode = "dollars" | "shares";

export default function OrderTicketPanel({ symbol, price, buyingPower }: OrderTicketPanelProps) {
  const [side, setSide] = useState<Side>("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [inputMode, setInputMode] = useState<InputMode>("dollars");
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const execPrice = orderType === "limit" && limitPrice ? Number(limitPrice) : price;
  const amountNum = Number(amount) || 0;
  const shares = inputMode === "dollars" ? (execPrice > 0 ? amountNum / execPrice : 0) : amountNum;
  const total = shares * execPrice;
  const insufficient = side === "buy" && total > buyingPower;
  const canSubmit = shares > 0 && !insufficient;

  function onConfirm() {
    if (!canSubmit) return;
    toast.success(`${side === "buy" ? "Bought" : "Sold"} ${shares.toFixed(2)} ${symbol}`, {
      description: `${orderType === "market" ? "Market" : "Limit"} order · ${formatUsd(total)}`,
    });
    setAmount("");
    setLimitPrice("");
  }

  return (
    <div className="rounded-xl border border-edge bg-surface p-4">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={side === s}
            onClick={() => setSide(s)}
            className={`rounded-md py-1.5 text-sm font-semibold capitalize transition-colors ${
              side === s
                ? s === "buy"
                  ? "bg-accent text-on-accent"
                  : "bg-danger text-on-danger"
                : "text-mid hover:text-hi"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-3 inline-flex w-full rounded-lg bg-surface-2 p-1">
        {(["market", "limit"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={orderType === t}
            onClick={() => setOrderType(t)}
            className={`flex-1 rounded-md py-1 text-xs font-medium capitalize transition-colors ${
              orderType === t ? "bg-surface-3 text-hi" : "text-mid hover:text-hi"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {orderType === "limit" ? (
        <label className="mt-3 block">
          <span className="eyebrow">Limit Price</span>
          <input
            type="number"
            inputMode="decimal"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder={price.toFixed(2)}
            className="mt-1 w-full rounded-lg border border-edge bg-surface-2 px-3 py-2 font-mono text-sm text-hi outline-none focus:border-accent"
          />
        </label>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <span className="eyebrow">Amount</span>
        <div className="inline-flex rounded-md bg-surface-2 p-0.5 text-xs">
          {(["dollars", "shares"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={inputMode === m}
              onClick={() => setInputMode(m)}
              className={`rounded px-2 py-0.5 font-medium transition-colors ${
                inputMode === m ? "bg-surface-3 text-hi" : "text-dim hover:text-hi"
              }`}
            >
              {m === "dollars" ? "$" : "Shares"}
            </button>
          ))}
        </div>
      </div>
      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={inputMode === "dollars" ? "$0.00" : "0"}
        aria-label={inputMode === "dollars" ? "Dollar amount" : "Share count"}
        className="mt-1 w-full rounded-lg border border-edge bg-surface-2 px-3 py-2 font-mono text-sm text-hi outline-none focus:border-accent"
      />

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-dim">{inputMode === "dollars" ? "Est. shares" : "Est. total"}</dt>
          <dd className="font-mono tabular-nums text-hi">
            {inputMode === "dollars" ? shares.toFixed(4) : formatUsd(total)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-dim">Buying power</dt>
          <dd className="font-mono tabular-nums text-mid">{formatUsd(buyingPower)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-dim">Fees</dt>
          <dd className="font-mono tabular-nums text-mid">$0.00</dd>
        </div>
      </dl>

      {insufficient ? (
        <p className="mt-2 text-xs font-medium text-danger">Insufficient buying power.</p>
      ) : null}

      <button
        type="button"
        onClick={onConfirm}
        disabled={!canSubmit}
        className={`mt-3 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          side === "buy" ? "bg-accent text-on-accent" : "bg-danger text-on-danger"
        }`}
      >
        {side === "buy" ? "Confirm Buy" : "Confirm Sell"}
      </button>
    </div>
  );
}
