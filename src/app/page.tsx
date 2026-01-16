"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
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

  if (href) {
    const disabled = href === "#";
    return (
      <a
        href={disabled ? undefined : href}
        onClick={(e) => disabled && e.preventDefault()}
        className={cn(base, sizing, style, disabled && "opacity-40 cursor-not-allowed")}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={cn(base, sizing, style)} onClick={onClick}>
      {children}
    </button>
  );
}

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <p className="text-sm font-semibold text-white">{title}</p>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
          >
            닫기
          </button>
        </div>
        <div className="px-6 py-5 text-sm text-white/80">{children}</div>
      </div>
    </div>
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

export default function Page() {
  const [open, setOpen] = useState(false);

  const platform = useMemo(() => detectPlatform(), []);
  const primary = platform ? DOWNLOADS[platform] : DOWNLOADS.mac;

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
            {/* Brand Icon */}
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
            <a className="hover:text-white" href="#trust">
              보안
            </a>
            <a className="hover:text-white" href="#download">
              다운로드
            </a>
          </nav>

          <Button variant="secondary" onClick={() => setOpen(true)}>
            다운로드
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Tag>✨ 붙여넣기 기반</Tag>
            <Tag>🔒 로컬 저장</Tag>
            <Tag>⚡ 정리 자동화</Tag>
            <Tag>🧠 결과물 중심</Tag>
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-6xl">
            붙여넣는 순간,
            <br />
            <span className="text-white/70">메모가 “결과물”로 바뀐다</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            회의록, 강의, 메시지, 이메일…
            <br />
            흩어진 텍스트를 복붙하면 <span className="text-white">요약 · 액션 · 키워드</span>로
            깔끔하게 정리해줘요.
            <br />
            폴더/태그 세팅 없이, 그냥 쓰는 노트앱.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={primary.href} size="lg">
              {primary.label} <span className="text-white/70">↘</span>
              <span className="ml-1 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-[11px] text-zinc-800">
                {primary.chip}
              </span>
            </Button>

            <Button variant="secondary" onClick={() => setOpen(true)} size="lg">
              OS 선택
            </Button>

            <Button variant="ghost" href="#features" size="lg">
              기능 보기 →
            </Button>
          </div>

          <p className="mt-4 text-xs text-white/50">
            * 다운로드 링크는 아직 준비중입니다. (나중에 R2/S3로 연결)
          </p>

          {/* Demo Panel */}
          <div className="mt-12 w-full">
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
      <section id="features" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-white/70">
            FEATURES
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            정리의 단계를 줄이면, 집중이 늘어난다
          </h2>
          <p className="mt-4 text-base text-white/70">
            메모를 “쌓는 것”보다{" "}
            <span className="text-white">꺼내 쓰기 좋은 상태</span>로 바꾸는 데 집중했어요.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon="🧩"
            title="액션 아이템 자동 추출"
            desc="해야 할 일을 텍스트에서 뽑아 실행 가능한 리스트로 정리합니다."
          />
          <FeatureCard
            icon="🧠"
            title="요약 + 구조화 포맷"
            desc="그냥 요약이 아니라 ‘다시 보기 쉬운 문서’로 재구성합니다."
          />
          <FeatureCard
            icon="🔎"
            title="자연어로 검색"
            desc="키워드 몰라도 괜찮아요. 사람 말로 찾으면 됩니다."
          />
          <FeatureCard
            icon="💾"
            title="로컬-퍼스트 저장"
            desc="메모는 내 컴퓨터에 남습니다. 계정/클라우드 없이 가볍게."
          />
        </div>
      </section>

      {/* How */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-white/70">
            WORKFLOW
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            복붙만으로 정리 루틴을 만든다
          </h2>
          <p className="mt-4 text-base text-white/70">
            입력 → 정리 → 행동까지, 더 짧고 더 확실하게.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MiniStep step="STEP 01" title="복사" desc="어디서든 텍스트를 가져오세요." />
          <MiniStep step="STEP 02" title="붙여넣기" desc="세팅 없이 바로 입력합니다." />
          <MiniStep step="STEP 03" title="정리 완료" desc="요약·액션·키워드로 완성됩니다." />
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-white/70">
            TRUST
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            API 키는 안전하게, 내 데이터는 로컬에
          </h2>
          <p className="mt-4 text-base text-white/70">
            API 키는 앱 파일이 아니라{" "}
            <span className="text-white">운영체제 키체인</span>에 저장됩니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <p className="text-sm font-semibold">🔐 키 저장 방식</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              macOS는 Keychain, Windows는 Credential Manager에 저장됩니다.
              배포 파일에 키가 포함될 가능성을 구조적으로 차단합니다.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <p className="text-sm font-semibold">🧯 실수 방지 설계</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              민감정보가 로그/설정 파일로 남지 않도록 기본 설계를 안전하게 가져갑니다.
              내 키를 남이 쓰는 일은 없습니다.
            </p>
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
                랜딩 먼저, 배포는 곧 연결합니다
              </h3>
              <p className="mt-3 max-w-xl text-sm text-white/75">
                지금은 다운로드 버튼이 “준비중” 상태예요.
                <br />
                R2 연결이 끝나는 즉시 버튼이 활성화됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button href={primary.href}>{primary.label} ↘</Button>
              <Button variant="secondary" onClick={() => setOpen(true)}>
                다른 OS
              </Button>
            </div>
          </div>

          <p className="mt-5 text-xs text-white/55">
            * 나중에 Vercel 환경변수만 넣으면 다운로드가 바로 활성화돼요.
          </p>
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
              <a className="hover:text-white" href="#trust">
                Trust
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Download modal */}
      <Modal open={open} title="다운로드 선택" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          {(["mac", "windows"] as Platform[]).map((p) => {
            const d = DOWNLOADS[p];
            const disabled = d.href === "#";
            return (
              <a
                key={p}
                href={disabled ? undefined : d.href}
                onClick={(e) => disabled && e.preventDefault()}
                className={cn(
                  "flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10",
                  disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-black/20 text-xs text-white/80">
                    {d.chip}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{d.label}</p>
                    <p className="mt-1 text-xs text-white/60">{d.meta}</p>
                  </div>
                </div>

                <span className="text-white/70">{disabled ? "준비중" : "↘"}</span>
              </a>
            );
          })}

          <div className="pt-2 text-xs text-white/50">
            다운로드 링크는 나중에 R2 연결 후 활성화됩니다.
          </div>
        </div>
      </Modal>
    </main>
  );
}
