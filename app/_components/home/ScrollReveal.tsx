"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  id,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      data-scroll-reveal="section"
      className={className}
      initial={
        reduceMotion
          ? false
          : {
              clipPath: "inset(12% 0% 0% 0%)",
              filter: "blur(7px)",
              opacity: 0.42,
              y: 34,
            }
      }
      whileInView={
        reduceMotion
          ? undefined
          : {
              clipPath: "inset(0% 0% 0% 0%)",
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
            }
      }
      viewport={{ amount: 0.12, margin: "0px 0px -6% 0px", once: false }}
      transition={{
        delay,
        duration: 0.78,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: reduceMotion ? undefined : "transform, opacity, filter, clip-path" }}
    >
      {children}
    </motion.section>
  );
}
