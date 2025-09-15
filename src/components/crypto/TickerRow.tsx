// components/TickerRow.tsx
import { memo, useMemo } from "react";
import { Heart, HeartPlus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Ticker } from "@/types/crypto";

type Props = {
  item: Ticker;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string, next: boolean) => void;
};

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

const TickerRow = memo(function TickerRow({ item, isFavorite, onToggleFavorite }: Props) {
  const change = item.change24h ?? 0;
  const positive = change >= 0;

  const ChangeIcon = useMemo(() => (positive ? ArrowUpRight : ArrowDownRight), [positive]);

  return (
    <div
      className='grid grid-cols-13 px-4 py-3 hover:bg-slate-700 transition-colors cursor-pointer'
      role='row'
      aria-label={`${item.symbol} ${item.name}`}
    >
      <div className='col-span-1 flex items-center'>
        <button
          type='button'
          className='text-gray-400 hover:text-gray-50 cursor-pointer hover:scale-110 transition'
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => onToggleFavorite(item.symbol, !isFavorite)}
        >
          {isFavorite ? <Heart className='fill-current' /> : <HeartPlus />}
        </button>
      </div>

      <div className='col-span-3 font-semibold tabular-nums'>{item.symbol}</div>

      <div className='col-span-5 text-slate-300 truncate'>{item.name}</div>

      <div className='col-span-2 text-right tabular-nums'>${formatCurrency(item.price)}</div>

      <div
        className={`col-span-2 flex items-center justify-end gap-1 tabular-nums ${
          positive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        <ChangeIcon className='h-4 w-4' aria-hidden='true' />
        <span>{formatPercent(change)}</span>
      </div>
    </div>
  );
});

export default TickerRow;
