"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const LOCALE_COOKIE = "ak-locale";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function detectBrowserLocale(): "th" | "en" {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "";
  return lang.toLowerCase().startsWith("th") ? "th" : "en";
}

export function LocaleDocumentSync() {
  const pathname = usePathname();
  const router = useRouter();
  const redirected = React.useRef(false);

  // Sync lang attribute
  React.useEffect(() => {
    document.documentElement.lang = pathname.startsWith("/th") ? "th" : "en";
  }, [pathname]);

  // Auto-detect locale on first visit (only once)
  React.useEffect(() => {
    if (redirected.current) return;

    const savedLocale = getCookie(LOCALE_COOKIE);
    const browserLocale = detectBrowserLocale();
    const currentLocale = pathname.startsWith("/th") ? "th" : "en";

    // If user has saved preference and it doesn't match current → redirect
    if (savedLocale && savedLocale !== currentLocale) {
      redirected.current = true;
      const target = savedLocale === "th" ? "/th" : "/";
      router.replace(target);
      return;
    }

    // If no saved preference, use browser locale
    if (!savedLocale && browserLocale !== currentLocale) {
      redirected.current = true;
      setCookie(LOCALE_COOKIE, browserLocale);
      const target = browserLocale === "th" ? "/th" : "/";
      router.replace(target);
      return;
    }

    // Set cookie if not set but locale matches
    if (!savedLocale) {
      setCookie(LOCALE_COOKIE, currentLocale);
    }
  }, [pathname, router]);

  return null;
}

/** Call this when user manually switches language (e.g., from EN/TH toggle) */
export function saveLocalePreference(locale: "th" | "en") {
  setCookie(LOCALE_COOKIE, locale);
}
