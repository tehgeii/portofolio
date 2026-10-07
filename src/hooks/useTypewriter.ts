import { useEffect, useState } from "react";

interface Options {
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  /** When true, show the first word statically (reduced motion). */
  disabled?: boolean;
}

/** Types and deletes each word in turn, looping forever. */
export function useTypewriter(
  words: readonly string[],
  { typeSpeed = 70, deleteSpeed = 40, pause = 1600, disabled = false }: Options = {},
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Restart cleanly when the word list changes (e.g. language switch).
  const key = words.join("|");
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setIndex(0);
    setText("");
    setDeleting(false);
  }

  useEffect(() => {
    if (disabled || words.length === 0) return;
    const word = words[index % words.length];

    let delay = deleting ? deleteSpeed : typeSpeed;
    if (!deleting && text === word) delay = pause;
    else if (deleting && text === "") delay = 300;

    const timer = window.setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause, disabled]);

  return disabled ? (words[0] ?? "") : text;
}
