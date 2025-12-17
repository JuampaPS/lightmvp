/**
 * Helper functions for portfolio card rendering and styling
 */

import type { PortfolioItem } from "@/data/portfolioData";

/**
 * Card type classification
 */
export type CardType = 'grid' | 'fullscreen-image' | 'fullscreen-video';

/**
 * Get the card type based on index and item properties
 */
export function getCardType(index: number, item: PortfolioItem): CardType {
  const isFullscreenIndex = index === 2 || index === 3 || index === 5 || index === 7 || index === 9;
  const isGridIndex = index === 0 || index === 1 || index === 4 || index === 6 || index === 8;
  
  if (isFullscreenIndex && (item.video || item.image)) {
    return item.video ? 'fullscreen-video' : 'fullscreen-image';
  }
  
  if (isGridIndex) {
    return 'grid';
  }
  
  return 'grid'; // Default fallback
}

/**
 * Get CSS classes for a card based on its type
 */
export function getCardClassName(index: number, item: PortfolioItem): string {
  const cardType = getCardType(index, item);
  const baseClass = 'portfolio-card';
  
  if (cardType === 'fullscreen-image' || cardType === 'fullscreen-video') {
    return `${baseClass} portfolio-card-image`;
  }
  
  if (cardType === 'grid') {
    return `${baseClass} portfolio-card-grid`;
  }
  
  return baseClass;
}

/**
 * Get background color for a card based on index and item
 */
export function getCardBackgroundColor(
  index: number, 
  item: PortfolioItem, 
  fallbackColors: readonly string[]
): string {
  const cardType = getCardType(index, item);
  
  // Grid cards (ocupar toda la pantalla):
  // Index 0 (NGBG 25): white background
  if (index === 0) {
    return '#FFFFFF';
  }
  
  // Index 1 (NGBG 24): white background - ocupar toda la pantalla
  if (index === 1) {
    return '#FFFFFF';
  }
  
  // Index 4 (Lille Vega/Plan B): black background - ocupar toda la pantalla
  if (index === 4) {
    return '#000000';
  }
  
  // Index 6 (Werkstatt): white background - ocupar toda la pantalla
  if (index === 6) {
    return '#FFFFFF';
  }
  
  // Index 8 (Kayak): black background - ocupar toda la pantalla
  if (index === 8) {
    return '#000000';
  }
  
  // Fullscreen cards with video/image: default black
  if ((cardType === 'fullscreen-image' || cardType === 'fullscreen-video') && (item.video || item.image)) {
    return '#000000';
  }
  
  // Fallback to color array
  return fallbackColors[index % fallbackColors.length];
}

/**
 * Get text color for a card based on index
 */
export function getCardTextColor(index: number): string | undefined {
  // White background cards need black text
  // Index 0 (NGBG 25), index 1 (NGBG 24), index 6 (Werkstatt)
  if (index === 0 || index === 1 || index === 6) {
    return '#000000';
  }
  
  // Black background cards need white text
  // Index 4 (Lille Vega/Plan B), index 8 (Kayak)
  if (index === 4 || index === 8) {
    return '#FFFFFF';
  }
  
  // Default: inherit
  return undefined;
}

/**
 * Check if a card should render as grid layout
 */
export function isGridCard(index: number): boolean {
  return index === 0 || index === 1 || index === 4 || index === 6 || index === 8;
}

/**
 * Check if a card should render as fullscreen
 */
export function isFullscreenCard(index: number, item: PortfolioItem): boolean {
  const fullscreenIndices = [2, 3, 5, 7, 9];
  return fullscreenIndices.includes(index) && !!(item.video || item.image);
}

