/**
 * Card animation configuration generator
 * This file contains the logic to determine animation configs based on card index
 * TODO: Refactor to be data-driven instead of index-based
 */

import type { CardAnimationConfig } from '@/types/animation';
import { ANIMATION_CONSTANTS, calculateStartTime } from '@/types/animation';

const { BASE_DURATION } = ANIMATION_CONSTANTS;

/**
 * Get animation configuration for a card at a specific index
 * 
 * @param index - The index of the card in the portfolio items array
 * @param previousEndTime - The end time of the previous card's animation
 * @returns Configuration object for the card's animation
 */
export function getCardAnimationConfig(
  index: number,
  previousEndTime: number = 0
): CardAnimationConfig {
  switch (index) {
    case 0:
      // Base card: NGBG 25 - visible initially, lowest z-index
      return {
        type: 'base',
        zIndex: 1,
        startTime: 0,
        duration: 0,
      };

    case 1:
      // NGBG 24: stacks from bottom after fullpic25
      return {
        type: 'stack-from-bottom',
        zIndex: 3,
        startTime: BASE_DURATION, // After fullpic25 (index 2) finishes
        duration: index * BASE_DURATION,
      };

    case 2:
      // fullpic25: slides from right (or bottom on mobile)
      return {
        type: 'slide-from-right',
        zIndex: 2,
        startTime: 0,
        duration: BASE_DURATION,
        mobileBehavior: 'from-bottom',
      };

    case 3:
      // fullpic24: slides from right after NGBG 24 (index 1) finishes
      // NGBG 24 ends at: 0.5 (fullpic25) + 0.5 (NGBG 24 duration) = 1 second
      return {
        type: 'slide-from-right',
        zIndex: 4,
        startTime: calculateStartTime(BASE_DURATION, BASE_DURATION), // 1 second
        duration: BASE_DURATION,
        mobileBehavior: 'from-bottom',
      };

    case 4:
      // NGBG 25 duplicate: slides from bottom after fullpic24
      // fullpic24 ends at: 1 + 0.5 = 1.5 seconds
      return {
        type: 'slide-from-bottom',
        zIndex: 5,
        startTime: calculateStartTime(BASE_DURATION * 2, BASE_DURATION), // 1.5 seconds
        duration: BASE_DURATION,
      };

    case 5:
      // fullpic25 duplicate: slides from right after NGBG 25 duplicate
      // NGBG 25 duplicate ends at: 1.5 + 0.5 = 2 seconds
      return {
        type: 'slide-from-right',
        zIndex: 6,
        startTime: calculateStartTime(BASE_DURATION * 3, BASE_DURATION), // 2 seconds
        duration: BASE_DURATION,
        mobileBehavior: 'from-bottom',
      };

    case 6:
      // NGBG 24 duplicate: slides from bottom after fullpic25 duplicate
      // fullpic25 duplicate ends at: 2 + 0.5 = 2.5 seconds
      return {
        type: 'slide-from-bottom',
        zIndex: 7,
        startTime: calculateStartTime(BASE_DURATION * 4, BASE_DURATION), // 2.5 seconds
        duration: BASE_DURATION,
      };

    case 7:
      // fullpic24 duplicate: slides from right after NGBG 24 duplicate
      // NGBG 24 duplicate ends at: 2.5 + 0.5 = 3 seconds
      return {
        type: 'slide-from-right',
        zIndex: 8,
        startTime: calculateStartTime(BASE_DURATION * 5, BASE_DURATION), // 3 seconds
        duration: BASE_DURATION,
        mobileBehavior: 'from-bottom',
      };

    case 8:
      // White card: slides from bottom after fullpic24 duplicate
      // fullpic24 duplicate ends at: 3 + 0.5 = 3.5 seconds
      return {
        type: 'slide-from-bottom',
        zIndex: 9,
        startTime: calculateStartTime(BASE_DURATION * 6, BASE_DURATION), // 3.5 seconds
        duration: BASE_DURATION,
      };

    case 9:
      // Black fullscreen card: slides from right after white card
      // White card ends at: 3.5 + 0.5 = 4 seconds
      return {
        type: 'slide-from-right',
        zIndex: 10,
        startTime: calculateStartTime(BASE_DURATION * 7, BASE_DURATION), // 4 seconds
        duration: BASE_DURATION,
        mobileBehavior: 'from-bottom',
      };

    default:
      // Fallback for any unexpected indices
      return {
        type: 'base',
        zIndex: 1,
        startTime: 0,
        duration: 0,
      };
  }
}

