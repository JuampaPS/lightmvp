export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  images: string[];
  author?: string;
  video?: string;
  image?: string;
  fullscreenOnly?: boolean;
}

export const portfolioItems: PortfolioItem[] = [
  // NGBG 25
  {
    id: "ngbg25",
    title: "NGBG 25",
    category: "Festival",
    description: "Main stage de aniversario con timecode completo, diseño lumínico inmersivo y mezcla híbrida de fixtures LED, láser y humo criogénico.",
    tags: ["Timecode", "LED", "Láser", "Humo"],
    images: ["/images/1T9B5057.jpg", "/images/1T9B5319.jpg", "/images/1T9B5371.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp.mp4",
    image: "/images/1T9B5057.jpg",
  },
  // NGBG 24
  {
    id: "ngbg24",
    title: "NGBG 24",
    category: "Festival",
    description: "Edición previa con rig en voladizo, redundancia eléctrica IP65 y programación dinámica para dos escenarios principales.",
    tags: ["Rig", "IP65", "Dual Stage"],
    images: ["/images/1T9B5057.jpg", "/images/1T9B5319.jpg", "/images/1T9B5371.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4",
    image: "/images/1T9B5463.jpg",
  },
  // MAPPING
  {
    id: "mapping",
    title: "MAPPING",
    category: "Immersive",
    description: "Instalación de mapping arquitectónico sobre superficie irregular con sincronización Resolume y control de luminancia en vivo.",
    tags: ["Resolume", "Mapping", "Arquitectónico"],
    images: ["/images/1T9B6102.jpg", "/images/1T9B6193.jpg", "/images/1T9B6814.jpg", "/images/1T9B7264.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp2.mp4",
    image: "/images/1T9B5371.jpg",
  },
  // WERKSTAT
  {
    id: "werkstat",
    title: "WERKSTAT",
    category: "Club",
    description: "Venue modular itinerante con pixel mapping 360° y barras cinéticas reprogramables. Ajustable a tracklists híbridos y sesiones live.",
    tags: ["Pixel Mapping", "360°", "Barras Cinéticas"],
    images: ["/images/1T9B5463.jpg", "/images/1T9B6015.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp1.mp4",
    image: "/images/1T9B5319.jpg",
  },
  // KAYAK
  {
    id: "kayak",
    title: "KAYAK",
    category: "Event",
    description: "Producción completa para evento con diseño lumínico innovador y sistema de audio de alta calidad.",
    tags: ["Event", "Lighting", "Audio"],
    images: ["/images/1T9B6814.jpg", "/images/1T9B7264.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp4.mp4",
    image: "/images/1T9B6814.jpg",
  },
];

