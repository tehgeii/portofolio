import { useEffect } from "react";

// Several overlays (mobile menu, palette, project modal) can overlap for a
// moment while one animates out and another animates in. A shared counter
// makes sure the page is unlocked only when the *last* overlay closes.
let lockCount = 0;
let saved = { overflow: "", paddingRight: "" };

function lock() {
  if (lockCount++ > 0) return;
  const { body, documentElement } = document;
  const scrollbar = window.innerWidth - documentElement.clientWidth;
  saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  body.style.overflow = "hidden";
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
}

function unlock() {
  if (lockCount === 0 || --lockCount > 0) return;
  document.body.style.overflow = saved.overflow;
  document.body.style.paddingRight = saved.paddingRight;
}

/** Locks page scrolling while `locked` is true, without layout shift. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lock();
    return unlock;
  }, [locked]);
}
