import { motion, useScroll, useSpring } from "motion/react";

/** Thin gradient bar at the very top showing how far the page is read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-accent"
      style={{ scaleX }}
    />
  );
}
