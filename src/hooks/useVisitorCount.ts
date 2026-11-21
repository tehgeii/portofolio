import { useEffect, useState } from "react";
import { integrations } from "../config/integrations";
import { fetchTotalVisits } from "../lib/goatcounter";

const CACHE_KEY = "visits-v1";
const REFRESH = 5 * 60 * 1000;

function readCache(): number | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, value } = JSON.parse(raw) as { at: number; value: number };
    return Date.now() - at < REFRESH ? value : null;
  } catch {
    return null;
  }
}

/**
 * The site's total visits from GoatCounter, refreshed every few minutes while
 * the tab is visible. Null while unknown, when no site code is configured, or
 * when the counter can't be read: the UI then simply shows nothing.
 */
export function useVisitorCount(enabled = true) {
  const code = integrations.goatcounterCode;
  const [count, setCount] = useState<number | null>(readCache);

  useEffect(() => {
    if (!code || !enabled) return;
    const controller = new AbortController();
    const load = () => {
      if (document.visibilityState !== "visible") return;
      fetchTotalVisits(code, AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]))
        .then((value) => {
          setCount(value);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), value }));
          } catch {
            /* ignore */
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) setCount(null);
        });
    };
    if (readCache() === null) load();
    const timer = window.setInterval(load, REFRESH);
    document.addEventListener("visibilitychange", load);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, [code, enabled]);

  return code ? count : null;
}
