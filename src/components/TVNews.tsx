"use client";

import React, { useEffect, useRef, memo } from "react";

type Props = {
  tickr: string;
};

function TVNews({ tickr }: Props) {
  const container = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "displayMode": "regular",
          "feedMode": "symbol",
          "symbol": "NASDAQ:${tickr}",
          "colorTheme": "dark",
          "isTransparent": false,
          "locale": "en",
          "width": "100%",
          "height": 550
        }`;
    // @ts-ignore
    container.current.appendChild(script);
  }, []);

  return (
    <div className='tradingview-widget-container' ref={container}>
      <div className='tradingview-widget-container__widget'></div>
      <div className='tradingview-widget-copyright'>
        <a
          href='https://www.tradingview.com/news/top-providers/tradingview/'
          rel='noopener nofollow'
          target='_blank'
        ></a>
      </div>
    </div>
  );
}

export default memo(TVNews);
