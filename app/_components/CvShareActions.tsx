"use client";

import React from "react";
import { cvFiles } from "@/app/_data/cv";

type Variant = "hero" | "contact";
type CopyStatus = "idle" | "copied" | "error";

const iconClassName = "h-4 w-4 shrink-0";

function ActionIcon({ name }: { name: "copy" | "download" | "view" }) {
  const commonProps = {
    className: iconClassName,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "copy") {
    return (
      <svg {...commonProps}>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
      </svg>
    );
  }

  if (name === "download") {
    return (
      <svg {...commonProps}>
        <path d="M12 3v11" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function getActionClassName(variant: Variant, intent: "primary" | "secondary") {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-200/70 focus:ring-offset-2 focus:ring-offset-black";

  if (intent === "primary") {
    return `${base} bg-white text-zinc-950 hover:bg-amber-200`;
  }

  if (variant === "contact") {
    return `${base} border border-white/10 bg-black/25 text-white hover:bg-black/40`;
  }

  return `${base} border border-white/10 bg-white/[0.04] text-white backdrop-blur hover:bg-white/[0.08]`;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed");
  } finally {
    document.body.removeChild(textarea);
  }
}

export function CvShareActions({
  markdown,
  variant = "hero",
}: {
  markdown: string;
  variant?: Variant;
}) {
  const [copyStatus, setCopyStatus] = React.useState<CopyStatus>("idle");

  async function handleCopy() {
    try {
      await copyText(markdown);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2200);
  }

  const copyLabel =
    copyStatus === "copied"
      ? "Copied"
      : copyStatus === "error"
        ? "Copy failed"
        : "Copy CV.md";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={handleCopy}
        className={getActionClassName(variant, "primary")}
        aria-live="polite"
      >
        <ActionIcon name="copy" />
        {copyLabel}
      </button>
      <a
        href={cvFiles.pdf}
        download
        className={getActionClassName(variant, "secondary")}
      >
        <ActionIcon name="download" />
        Download PDF
      </a>
      <a
        href={cvFiles.markdown}
        download
        className={getActionClassName(variant, "secondary")}
      >
        <ActionIcon name="download" />
        Download CV.md
      </a>
      <a href={cvFiles.view} className={getActionClassName(variant, "secondary")}>
        <ActionIcon name="view" />
        View CV
      </a>
    </div>
  );
}
