"use client";

import { useState } from "react";
import Crypto from "@/components/Crypto";
import Stocks from "@/components/Stocks";

export default function Page() {
  const [active, setActive] = useState<"crypto" | "stocks">("stocks");

  return (
    <div className='px-4 py-10'>
      <h1 className='text-2xl font-bold mb-6'>Market Dashboard</h1>

      {/* Buttons here */}
      <div className='inline-flex rounded-2xl bg-slate-800 p-1 shadow'>
        <button
          onClick={() => setActive("crypto")}
          className={`px-4 py-2 rounded-xl text-sm transition ${
            active === "crypto" ? "bg-slate-700" : "hover:bg-slate-700/50"
          }`}
        >
          Crypto (Top 10)
        </button>
        <button
          onClick={() => setActive("stocks")}
          className={`px-4 py-2 rounded-xl text-sm transition ${
            active === "stocks" ? "bg-slate-700" : "hover:bg-slate-700/50"
          }`}
        >
          US Stocks (Top 10)
        </button>
      </div>

      {/* Render selected tab */}
      {active === "crypto" ? <Crypto /> : <Stocks />}
    </div>
  );
}
