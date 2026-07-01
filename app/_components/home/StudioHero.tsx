import Image from "next/image";
import Link from "next/link";

import { ThemeModeToggle } from "@/app/_components/ThemeModeToggle";
import { HeroNameMotion } from "@/app/_components/home/HeroNameMotion";
import { HeroPortraitMotion } from "@/app/_components/home/HeroPortraitMotion";
import { KineticHeroFX } from "@/app/_components/home/KineticHeroFX";
import type { HomeContent, Locale } from "@/app/_data/brand";
import { useChatState } from "@/lib/ChatContext";

const profileHeroImage = "/images/brand/akkapol-hero-transparent.png";
type HeroCopy = HomeContent["hero"];

function StudioMark() {
  return (
    <svg
      aria-label="Akkapol Systems logo"
      viewBox="0 0 520 200"
      className="h-9 w-auto fill-current md:h-10"
    >
      <path d="M25 175 85 25 145 175Z" />
      <path d="M155 25h60l60 150h-60Z" />
      <path d="M295 25h55v150h-55Z" />
      <path d="M370 25h130l-130 130Z" />
      <path d="M370 95 500 175H370Z" />
    </svg>
  );
}

function ArrowUpRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function HeroSystemMap({ labels }: { labels: HeroCopy["mapLabels"] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-[56%] overflow-hidden lg:block"
    >
      <svg
        viewBox="0 0 820 760"
        className="ak-system-map ak-text-accent absolute right-0 top-20 z-0 h-[74%] w-full opacity-[0.46]"
        fill="none"
      >
        <defs>
          <linearGradient id="traceAmber" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.46" stopColor="currentColor" stopOpacity="0.72" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="traceCyan" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8bd8dc" stopOpacity="0.06" />
            <stop offset="0.65" stopColor="#8bd8dc" stopOpacity="0.56" />
            <stop offset="1" stopColor="#8bd8dc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tracePulse" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#0f5dff" stopOpacity="0" />
            <stop offset="0.16" stopColor="#0f5dff" stopOpacity="0.42" />
            <stop offset="0.34" stopColor="#29d8ff" stopOpacity="0.98" />
            <stop offset="0.5" stopColor="#c8fbff" stopOpacity="1" />
            <stop offset="0.64" stopColor="#ffe15c" stopOpacity="0.98" />
            <stop offset="0.78" stopColor="#ffbb1c" stopOpacity="0.82" />
            <stop offset="1" stopColor="#ffbb1c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="ak-system-pipeline-base"
          d="M75 372h150c34 0 62-28 62-62V202c0-35 28-63 63-63h145c42 0 76 34 76 76v31"
          stroke="url(#traceCyan)"
          strokeWidth="1.4"
        />
        <path
          className="ak-system-pipeline-base"
          d="M310 330h182c44 0 80-36 80-80v-16c0-40 32-72 72-72h96"
          stroke="url(#traceAmber)"
          strokeWidth="1.5"
        />
        <path
          className="ak-system-pipeline-base"
          d="M420 410h118c48 0 87 39 87 87v95"
          stroke="url(#traceAmber)"
          strokeWidth="2"
        />
        <path
          className="ak-system-pipeline-base"
          d="M300 478h198c35 0 64 29 64 64v48c0 25 20 45 45 45h126"
          stroke="url(#traceCyan)"
          strokeWidth="1.2"
        />
        <g className="ak-system-pipeline-pulses" stroke="url(#tracePulse)" strokeLinecap="round">
          <path
            className="ak-system-pipeline-pulse ak-system-pipeline-pulse-a"
            d="M75 372h150c34 0 62-28 62-62V202c0-35 28-63 63-63h145c42 0 76 34 76 76v31"
            pathLength={1}
          />
          <path
            className="ak-system-pipeline-pulse ak-system-pipeline-pulse-b"
            d="M310 330h182c44 0 80-36 80-80v-16c0-40 32-72 72-72h96"
            pathLength={1}
          />
          <path
            className="ak-system-pipeline-pulse ak-system-pipeline-pulse-c"
            d="M420 410h118c48 0 87 39 87 87v95"
            pathLength={1}
          />
          <path
            className="ak-system-pipeline-pulse ak-system-pipeline-pulse-d"
            d="M300 478h198c35 0 64 29 64 64v48c0 25 20 45 45 45h126"
            pathLength={1}
          />
        </g>
        <path d="M470 126c36 20 68 52 94 95" stroke="#fff" strokeDasharray="4 8" strokeOpacity="0.14" />
        <path d="M540 326c66-4 118 15 156 56" stroke="#fff" strokeDasharray="4 8" strokeOpacity="0.12" />
        <rect x="360" y="116" width="82" height="55" rx="6" stroke="#ffffff" strokeOpacity="0.12" />
        <rect x="594" y="146" width="112" height="74" rx="8" stroke="#ffffff" strokeOpacity="0.13" strokeDasharray="5 6" />
        <rect x="612" y="432" width="86" height="60" rx="8" stroke="#ffffff" strokeOpacity="0.12" />
        <rect x="480" y="560" width="74" height="55" rx="7" stroke="#ffffff" strokeOpacity="0.1" />
        <circle className="ak-system-node" cx="287" cy="330" r="4" fill="#8bd8dc" opacity="0.8" />
        <circle className="ak-system-node" cx="626" cy="497" r="4" fill="#f6b51e" opacity="0.88" />
        <circle className="ak-system-node" cx="738" cy="162" r="4" fill="#f6b51e" opacity="0.72" />
        <g stroke="#ffffff" strokeOpacity="0.055">
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={`v-${index}`} d={`M${130 + index * 64} 80v610`} />
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={`h-${index}`} d={`M95 ${120 + index * 76}h660`} />
          ))}
        </g>
      </svg>

      <div className="absolute left-[8%] top-[42%] z-10 max-w-28 text-right">
        <p className="ak-type-label ak-text-signal">{labels.clarify}</p>
        <p className="ak-text-muted mt-1 text-xs leading-4">{labels.clarifyBody}</p>
      </div>
      <div className="absolute left-[10%] top-[55%] z-10 max-w-28 text-right">
        <p className="ak-type-label ak-text-signal">{labels.design}</p>
        <p className="ak-text-muted mt-1 text-xs leading-4">{labels.designBody}</p>
      </div>
      <div className="absolute right-[10%] top-[20%] z-10 max-w-48 border-l border-white/10 pl-4">
        <p className="ak-type-label ak-text-body">{labels.ambiguous}</p>
        <p className="ak-text-muted mt-1 text-xs leading-4">{labels.ambiguousBody}</p>
      </div>
      <div className="absolute right-[20%] top-[38%] z-10 max-w-40">
        <p className="ak-type-label ak-text-body">{labels.build}</p>
        <p className="ak-text-muted mt-1 text-xs leading-4">{labels.buildBody}</p>
      </div>
      <div className="absolute right-[7%] top-[55%] z-10 max-w-36">
        <p className="ak-type-label ak-text-body">{labels.operate}</p>
        <p className="ak-text-muted mt-1 text-xs leading-4">{labels.operateBody}</p>
      </div>
      <div className="ak-text-accent absolute right-[2%] top-[47%] z-10 flex items-center gap-4">
        <span className="h-px w-10 bg-amber-300/55" />
        <ArrowUpRight className="h-5 w-5" />
        <p className="ak-type-label">
          {labels.result[0]}
          <br />
          {labels.result[1]}
        </p>
      </div>
    </div>
  );
}

export function StudioHero({
  copy,
  locale,
}: {
  copy: HeroCopy;
  locale: Locale;
}) {
  const { setOpen } = useChatState();
  const ctaFocus = "ak-focus-ring";
  const alternateLocaleHref = locale === "th" ? "/" : "/th";
  const currentLocaleLabel = locale === "th" ? "TH" : "EN";
  const alternateLocaleLabel = locale === "th" ? "EN" : "TH";

  return (
    <section
      id="top"
      className="ak-studio-hero relative z-10 min-h-[100svh] overflow-hidden px-6 pb-0 pt-6 md:px-10 md:pb-[13.5rem] lg:px-14 xl:px-16"
    >
      <div className="ak-hero-grid pointer-events-none absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,black,black_76%,transparent_100%)]" />
      <div className="ak-hero-vignette pointer-events-none absolute inset-0" />
      <div className="ak-hero-left-fade pointer-events-none absolute inset-y-0 left-0 w-[36%]" />
      <KineticHeroFX />
      <HeroSystemMap labels={copy.mapLabels} />

      <header className="relative z-30 flex items-start justify-between gap-5">
        <Link href="#top" className={`ak-text-primary group flex items-center gap-5 ${ctaFocus}`}>
          <StudioMark />
          <span className="h-8 w-px bg-white/18" aria-hidden="true" />
          <span className="ak-type-label ak-text-muted flex items-center gap-4 transition group-hover:text-[var(--ak-color-fg)]">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(246,181,30,0.45)]" aria-hidden="true" />
            {copy.brand}
          </span>
        </Link>

        <div className="flex shrink-0 items-start justify-end gap-4">
          <nav
            className="ak-locale-switch"
            aria-label="Language"
          >
            <span aria-current="true">{currentLocaleLabel}</span>
            <Link href={alternateLocaleHref} className={ctaFocus}>
              {alternateLocaleLabel}
            </Link>
          </nav>
          <ThemeModeToggle />
          <div className="ak-hero-status-card relative mt-14 hidden min-w-[25rem] border-t border-r border-white/16 px-8 py-4 text-right xl:mt-16 lg:block">
            <span className="absolute -left-1.5 top-3 h-2 w-2 rounded-full bg-amber-300" />
            <p className="ak-type-label ak-text-muted">{copy.status}</p>
          </div>
        </div>
      </header>

      <div className="relative z-20 grid min-h-[calc(100svh-18rem)] items-center pt-12 lg:grid-cols-[0.48fr_0.52fr] lg:pt-5">
        <div className="ak-hero-copy relative z-20">
          <HeroNameMotion>
            AKKAPOL
            <span className="block">KUMPAPUG</span>
          </HeroNameMotion>

          <div className="ak-text-accent mt-6 flex max-w-[23rem] items-center gap-3">
            <span className="h-px flex-1 bg-amber-300" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full border border-amber-300 bg-[#070707] shadow-[0_0_18px_rgba(246,181,30,0.25)]" />
          </div>

          <p className="ak-type-title-hero ak-text-accent mt-5">
            {copy.role}
          </p>
          <p className="ak-type-body-hero ak-text-body mt-5 max-w-full">
            {copy.body[0]}
            <br className="hidden sm:block" /> {copy.body[1]}
          </p>

          <div className="ak-hero-actions mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#work"
              className={`ak-cta ak-cta-primary ${ctaFocus}`}
            >
              {copy.primaryCta}
              <ArrowUpRight className="ak-cta-icon" />
            </Link>
            <button
              data-hero-cta="conversation"
              onClick={() => setOpen(true)}
              className={`ak-cta ak-cta-secondary ${ctaFocus}`}
            >
              {copy.secondaryCta}
              <ArrowUpRight className="ak-cta-icon" />
            </button>
          </div>

          <div
            aria-hidden="true"
            className="ak-scroll-cue ak-text-accent mt-9 hidden h-10 items-center gap-4 sm:flex"
          >
            <span className="relative h-10 w-px overflow-hidden bg-white/12">
              <span className="ak-scroll-cue-marker absolute left-0 top-0 h-4 w-px bg-amber-300" />
            </span>
            <span className="h-px w-24 bg-gradient-to-r from-amber-300/70 via-cyan-100/35 to-transparent" />
          </div>
        </div>

        <HeroPortraitMotion className="ak-hero-portrait-shell pointer-events-none absolute bottom-0 right-0 z-20 hidden h-[70svh] w-[55vw] max-w-[58rem] lg:block">
          <div className="ak-hero-portrait-position absolute inset-0 translate-y-10 xl:translate-y-12">
            <div className="ak-portrait-bottom-fade absolute inset-x-12 bottom-0 h-44" />
            <div className="ak-portrait-side-fade absolute inset-y-0 right-0 w-40" />
            <Image
              src={profileHeroImage}
              alt="Akkapol Kumpapug portrait"
              fill
              preload
              sizes="(min-width: 1024px) 55vw, 0vw"
              style={{ transform: "translate3d(0, 0.75rem, 0) scale(1.02)", transformOrigin: "bottom right" }}
              className="ak-hero-portrait object-contain object-bottom opacity-95"
            />
          </div>
        </HeroPortraitMotion>
      </div>

      <div
        data-hero-panel="what-i-do"
        className="ak-hero-bottom-panel relative z-30 mt-8 overflow-hidden border-t border-white/16 px-6 py-5 backdrop-blur md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:px-14 xl:px-20"
      >
        <div className="absolute -top-[1px] left-0 right-0 h-8 border-t border-white/18 [clip-path:polygon(0_72%,2.5%_72%,4.5%_0,94.5%_0,97%_72%,100%_72%,100%_100%,0_100%)]" />
        <div className="absolute left-1/2 top-2 h-1 w-28 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-amber-300 to-white/20" />
        <div className="relative mx-auto grid w-full max-w-[92rem] gap-8 md:grid-cols-[0.43fr_0.31fr_0.26fr] md:items-end">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <p className="ak-type-label ak-text-accent">{copy.bottomEyebrow}</p>
              <span className="h-px flex-1 bg-white/18" />
            </div>
            <h2 className="ak-type-title-panel ak-text-primary">
              {copy.bottomTitle[0]}
              <span className="block">{copy.bottomTitle[1]}</span>
            </h2>
          </div>
          <p className="ak-type-body ak-text-muted w-full max-w-[22rem] [overflow-wrap:anywhere] md:col-start-2 md:max-w-md">
            {copy.bottomBody}
          </p>
          <div className="hidden min-h-32 overflow-hidden md:block">
            <div className="relative ml-auto h-40 max-w-md opacity-65">
              <div className="absolute inset-0 border border-amber-300/16 [transform:skewY(-22deg)_rotateX(62deg)]" />
              <div className="absolute inset-x-10 top-10 h-px bg-amber-300/35" />
              <div className="absolute bottom-9 left-16 h-28 w-px bg-amber-300/24" />
              <div className="absolute bottom-9 left-16 h-px w-44 bg-amber-300/24" />
              <div className="absolute bottom-16 right-16 h-24 w-px bg-white/12" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
