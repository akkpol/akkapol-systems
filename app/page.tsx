import { CvShareActions } from "@/app/_components/CvShareActions";
import { ScrollProgress } from "@/app/_components/HomeMotion";
import { ScrollReveal } from "@/app/_components/home/ScrollReveal";
import { StudioHero } from "@/app/_components/home/StudioHero";
import { ContactRow, SectionHeading, Surface } from "@/app/_components/system-primitives";
import { cv, cvMarkdown } from "@/app/_data/cv";
import type { IconName } from "@/app/_data/cv";

const profile = cv.profile;
const currentFocus = cv.currentFocus;
const strengths = cv.strengths;

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

export default function AkkapolPortfolioPage() {
  return (
    <main className="ak-theme-shell">
      <ScrollProgress />
      <StudioHero email={profile.email} />

      <ScrollReveal
        id="about"
        className="ak-section-frame"
      >
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Executive Summary"
            title="A practical profile built around execution, workflow design, and solving real business problems."
          />
          <Surface className="ak-type-body-lg" variant="roomy">
            <p>{cv.summary}</p>
          </Surface>
        </div>
      </ScrollReveal>

      <ScrollReveal
        id="focus"
        className="ak-section-frame"
        delay={0.02}
      >
        <SectionHeading
          eyebrow="Current Focus"
          title="Building 2026-ready AI-integrated business systems for real operations."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {currentFocus.map((item) => (
            <Surface key={item} className="ak-type-body-sm">
              {item}
            </Surface>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal
        id="skills"
        className="ak-section-frame"
        delay={0.03}
      >
        <SectionHeading
          eyebrow="Core Competencies"
          title="A practical stack for AI-assisted systems, workflow automation, and production web delivery."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <Surface
              key={skill.title}
              variant="card"
            >
              <div className="ak-signal-icon mb-6">
                <Icon name={skill.icon} className="h-6 w-6" />
              </div>
              <h3 className="ak-type-title-card text-white">{skill.title}</h3>
              <p className="ak-type-body-sm mt-3 text-zinc-400">{skill.items}</p>
            </Surface>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal
        id="experience"
        className="ak-section-frame"
      >
        <SectionHeading
          eyebrow="Experience"
          title="Current role first: building AI systems, workflows, and practical solutions."
        />
        <div className="space-y-4">
          {experience.map((job) => (
            <Surface
              key={`${job.title}-${job.period}`}
              className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:p-8"
              variant="roomy"
            >
              <div>
                <p className="ak-type-body-sm font-medium text-amber-200">{job.period}</p>
                <h3 className="ak-type-title-card mt-3 text-white">
                  {job.title}
                </h3>
                <p className="ak-type-body-sm mt-2 text-zinc-400">{job.company}</p>
              </div>
              <ul className="ak-type-body space-y-3 text-zinc-300">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Surface>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal
        id="education"
        className="ak-section-frame"
        delay={0.02}
      >
        <SectionHeading
          eyebrow="Education"
          title="A technical foundation across data, production systems, web development, and electronics."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <Surface
              key={`${item.program}-${item.period}`}
              className="ak-type-body-sm p-5"
            >
              <p className="font-semibold text-white">{item.program}</p>
              <p className="mt-1 text-zinc-400">
                {item.institution} · {item.period}
              </p>
              {item.description ? (
                <p className="mt-3 text-zinc-400">{item.description}</p>
              ) : null}
            </Surface>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal
        id="contact"
        className="ak-section-frame"
      >
        <Surface className="ak-surface-strong overflow-hidden md:p-12" variant="roomy">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Icon name="brain" className="mb-6 h-10 w-10 text-amber-200" />
              <h2 className="ak-type-title-section-long text-white">
                Let&apos;s turn business problems into practical AI-assisted systems.
              </h2>
              <p className="ak-type-body-lg mt-6 max-w-2xl text-zinc-300">
                Best fit: practical AI-assisted systems, customer workflows,
                process automation, and production-ready web platforms.
              </p>
              <div className="mt-8">
                <CvShareActions markdown={cvMarkdown} variant="contact" />
              </div>
            </div>

            <div className="ak-type-body-sm flex flex-col justify-end gap-4 text-zinc-300">
              <ContactRow href={`mailto:${profile.email}`}>
                <Icon name="mail" className="h-5 w-5 text-amber-200" /> {profile.email}
              </ContactRow>
              <ContactRow href={`tel:${profile.phone.replace(/\s+/g, "")}`}>
                <Icon name="phone" className="h-5 w-5 text-amber-200" /> {profile.phone}
              </ContactRow>
              <ContactRow href={`https://${profile.linkedin}`} target="_blank">
                <Icon name="arrow" className="h-5 w-5 text-amber-200" /> {profile.linkedin}
              </ContactRow>
              <ContactRow href={`https://${profile.portfolio}`} target="_blank">
                <Icon name="arrow" className="h-5 w-5 text-amber-200" /> {profile.portfolio}
              </ContactRow>
              <ContactRow>
                <Icon name="map" className="h-5 w-5 text-amber-200" /> {profile.location}
              </ContactRow>
            </div>
          </div>
        </Surface>
      </ScrollReveal>
    </main>
  );
}
