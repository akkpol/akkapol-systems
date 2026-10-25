import { SiteNav, type NavKey } from "@/app/_components/SiteNav";
import type { Locale } from "@/app/_data/brand";

type SiteHeaderProps = {
  /** Marks the matching nav pill as the current page. */
  current?: NavKey;
  /** Active language. Auto-detected from the pathname when omitted. */
  locale?: Locale;
};

/**
 * Shared top navigation for interior pages (writing, CV, legal, etc.).
 *
 * The homepage keeps its own layered hero header; both reuse the same
 * `SiteNav` so brand, links, language switch, theme toggle, and the mobile
 * menu behave identically across the site.
 */
export function SiteHeader({ current, locale }: SiteHeaderProps) {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[var(--ak-layout-container)] px-[var(--ak-layout-section-x)] pt-8 md:pt-10">
      <div className="border-b border-[var(--ak-border-subtle)] pb-5">
        <SiteNav locale={locale} current={current} />
      </div>
    </header>
  );
}
