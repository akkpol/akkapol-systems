import Link from "next/link";

import type { BlogCardData } from "@/lib/blog";

export function NoteTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="ak-tag">
          {tag}
        </li>
      ))}
    </ul>
  );
}

type NoteCardProps = {
  note: BlogCardData;
  featured?: boolean;
};

/**
 * One note in the writing index. The whole card is a single link so there are
 * no nested interactive elements; the "Read note" line is a visual affordance.
 */
export function NoteCard({ note, featured = false }: NoteCardProps) {
  return (
    <Link
      href={`/blog/${note.slug}`}
      className={`ak-surface ${
        featured ? "ak-surface-roomy ak-surface-strong" : "ak-surface-card"
      } ak-focus-ring group flex h-full flex-col gap-4`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <time dateTime={note.date} className="ak-type-label ak-text-muted">
          {note.dateLabel}
        </time>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--ak-color-subtle)]" />
        <span className="ak-type-label ak-text-subtle">{note.readingMinutes} min read</span>
        {note.aiAssisted ? (
          <>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--ak-color-subtle)]" />
            <span className="ak-type-label ak-text-subtle">AI-assisted</span>
          </>
        ) : null}
      </div>

      {featured ? <p className="ak-type-label ak-text-accent">Latest note</p> : null}

      <h2
        className={
          featured
            ? "ak-type-title-section-long ak-text-primary transition group-hover:text-[var(--ak-color-accent-text)]"
            : "ak-type-title-card ak-text-primary transition group-hover:text-[var(--ak-color-accent-text)]"
        }
      >
        {note.title}
      </h2>

      {note.description ? (
        <p className={featured ? "ak-type-body-lg ak-text-body max-w-2xl" : "text-sm leading-6 ak-text-body"}>
          {note.description}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <NoteTags tags={note.tags} />
        <span className="ak-type-label ak-text-muted inline-flex items-center gap-2 transition group-hover:text-[var(--ak-color-accent-text)]">
          Read note
          <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
