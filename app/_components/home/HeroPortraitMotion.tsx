"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type HeroPortraitMotionProps = {
  children: ReactNode;
  className: string;
};

export function HeroPortraitMotion({ children, className }: HeroPortraitMotionProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const scroll = useSpring(scrollY, {
    stiffness: reduceMotion ? 700 : 88,
    damping: reduceMotion ? 90 : 28,
    mass: reduceMotion ? 0.2 : 0.42,
  });

  const scrollOpacity = useTransform(scroll, [0, 260, 640], [1, 0.94, 0.28]);
  const portraitY = useTransform(scroll, [0, 640], ["0rem", "2.4rem"]);
  const scrollScale = useTransform(scroll, [0, 640], [1, 0.972]);

  if (reduceMotion) {
    return (
      <div className={className}>
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 24, y: 30, filter: "blur(14px) saturate(0.78)" }}
      animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px) saturate(1)" }}
      transition={{ duration: 1.34, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ opacity: scrollOpacity, y: portraitY, scale: scrollScale }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
