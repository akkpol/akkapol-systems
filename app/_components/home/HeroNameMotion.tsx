"use client";

import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type HeroNameMotionProps = {
  children: ReactNode;
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
    return <h1 className="ak-type-display-hero text-zinc-100">{children}</h1>;
  }

  return (
    <motion.h1
      className="ak-type-display-hero ak-hero-name-motion relative isolate text-zinc-100"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
      }}
    >
      <motion.span
        aria-hidden="true"
        className="ak-hero-name-sheen pointer-events-none absolute inset-[-0.18em_-0.24em] -z-10"
        style={{
          background: sheenBackground,
        }}
      />
      <motion.span
        aria-hidden="true"
        className="ak-hero-name-rim pointer-events-none absolute inset-[-0.1em_-0.2em] -z-10"
      />
      {children}
    </motion.h1>
  );
}
