import Link from "next/link";

import { StudioMark } from "@/app/_components/StudioMark";
import { ThemeModeToggle } from "@/app/_components/ThemeModeToggle";

type SiteHeaderProps = {
  current?: "blog";
};

/**
 * Shared top navigation for interior pages (currently the writing section).
 *
 * The homepage keeps its own layered hero header; this header reuses the same
 * brand mark, pill controls, and theme toggle so the blog reads as part of the
 * same site.
 */
export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[var(--ak-layout-container)] px-[var(--ak-layout-section-x)] pt-8 md:pt-10">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-4 border-b border-[var(--ak-border-subtle)] pb-5">
        <Link href="/" className="ak-focus-ring group flex items-center gap-3">
          <StudioMark className="h-8 w-auto md:h-9" />
          <span className="h-7 w-px bg-[var(--ak-border-subtle)]" aria-hidden="true" />
          <span className="ak-type-label ak-text-muted transition group-hover:text-[var(--ak-color-fg)]">
            AKKAPOL SYSTEMS
          </span>
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
          <Link href="/" className="ak-nav-pill ak-type-label ak-focus-ring">
            Home
          </Link>
          <Link href="/cv" className="ak-nav-pill ak-type-label ak-focus-ring">
            CV
          </Link>
          <Link
            href="/blog"
            aria-current={current === "blog" ? "page" : undefined}
            className="ak-nav-pill ak-type-label ak-focus-ring"
          >
            Blog
          </Link>
          <ThemeModeToggle />
        </nav>
      </div>
    </header>
  );
}
