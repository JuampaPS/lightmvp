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
}

export const portfolioItems: PortfolioItem[] = [
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
  {
    id: "history-venues",
    title: "HISTORY/VENUES",
    category: "Corporate",
    description: "Campaña de marca con recorrido interactivo y triggers RFID que activan escenas personalizadas por segmento de audiencia.",
    tags: ["RFID", "Interactivo", "Brand"],
    images: ["/images/1T9B5463.jpg", "/images/1T9B6015.jpg", "/images/1T9B6102.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp4.mp4",
    image: "/images/1T9B6015.jpg",
  },
  {
    id: "production-cph",
    title: "PRODUCTION CPH",
    category: "Corporate",
    description: "Campaña de marca con recorrido interactivo y triggers RFID que activan escenas personalizadas por segmento de audiencia.",
    tags: ["RFID", "Interactivo", "Brand"],
    images: ["/images/1T9B6193.jpg", "/images/1T9B6814.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp5.mp4",
    image: "/images/1T9B6102.jpg",
  },
];

