"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { saveLocalePreference } from "@/app/_components/LocaleDocumentSync";
import { StudioMark } from "@/app/_components/StudioMark";
import { ThemeModeToggle } from "@/app/_components/ThemeModeToggle";
import type { Locale } from "@/app/_data/brand";

export type NavKey = "home" | "cv" | "blog";

type NavText = {
  brand: string;
  home: string;
  cv: string;
  blog: string;
  primary: string;
  language: string;
  openMenu: string;
  closeMenu: string;
};

const NAV_TEXT: Record<Locale, NavText> = {
  en: {
    brand: "AKKAPOL SYSTEMS",
    home: "Home",
    cv: "CV",
    blog: "Blog",
    primary: "Primary",
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  th: {
    brand: "AKKAPOL SYSTEMS",
    home: "หน้าแรก",
    cv: "CV",
    blog: "บทความ",
    primary: "เมนูหลัก",
    language: "ภาษา",
    openMenu: "เปิดเมนู",
    closeMenu: "ปิดเมนู",
  },
};

/**
 * Routes that actually have a Thai counterpart. For every other route the
 * language switch falls back to the localized home so we never link to a 404.
 */
const THAI_ROUTES = new Set(["/", "/privacy"]);

function stripThaiPrefix(pathname: string): string {
  if (pathname === "/th") return "/";
  return pathname.replace(/^\/th(?=\/|$)/, "") || "/";
}

/** Resolve the same page in the target locale, degrading to home when absent. */
export function localizedHref(pathname: string, target: Locale): string {
  const base = stripThaiPrefix(pathname);
  if (target === "th") {
    if (!THAI_ROUTES.has(base)) return "/th";
    return base === "/" ? "/th" : `/th${base}`;
  }
  return base;
}

function buildItems(locale: Locale, t: NavText): Array<{ key: NavKey; href: string; label: string }> {
  return [
    { key: "home", href: locale === "th" ? "/th" : "/", label: t.home },
    { key: "cv", href: "/cv", label: t.cv },
    { key: "blog", href: "/blog", label: t.blog },
  ];
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export type SiteNavProps = {
  /** Active language. Auto-detected from the pathname when omitted. */
  locale?: Locale;
  /** Marks the matching nav pill as the current page. */
  current?: NavKey;
  /** Custom brand node (rendered as-is). Falls back to the default mark + wordmark. */
  brand?: React.ReactNode;
  /** Target for the default brand link. Ignored when `brand` is provided. */
  brandHref?: string;
  /** Extra desktop-only content appended to the controls cluster. */
  trailing?: React.ReactNode;
  /** Vertical alignment of the header row. */
  align?: "center" | "start";
  /** Extra classes merged onto the header row. */
  className?: string;
};

/**
 * Shared, locale-aware primary navigation for every page.
 *
 * Renders inline pills on desktop and a collapsible hamburger panel on mobile,
 * with a TH/EN switch and the theme toggle. Reused by `SiteHeader` (interior
 * pages) and the homepage hero so the menu behaves identically site-wide.
 */
export function SiteNav({
  locale: localeProp,
  current,
  brand,
  brandHref = "/",
  trailing,
  align = "center",
  className = "",
}: SiteNavProps) {
  const pathname = usePathname();
  const locale = localeProp ?? (pathname?.startsWith("/th") ? "th" : "en");
  const t = NAV_TEXT[locale];
  const items = React.useMemo(() => buildItems(locale, t), [locale, t]);

  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape and on outside pointer clicks.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const alternateLocale: Locale = locale === "th" ? "en" : "th";
  const alternateHref = localizedHref(pathname ?? "/", alternateLocale);
  const alignClass = align === "start" ? "items-start" : "items-center";

  const localeSwitch = (
    <nav className="ak-locale-switch" aria-label={t.language}>
      <span aria-current="true">{locale === "th" ? "TH" : "EN"}</span>
      <Link
        href={alternateHref}
        className="ak-focus-ring"
        onClick={() => {
          saveLocalePreference(alternateLocale);
          setOpen(false);
        }}
      >
        {alternateLocale === "th" ? "TH" : "EN"}
      </Link>
    </nav>
  );

  const brandNode = brand ?? (
    <Link href={brandHref} className="ak-focus-ring group flex items-center gap-3">
      <StudioMark className="h-8 w-auto md:h-9" />
      <span className="h-7 w-px bg-[var(--ak-border-subtle)]" aria-hidden="true" />
      <span className="ak-type-label ak-text-muted transition group-hover:text-[var(--ak-color-fg)]">
        {t.brand}
      </span>
    </Link>
  );

  return (
    <div
      ref={rootRef}
      className={`relative flex ${alignClass} justify-between gap-4 ${className}`}
    >
      {brandNode}

      {/* Desktop controls */}
      <div className={`hidden shrink-0 ${alignClass} gap-2 md:flex`}>
        <nav aria-label={t.primary} className={`flex ${alignClass} gap-2`}>
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={current === item.key ? "page" : undefined}
              className="ak-nav-pill ak-type-label ak-focus-ring"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {localeSwitch}
        <ThemeModeToggle />
        {trailing}
      </div>

      {/* Mobile controls */}
      <div className="flex shrink-0 items-center gap-2 md:hidden">
        <ThemeModeToggle />
        <button
          type="button"
          className="ak-nav-pill ak-type-label ak-focus-ring"
          aria-expanded={open}
          aria-controls="ak-mobile-nav"
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Mobile panel */}
      {open ? (
        <div
          id="ak-mobile-nav"
          className="absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] md:hidden"
        >
          <div className="rounded-[var(--ak-radius-panel)] border border-[var(--ak-border-subtle)] bg-[var(--ak-color-bg-elevated)] p-3 shadow-[var(--ak-shadow-panel)] backdrop-blur">
            <nav aria-label={t.primary} className="flex flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={current === item.key ? "page" : undefined}
                  className="ak-nav-pill ak-type-label ak-focus-ring justify-start"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--ak-border-subtle)] pt-3">
              <span className="ak-type-label ak-text-muted">{t.language}</span>
              {localeSwitch}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
