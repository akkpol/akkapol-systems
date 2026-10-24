import type { Metadata } from "next";
import Link from "next/link";

import { formatBlogDate, listPosts, type BlogPost } from "@/lib/blog";

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

function PostTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-[var(--ak-border-subtle)] bg-[var(--ak-surface-secondary)] px-2.5 py-0.5 text-xs ak-text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="ak-surface ak-surface-card ak-focus-ring group flex h-full flex-col gap-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <time dateTime={post.date} className="ak-type-label ak-text-muted">
          {formatBlogDate(post.date)}
        </time>
        <span className="ak-type-label ak-text-subtle">{post.readingMinutes} min read</span>
      </div>

      <h2 className="ak-type-title-card ak-text-primary transition group-hover:text-[var(--ak-color-accent-text)]">
        {post.title}
      </h2>

      {post.description ? (
        <p className="text-sm leading-6 ak-text-body">{post.description}</p>
      ) : null}

      <div className="mt-auto pt-3">
        <PostTags tags={post.tags} />
      </div>
    </Link>
  );
}

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

  return (
    <main className="ak-theme-shell" data-locale="en" lang="en">
      <div className="ak-section-frame pb-0 pt-8 md:pt-10">
        <Link
          href="/"
          className="ak-focus-ring group inline-flex items-center gap-2 rounded-full border border-[var(--ak-border-strong)] bg-[var(--ak-surface-panel)] px-4 py-2 text-sm font-medium ak-text-body transition hover:border-[var(--ak-color-accent)] hover:text-[var(--ak-color-accent-text)]"
        >
          <span aria-hidden="true" className="transition group-hover:-translate-x-0.5">
            ←
          </span>
          <span>Back to Home</span>
        </Link>
      </div>

      <section className="ak-section-frame pt-10 md:pt-14">
        <header className="max-w-3xl">
          <p className="ak-type-label ak-text-accent">Writing</p>
          <h1 className="ak-type-title-section ak-text-primary mt-4">
            Notes from the system studio
          </h1>
          <p className="ak-type-body-lg ak-text-body mt-6">
            {blogDescription}
          </p>
          {posts.length > 0 ? (
            <p className="ak-type-label ak-text-subtle mt-6">
              {posts.length} {posts.length === 1 ? "note" : "notes"} · newest first
            </p>
          ) : null}
        </header>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
