import { createClient } from "@/lib/supabase/server";
import { quoteFor, DEMO_PORTFOLIO } from "@/lib/demoData";
import ScreenHeader from "@/components/layout/ScreenHeader";
import TVNews from "@/components/TVNews";
import StockChartPanel from "@/components/stock/StockChartPanel";
import OrderTicketPanel from "@/components/stock/OrderTicketPanel";
import Fundamentals from "@/components/stock/Fundamentals";

export default async function Page({ params }: { params: Promise<{ tickr: string }> }) {
  const { tickr } = await params;
  const symbol = tickr.toUpperCase();
  const quote = quoteFor(symbol);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("cash_balance")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  const buyingPower = Number(portfolio?.cash_balance ?? DEMO_PORTFOLIO.buyingPower);

  return (
    <div>
      <ScreenHeader back title={symbol} />
      <div className="px-5">
        <StockChartPanel
          symbol={symbol}
          name={quote.name}
          price={quote.price}
          changePct={quote.changePct}
        />
        <div className="mt-4 rounded-2xl border border-edge bg-surface p-2">
          <TVNews tickr={symbol} />
        </div>

        <div className="mt-4 space-y-4">
          <OrderTicketPanel symbol={symbol} price={quote.price} buyingPower={buyingPower} />
          <Fundamentals symbol={symbol} price={quote.price} />
        </div>
      </div>
    </div>
  );
}
