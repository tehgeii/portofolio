import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
  /** Seconds to wait before the first count, e.g. while the parent fades in. */
  delay?: number;
}

/**
 * Counts up to `value` the first time it scrolls into view. When the value
 * changes later (live data replacing the snapshot) it moves from the number
 * on screen to the new one instead of starting again from 0.
 */
export function CountUp({ value, suffix = "", duration = 1.6, delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const counted = useRef(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const render = (v: number) => {
      shown.current = v;
      el.textContent = `${Math.round(v)}${suffix}`;
    };
    if (reduce || shown.current === value) {
      render(value);
      counted.current = true;
      return;
    }
    const controls = animate(shown.current, value, {
      duration: counted.current ? 0.8 : duration,
      delay: counted.current ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        counted.current = true;
        render(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, delay, reduce]);

  // Screen readers get the final value; the animated digits are decorative.
  return (
    <>
      <span ref={ref} aria-hidden="true">{`0${suffix}`}</span>
      <span className="sr-only">{`${value}${suffix}`}</span>
    </>
  );
}
