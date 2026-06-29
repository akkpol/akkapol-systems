"use client";

import { CvShareActions } from "@/app/_components/CvShareActions";
import { ScrollProgress } from "@/app/_components/HomeMotion";
import { ScrollReveal } from "@/app/_components/home/ScrollReveal";
import { StudioHero } from "@/app/_components/home/StudioHero";
import { ContactRow, SectionHeading, Surface, SystemAction } from "@/app/_components/system-primitives";
import { homeContent, type HomeContent, type Locale } from "@/app/_data/brand";
import { cv, cvMarkdown } from "@/app/_data/cv";
import type { IconName } from "@/app/_data/cv";
import { useChatState } from "@/lib/ChatContext";

const profile = cv.profile;

function assertPortfolioData() {
  if (process.env.NODE_ENV === "production") return;

  const localeEntries = Object.entries(homeContent) as Array<[Locale, HomeContent]>;
  const checks: Array<[boolean, string]> = [
    [profile.email.includes("@"), "profile.email should be a valid email-like string"],
    [localeEntries.length === 2, "homeContent should include English and Thai locales"],
    [
      localeEntries.every(([, content]) => content.hero.body.length === 2),
      "each locale hero should contain two body lines",
    ],
    [
      localeEntries.every(([, content]) => content.sections.services.offers.length >= 3),
      "each locale should contain at least 3 service offers",
    ],
    [
      localeEntries.every(([, content]) => content.sections.work.items.length >= 2),
      "each locale should contain at least 2 selected work items",
    ],
    [
      localeEntries.every(([, content]) =>
        content.sections.skills.items.every((skill) => skill.title && skill.items && skill.icon),
      ),
      "every localized skill needs title, items, and icon",
    ],
    [
      localeEntries.every(([, content]) => content.sections.experience.items[0]?.title),
      "each locale should start experience with the current role",
    ],
    [
      localeEntries.every(([, content]) =>
        content.sections.experience.items.every((job) => job.points.length > 0),
      ),
      "every localized experience item needs at least one bullet point",
    ],
    [
      localeEntries.every(([, content]) => content.sections.education.items.length >= 3),
      "each locale should contain at least 3 education items",
    ],
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

function ServicesSection({
  content,
  locale,
  onOpenChat,
}: {
  content: HomeContent["sections"]["services"];
  locale: Locale;
  onOpenChat: () => void;
}) {
  const bestForLabel = locale === "th" ? "เหมาะกับ:" : "Best for:";

  return (
    <ScrollReveal id="services" className="ak-section-frame" delay={0.01}>
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <p className="ak-type-body ak-text-body max-w-xl">{content.body}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <SystemAction onClick={onOpenChat} intent="primary">
              {content.primaryAction}
            </SystemAction>
            <SystemAction href="#work">{content.secondaryAction}</SystemAction>
          </div>
        </div>

        <div className="grid gap-4">
          {content.offers.map((offer) => (
            <Surface
              key={offer.title}
              as="article"
              className="grid gap-5 md:grid-cols-[auto_1fr]"
              variant="card"
            >
              <div className="ak-signal-icon">
                <Icon name={offer.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="ak-type-title-card ak-text-primary">{offer.title}</h3>
                <p className="ak-type-body-sm ak-text-body mt-2">{offer.outcome}</p>
                <p className="ak-type-body-sm ak-text-accent-soft mt-3 font-medium">
                  {bestForLabel} {offer.bestFor}
                </p>
                <ul className="ak-type-body-sm ak-text-muted mt-4 grid gap-2 sm:grid-cols-2">
                  {offer.scope.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function SelectedWorkSection({ content }: { content: HomeContent["sections"]["work"] }) {
  return (
    <ScrollReveal id="work" className="ak-section-frame" delay={0.02}>
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />
      <div className="grid gap-4 lg:grid-cols-2">
        {content.items.map((work) => (
          <Surface
            key={work.title}
            as="article"
            className="flex h-full flex-col gap-6"
            variant="card"
          >
            <div className="flex items-start justify-between gap-5">
              <div className="ak-signal-icon">
                <Icon name={work.icon} className="h-6 w-6" />
              </div>
              <p className="ak-type-label ak-text-signal max-w-[12rem] text-right">
                {work.status}
              </p>
            </div>
            <div>
              <h3 className="ak-type-title-card ak-text-primary">{work.title}</h3>
              <p className="ak-type-body ak-text-body mt-3">{work.description}</p>
            </div>
            <ul className="ak-type-body-sm ak-text-muted grid gap-3">
              {work.proofPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="ak-type-label ak-text-muted rounded-full border border-white/10 px-3 py-2"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {work.links.map((link) => (
                <a
                  key={`${work.title}-${link.href}`}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="ak-action ak-action-secondary"
                >
                  {link.label}
                  <Icon name="arrow" className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Surface>
        ))}
      </div>
    </ScrollReveal>
  );
}

export function AkkapolPortfolioPage({ locale = "en" }: { locale?: Locale }) {
  const content = homeContent[locale];
  const sections = content.sections;
  const { setOpen } = useChatState();
  const openChat = () => setOpen(true);

  return (
    <main className="ak-theme-shell" data-locale={locale} lang={locale}>
      <ScrollProgress />
      <StudioHero copy={content.hero} email={profile.email} locale={locale} />

      <ScrollReveal id="about" className="ak-section-frame">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={sections.about.eyebrow} title={sections.about.title} />
          <Surface className="ak-type-body-lg" variant="roomy">
            <p>{sections.about.summary}</p>
          </Surface>
        </div>
      </ScrollReveal>

      <SelectedWorkSection content={sections.work} />
      <ServicesSection content={sections.services} locale={locale} onOpenChat={openChat} />

      <ScrollReveal id="experience" className="ak-section-frame">
        <SectionHeading eyebrow={sections.experience.eyebrow} title={sections.experience.title} />
        <div className="space-y-4">
          {sections.experience.items.map((job) => (
            <Surface
              key={`${job.title}-${job.period}`}
              className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:p-8"
              variant="roomy"
            >
              <div>
                <p className="ak-type-body-sm ak-text-accent-soft font-medium">{job.period}</p>
                <h3 className="ak-type-title-card ak-text-primary mt-3">{job.title}</h3>
                <p className="ak-type-body-sm ak-text-muted mt-2">{job.company}</p>
              </div>
              <ul className="ak-type-body ak-text-body space-y-3">
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

      <ScrollReveal id="education" className="ak-section-frame" delay={0.02}>
        <SectionHeading eyebrow={sections.education.eyebrow} title={sections.education.title} />
        <div className="grid gap-4 md:grid-cols-2">
          {sections.education.items.map((item) => (
            <Surface key={`${item.program}-${item.period}`} className="ak-type-body-sm p-5">
              <p className="ak-text-primary font-semibold">{item.program}</p>
              <p className="ak-text-muted mt-1">
                {item.institution} · {item.period}
              </p>
              {item.description ? <p className="ak-text-muted mt-3">{item.description}</p> : null}
            </Surface>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal id="contact" className="ak-section-frame">
        <Surface className="ak-surface-strong overflow-hidden md:p-12" variant="roomy">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Icon name="brain" className="ak-text-accent-soft mb-6 h-10 w-10" />
              <h2 className="ak-type-title-section-long ak-text-primary">{sections.contact.title}</h2>
              <p className="ak-type-body-lg ak-text-body mt-6 max-w-2xl">
                {sections.contact.body}
              </p>
              <div className="mt-8">
                <CvShareActions markdown={cvMarkdown} labels={sections.contact.cvActions} />
              </div>
            </div>

            <div className="ak-type-body-sm ak-text-body flex flex-col justify-end gap-4">
              <ContactRow href={`mailto:${profile.email}`}>
                <Icon name="mail" className="ak-text-accent-soft h-5 w-5" /> {profile.email}
              </ContactRow>
              <ContactRow href={`tel:${profile.phone.replace(/\s+/g, "")}`}>
                <Icon name="phone" className="ak-text-accent-soft h-5 w-5" /> {profile.phone}
              </ContactRow>
              <ContactRow href={`https://${profile.linkedin}`} target="_blank">
                <Icon name="arrow" className="ak-text-accent-soft h-5 w-5" /> {profile.linkedin}
              </ContactRow>
              <ContactRow href={`https://${profile.portfolio}`} target="_blank">
                <Icon name="arrow" className="ak-text-accent-soft h-5 w-5" /> {profile.portfolio}
              </ContactRow>
              <ContactRow>
                <Icon name="map" className="ak-text-accent-soft h-5 w-5" /> {profile.location}
              </ContactRow>
              <ContactRow href={locale === "th" ? "/th/privacy" : "/privacy"} target="_blank">
                <span className="ak-text-accent-soft h-5 w-5 inline-flex items-center justify-center text-xs font-bold">🔒</span>{" "}
                {locale === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
              </ContactRow>
            </div>
          </div>
        </Surface>
      </ScrollReveal>
    </main>
  );
}
