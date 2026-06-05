import type { ReactNode } from "react";

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

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      <p className="ak-type-label mb-3 text-amber-300/80">{eyebrow}</p>
      <h2 className="ak-type-title-section-long max-w-3xl text-white">{title}</h2>
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
