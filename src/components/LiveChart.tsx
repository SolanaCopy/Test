"use client";

import React, { useEffect, useRef } from "react";

const LiveChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          // Pas het symbool hieronder aan naar het juiste symbool van PancakeSwap Futures
          symbol: "PANCAKE:BTCUSD", 
          interval: "1",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: true,
          save_image: false,
          container_id: "tradingview_chart"
        });
      }
    };
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      id="tradingview_chart"
      ref={containerRef}
      style={{ height: "500px", width: "100%" }}
    />
  );
};

export default LiveChart;
