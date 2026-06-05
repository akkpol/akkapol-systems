import Image from "next/image";
import { cv, cvFiles } from "@/app/_data/cv";

export const metadata = {
  title: "Akkapol Kumpapug CV",
  description:
    "Recruiter-ready CV for Akkapol Kumpapug, AI Systems Builder & Problem Solver.",
};

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`cv-section ${className}`}>
      <h2 className="mb-4 border-b border-amber-300/35 pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-200 print:border-amber-500/50 print:text-amber-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-6 text-zinc-300 print:text-zinc-800">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 print:bg-amber-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CvPage() {
  return (
    <main className="cv-print-page min-h-screen bg-[#070707] px-4 py-8 text-zinc-100 print:bg-white print:px-0 print:py-0">
      <article className="mx-auto max-w-[920px] overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50 print:max-w-none print:rounded-none print:border-0 print:bg-white print:shadow-none">
        <header className="relative overflow-hidden bg-black px-8 py-9 print:bg-zinc-950 print:px-8 print:py-7">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.18),transparent_36%),linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:100%_100%,52px_52px,52px_52px]" />
          <div className="relative grid gap-7 md:grid-cols-[1fr_156px] print:grid-cols-[1fr_120px]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
                {cv.profile.role}
              </p>
              <h1 className="text-5xl font-semibold leading-none text-white print:text-4xl">
                {cv.profile.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 print:text-sm">
                AI-integrated systems, workflow design, and practical execution for
                production-ready business operations.
              </p>
              <div className="mt-6 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2 print:grid-cols-2 print:text-xs">
                <a href={`mailto:${cv.profile.email}`}>{cv.profile.email}</a>
                <a href={`tel:${cv.profile.phone.replace(/\s+/g, "")}`}>
                  {cv.profile.phone}
                </a>
                <a href={`https://${cv.profile.linkedin}`}>{cv.profile.linkedin}</a>
                <a href={`https://${cv.profile.portfolio}`}>{cv.profile.portfolio}</a>
                <span>{cv.profile.location}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 print:aspect-square">
                <Image
                  src="/images/akkapol-cv-portrait-2026.png"
                  alt="Akkapol Kumpapug"
                  fill
                  preload
                  sizes="156px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 px-8 py-8 md:grid-cols-[0.78fr_1.22fr] print:grid-cols-[0.8fr_1.2fr] print:gap-6 print:px-8 print:py-7">
          <aside className="space-y-7">
            <Section title="Current Focus">
              <BulletList items={cv.currentFocus} />
            </Section>

            <Section title="Core Competencies">
              <div className="flex flex-wrap gap-2">
                {cv.coreCompetencies.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs leading-5 text-zinc-300 print:border-zinc-300 print:bg-zinc-50 print:text-zinc-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Strengths">
              <div className="space-y-3">
                {cv.strengths.map((strength) => (
                  <div key={strength.title}>
                    <h3 className="text-sm font-semibold text-white print:text-zinc-950">
                      {strength.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-400 print:text-zinc-700">
                      {strength.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          </aside>

          <div className="space-y-8">
            <Section title="Executive Summary">
              <p className="text-sm leading-7 text-zinc-300 print:text-zinc-800">
                {cv.summary}
              </p>
            </Section>

            <Section title="Experience">
              <div className="space-y-6">
                {cv.experience.map((job) => (
                  <section key={`${job.title}-${job.period}`} className="cv-item">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-white print:text-zinc-950">
                          {job.title}
                        </h3>
                        <p className="text-sm text-zinc-400 print:text-zinc-700">
                          {job.company}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-amber-200 print:text-amber-700">
                        {job.period}
                      </p>
                    </div>
                    <div className="mt-3">
                      <BulletList items={job.points} />
                    </div>
                  </section>
                ))}
              </div>
            </Section>

            <Section title="Education">
              <div className="grid gap-4">
                {cv.education.map((item) => (
                  <section key={`${item.program}-${item.period}`} className="cv-item">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white print:text-zinc-950">
                          {item.program}
                        </h3>
                        <p className="text-sm text-zinc-400 print:text-zinc-700">
                          {item.institution}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-amber-200 print:text-amber-700">
                        {item.period}
                      </p>
                    </div>
                    {item.description ? (
                      <p className="mt-2 text-xs leading-5 text-zinc-400 print:text-zinc-700">
                        {item.description}
                      </p>
                    ) : null}
                  </section>
                ))}
              </div>
            </Section>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-8 py-5 text-xs text-zinc-500 print:hidden">
          <span>Ready to share with recruiters and clients.</span>
          <div className="flex gap-3">
            <a className="text-amber-200 hover:text-amber-100" href={cvFiles.pdf} download>
              Download PDF
            </a>
            <a
              className="text-amber-200 hover:text-amber-100"
              href={cvFiles.markdown}
              download
            >
              Download CV.md
            </a>
          </div>
        </footer>
      </article>
    </main>
  );
}
