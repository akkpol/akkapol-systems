import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/app/_components/SiteHeader";
import { BlogStream } from "@/app/blog/_components/BlogStream";
import { collectPostTags, formatBlogDate, listPosts, toBlogCardData } from "@/lib/blog";

// Posts are read from content/blog at build time. New Markdown files are
// published by the next rebuild/redeploy.

const blogDescription =
  "Working notes on practical AI systems, workflow automation, and software built for real operations — from the studio of Akkapol Kumpapug.";

export const metadata: Metadata = {
  title: "Writing",
  description: blogDescription,
  alternates: {
    canonical: "/blog",
    languages: {
      en: "/blog",
    },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: "Akkapol Systems",
    title: "Writing | Akkapol Kumpapug",
    description: blogDescription,
  },
  twitter: {
    card: "summary",
    title: "Writing | Akkapol Kumpapug",
    description: blogDescription,
  },
};

function EmptyState() {
  return (
    <div className="ak-surface ak-surface-roomy ak-surface-strong mt-12 overflow-hidden md:p-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <span
          className="ak-signal-icon h-14 w-14 shrink-0 rounded-[var(--ak-radius-panel)]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5V6a2 2 0 0 1 2-2h9l5 5v10.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
            <path d="M14 4v5h5" />
            <path d="M8 13h8M8 17h5" />
          </svg>
        </span>

        <div className="max-w-2xl">
          <p className="ak-type-label ak-text-accent">Nothing published yet</p>
          <h2 className="ak-type-title-section-long ak-text-primary mt-3">
            The next note is still being written.
          </h2>
          <p className="ak-type-body ak-text-body mt-4">
            This space collects working notes on AI systems, automation, and the
            details of shipping software that has to survive real operations.
            When a note is ready it will appear here — no newsletter, no noise.
          </p>
          <p className="ak-type-body-sm ak-text-muted mt-3">
            In the meantime, the <Link href="/" className="ak-text-accent underline decoration-[var(--ak-color-accent)] underline-offset-4 hover:text-[var(--ak-color-accent-soft-text)]">portfolio home</Link> and
            {" "}
            <Link href="/cv" className="ak-text-accent underline decoration-[var(--ak-color-accent)] underline-offset-4 hover:text-[var(--ak-color-accent-soft-text)]">CV</Link>
            {" "}cover the work in more depth.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/" className="ak-action ak-action-primary ak-focus-ring">
              Back to the portfolio
            </Link>
            <a href="mailto:akkapol.kumpapug@gmail.com" className="ak-action ak-action-secondary ak-focus-ring">
              Start a conversation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogIndexPage() {
  const posts = listPosts();
  const notes = posts.map(toBlogCardData);
  const tags = collectPostTags(posts);
  const newestDate = posts[0]?.date;

  return (
    <main className="ak-theme-shell" data-locale="en" lang="en">
      <SiteHeader current="blog" />

      <section className="ak-section-frame">
        <div className="pt-4 md:pt-6">
          <header className="max-w-3xl">
            <p className="ak-type-label ak-text-accent">Writing</p>
            <h1 className="ak-type-title-section ak-text-primary mt-4">
              Notes from the system studio
            </h1>
            <p className="ak-type-body-lg ak-text-body mt-6">{blogDescription}</p>

            {notes.length > 0 ? (
              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="ak-type-label ak-text-muted">
                  {notes.length} {notes.length === 1 ? "note" : "notes"}
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--ak-color-subtle)]" />
                <span className="ak-type-label ak-text-muted">
                  {tags.length} {tags.length === 1 ? "topic" : "topics"}
                </span>
                {newestDate ? (
                  <>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--ak-color-subtle)]" />
                    <span className="ak-type-label ak-text-muted">
                      newest {formatBlogDate(newestDate)}
                    </span>
                  </>
                ) : null}
              </div>
            ) : null}
          </header>

          {notes.length === 0 ? <EmptyState /> : <BlogStream notes={notes} tags={tags} />}
        </div>

        <footer className="mt-16 border-t border-[var(--ak-border-subtle)] pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="ak-type-label ak-text-accent">Working in the open</p>
              <p className="ak-type-body-sm ak-text-muted mt-3">
                Notes come from real project work and long sessions with AI
                assistants. If a workflow problem is worth writing about, it is
                usually worth solving.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:akkapol.kumpapug@gmail.com" className="ak-action ak-action-primary ak-focus-ring">
                Start a conversation
              </a>
              <Link href="/" className="ak-action ak-action-secondary ak-focus-ring">
                Back to the portfolio
              </Link>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
