"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export function KineticHeroFX() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const { scrollYProgress } = useScroll();

  const scroll = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 700 : 92,
    damping: reduceMotion ? 90 : 26,
    mass: reduceMotion ? 0.2 : 0.38,
  });

  const gridY = useTransform(scroll, [0, 0.34], ["-2%", "10%"]);
  const gridOpacity = useTransform(scroll, [0, 0.12, 0.36], [0.48, 0.78, 0.3]);
  const frameY = useTransform(scroll, [0, 0.32], ["0%", "-7%"]);
  const frameOpacity = useTransform(scroll, [0, 0.12, 0.34], [0.5, 0.78, 0.24]);
  const scanY = useTransform(scroll, [0, 0.34], ["-12%", "112%"]);
  const scanOpacity = useTransform(scroll, [0, 0.16, 0.36], [0.2, 0.82, 0.18]);
  const orbitRotate = useTransform(scroll, [0, 0.36], [0, 42]);
  const orbitCounterRotate = useTransform(scroll, [0, 0.36], [18, -34]);
  const signalScale = useTransform(scroll, [0, 0.2, 0.38], [0.2, 1, 0.58]);
  const signalOpacity = useTransform(scroll, [0, 0.14, 0.38], [0.22, 0.86, 0.24]);
  const cursorX = useTransform(pointerX, [0, 1], ["-9vw", "9vw"]);
  const cursorY = useTransform(pointerY, [0, 1], ["-6vh", "6vh"]);

  useEffect(() => {
    if (reduceMotion) return;

    function handlePointerMove(event: PointerEvent) {
      pointerX.set(event.clientX / window.innerWidth);
      pointerY.set(event.clientY / window.innerHeight);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerX, pointerY, reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="ak-kinetic-static pointer-events-none absolute inset-0 z-[12] overflow-hidden"
      />
    );
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
        className="ak-kinetic-grid"
        style={{ opacity: gridOpacity, y: gridY }}
      />
      <motion.div
        className="ak-kinetic-cursor-frame"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.div
        className="ak-kinetic-scan"
        style={{ opacity: scanOpacity, y: scanY }}
      />
      <motion.div
        className="ak-kinetic-orbit ak-kinetic-orbit-a"
        style={{ rotate: orbitRotate }}
      />
      <motion.div
        className="ak-kinetic-orbit ak-kinetic-orbit-b"
        style={{ rotate: orbitCounterRotate }}
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
