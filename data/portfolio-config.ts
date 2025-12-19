/**
 * Portfolio Configuration - Single Source of Truth
 * 
 * This file contains the data-driven configuration for all portfolio cards.
 * Each card is defined with its type, content, and styling properties.
 * 
 * Layout Types:
 * - 'fullscreen': Video or image that covers the entire card
 * - 'grid-layout': Text + gallery images in a 2x2 grid (desktop) or column (mobile)
 */

export interface PortfolioItem {
  id: string;
  layout: 'fullscreen' | 'grid-layout';
  title: string;
  subtitle?: string; // For dates like "SWE-2025", "DK-2025"
  description?: string; // Multi-line description text
  mediaType?: 'video' | 'image'; // For fullscreen layout
  mediaSrc?: string; // For fullscreen layout
  galleryImages?: string[]; // For grid-layout (2-3 images)
  bgColor: string;
  textColor: string;
}

export const PORTFOLIO_DATA: PortfolioItem[] = [
  // TARJETA 1 (Old Index 0): NGBG 25 - Grid Layout
  {
    id: 'ngbg-25',
    layout: 'grid-layout',
    title: 'NGBG 25',
    subtitle: 'SWE-2025',
    description: 'FROM CONCEPT TO EXECUTION –\n2 DAYS STAGE PRODUCTION\nAT NGBG STREET FESTIVAL\n2025 & 2024',
    bgColor: '#FFFFFF',
    textColor: '#000000',
    galleryImages: [
      '/images/gallery/1ngbg25.jpg',
      '/images/gallery/2ngbg25.jpg',
      '/images/gallery/3ngbg25.png',
    ],
  },

  // TARJETA 2 (Old Index 1): NGBG 25 Video - Fullscreen
  {
    id: 'ngbg-25-video',
    layout: 'fullscreen',
    title: 'NGBG 25 Video',
    mediaType: 'video',
    mediaSrc: '/images/gallery/videos-hero/ngbg25-Mathias Malmø Wide 28.mp4',
    bgColor: '#000000',
    textColor: '#FFFFFF',
  },

  // TARJETA 3 (Old Index 2): NGBG 24 - Grid Layout
  {
    id: 'ngbg-24',
    layout: 'grid-layout',
    title: 'NGBG 24',
    subtitle: 'SWE-2024',
    bgColor: '#000000',
    textColor: '#FFFFFF',
    galleryImages: [
      '/images/gallery/1ngbg24.png',
      '/images/gallery/2ngbg24.jpg',
      '/images/gallery/3ngbg24.jpg',
    ],
  },

  // TARJETA 4 (Old Index 3): NGBG 24 Full Image - Fullscreen
  {
    id: 'ngbg-24-full-image',
    layout: 'fullscreen',
    title: 'NGBG 24 Image',
    mediaType: 'image',
    mediaSrc: '/images/ngbg24fullscreen.jpg',
    bgColor: '#000000',
    textColor: '#FFFFFF',
  },

  // TARJETA 5 (Old Index 4): LILLE VEGA PLAN B - Grid Layout
  {
    id: 'lille-vega-plan-b',
    layout: 'grid-layout',
    title: 'LILLE VEGA\nPLAN B',
    description: 'LIGHT SHOW AND PROJECTION MAPPING\nON 3D STRUCTURES',
    bgColor: '#FFFFFF',
    textColor: '#000000',
    galleryImages: [
      '/images/gallery/1planb.JPG',
      '/images/gallery/2planb.JPG',
      '/images/gallery/vega1.JPG',
    ],
  },

  // TARJETA 6 (Old Index 5): New Vega Video - Fullscreen
  {
    id: 'new-vega-video',
    layout: 'fullscreen',
    title: 'Vega Video',
    mediaType: 'video',
    mediaSrc: '/images/gallery/videos-hero/NewVegavideofull.mp4',
    bgColor: '#000000',
    textColor: '#FFFFFF',
  },

  // TARJETA 7 (Old Index 6): WERKSTATT - Grid Layout
  {
    id: 'werkstatt',
    layout: 'grid-layout',
    title: 'WERKSTATT',
    subtitle: 'DK-2025',
    description: "VISUAL SHOW IN KLUB WERKSTATT'S REIMAGINED\nENGINE WORKSHOP — A CUSTOM CONCEPT\nCRAFTED FROM OUR DESIGNS.",
    bgColor: '#000000',
    textColor: '#FFFFFF',
    galleryImages: [
      '/images/gallery/1werkstatt.jpg',
      '/images/gallery/2werkstatt.jpg',
      '/images/gallery/3werkstatt.jpg',
    ],
  },

  // TARJETA 8 (Old Index 7): Werkstatt Video - Fullscreen
  {
    id: 'werkstatt-video',
    layout: 'fullscreen',
    title: 'Werkstatt Video',
    mediaType: 'video',
    mediaSrc: '/images/gallery/videos-hero/werkstattfullvideo.mp4',
    bgColor: '#000000',
    textColor: '#FFFFFF',
  },

  // TARJETA 9 (Old Index 8): KAYAK - Grid Layout
  {
    id: 'kayak',
    layout: 'grid-layout',
    title: 'KAYAK',
    subtitle: 'DK-2025',
    description: 'HALLOWEEN VISUALS AT KAYAK BAR —\nPROGRAMMED AND PERFORMED LIVE.',
    bgColor: '#FFFFFF',
    textColor: '#000000',
    galleryImages: [
      '/images/gallery/1kayaknew.jpg',
      '/images/gallery/2kayak.jpg',
      '/images/gallery/3kayak.jpg',
    ],
  },

  // TARJETA 10 (Old Index 9): Kayak Video - Fullscreen
  {
    id: 'kayak-video',
    layout: 'fullscreen',
    title: 'Kayak Video',
    mediaType: 'video',
    mediaSrc: '/images/gallery/videos-hero/kayakfullvideo.mp4',
    bgColor: '#000000',
    textColor: '#FFFFFF',
  },
];
