"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AdsenseUnit from "@/components/Adsense";

type Platform = "mac" | "windows";

function detectPlatform(): Platform | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac os") || ua.includes("macintosh")) return "mac";
  if (ua.includes("windows")) return "windows";
  return null;
}

const DOWNLOADS: Record<
  Platform,
  { label: string; href: string; meta: string; chip: string }
> = {
  mac: {
    label: "macOS 다운로드",
    href: process.env.NEXT_PUBLIC_DOWNLOAD_MAC ?? "#",
    meta: "ZIP · Apple Silicon & Intel",
    chip: "macOS",
  },
  windows: {
    label: "Windows 다운로드",
    href: process.env.NEXT_PUBLIC_DOWNLOAD_WIN ?? "#",
    meta: "EXE · Windows 10/11",
    chip: "Windows",
  },
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/25";
  const sizing = size === "lg" ? "px-6 py-3.5 text-sm" : "px-5 py-3 text-sm";
  const style =
    variant === "primary"
      ? "bg-white text-zinc-950 hover:bg-white/90"
      : variant === "secondary"
        ? "bg-white/10 text-white hover:bg-white/15 border border-white/15"
        : "text-white/70 hover:text-white";

  const disabledStyle = disabled ? "opacity-40 cursor-not-allowed" : "";

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        onClick={(e) => disabled && e.preventDefault()}
        className={cn(base, sizing, style, disabledStyle)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={cn(base, sizing, style, disabledStyle)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/7">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -right-28 -top-28 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
      </div>
    </div>
  );
}

function MiniStep({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <p className="text-xs font-semibold text-white/70">{step}</p>
      <p className="mt-2 text-lg font-semibold">{title}</p>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
    </div>
  );
}

/** ✅ 다운로드 광고 모달 (카운트다운 후 버튼 활성화) */
function DownloadAdModal({
  open,
  platform,
  href,
  onClose,
}: {
  open: boolean;
  platform: Platform;
  href: string;
  onClose: () => void;
}) {
  const [sec, setSec] = useState(5);

  useEffect(() => {
    if (!open) return;

    setSec(5);
    const t = setInterval(() => {
      setSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [open]);

  if (!open) return null;

  const ready = sec === 0;
  const isLinkReady = href !== "#";
  const finalReady = ready && isLinkReady;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image
                src="/logo.png"
                alt="SecondBrain Pro"
                width={36}
                height={36}
                className="h-9 w-9 object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">SecondBrain Pro 다운로드</p>
              <p className="mt-1 text-xs text-white/60">
                {platform === "mac" ? "macOS" : "Windows"} 설치 파일
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
          >
            닫기
          </button>
        </div>

        <div className="grid gap-5 px-6 py-6 md:grid-cols-[1fr_300px]">
          {/* Left content */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">
              {ready ? "준비 완료!" : `다운로드 준비 중… ${sec}s`}
            </p>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">
              설치 후 앱을 열고 <span className="text-white">API 키만 입력</span>하면 바로 요약/정리 기능을 사용할 수 있어요.
              <br />
              (API 키는 운영체제 키체인에 저장됩니다.)
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                href={finalReady ? href : undefined}
                disabled={!finalReady}
                size="lg"
              >
                {finalReady ? "다운로드 시작 ↘" : "잠시만…"}
              </Button>

              <Button variant="secondary" onClick={onClose} size="lg">
                돌아가기
              </Button>
            </div>

            {!isLinkReady && (
              <p className="mt-3 text-xs text-red-300/90">
                ⚠️ 아직 다운로드 링크가 연결되지 않았습니다. (환경변수로 연결하면 자동 활성화됩니다)
              </p>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-semibold text-white/70">TIP</p>
              <p className="mt-2 text-sm text-white/70">
                다운로드가 느리면, 나중에 <span className="text-white">Cloudflare R2</span>로 연결하면 더 안정적으로 받을 수 있어요.
              </p>
            </div>
          </div>

          {/* Right ad */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
            <p className="px-2 pb-2 text-[11px] text-white/50">Sponsored</p>
            {/* ✅ 300x600 고정 광고 */}
            <div className="grid place-items-center overflow-hidden rounded-2xl bg-black/20 p-2">
              <AdsenseUnit
                slot="7354479161"
                style={{ display: "inline-block", width: 300, height: 600 }}
                responsive={false}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4 text-xs text-white/50">
          광고는 서비스 운영을 위한 수익 모델이며, 기능 사용에는 영향을 주지 않습니다.
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("mac");

  const platform = useMemo(() => detectPlatform(), []);
  const primary = platform ? DOWNLOADS[platform] : DOWNLOADS.mac;

  function openDownload(p: Platform) {
    setSelectedPlatform(p);
    setDownloadOpen(true);
  }

  const selected = DOWNLOADS[selectedPlatform];

  return (
    <main className="min-h-screen bg-[#070712] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-250px] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute right-[-260px] top-[22%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[-240px] h-[560px] w-[560px] rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070712]/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image
                src="/logo.png"
                alt="SecondBrain Pro"
                width={36}
                height={36}
                className="h-9 w-9 object-cover"
                priority
              />
            </div>

            <div>
              <p className="text-sm font-semibold leading-none">SecondBrain Pro</p>
              <p className="mt-1 text-xs text-white/60">
                Paste → Summary · Actions · Keywords
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/75 md:flex">
            <a className="hover:text-white" href="#features">
              기능
            </a>
            <a className="hover:text-white" href="#how">
              사용법
            </a>
            <a className="hover:text-white" href="#apikey">
              API 키
            </a>
            <a className="hover:text-white" href="#download">
              다운로드
            </a>
          </nav>

          <Button variant="secondary" onClick={() => openDownload(primary.chip === "macOS" ? "mac" : "windows")}>
            다운로드
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:pt-20">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Tag>✨ 붙여넣기 기반</Tag>
            <Tag>🔒 로컬 저장</Tag>
            <Tag>⚡ 정리 자동화</Tag>
            <Tag>🧠 결과물 중심</Tag>
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-6xl">
            생각을 기록하는 속도,
            <br />
            <span className="text-white/70">정리하는 속도로 맞춘다</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            메모가 쌓이는 순간부터 “다시 보기 어렵다”가 시작돼요.
            <br />
            SecondBrain Pro는 복붙한 텍스트를 <span className="text-white">요약 · 액션 · 키워드</span>로 바꿔서,
            다시 꺼내 쓰기 쉬운 형태로 정리합니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={() => openDownload(platform ?? "mac")} size="lg">
              {primary.label} <span className="text-white/70">↘</span>
              <span className="ml-1 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-[11px] text-zinc-800">
                {primary.chip}
              </span>
            </Button>

            <Button variant="secondary" onClick={() => openDownload("mac")} size="lg">
              macOS
            </Button>
            <Button variant="secondary" onClick={() => openDownload("windows")} size="lg">
              Windows
            </Button>
          </div>

          {/* ✅ 상단 배너 광고 (반응형/데스크탑) */}
          <div className="mt-10 w-full">
            <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <p className="px-2 pb-2 text-[11px] text-white/50">Sponsored</p>

              {/* 데스크탑 970x90 */}
              <div className="hidden md:grid place-items-center">
                <AdsenseUnit
                  slot="1739739148"
                  style={{ display: "inline-block", width: 970, height: 90 }}
                  responsive={false}
                />
              </div>

              {/* 모바일 auto */}
              <div className="grid md:hidden place-items-center">
                <AdsenseUnit slot="6232969180" />
              </div>
            </div>
          </div>

          {/* Demo */}
          <div className="mt-10 w-full">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                </div>
                <p className="text-xs text-white/50">SecondBrain Pro · Summarize</p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs font-semibold text-white/70">입력</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    “금요일까지 API 문서 정리하고 디자인 시안 받아야 함.
                    월요일부터 QA 시작, 내일 15시 데일리.”
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs font-semibold text-white/70">출력</p>
                  <div className="mt-2 space-y-3 text-sm text-white/80">
                    <div>
                      <p className="font-semibold">핵심 요약</p>
                      <p className="text-white/70">
                        금요일까지 문서를 정리하고 시안을 확보해야 하며, 월요일부터 QA를 시작합니다.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">액션 아이템</p>
                      <ul className="list-disc pl-5 text-white/70">
                        <li>API 문서 정리 (금요일)</li>
                        <li>디자인 시안 요청</li>
                        <li>데일리(내일 15:00)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">키워드</p>
                      <p className="text-white/70">#문서 #QA #디자인 #데일리</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -bottom-28 right-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-white/70">FEATURES</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            정리는 “기능”이 아니라 “생활 루틴”이어야 한다
          </h2>
          <p className="mt-4 text-base text-white/70">
            보기 좋게 쌓는 노트가 아니라, <span className="text-white">바로 써먹는 결과물</span>로 바꿔줘요.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon="🧩"
            title="액션 아이템 자동 추출"
            desc="해야 할 일을 텍스트에서 뽑아 ‘바로 실행 가능한 리스트’로 변환합니다."
          />
          <FeatureCard
            icon="🧠"
            title="요약 + 구조화"
            desc="그냥 요약이 아니라 ‘다시 보기 쉬운 문서 형태’로 정리합니다."
          />
          <FeatureCard
            icon="🔎"
            title="자연어 검색"
            desc="키워드 몰라도 괜찮아요. 질문하듯 찾으면 됩니다."
          />
          <FeatureCard
            icon="💾"
            title="로컬-퍼스트 저장"
            desc="메모는 내 컴퓨터에 저장됩니다. 계정 없이도 가볍게."
          />
        </div>

        {/* ✅ 중간 반응형 광고 */}
        <div className="mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="px-2 pb-2 text-[11px] text-white/50">Sponsored</p>
            <AdsenseUnit slot="6232969180" />
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-white/70">WORKFLOW</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            복붙 → 정리 → 다음 행동
          </h2>
          <p className="mt-4 text-base text-white/70">
            입력이 끝나면, 정리는 자동으로 끝납니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MiniStep step="STEP 01" title="복사" desc="어디서든 텍스트를 가져오세요." />
          <MiniStep step="STEP 02" title="붙여넣기" desc="앱에 넣는 순간 정리가 시작돼요." />
          <MiniStep step="STEP 03" title="완성" desc="요약·액션·키워드로 결과물이 완성됩니다." />
        </div>
      </section>

      {/* API Key Guide */}
      <section id="apikey" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-white/80">API KEY GUIDE</p>
              <h3 className="mt-2 text-2xl font-bold">GPT / Gemini API 키 받는 방법</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                SecondBrain Pro는 “내 키로 내가 쓰는 방식”이에요.
                키는 앱 내부에 저장되지 않고 운영체제 키체인을 사용합니다.
              </p>
            </div>

            {/* ✅ 300x600 고정 광고(데스크탑) */}
            <div className="hidden lg:block">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-3">
                <p className="px-2 pb-2 text-[11px] text-white/50">Sponsored</p>
                <AdsenseUnit
                  slot="4238744126"
                  style={{ display: "inline-block", width: 300, height: 600 }}
                  responsive={false}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm font-semibold">OpenAI(GPT) 키 만들기</p>
              <ol className="mt-3 list-decimal pl-5 text-sm text-white/70 space-y-2">
                <li>OpenAI Platform 로그인</li>
                <li>Settings → API keys 메뉴 이동</li>
                <li>Create new secret key 생성 후 복사</li>
                <li>SecondBrain Pro 설정에서 GPT 키로 등록</li>
              </ol>
              <p className="mt-3 text-xs text-white/50">
                키는 한 번만 보여줄 수 있어요. 안전한 곳에 보관하세요.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm font-semibold">Gemini 키 만들기</p>
              <ol className="mt-3 list-decimal pl-5 text-sm text-white/70 space-y-2">
                <li>Google AI Studio 접속</li>
                <li>Get API key / API Keys 메뉴 이동</li>
                <li>Create API key 생성</li>
                <li>SecondBrain Pro 설정에서 Gemini 키로 등록</li>
              </ol>
              <p className="mt-3 text-xs text-white/50">
                무료 티어는 쿼터가 0으로 보일 수 있어요. 프로젝트/정책에 따라 달라질 수 있습니다.
              </p>
            </div>
          </div>

          {/* 모바일용 하단 광고 */}
          <div className="mt-8 lg:hidden">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <p className="px-2 pb-2 text-[11px] text-white/50">Sponsored</p>
              <AdsenseUnit slot="6232969180" />
            </div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="mx-auto max-w-6xl px-4 pb-24">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 via-white/5 to-fuchsia-500/15 p-8 backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-white/80">다운로드</p>
              <h3 className="mt-2 text-2xl font-bold">
                지금 설치하고, 오늘부터 정리 루틴을 바꿔보세요
              </h3>
              <p className="mt-3 max-w-xl text-sm text-white/75">
                설치 후 API 키만 등록하면 바로 사용할 수 있어요.
                노트는 로컬에 저장되고, 정리는 빠르게 끝납니다.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => openDownload(platform ?? "mac")}>
                {primary.label} ↘
              </Button>
              <Button variant="secondary" onClick={() => openDownload("mac")}>
                macOS
              </Button>
              <Button variant="secondary" onClick={() => openDownload("windows")}>
                Windows
              </Button>
            </div>
          </div>

          {/* ✅ 하단 데스크탑 728x90 */}
          <div className="mt-6 hidden md:grid place-items-center">
            <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <p className="px-2 pb-2 text-[11px] text-white/50">Sponsored</p>
              <AdsenseUnit
                slot="9071434254"
                style={{ display: "inline-block", width: 728, height: 90 }}
                responsive={false}
              />
            </div>
          </div>

          {/* ✅ 모바일 auto */}
          <div className="mt-6 grid md:hidden place-items-center">
            <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <p className="px-2 pb-2 text-[11px] text-white/50">Sponsored</p>
              <AdsenseUnit slot="6232969180" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-white/55">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} SecondBrain Pro</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-white" href="#download">
                Download
              </a>
              <a className="hover:text-white" href="#features">
                Features
              </a>
              <a className="hover:text-white" href="#apikey">
                API Key Guide
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ 다운로드 광고 모달 */}
      <DownloadAdModal
        open={downloadOpen}
        platform={selectedPlatform}
        href={selected.href}
        onClose={() => setDownloadOpen(false)}
      />
    </main>
  );
}
