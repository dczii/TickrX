"use client";
import React, { useEffect, useRef, memo } from "react";

function TVChart({ tickr }: { tickr: string }) {
  const container = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "allow_symbol_change": false,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "D",
          "locale": "en",
          "save_image": false,
          "style": "1",
          "symbol": "NASDAQ:${tickr}",
          "theme": "dark",
          "timezone": "Etc/UTC",
          "backgroundColor": "#0F0F0F",
          "gridColor": "rgba(242, 242, 242, 0.06)",
          "watchlist": [],
          "withdateranges": true,
          "range": "YTD",
          "compareSymbols": [],
          "show_popup_button": true,
          "popup_height": "650",
          "popup_width": "1000",
          "studies": [],
          "autosize": true
        }`;
    // @ts-ignore
    container.current.appendChild(script);
  }, []);

  return (
    <div
      className='tradingview-widget-container'
      ref={container}
      style={{ height: "350px", width: "100%" }}
    >
      <div
        className='tradingview-widget-container__widget'
        style={{ height: "350px", width: "100%" }}
      ></div>
    </div>
  );
}

export default memo(TVChart);
