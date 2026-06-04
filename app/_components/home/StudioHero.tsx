import Image from "next/image";
import Link from "next/link";

import { HeroNameMotion } from "@/app/_components/home/HeroNameMotion";
import { HeroPortraitMotion } from "@/app/_components/home/HeroPortraitMotion";
import { KineticHeroFX } from "@/app/_components/home/KineticHeroFX";

const profileHeroImage = "/images/brand/akkapol-hero-transparent.png";

function StudioMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 88 52"
      className="h-8 w-14 text-zinc-100 md:h-9 md:w-16"
      fill="none"
    >
      <path d="M7 43 27 9h10L16 43H7Z" fill="currentColor" />
      <path d="M31 43 51 9h10L41 43H31Z" fill="currentColor" opacity="0.92" />
      <path d="M47 43 67 9h10L58 43H47Z" fill="currentColor" opacity="0.88" />
      <path d="M34 31h25" stroke="currentColor" strokeWidth="5" strokeLinecap="square" />
      <path d="M59 18 78 43" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
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

function HeroSystemMap() {
  return (
    <div
      aria-hidden="true"
      className="ak-system-map pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-[56%] overflow-hidden lg:block"
    >
      <svg
        viewBox="0 0 820 760"
        className="absolute right-0 top-20 z-0 h-[74%] w-full text-amber-300/35 opacity-60"
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
            <stop offset="0" stopColor="#8bd8dc" stopOpacity="0" />
            <stop offset="0.28" stopColor="#8bd8dc" stopOpacity="0.78" />
            <stop offset="0.56" stopColor="#f6b51e" stopOpacity="0.82" />
            <stop offset="0.74" stopColor="#fff7d6" stopOpacity="0.62" />
            <stop offset="1" stopColor="#f6b51e" stopOpacity="0" />
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

      <div className="absolute left-[8%] top-[42%] z-10 max-w-28 text-right opacity-75">
        <p className="ak-type-label text-cyan-100/60">CLARIFY</p>
        <p className="mt-1 text-xs leading-4 text-zinc-600">Understand goals, constraints, context</p>
      </div>
      <div className="absolute left-[10%] top-[55%] z-10 max-w-28 text-right opacity-70">
        <p className="ak-type-label text-cyan-100/55">DESIGN</p>
        <p className="mt-1 text-xs leading-4 text-zinc-600">Map systems and workflows</p>
      </div>
      <div className="absolute right-[10%] top-[20%] z-10 max-w-48 border-l border-white/10 pl-4 opacity-80">
        <p className="ak-type-label text-zinc-300">AMBIGUOUS INPUT</p>
        <p className="mt-1 text-xs leading-4 text-zinc-600">Unclear, scattered, hard to scale</p>
      </div>
      <div className="absolute right-[20%] top-[38%] z-10 max-w-40 opacity-75">
        <p className="ak-type-label text-zinc-300">BUILD</p>
        <p className="mt-1 text-xs leading-4 text-zinc-600">Create intelligent tools and automations</p>
      </div>
      <div className="absolute right-[7%] top-[55%] z-10 max-w-36 opacity-70">
        <p className="ak-type-label text-zinc-300">OPERATE</p>
        <p className="mt-1 text-xs leading-4 text-zinc-600">Run, refine, and evolve systems</p>
      </div>
      <div className="absolute right-[2%] top-[47%] z-10 flex items-center gap-4 text-amber-300/85">
        <span className="h-px w-10 bg-amber-300/55" />
        <ArrowUpRight className="h-5 w-5" />
        <p className="ak-type-label">
          ELEGANT SYSTEMS.
          <br />
          REAL RESULTS.
        </p>
      </div>
    </div>
  );
}

export function StudioHero({ email }: { email: string }) {
  const ctaFocus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/85 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]";

  return (
    <section
      id="top"
      className="relative z-10 min-h-[100svh] overflow-hidden bg-[#070707] px-6 pb-0 pt-6 md:px-10 md:pb-[13.5rem] lg:px-14 xl:px-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_63%_24%,rgba(255,255,255,0.065),transparent_28%),radial-gradient(ellipse_at_19%_18%,rgba(246,181,30,0.07),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:100%_100%,100%_100%,74px_74px,74px_74px] opacity-80 [mask-image:linear-gradient(to_bottom,black,black_76%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,transparent_0,transparent_22%,rgba(7,7,7,0.55)_64%,#070707_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[36%] bg-gradient-to-r from-[#070707] via-[#070707]/92 to-transparent" />
      <KineticHeroFX />
      <HeroSystemMap />

      <header className="relative z-30 flex items-start justify-between gap-5">
        <Link href="#top" className={`group flex items-center gap-5 text-zinc-100 ${ctaFocus}`}>
          <StudioMark />
          <span className="h-8 w-px bg-white/18" aria-hidden="true" />
          <span className="ak-type-label flex items-center gap-4 text-zinc-400 transition group-hover:text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(246,181,30,0.45)]" aria-hidden="true" />
            SYSTEMS STUDIO
          </span>
        </Link>

        <div className="hidden min-w-[25rem] justify-end md:flex">
          <div className="relative border-t border-r border-white/16 px-8 py-4 text-right">
            <span className="absolute -left-1.5 top-3 h-2 w-2 rounded-full bg-amber-300" />
            <p className="ak-type-label text-zinc-500">SYSTEMS THINKER • BUILDER • OPERATOR</p>
          </div>
        </div>
      </header>

      <div className="relative z-20 grid min-h-[calc(100svh-18rem)] items-center pt-12 lg:grid-cols-[0.48fr_0.52fr] lg:pt-5">
        <div className="ak-hero-copy relative z-20">
          <HeroNameMotion>
            AKKAPOL
            <span className="block">KUMPAPUG</span>
          </HeroNameMotion>

          <div className="mt-6 flex max-w-[23rem] items-center gap-3 text-amber-300">
            <span className="h-px flex-1 bg-amber-300" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full border border-amber-300 bg-[#070707] shadow-[0_0_18px_rgba(246,181,30,0.25)]" />
          </div>

          <p className="ak-type-title-hero mt-5 text-amber-300">
            Creative AI Systems Builder
          </p>
          <p className="ak-type-body-hero mt-5 max-w-full text-zinc-300">
            Systems, workflows, and intelligent tools
            <br className="hidden sm:block" /> for real business operations
          </p>

          <div className="ak-hero-actions mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/cv"
              className={`group/cta inline-flex h-14 w-full min-w-0 box-border items-center justify-between rounded-[4px] border border-amber-300 bg-amber-300 px-8 text-base font-medium text-zinc-950 shadow-[0_0_42px_rgba(246,181,30,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-[0_0_54px_rgba(246,181,30,0.28)] sm:h-16 sm:w-auto sm:min-w-52 sm:justify-center sm:gap-8 ${ctaFocus}`}
            >
              View CV
              <ArrowUpRight className="h-6 w-6 transition duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </Link>
            <a
              data-hero-cta="conversation"
              href={`mailto:${email}`}
              className={`group/cta inline-flex h-14 w-full min-w-0 box-border items-center justify-between rounded-[4px] border border-white/25 bg-black/25 px-8 text-base font-medium text-zinc-200 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.065] hover:text-white sm:h-16 sm:w-auto sm:min-w-64 sm:justify-center sm:gap-8 ${ctaFocus}`}
            >
              Start a conversation
              <ArrowUpRight className="h-6 w-6 transition duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </a>
          </div>

          <div
            aria-hidden="true"
            className="ak-scroll-cue mt-9 hidden h-10 items-center gap-4 text-amber-300/75 sm:flex"
          >
            <span className="relative h-10 w-px overflow-hidden bg-white/12">
              <span className="ak-scroll-cue-marker absolute left-0 top-0 h-4 w-px bg-amber-300" />
            </span>
            <span className="h-px w-24 bg-gradient-to-r from-amber-300/70 via-cyan-100/35 to-transparent" />
          </div>
        </div>

        <HeroPortraitMotion className="ak-hero-portrait-shell pointer-events-none absolute bottom-0 right-0 z-20 hidden h-[80svh] w-[55vw] max-w-[58rem] lg:block">
          <div className="absolute inset-x-12 bottom-0 h-44 bg-gradient-to-t from-[#070707] via-[#070707]/70 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#070707] to-transparent" />
          <Image
            src={profileHeroImage}
            alt="Akkapol Kumpapug portrait"
            fill
            preload
            sizes="(min-width: 1024px) 55vw, 0vw"
            style={{ transform: "translate3d(0, 0.75rem, 0) scale(1.02)", transformOrigin: "bottom right" }}
            className="ak-hero-portrait object-contain object-bottom opacity-95"
          />
        </HeroPortraitMotion>
      </div>

      <div
        data-hero-panel="what-i-do"
        className="relative z-30 mt-8 overflow-hidden border-t border-white/16 bg-[#0a0a0a]/94 px-6 py-5 shadow-[0_-30px_90px_rgba(0,0,0,0.65)] backdrop-blur md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:px-14 xl:px-20"
      >
        <div className="absolute -top-[1px] left-0 right-0 h-8 border-t border-white/18 [clip-path:polygon(0_72%,2.5%_72%,4.5%_0,94.5%_0,97%_72%,100%_72%,100%_100%,0_100%)]" />
        <div className="absolute left-1/2 top-2 h-1 w-28 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-amber-300 to-white/20" />
        <div className="relative mx-auto grid w-full max-w-[92rem] gap-8 md:grid-cols-[0.43fr_0.31fr_0.26fr] md:items-end">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <p className="ak-type-label text-amber-300">WHAT I DO</p>
              <span className="h-px flex-1 bg-white/18" />
            </div>
            <h2 className="ak-type-title-panel text-zinc-100">
              I build systems that
              <span className="block">run your business.</span>
            </h2>
          </div>
          <p className="ak-type-body w-full max-w-[22rem] text-zinc-400 [overflow-wrap:anywhere] md:col-start-2 md:max-w-md">
            I partner with founders and operators to turn ambiguity into structure,
            designing and building systems that streamline operations and scale with
            confidence.
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
