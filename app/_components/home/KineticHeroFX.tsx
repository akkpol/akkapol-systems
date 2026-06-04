"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export function KineticHeroFX() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scroll = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 700 : 92,
    damping: reduceMotion ? 90 : 26,
    mass: reduceMotion ? 0.2 : 0.38,
  });

  const frameY = useTransform(scroll, [0, 0.32], ["0%", "-7%"]);
  const frameOpacity = useTransform(scroll, [0, 0.12, 0.34], [0.5, 0.78, 0.24]);
  const scanY = useTransform(scroll, [0, 0.34], ["-12%", "112%"]);
  const scanOpacity = useTransform(scroll, [0, 0.16, 0.36], [0.2, 0.82, 0.18]);
  const signalScale = useTransform(scroll, [0, 0.2, 0.38], [0.2, 1, 0.58]);
  const signalOpacity = useTransform(scroll, [0, 0.14, 0.38], [0.22, 0.86, 0.24]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[12] overflow-hidden"
    >
      <motion.div
        className="ak-kinetic-stage-frame"
        style={{ opacity: frameOpacity, y: frameY }}
      />
      <motion.div
        className="ak-kinetic-scan"
        style={{ opacity: scanOpacity, y: scanY }}
      />
      <motion.span
        className="ak-kinetic-signal ak-kinetic-signal-a"
        style={{ opacity: signalOpacity, scaleX: signalScale }}
      />
      <motion.span
        className="ak-kinetic-signal ak-kinetic-signal-b"
        style={{ opacity: signalOpacity, scaleX: signalScale }}
      />
      <motion.span
        className="ak-kinetic-signal ak-kinetic-signal-c"
        style={{ opacity: signalOpacity, scaleX: signalScale }}
      />
    </div>
  );
}
