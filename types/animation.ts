/**
 * Animation configuration types for portfolio card animations
 */

export type AnimationType = 'base' | 'slide-from-right' | 'slide-from-bottom' | 'stack-from-bottom';

export type MobileBehavior = 'same' | 'from-bottom';

/**
 * Configuration for a single card animation
 */
export interface CardAnimationConfig {
  /** Type of animation to apply */
  type: AnimationType;
  /** Z-index for stacking order */
  zIndex: number;
  /** Start time in the timeline (in seconds) */
  startTime: number;
  /** Duration of the animation (in seconds) */
  duration: number;
  /** How the card behaves on mobile devices */
  mobileBehavior?: MobileBehavior;
}

/**
 * Animation constants
 */
export const ANIMATION_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  BASE_DURATION: 0.5,
  INIT_RETRY_DELAY: 100,
  SCROLL_SCRUB_VALUE: 0.1,
  INIT_SCROLL_DELAY: 200,
  RESIZE_DEBOUNCE_DELAY: 150,
  MOBILE_SCRUB_VALUE: 0.2,
  MOBILE_ANTICIPATE_PIN: 2,
  DESKTOP_ANTICIPATE_PIN: 1.5,
} as const;

/**
 * Calculate animation start time based on previous card's end time
 */
export function calculateStartTime(
  previousEndTime: number,
  delay: number = 0
): number {
  return previousEndTime + delay;
}

/**
 * Check if current viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= ANIMATION_CONSTANTS.MOBILE_BREAKPOINT;
}

/**
 * Get window width safely
 */
export function getWindowWidth(): number {
  if (typeof window === 'undefined') return 1000;
  return window.innerWidth;
}

