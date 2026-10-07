/** True on Apple devices, where shortcuts use ⌘ instead of Ctrl. */
export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
