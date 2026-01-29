/**
 * Run callback after first paint, deferring to requestIdleCallback when available
 * to avoid blocking main thread (TBT / TTI). Falls back to setTimeout(0).
 * Use for heavy animation setup (GSAP, ScrollTrigger, etc.).
 */
export function deferOnIdle(cb: () => void, options?: { timeout?: number }): () => void {
  if (typeof window === "undefined") return () => {};

  const timeout = options?.timeout ?? 200;

  const id =
    typeof requestIdleCallback !== "undefined"
      ? requestIdleCallback(cb, { timeout })
      : (setTimeout(cb, 0) as unknown as number);

  const cancel = () => {
    if (typeof cancelIdleCallback !== "undefined" && typeof id === "number") {
      cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
  };

  return cancel;
}
