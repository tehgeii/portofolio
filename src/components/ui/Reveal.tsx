import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  /** Distance (px) the element travels while fading in. */
  y?: number;
  /** Render as a list item when used directly inside a <ul>/<ol>. */
  as?: "div" | "li";
}

/** Fades & lifts its children into view the first time they're scrolled to. */
export function Reveal({ delay = 0, y = 24, as = "div", children, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  // motion.li accepts the same props as motion.div for our purposes.
  const Component = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Component
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...props}
    >
      {children}
    </Component>
  );
}
