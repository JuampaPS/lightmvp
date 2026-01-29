/**
 * useStackingAnimation Hook
 *
 * GSAP ScrollTrigger stacking effect. Setup deferred via requestIdleCallback
 * to avoid blocking main thread (TBT/TTI). Uses useEffect (not useLayoutEffect)
 * so animation runs after paint.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deferOnIdle } from "@/utils/deferOnIdle";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseStackingAnimationProps {
  wrapperRef: React.RefObject<HTMLElement>;
  cardsRef: React.MutableRefObject<HTMLElement[]>;
  totalItems: number;
}

const ANIMATION_DURATION = 1;
const SCROLL_SCRUB = 0.5;

export function useStackingAnimation({
  wrapperRef,
  cardsRef,
  totalItems,
}: UseStackingAnimationProps) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    let mounted = true;

    const setup = () => {
      if (!mounted || !wrapperRef.current) return;
      const wrapper = wrapperRef.current;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: `+=${totalItems * 100}%`,
            pin: true,
            scrub: SCROLL_SCRUB,
            anticipatePin: 1,
          },
        });
        timelineRef.current = tl;

        cardsRef.current.forEach((card, index) => {
          if (!card || index === 0) return;
          gsap.set(card, { zIndex: index + 1 });
          tl.fromTo(
            card,
            { yPercent: 100 },
            { yPercent: 0, duration: ANIMATION_DURATION, ease: "none" }
          );
        });
      }, wrapper);

      ctxRef.current = ctx;
      ScrollTrigger.refresh();
    };

    const cancel = deferOnIdle(setup, { timeout: 300 });

    return () => {
      mounted = false;
      cancel();
      const ctx = ctxRef.current;
      if (ctx) {
        ctx.revert();
        ctxRef.current = null;
      }
      timelineRef.current = null;
    };
  }, [wrapperRef, cardsRef, totalItems]);

  return timelineRef;
}
