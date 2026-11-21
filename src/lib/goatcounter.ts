/**
 * Privacy-friendly visitor statistics with GoatCounter
 * (https://www.goatcounter.com): no cookies and no personal data. We call
 * its two endpoints directly instead of loading its script.
 */

const base = (code: string) => `https://${code}.goatcounter.com`;

/** True for automated browsers (tests, screenshots) and local development: those never count. */
function shouldSkip() {
  return navigator.webdriver || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
}

let counted = false;

/** Records one page view per page load. */
export function countPageview(code: string) {
  if (counted || shouldSkip()) return;
  counted = true;
  const params = new URLSearchParams({
    p: location.pathname,
    t: document.title,
    r: document.referrer,
    rnd: Math.random().toString(36).slice(2),
  });
  fetch(`${base(code)}/count?${params}`, { mode: "no-cors", credentials: "omit", keepalive: true }).catch(() => {});
}

/**
 * Total visits for the whole site. GoatCounter formats the number for display
 * ("1,234" or "1.234"), so keep only the digits. Needs "Allow adding visitor
 * counts on your website" enabled in the GoatCounter settings.
 */
export async function fetchTotalVisits(code: string, signal?: AbortSignal): Promise<number> {
  const res = await fetch(`${base(code)}/counter/TOTAL.json`, { credentials: "omit", signal });
  if (!res.ok) throw new Error(`GoatCounter ${res.status}`);
  const { count } = (await res.json()) as { count?: string | number };
  const value = Number(String(count ?? "").replace(/\D/g, ""));
  if (!Number.isFinite(value) || value <= 0) throw new Error("GoatCounter: no count");
  return value;
}
