"use client";

import React from "react";
import { SystemAction } from "@/app/_components/system-primitives";
import { cvFiles } from "@/app/_data/cv";

type CopyStatus = "idle" | "copied" | "error";

const iconClassName = "h-4 w-4 shrink-0";
type CvShareLabels = {
  copyIdle: string;
  copyCopied: string;
  copyError: string;
  downloadPdf: string;
  downloadMarkdown: string;
  viewCv: string;
};

const defaultLabels: CvShareLabels = {
  copyIdle: "Copy CV.md",
  copyCopied: "Copied",
  copyError: "Copy failed",
  downloadPdf: "Download PDF",
  downloadMarkdown: "Download CV.md",
  viewCv: "View CV",
};

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
  labels = defaultLabels,
  markdown,
}: {
  labels?: CvShareLabels;
  markdown: string;
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
      ? labels.copyCopied
      : copyStatus === "error"
        ? labels.copyError
        : labels.copyIdle;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <SystemAction
        onClick={handleCopy}
        intent="primary"
        aria-live="polite"
      >
        <ActionIcon name="copy" />
        {copyLabel}
      </SystemAction>
      <SystemAction
        href={cvFiles.pdf}
        download
      >
        <ActionIcon name="download" />
        {labels.downloadPdf}
      </SystemAction>
      <SystemAction
        href={cvFiles.markdown}
        download
      >
        <ActionIcon name="download" />
        {labels.downloadMarkdown}
      </SystemAction>
      <SystemAction href={cvFiles.view}>
        <ActionIcon name="view" />
        {labels.viewCv}
      </SystemAction>
    </div>
  );
}
