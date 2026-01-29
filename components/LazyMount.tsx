"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  /** Placeholder until near viewport. */
  fallback?: ReactNode;
  rootMargin?: string;
  /** Called when content is revealed (e.g. ScrollTrigger.refresh). */
  onReveal?: () => void;
}

/**
 * Delays mounting children until the wrapper is near the viewport (IntersectionObserver).
 * Use for below-the-fold heavy sections to reduce initial payload and improve LCP/TTI.
 */
export function LazyMount({
  children,
  fallback = null,
  rootMargin = "300px",
  onReveal,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { rootMargin, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (visible) onRevealRef.current?.();
  }, [visible]);

  return (
    <div ref={ref}>
      {visible ? children : fallback}
    </div>
  );
}
