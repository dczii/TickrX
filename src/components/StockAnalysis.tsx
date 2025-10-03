"use client";

import React, { useEffect, useState } from "react";
import type { AnalystJSON } from "@/app/api/stock-analysis/route";
import { toast } from "sonner";
import TickrXSpinner from "@/components/TickrXSpinner";

type Props = {
  tickr: string;
};

export default function StockAnalysis({ tickr }: Props) {
  const [data, setData] = useState<AnalystJSON | null>(null);

  useEffect(() => {
    async function loadStockData() {
      try {
        const r = await fetch("/api/stock-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticker: tickr }),
        });
        const data = await r.json();
        setData(data.analysis);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        toast.error("Something went wrong loading stocks.");
      }
    }

    loadStockData();
  }, []);

  if (!data) {
    return (
      <div className='flex justify-center items-center h-fit'>
        <TickrXSpinner size={120} accent='text-emerald-400' />
      </div>
    );
  }
  return (
    <div className='space-y-6 text-slate-100'>
      {/* Bull Case */}
      <Section title='🐂 Bull Case' items={data.bullCase} color='text-emerald-400' />

      {/* Bear Case */}
      <Section title='🐻 Bear Case' items={data.bearCase} color='text-red-400' />

      {/* Warning Signs */}
      <Section title='⚠️ Warning Signs' items={data.warningSigns} color='text-yellow-400' />

      {/* Earnings */}
      <div className='bg-[rgba(1,93,83,0.3)] p-6 rounded-2xl shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>📊 Last 5 Earnings Reports</h2>
        <div className='space-y-4'>
          {data.earningsLast5?.map((e, i) => (
            <details key={i} className='bg-slate-900 rounded-lg p-4 border border-slate-700'>
              <summary className='cursor-pointer font-medium'>{e.period}</summary>
              <div className='mt-2 text-sm space-y-2'>
                <p>
                  <strong>Revenue:</strong> {e.revenue?.actual ?? "—"} (Consensus{" "}
                  {e.revenue?.consensus ?? "—"}) → {e.revenue?.beatOrMiss ?? "—"}
                </p>
                <p>
                  <strong>EPS:</strong> {e.eps?.actual ?? "—"} (Consensus {e.eps?.consensus ?? "—"})
                  → {e.eps?.beatOrMiss ?? "—"}
                </p>
                {e.marginsCommentary && (
                  <p>
                    <strong>Margins:</strong> {e.marginsCommentary}
                  </p>
                )}
                {e.keyDrivers?.length ? (
                  <p>
                    <strong>Drivers:</strong> {e.keyDrivers.join(", ")}
                  </p>
                ) : null}
                {e.notableOneOffs?.length ? (
                  <p>
                    <strong>One-offs:</strong> {e.notableOneOffs.join(", ")}
                  </p>
                ) : null}
                {e.fxImpact && (
                  <p>
                    <strong>FX Impact:</strong> {e.fxImpact}
                  </p>
                )}
                {e.managementTone && (
                  <p>
                    <strong>Mgmt Tone:</strong> {e.managementTone}
                  </p>
                )}
                {e.stockReaction && (
                  <p>
                    <strong>Stock Reaction:</strong> {e.stockReaction}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Guidance & Outlook */}
      <div className='bg-[rgba(1,93,83,0.3)] p-6 rounded-2xl shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>📈 Guidance & Outlook</h2>
        <ul className='list-disc pl-6 space-y-1 text-slate-300'>
          {data.guidanceOutlook.latestGuidance && (
            <li>
              <strong>Latest Guidance:</strong> {data.guidanceOutlook.latestGuidance}
            </li>
          )}
          {data.guidanceOutlook.changes && (
            <li>
              <strong>Changes:</strong> {data.guidanceOutlook.changes}
            </li>
          )}
          {data.guidanceOutlook.vsConsensus && (
            <li>
              <strong>Vs Consensus:</strong> {data.guidanceOutlook.vsConsensus}
            </li>
          )}
          {data.guidanceOutlook.nearTermView && (
            <li>
              <strong>Near-term:</strong> {data.guidanceOutlook.nearTermView}
            </li>
          )}
          {data.guidanceOutlook.midTermView && (
            <li>
              <strong>Mid-term:</strong> {data.guidanceOutlook.midTermView}
            </li>
          )}
        </ul>
      </div>

      {/* Final Assessment */}
      <div className='bg-[rgba(1,93,83,0.3)] p-6 rounded-2xl shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>📝 Final Assessment</h2>
        <p className='text-slate-300 mb-4'>{data.finalAssessment.summary}</p>
        <ul className='list-disc pl-6 space-y-1 text-slate-300'>
          {data.finalAssessment.shortTerm && (
            <li>
              <strong>Short-term:</strong> {data.finalAssessment.shortTerm}
            </li>
          )}
          {data.finalAssessment.mediumTerm && (
            <li>
              <strong>Medium-term:</strong> {data.finalAssessment.mediumTerm}
            </li>
          )}
          {data.finalAssessment.longTerm && (
            <li>
              <strong>Long-term:</strong> {data.finalAssessment.longTerm}
            </li>
          )}
        </ul>
        {data.finalAssessment.actionables?.length ? (
          <div className='mt-4'>
            <h3 className='font-semibold'>Actionables</h3>
            <ul className='list-disc pl-6 text-slate-300'>
              {data.finalAssessment.actionables.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {data.finalAssessment.wouldChangeView?.length ? (
          <div className='mt-4'>
            <h3 className='font-semibold'>Would Change View</h3>
            <ul className='list-disc pl-6 text-slate-300'>
              {data.finalAssessment.wouldChangeView.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* --- Helper Section component --- */
function Section({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return (
    <div className='bg-[rgba(1,93,83,0.3)] p-6 rounded-2xl shadow-lg'>
      <h2 className={`text-xl font-semibold mb-4 ${color}`}>{title}</h2>
      <ul className='list-disc pl-6 space-y-1 text-slate-300'>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
