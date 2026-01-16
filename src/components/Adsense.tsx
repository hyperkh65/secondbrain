"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

type AdUnitProps = {
  className?: string;
  style?: React.CSSProperties;
  client?: string; // 기본값은 네 client로 고정해도 됨
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
};

export default function AdsenseUnit({
  className,
  style,
  client = "ca-pub-8940400388075870",
  slot,
  format = "auto",
  responsive = true,
}: AdUnitProps) {
  useEffect(() => {
    try {
      // Google Ads 스크립트 로딩 후 push
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // 광고 차단기/로딩 타이밍 이슈는 무시
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style ?? { display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : undefined}
      />
    </div>
  );
}
