import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SecondBrain Pro — 붙여넣기만 하면 정리되는 AI 노트",
  description:
    "회의록·강의·메시지·이메일… 흩어진 텍스트를 붙여넣으면 요약·액션·키워드로 정리해주는 로컬-퍼스트 AI 노트앱.",
  metadataBase: new URL("https://secondbrain.pro"),
  openGraph: {
    title: "SecondBrain Pro",
    description:
      "붙여넣기만 하면 요약·액션·키워드로 정리되는 로컬-퍼스트 AI 노트앱",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#070712] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
