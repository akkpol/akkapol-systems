"use client";

import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type HeroNameMotionProps = {
  children: ReactNode;
};

const heroNameStyle = {
  fontSize: "var(--ak-type-display-hero, clamp(3rem, 8vw, 7.75rem))",
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: 0.9,
  maxWidth: "100%",
  transform: "translateZ(0)",
  width: "max-content",
};

const sheenBaseStyle = {
  borderRadius: "0.08em",
  filter: "blur(18px) saturate(1.2)",
  mixBlendMode: "screen" as const,
  transform: "translateZ(0)",
  willChange: "background, opacity",
};

const rimBaseStyle = {
  background:
    "linear-gradient(90deg, rgba(246, 181, 30, 0.09), transparent 38%), linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 42%)",
  borderLeft: "1px solid rgba(246, 181, 30, 0.2)",
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  maskImage: "linear-gradient(90deg, black, black 72%, transparent 100%)",
};

export function HeroNameMotion({ children }: HeroNameMotionProps) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(48);

  const smoothX = useSpring(pointerX, { stiffness: 190, damping: 30, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 190, damping: 30, mass: 0.35 });

  const sheenBackground = useTransform([smoothX, smoothY], ([x, y]) => {
    const xPercent = Number(x);
    const yPercent = Number(y);

    return [
      `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(255, 245, 205, 0.2), transparent 24%)`,
      `radial-gradient(circle at ${Math.max(0, xPercent - 18)}% ${Math.min(100, yPercent + 20)}%, rgba(139, 216, 220, 0.13), transparent 28%)`,
      "linear-gradient(115deg, transparent 0%, rgba(246, 181, 30, 0.13) 42%, rgba(255, 255, 255, 0.1) 50%, transparent 62%)",
    ].join(", ");
  });

  if (reduceMotion) {
    return (
      <h1 className="ak-type-display-hero text-zinc-100" style={heroNameStyle}>
        {children}
      </h1>
    );
  }

  return (
    <motion.h1
      className="ak-type-display-hero ak-hero-name-motion relative isolate text-zinc-100"
      initial="rest"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
      }}
      style={heroNameStyle}
      whileHover="hover"
    >
      <motion.span
        aria-hidden="true"
        className="ak-hero-name-sheen pointer-events-none absolute inset-[-0.18em_-0.24em] -z-10"
        variants={{
          hover: { opacity: 1 },
          rest: { opacity: 0 },
        }}
        style={{
          background: sheenBackground,
          ...sheenBaseStyle,
        }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        aria-hidden="true"
        className="ak-hero-name-rim pointer-events-none absolute inset-[-0.1em_-0.2em] -z-10"
        variants={{
          hover: { opacity: 0.44 },
          rest: { opacity: 0.18 },
        }}
        style={rimBaseStyle}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      />
      {children}
    </motion.h1>
  );
}
