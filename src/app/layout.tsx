import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SecondBrain Pro — 붙여넣기만 하면 정리되는 AI 노트",
  description:
    "회의록·강의·메시지·이메일… 텍스트를 붙여넣으면 요약·액션·키워드로 자동 정리되는 로컬-퍼스트 AI 노트앱.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#070712] text-white antialiased">
        {/* ✅ AdSense script: 반드시 1회만 로딩 */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8940400388075870"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
