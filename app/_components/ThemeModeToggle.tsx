"use client";

import { useSyncExternalStore } from "react";

type ThemeMode = "dark" | "light";

function getCurrentTheme(): ThemeMode {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("ak-theme", theme);
  window.dispatchEvent(new Event("ak-theme-change"));
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("ak-theme-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("ak-theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function ThemeModeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getCurrentTheme, () => "dark");

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="ak-theme-toggle ak-focus-ring"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "light"}
      suppressHydrationWarning
      title={`Switch to ${nextTheme} mode`}
      onClick={() => {
        applyTheme(nextTheme);
      }}
    >
      <span className="ak-theme-toggle-track" aria-hidden="true">
        <span className="ak-theme-toggle-thumb">
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" className="ak-theme-toggle-icon" fill="none">
              <path
                d="M20 14.2A7.5 7.5 0 0 1 9.8 4a8.1 8.1 0 1 0 10.2 10.2Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ak-theme-toggle-icon" fill="none">
              <path
                d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4 16 8M8 16l-1.6 1.6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
