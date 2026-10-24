import type { ReactNode } from "react";

import {
  parseInlineMarkdown,
  parseMarkdown,
  type MarkdownBlock,
  type MarkdownInline,
} from "@/lib/blog";

const EXTERNAL_LINK_PATTERN = /^(?:https?:\/\/|mailto:)/i;

const inlineCodeClassName =
  "rounded border border-[var(--ak-border-subtle)] bg-[var(--ak-surface-secondary)] px-1.5 py-0.5 font-mono text-[0.85em] ak-text-accent-soft";

const linkClassName =
  "ak-text-accent underline decoration-[var(--ak-color-accent)] underline-offset-4 transition hover:text-[var(--ak-color-accent-soft-text)]";

function renderInline(tokens: MarkdownInline[]): ReactNode[] {
  return tokens.map((token, index) => {
    switch (token.type) {
      case "code":
        return (
          <code key={index} className={inlineCodeClassName}>
            {token.value}
          </code>
        );
      case "strong":
        return (
          <strong key={index} className="font-semibold ak-text-primary">
            {token.value}
          </strong>
        );
      case "em":
        return (
          <em key={index} className="italic">
            {token.value}
          </em>
        );
      case "link": {
        const isExternal = EXTERNAL_LINK_PATTERN.test(token.href);
        return (
          <a
            key={index}
            href={token.href}
            className={linkClassName}
            {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          >
            {token.value}
          </a>
        );
      }
      default:
        // Plain text nodes are escaped by React, so raw HTML in Markdown
        // (for example `<script>`) is rendered literally and never executed.
        return token.value;
    }
  });
}

const headingClassNames: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "mt-12 mb-5 text-2xl font-semibold leading-tight ak-text-primary sm:text-3xl",
  2: "mt-12 mb-4 text-xl font-semibold leading-snug ak-text-primary sm:text-2xl",
  3: "mt-9 mb-3 text-lg font-semibold leading-snug ak-text-primary",
  4: "mt-8 mb-3 text-base font-semibold ak-text-primary",
  5: "mt-8 mb-3 text-base font-semibold ak-text-primary",
  6: "mt-8 mb-3 text-sm font-semibold uppercase tracking-wide ak-text-muted",
};

function renderHeading(block: Extract<MarkdownBlock, { type: "heading" }>, key: number): ReactNode {
  const children = renderInline(parseInlineMarkdown(block.text));
  const className = headingClassNames[block.level];

  switch (block.level) {
    case 1:
      return (
        <h1 key={key} className={className}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 key={key} className={className}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 key={key} className={className}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 key={key} className={className}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 key={key} className={className}>
          {children}
        </h5>
      );
    default:
      return (
        <h6 key={key} className={className}>
          {children}
        </h6>
      );
  }
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  switch (block.type) {
    case "heading":
      return renderHeading(block, index);
    case "paragraph":
      return (
        <p key={index} className="mt-5 text-base leading-7 ak-text-body">
          {renderInline(parseInlineMarkdown(block.text))}
        </p>
      );
    case "list":
      return block.ordered ? (
        <ol
          key={index}
          className="mt-5 list-decimal space-y-2 pl-6 marker:text-[var(--ak-color-accent)]"
        >
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-1 text-base leading-7 ak-text-body">
              {renderInline(parseInlineMarkdown(item))}
            </li>
          ))}
        </ol>
      ) : (
        <ul
          key={index}
          className="mt-5 list-disc space-y-2 pl-6 marker:text-[var(--ak-color-accent)]"
        >
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-1 text-base leading-7 ak-text-body">
              {renderInline(parseInlineMarkdown(item))}
            </li>
          ))}
        </ul>
      );
    case "blockquote":
      return (
        <blockquote
          key={index}
          className="mt-6 border-l-2 border-[var(--ak-color-accent)] pl-5 text-base italic leading-7 ak-text-muted"
        >
          {renderInline(parseInlineMarkdown(block.text))}
        </blockquote>
      );
    case "code":
      return (
        <div
          key={index}
          className="mt-6 overflow-hidden rounded-lg border border-[var(--ak-border-subtle)]"
        >
          {block.language ? (
            <p className="border-b border-[var(--ak-border-subtle)] px-4 py-2 ak-type-label ak-text-muted">
              {block.language}
            </p>
          ) : null}
          <pre className="overflow-x-auto bg-[var(--ak-color-bg-elevated)] p-4 text-sm leading-6">
            <code className="font-mono ak-text-body">{block.code}</code>
          </pre>
        </div>
      );
    case "hr":
      return <hr key={index} className="my-10 border-t border-[var(--ak-border-subtle)]" />;
    default:
      return null;
  }
}

/**
 * Safe Markdown renderer.
 *
 * Produces React elements only — never `dangerouslySetInnerHTML` — so raw HTML
 * embedded in a post is displayed as text instead of being executed.
 */
export function Markdown({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  if (blocks.length === 0) return null;

  return <div>{blocks.map((block, index) => renderBlock(block, index))}</div>;
}
