"use client";
import React, { useEffect, useRef, memo } from "react";

type Props = {
  tickr: string;
};

function TradingViewWidget({ tickr }: Props) {
  const container = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "colorTheme": "dark",
          "displayMode": "single",
          "isTransparent": false,
          "locale": "en",
          "interval": "1D",
          "disableInterval": false,
          "width": "100%",
          "height": 450,
          "symbol": "NASDAQ:${tickr}",
          "showIntervalTabs": true
        }`;
    // @ts-ignore
    container.current.appendChild(script);
  }, []);

  return (
    <div className='tradingview-widget-container' ref={container}>
      <div className='tradingview-widget-container__widget'></div>
      <div className='tradingview-widget-copyright'>
        <a
          href='https://www.tradingview.com/symbols/NASDAQ-AAPL/technicals/'
          rel='noopener nofollow'
          target='_blank'
        ></a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
