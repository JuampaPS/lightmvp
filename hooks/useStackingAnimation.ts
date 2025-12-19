/**
 * useStackingAnimation Hook
 * 
 * Custom hook that encapsulates all GSAP ScrollTrigger animation logic
 * for the portfolio stacking effect.
 * 
 * Uses gsap.context for proper memory cleanup and useLayoutEffect
 * to prevent FOUC (Flash of Unstyled Content).
 */

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseStackingAnimationProps {
  wrapperRef: React.RefObject<HTMLElement>;
  cardsRef: React.MutableRefObject<HTMLElement[]>;
  totalItems: number;
}

// Animation configuration constants
const ANIMATION_DURATION = 1;
const SCROLL_SCRUB = 0.5; // Smoothness of scroll animation

/**
 * Custom hook for managing portfolio stacking animations
 * 
 * @param wrapperRef - Reference to the wrapper container element
 * @param cardsRef - Mutable ref array containing all card elements
 * @param totalItems - Total number of portfolio items
 */
export function useStackingAnimation({
  wrapperRef,
  cardsRef,
  totalItems,
}: UseStackingAnimationProps) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    // Early return if wrapper is not available
    if (!wrapperRef.current) return;

    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Create timeline with ScrollTrigger configuration
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${totalItems * 100}%`, // Duration depends on number of cards
          pin: true, // Pin the container during scroll
          scrub: SCROLL_SCRUB, // Link animation to scroll position
          anticipatePin: 1,
        },
      });

      timelineRef.current = tl;

      // Apply animation to each card (skip first card as it's the base)
      cardsRef.current.forEach((card, index) => {
        if (!card || index === 0) return; // First card stays in place

        // Set z-index to ensure proper stacking order
        gsap.set(card, { zIndex: index + 1 });

        // Animate card from bottom (yPercent: 100) to position (yPercent: 0)
        tl.fromTo(
          card,
          {
            yPercent: 100, // Start completely below viewport
          },
          {
            yPercent: 0, // Move to final position
            duration: ANIMATION_DURATION,
            ease: 'none', // Linear easing for direct finger response
          }
        );
      });
    }, wrapperRef); // Scope GSAP context to wrapper

    // Cleanup function
    return () => {
      ctx.revert(); // Revert all GSAP animations and kill ScrollTriggers
    };
  }, [wrapperRef, cardsRef, totalItems]);

  return timelineRef;
}

