"use client";
import { useEffect, useRef, memo } from "react";

interface TVChartProps {
  tickr: string;
  /** TradingView interval, e.g. "1" "5" "60" "D" "W". */
  interval?: string;
  height?: number;
}

function TVChart({ tickr, interval = "D", height = 350 }: TVChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";
    node.appendChild(widget);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: false,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval,
      locale: "en",
      save_image: false,
      style: "1",
      symbol: `NASDAQ:${tickr}`,
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "#0A0B0D",
      gridColor: "rgba(242, 242, 242, 0.06)",
      watchlist: [],
      withdateranges: true,
      range: "YTD",
      compareSymbols: [],
      show_popup_button: true,
      popup_height: "650",
      popup_width: "1000",
      studies: [],
      autosize: true,
    });
    node.appendChild(script);

    return () => {
      node.replaceChildren();
    };
  }, [tickr, interval]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height, width: "100%" }}
    />
  );
}

export default memo(TVChart);
