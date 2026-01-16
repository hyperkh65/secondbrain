import "./globals.css";

export const metadata = {
  title: "SecondBrain Pro — Paste-to-Productivity",
  description: "붙여넣는 순간 메모가 요약·액션·키워드로 정리되는 로컬-퍼스트 AI 노트앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#070712] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
