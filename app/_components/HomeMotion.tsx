"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-amber-200 via-amber-300 to-cyan-100 shadow-[0_0_18px_rgba(251,191,36,0.35)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
