"use client";

import Image from "next/image";
import React from "react";
import { motion, useScroll } from "framer-motion";

import { CvShareActions } from "@/app/_components/CvShareActions";
import { cv, cvMarkdown } from "@/app/_data/cv";
import type { IconName } from "@/app/_data/cv";

const profile = cv.profile;

const profileHeroImage = "/images/akkapol-profile.png";
const currentFocus = cv.currentFocus;
const strengths = cv.strengths;

const workflowStages = [
  {
    id: "intake",
    step: "01",
    label: "Intake",
    title: "Capture the real request",
    description:
      "LINE/LIFF intake turns messy customer input into a structured case with files, context, and ownership.",
    event: "customer_intake.submitted",
    guard: "Schema validation + signed asset URLs",
  },
  {
    id: "triage",
    step: "02",
    label: "AI Triage",
    title: "Reduce ambiguity before work starts",
    description:
      "AI assistance classifies intent, missing details, urgency, and quotation readiness without becoming the source of truth.",
    event: "case.triage.completed",
    guard: "Human review + confidence threshold",
  },
  {
    id: "quote",
    step: "03",
    label: "Quote",
    title: "Move through explicit commercial states",
    description:
      "Quote, payment, and approval gates become visible states instead of private chat history or spreadsheet drift.",
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
];

const skills = cv.skills;
const experience = cv.experience;
const education = cv.education;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

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
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-zinc-200 shadow-sm backdrop-blur">
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

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-amber-300"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function HeroProfileCard() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50">
      <div className="absolute left-6 top-6 z-20 border border-white/10 bg-black/45 px-3 py-2 text-xs font-semibold text-zinc-200 backdrop-blur">
        Profile
      </div>
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={profileHeroImage}
          alt="Akkapol Kumpapug profile visual"
          fill
          preload
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,transparent,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.64)_100%)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/55 to-transparent p-8 pt-28">
        <p className="text-2xl font-semibold text-white">{profile.name}</p>
        <p className="mt-1 text-sm text-zinc-300">{profile.role}</p>
      </div>
    </div>
  );
}

function WorkflowPreview() {
  const [activeId, setActiveId] = React.useState(workflowStages[0].id);
  const activeStage =
    workflowStages.find((stage) => stage.id === activeId) ?? workflowStages[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {workflowStages.map((stage) => {
          const selected = stage.id === activeId;

          return (
            <motion.button
              key={stage.id}
              type="button"
              onClick={() => setActiveId(stage.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`border p-4 text-left transition ${
                selected
                  ? "border-amber-300/50 bg-amber-300/12 text-white"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/[0.07]"
              } rounded-lg`}
            >
              <span className="text-xs font-semibold text-amber-200">{stage.step}</span>
              <span className="ml-3 text-sm font-semibold">{stage.label}</span>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{stage.title}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/25 backdrop-blur md:p-8">
        <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative"
        >
          <p className="text-sm font-semibold text-amber-200">
            {activeStage.step} / {activeStage.label}
          </p>
          <h3 className="mt-4 max-w-2xl text-3xl font-semibold text-white md:text-5xl">
            {activeStage.title}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
            {activeStage.description}
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-semibold uppercase text-zinc-500">Event</p>
              <p className="mt-2 break-words font-mono text-sm text-amber-100">
                {activeStage.event}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-semibold uppercase text-zinc-500">Guard</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">{activeStage.guard}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AkkapolPortfolioPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-zinc-100">
      <ScrollProgress />
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_38%),linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:100%_100%,72px_72px,72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a href="#top" className="text-sm font-semibold uppercase text-white">
          AKKAPOL
        </a>
        <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          <a className="transition hover:text-white" href="#about">
            About
          </a>
          <a className="transition hover:text-white" href="#focus">
            Focus
          </a>
          <a className="transition hover:text-white" href="#skills">
            Skills
          </a>
          <a className="transition hover:text-white" href="#systems">
            Systems
          </a>
          <a className="transition hover:text-white" href="#experience">
            Experience
          </a>
          <a className="transition hover:text-white" href="#education">
            Education
          </a>
          <a className="transition hover:text-white" href="#contact">
            Contact
          </a>
        </nav>
      </header>

      <section
        id="top"
        className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-8 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:pb-28 md:pt-20"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <Badge>
            <Icon name="sparkles" className="mr-2 inline h-4 w-4 text-amber-300" />
            {profile.tagline}
          </Badge>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.95] text-white md:text-7xl lg:text-8xl">
            AI-integrated systems builder for business workflows that actually ship.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
            I design practical AI-assisted business systems that combine LLM tooling,
            agentic development workflows, cloud infrastructure, CRM-style operations,
            customer intake, quotation/status tracking, and production-ready web systems.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200"
            >
              Work with me
              <Icon
                name="arrow"
                className="ml-2 h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#systems"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/[0.08]"
            >
              Explore systems
            </a>
          </div>

          <div className="mt-5">
            <CvShareActions markdown={cvMarkdown} />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {strengths.map((item) => (
              <Badge key={item.title}>{item.title}</Badge>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <HeroProfileCard />
        </motion.div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle
            eyebrow="Executive Summary"
            title="Full-stack execution, AI workflow design, and operational problem solving in one profile."
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
            <motion.div
              key={skill.title}
              whileHover={{ y: -6 }}
              className="rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/20 backdrop-blur"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-300/15 text-amber-200">
                <Icon name={skill.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{skill.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{skill.items}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="systems" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10">
        <SectionTitle
          eyebrow="System Operating Model"
          title="The portfolio should feel like the systems I build: explicit states, clear events, and durable handoffs."
        />
        <WorkflowPreview />
      </section>

      <section
        id="experience"
        className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10"
      >
        <SectionTitle
          eyebrow="Experience"
          title="Current role first: AI systems, workflow platforms, and practical implementation."
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
                Let&apos;s turn business ambiguity into a working AI-integrated system.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Best fit: AI-assisted operational systems, LINE/LIFF intake flows,
                workflow automation, CRM-style quote/status tracking, and production-ready web
                platforms.
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
