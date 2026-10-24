"use client";

import { useMemo, useState } from "react";

import { NoteCard } from "@/app/blog/_components/NoteCard";
import type { BlogCardData, BlogTagCount } from "@/lib/blog";

type BlogStreamProps = {
  notes: BlogCardData[];
  tags: BlogTagCount[];
};

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * Client-side topic filter for the writing index.
 *
 * The default view promotes the newest note; filtering by a topic collapses to
 * a flat grid so the selected notes are all presented equally. All data is
 * precomputed on the server, so this component never touches the filesystem.
 */
export function BlogStream({ notes, tags }: BlogStreamProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visibleNotes = useMemo(() => {
    if (activeTag === null) return notes;
    const target = activeTag.toLowerCase();
    return notes.filter((note) => note.tags.some((tag) => tag.toLowerCase() === target));
  }, [activeTag, notes]);

  const isFiltered = activeTag !== null;
  const featured = visibleNotes[0];
  const rest = visibleNotes.slice(1);

  return (
    <div>
      <div
        className="mt-8 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter notes by topic"
      >
        <button
          type="button"
          className="ak-tag ak-tag-button ak-focus-ring"
          aria-pressed={!isFiltered}
          onClick={() => setActiveTag(null)}
        >
          All notes
        </button>
        {tags.map((entry) => {
          const isActive = activeTag === entry.tag;
          return (
            <button
              key={entry.tag}
              type="button"
              className="ak-tag ak-tag-button ak-focus-ring"
              aria-pressed={isActive}
              aria-label={`${entry.tag} (${countLabel(entry.count, "note", "notes")})`}
              onClick={() => setActiveTag(isActive ? null : entry.tag)}
            >
              <span>{entry.tag}</span>
              <span aria-hidden="true" className="ak-text-subtle">
                {entry.count}
              </span>
            </button>
          );
        })}
      </div>

      <p
        className={
          isFiltered ? "ak-type-label ak-text-subtle mt-4" : "sr-only"
        }
        aria-live="polite"
      >
        {isFiltered
          ? `${countLabel(visibleNotes.length, "note", "notes")} tagged ${activeTag}`
          : `${countLabel(notes.length, "note", "notes")} · newest first`}
      </p>

      {visibleNotes.length === 0 ? (
        <div className="ak-surface ak-surface-roomy mt-6">
          <p className="ak-type-body ak-text-body">
            No notes for this topic yet. Pick another topic or read all notes.
          </p>
        </div>
      ) : isFiltered ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {visibleNotes.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6">{featured ? <NoteCard note={featured} featured /> : null}</div>
          {rest.length > 0 ? (
            <div className="mt-10">
              <p className="ak-type-label ak-text-accent">More notes</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {rest.map((note) => (
                  <NoteCard key={note.slug} note={note} />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
