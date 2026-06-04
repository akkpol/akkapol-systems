import Image from "next/image";
import type React from "react";
import { CvShareActions } from "@/app/_components/CvShareActions";
import {
  ScrollProgress,
  SystemRadar,
  WorkflowPreview,
  type WorkflowStage,
} from "@/app/_components/HomeMotion";
import { cv, cvMarkdown } from "@/app/_data/cv";
import type { IconName } from "@/app/_data/cv";

const profile = cv.profile;
const profileHeroImage = "/images/akkapol-profile-2026.png";
const currentFocus = cv.currentFocus;
const strengths = cv.strengths;

const workflowStages = [
  {
    id: "intake",
    step: "01",
    label: "Intake",
    title: "Capture the real request",
    description:
      "Customer requests are turned into structured cases with clear context, files, and ownership.",
    event: "customer_intake.submitted",
    guard: "Schema validation + signed asset URLs",
  },
  {
    id: "triage",
    step: "02",
    label: "AI Triage",
    title: "Clarify the work before execution",
    description:
      "AI helps identify intent, missing information, urgency, and quote readiness while people stay in control of the decision.",
    event: "case.triage.completed",
    guard: "Human review + confidence threshold",
  },
  {
    id: "quote",
    step: "03",
    label: "Quote",
    title: "Make every business step visible",
    description:
      "Quotes, payments, and approvals become easier to track through clear system steps instead of scattered chats or spreadsheets.",
    event: "quote.status.changed",
    guard: "Idempotent transition keys",
  },
  {
    id: "production",
    step: "04",
    label: "Production",
    title: "Expose the operational truth",
    description:
      "Operators, customers, and owners see one workflow timeline with handoffs, blockers, and status changes.",
    event: "production.stage.updated",
    guard: "Audit log + role-scoped access",
  },
] satisfies WorkflowStage[];

const skills = cv.skills;
const experience = cv.experience;
const education = cv.education;

function assertPortfolioData() {
  if (process.env.NODE_ENV === "production") return;

  const checks: Array<[boolean, string]> = [
    [
      profile.role === "AI Systems Builder & Problem Solver",
      "profile.role should match the latest resume",
    ],
    [profile.email.includes("@"), "profile.email should be a valid email-like string"],
    [currentFocus.length >= 5, "currentFocus should contain the latest focus areas"],
    [strengths.length >= 5, "strengths should contain at least 5 items"],
    [
      skills.every((skill) => skill.title && skill.items && skill.icon),
      "every skill needs title, items, and icon",
    ],
    [
      experience[0]?.title === "Independent AI Systems Developer & Consultant",
      "latest current position should be first",
    ],
    [
      experience.every((job) => job.points.length > 0),
      "every experience item needs at least one bullet point",
    ],
    [education.length >= 3, "education should contain at least 3 items"],
  ];

  for (const [condition, message] of checks) {
    if (!condition) {
      throw new Error(message);
    }
  }
}

assertPortfolioData();

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "arrow":
      return (
        <svg {...commonProps}>
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...commonProps}>
          <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
          <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
          <path d="m5 13 .7 1.8L7.5 15.5l-1.8.7L5 18l-.7-1.8-1.8-.7 1.8-.7L5 13Z" />
        </svg>
      );
    case "workflow":
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="6" height="6" rx="2" />
          <rect x="15" y="14" width="6" height="6" rx="2" />
          <path d="M9 7h3a4 4 0 0 1 4 4v3" />
          <path d="M12 11h4" />
        </svg>
      );
    case "code":
      return (
        <svg {...commonProps}>
          <path d="m9 18-6-6 6-6" />
          <path d="m15 6 6 6-6 6" />
        </svg>
      );
    case "database":
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
        </svg>
      );
    case "figma":
      return (
        <svg {...commonProps}>
          <path d="M12 12a4 4 0 1 1 4 4h-4v-4Z" />
          <path d="M8 20a4 4 0 0 0 4-4v-4H8a4 4 0 1 0 0 8Z" />
          <path d="M8 12h4V4H8a4 4 0 1 0 0 8Z" />
          <path d="M12 4h4a4 4 0 0 1 0 8h-4V4Z" />
        </svg>
      );
    case "brain":
      return (
        <svg {...commonProps}>
          <path d="M9 3a3 3 0 0 0-3 3v1a4 4 0 0 0 0 8v1a4 4 0 0 0 6 3.5" />
          <path d="M15 3a3 3 0 0 1 3 3v1a4 4 0 0 1 0 8v1a4 4 0 0 1-6 3.5" />
          <path d="M12 5v14" />
          <path d="M8 8h2" />
          <path d="M14 8h2" />
          <path d="M8 15h2" />
          <path d="M14 15h2" />
        </svg>
      );
    case "mail":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...commonProps}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z" />
        </svg>
      );
    case "map":
      return (
        <svg {...commonProps}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-amber-300/18 bg-amber-300/[0.055] px-3.5 py-2 text-sm text-zinc-200 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-sm font-medium uppercase text-amber-300/80">
        {eyebrow}
      </p>
      <h2 className="max-w-3xl text-3xl font-semibold text-white md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

function HeroProfileCard() {
  return (
    <div className="relative overflow-hidden border border-amber-300/22 bg-zinc-950 shadow-2xl shadow-black/50">
      <div className="absolute left-5 top-5 z-20 border border-amber-300/25 bg-black/55 px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-200 backdrop-blur">
        Systems online
      </div>
      <div className="absolute right-5 top-5 z-20 hidden text-right font-mono text-[0.68rem] uppercase tracking-[0.16em] text-zinc-500 sm:block">
        <p>Role</p>
        <p className="mt-2 max-w-32 text-zinc-200">{profile.role}</p>
      </div>
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={profileHeroImage}
          alt="Akkapol Kumpapug profile portrait in dark amber system style"
          fill
          preload
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover object-[50%_34%]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_28%,transparent,rgba(0,0,0,0.06)_36%,rgba(0,0,0,0.5)_100%)]" />
        <div className="absolute inset-0 ring-1 ring-inset ring-amber-300/10" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5 pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200">
          {profile.name}
        </p>
        <p className="mt-2 text-sm text-zinc-300">
          Automation · Integration · Intelligence
        </p>
      </div>
    </div>
  );
}

function HeroWorkflowStrip() {
  return (
    <div className="relative overflow-hidden border border-amber-300/18 bg-black/35 p-4 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="mb-4 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber-200">
        <span>Systems workflow</span>
        <span>State guarded</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {workflowStages.map((stage, index) => (
          <div
            key={stage.id}
            className="relative border border-white/10 bg-white/[0.035] p-3"
          >
            {index < workflowStages.length - 1 ? (
              <span className="absolute -right-3 top-1/2 hidden h-px w-3 bg-amber-300/50 sm:block" />
            ) : null}
            <p className="font-mono text-xs text-amber-200">{stage.step}</p>
            <p className="mt-2 text-sm font-semibold text-white">{stage.label}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{stage.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AkkapolPortfolioPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-zinc-100">
      <ScrollProgress />
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_35%),linear-gradient(to_right,rgba(251,191,36,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.04)_1px,transparent_1px)] bg-[size:100%_100%,72px_72px,72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-amber-300/50" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-white"
        >
          AKKAPOL
        </a>

        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400 md:flex">
          <a className="transition hover:text-amber-200" href="#about">
            About
          </a>
          <a className="transition hover:text-amber-200" href="#focus">
            Focus
          </a>
          <a className="transition hover:text-amber-200" href="#skills">
            Skills
          </a>
          <a className="transition hover:text-amber-200" href="#systems">
            Systems
          </a>
          <a className="transition hover:text-amber-200" href="#experience">
            Experience
          </a>
          <a className="transition hover:text-amber-200" href="#education">
            Education
          </a>
          <a className="transition hover:text-amber-200" href="#contact">
            Contact
          </a>
        </nav>
      </header>

      <section
        id="top"
        className="relative z-10 mx-auto grid min-h-[calc(100svh-64px)] max-w-7xl gap-7 px-6 pb-8 pt-4 md:grid-cols-[1.02fr_0.98fr] md:px-10 lg:gap-8"
      >
        <div className="flex flex-col justify-start pt-6 md:pt-10">
          <h1
            className="max-w-4xl text-[4rem] font-black uppercase leading-[0.78] text-white sm:text-[7.2rem] md:text-[8.4rem] lg:text-[9.2rem]"
          >
            AKKAPOL
            <span className="mt-5 block max-w-3xl text-3xl font-semibold normal-case leading-tight text-zinc-100 sm:text-4xl md:text-5xl">
              <span className="text-amber-300">AI-integrated</span> systems builder
              focused on solving real business problems with systems that actually get used.
            </span>
          </h1>

          <p
            className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg"
          >
            I design practical AI-assisted business systems that focus on solving real operational problems —
            turning messy workflows into clear, working solutions using automation, LLM tools, and production-ready systems.
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex min-h-12 items-center justify-center border border-amber-300 bg-amber-300 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-zinc-950 shadow-[0_0_34px_rgba(251,191,36,0.18)] transition hover:bg-amber-200"
            >
              Work with me
              <Icon
                name="arrow"
                className="ml-2 h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#systems"
              className="inline-flex min-h-12 items-center justify-center border border-amber-300/22 bg-white/[0.035] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 backdrop-blur transition hover:border-amber-300/45 hover:bg-amber-300/[0.08]"
            >
              Explore systems
            </a>
          </div>
        </div>

        <div
          className="relative flex min-h-[560px] flex-col justify-center gap-4"
        >
          <SystemRadar />
          <HeroProfileCard />
          <div>
            <HeroWorkflowStrip />
          </div>
        </div>

        <div
          className="grid gap-5 md:col-span-2 lg:grid-cols-[auto_1fr] lg:items-start"
        >
          <CvShareActions markdown={cvMarkdown} />
          <div className="flex flex-wrap gap-3">
            {strengths.map((item) => (
              <Badge key={item.title}>{item.title}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle
            eyebrow="Executive Summary"
            title="A practical profile built around execution, workflow design, and solving real business problems."
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-lg leading-9 text-zinc-300 shadow-2xl shadow-black/20 backdrop-blur">
            <p>{cv.summary}</p>
          </div>
        </div>
      </section>

      <section id="focus" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <SectionTitle
          eyebrow="Current Focus"
          title="Building 2026-ready AI-integrated business systems for real operations."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {currentFocus.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-zinc-300 backdrop-blur"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="skills" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <SectionTitle
          eyebrow="Core Competencies"
          title="A practical stack for AI-assisted systems, workflow automation, and production web delivery."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1.5"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-300/15 text-amber-200">
                <Icon name={skill.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{skill.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{skill.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="systems" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <SectionTitle
          eyebrow="System Operating Model"
          title="This portfolio reflects how I build systems: clear steps, clear signals, and smooth handoffs."
        />
        <WorkflowPreview stages={workflowStages} />
      </section>

      <section
        id="experience"
        className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10"
      >
        <SectionTitle
          eyebrow="Experience"
          title="Current role first: building AI systems, workflows, and practical solutions."
        />
        <div className="space-y-4">
          {experience.map((job) => (
            <div
              key={`${job.title}-${job.period}`}
              className="grid gap-6 rounded-lg border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:grid-cols-[0.8fr_1.2fr] md:p-8"
            >
              <div>
                <p className="text-sm font-medium text-amber-200">{job.period}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  {job.title}
                </h3>
                <p className="mt-2 text-zinc-400">{job.company}</p>
              </div>
              <ul className="space-y-3 text-zinc-300">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-7">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="education"
        className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10"
      >
        <SectionTitle
          eyebrow="Education"
          title="A technical foundation across data, production systems, web development, and electronics."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <div
              key={`${item.program}-${item.period}`}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-zinc-300 backdrop-blur"
            >
              <p className="font-semibold text-white">{item.program}</p>
              <p className="mt-1 text-zinc-400">
                {item.institution} · {item.period}
              </p>
              {item.description ? (
                <p className="mt-3 text-zinc-400">{item.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-12">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Icon name="brain" className="mb-6 h-10 w-10 text-amber-200" />
              <h2 className="text-4xl font-semibold text-white md:text-6xl">
                Let&apos;s turn business problems into practical AI-assisted systems.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Best fit: practical AI-assisted systems, customer workflows,
                process automation, and production-ready web platforms.
              </p>
              <div className="mt-8">
                <CvShareActions markdown={cvMarkdown} variant="contact" />
              </div>
            </div>

            <div className="flex flex-col justify-end gap-4 text-sm text-zinc-300">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 rounded-lg bg-black/30 p-4 transition hover:bg-black/45"
              >
                <Icon name="mail" className="h-5 w-5 text-amber-200" /> {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 rounded-lg bg-black/30 p-4 transition hover:bg-black/45"
              >
                <Icon name="phone" className="h-5 w-5 text-amber-200" /> {profile.phone}
              </a>
              <a
                href={`https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg bg-black/30 p-4 transition hover:bg-black/45"
              >
                <Icon name="arrow" className="h-5 w-5 text-amber-200" /> {profile.linkedin}
              </a>
              <a
                href={`https://${profile.portfolio}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg bg-black/30 p-4 transition hover:bg-black/45"
              >
                <Icon name="arrow" className="h-5 w-5 text-amber-200" /> {profile.portfolio}
              </a>
              <div className="flex items-center gap-3 rounded-lg bg-black/30 p-4">
                <Icon name="map" className="h-5 w-5 text-amber-200" /> {profile.location}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
