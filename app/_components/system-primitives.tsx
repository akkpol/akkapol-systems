import type { AriaAttributes, MouseEventHandler, ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
};

type SurfaceProps = {
  as?: "div" | "article";
  children: ReactNode;
  className?: string;
  variant?: "roomy" | "compact" | "card";
};

type ContactRowProps = {
  children: ReactNode;
  href?: string;
  target?: "_blank";
};

type SystemActionProps = {
  "aria-live"?: AriaAttributes["aria-live"];
  children: ReactNode;
  className?: string;
  download?: boolean | string;
  href?: string;
  intent?: "primary" | "secondary";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
};

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      <p className="ak-type-label ak-text-accent mb-3">{eyebrow}</p>
      <h2 className="ak-type-title-section-long ak-text-primary max-w-3xl">{title}</h2>
    </div>
  );
}

export function Surface({
  as: Element = "div",
  children,
  className = "",
  variant = "compact",
}: SurfaceProps) {
  const variantClass = {
    roomy: "ak-surface-roomy",
    compact: "ak-surface-compact",
    card: "ak-surface-card",
  }[variant];

  return <Element className={`ak-surface ${variantClass} ${className}`}>{children}</Element>;
}

export function ContactRow({ children, href, target }: ContactRowProps) {
  if (href) {
    return (
      <a
        href={href}
        rel={target === "_blank" ? "noreferrer" : undefined}
        target={target}
        className="ak-contact-row"
      >
        {children}
      </a>
    );
  }

  return <div className="ak-contact-row">{children}</div>;
}

export function SystemAction({
  "aria-live": ariaLive,
  children,
  className = "",
  download,
  href,
  intent = "secondary",
  onClick,
  type = "button",
}: SystemActionProps) {
  const actionClassName = `ak-action ak-action-${intent} ${className}`.trim();

  if (href) {
    return (
      <a href={href} download={download} className={actionClassName}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={actionClassName}
      aria-live={ariaLive}
    >
      {children}
    </button>
  );
}
