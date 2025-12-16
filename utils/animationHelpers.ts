/**
 * Helper functions for applying GSAP animations to cards
 */

import { gsap } from "gsap";
import type { CardAnimationConfig } from "@/types/animation";
import { ANIMATION_CONSTANTS } from "@/types/animation";

const { BASE_DURATION } = ANIMATION_CONSTANTS;

/**
 * Apply base card animation (no movement, just z-index)
 */
export function applyBaseAnimation(
  card: HTMLElement,
  config: CardAnimationConfig
): void {
  gsap.set(card, {
    x: 0,
    y: 0,
    zIndex: config.zIndex,
  });
}

/**
 * Apply slide from right animation
 */
export function applySlideFromRightAnimation(
  card: HTMLElement,
  config: CardAnimationConfig,
  timeline: gsap.core.Timeline,
  windowWidth: number
): void {
  gsap.set(card, {
    x: windowWidth,
    y: 0,
    zIndex: config.zIndex,
  });

  timeline.to(
    card,
    {
      x: 0,
      duration: config.duration,
      ease: "none",
    },
    config.startTime
  );
}

/**
 * Apply slide from bottom animation
 */
export function applySlideFromBottomAnimation(
  card: HTMLElement,
  config: CardAnimationConfig,
  timeline: gsap.core.Timeline,
  cardHeight: number
): void {
  gsap.set(card, {
    x: 0,
    y: cardHeight,
    zIndex: config.zIndex,
  });

  timeline.to(
    card,
    {
      y: 0,
      duration: config.duration,
      ease: "none",
    },
    config.startTime
  );
}

/**
 * Apply stack from bottom animation (for cards that stack after others)
 */
export function applyStackFromBottomAnimation(
  card: HTMLElement,
  config: CardAnimationConfig,
  timeline: gsap.core.Timeline,
  cardHeight: number,
  index: number
): void {
  gsap.set(card, {
    x: 0,
    y: index * cardHeight,
    zIndex: config.zIndex,
  });

  timeline.to(
    card,
    {
      y: 0,
      duration: config.duration,
      ease: "none",
    },
    config.startTime
  );
}

/**
 * Apply animation to a card based on its configuration
 */
export function applyCardAnimation(
  card: HTMLElement,
  config: CardAnimationConfig,
  timeline: gsap.core.Timeline,
  options: {
    isMobile: boolean;
    windowWidth: number;
    cardHeight: number;
    index: number;
  }
): void {
  const { isMobile, windowWidth, cardHeight, index } = options;

  // Handle mobile behavior override
  const shouldUseMobileBehavior = 
    isMobile && 
    config.mobileBehavior === 'from-bottom' && 
    (config.type === 'slide-from-right');

  switch (config.type) {
    case 'base':
      applyBaseAnimation(card, config);
      break;

    case 'slide-from-right':
      if (shouldUseMobileBehavior) {
        // Override: use slide from bottom on mobile
        applySlideFromBottomAnimation(
          card,
          { ...config, type: 'slide-from-bottom' },
          timeline,
          cardHeight
        );
      } else {
        applySlideFromRightAnimation(card, config, timeline, windowWidth);
      }
      break;

    case 'slide-from-bottom':
      applySlideFromBottomAnimation(card, config, timeline, cardHeight);
      break;

    case 'stack-from-bottom':
      applyStackFromBottomAnimation(card, config, timeline, cardHeight, index);
      break;

    default:
      // Fallback to base animation
      applyBaseAnimation(card, config);
  }
}

