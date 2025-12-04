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
    images: ["/images/gallery/1ngbg25.jpg", "/images/gallery/2ngbg25.jpg", "/images/gallery/3ngbg25.png"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp.mp4",
    image: "/images/gallery/1ngbg25.jpg",
  },
  // NGBG 24
  {
    id: "ngbg24-text",
    title: "NGBG 24",
    category: "Festival",
    description: "Edición previa con rig en voladizo, redundancia eléctrica IP65 y programación dinámica para dos escenarios principales.",
    tags: ["Rig", "IP65", "Dual Stage"],
    images: ["/images/1T9B5057.jpg", "/images/1T9B5319.jpg", "/images/1T9B5371.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4",
    image: "/images/1T9B5463.jpg",
  },
  // NGBG 24 con imagen full
  {
    id: "ngbg24",
    title: "fullpic25",
    category: "Festival",
    description: "Edición previa con rig en voladizo, redundancia eléctrica IP65 y programación dinámica para dos escenarios principales.",
    tags: ["Rig", "IP65", "Dual Stage"],
    images: ["/images/1T9B5057.jpg", "/images/1T9B5319.jpg", "/images/1T9B5371.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4",
    image: "/images/gallery/3ngbg25.png",
  },
  // fullpic24
  {
    id: "fullpic24",
    title: "fullpic24",
    category: "Festival",
    description: "Imagen full de NGBG 24.",
    tags: ["Festival", "Image"],
    images: ["/images/1T9B5463.jpg"],
    author: "BUNKER",
    image: "/images/1T9B5463.jpg",
  },
  // Little Vega Plan B
  {
    id: "ngbg25-duplicate",
    title: "LILLE VEGA\nDK-2025\nPlan B\nSWE-2025",
    category: "Festival",
    description: "Light show and projection mapping for Little Vega events in Denmark and Sweden.",
    tags: ["Light Show", "Projection", "DK-2025", "SWE-2025"],
    images: ["/images/1T9B5057.jpg", "/images/1T9B5319.jpg", "/images/1T9B5371.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp.mp4",
    image: "/images/1T9B5057.jpg",
  },
  // fullpic25 (duplicado - fullscreen pic de NGBG25)
  {
    id: "fullpic25-duplicate",
    title: "fullpic25",
    category: "Festival",
    description: "Imagen full de NGBG 25.",
    tags: ["Festival", "Image"],
    images: ["/images/1T9B5057.jpg"],
    author: "BUNKER",
    image: "/images/1T9B5057.jpg",
  },
  // NGBG 24 (duplicado después de NGBG25)
  {
    id: "ngbg24-duplicate",
    title: "Werkstatt",
    category: "Festival",
    description: "Edición previa con rig en voladizo, redundancia eléctrica IP65 y programación dinámica para dos escenarios principales.",
    tags: ["Rig", "IP65", "Dual Stage"],
    images: ["/images/1T9B5057.jpg", "/images/1T9B5319.jpg", "/images/1T9B5371.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4",
    image: "/images/1T9B5463.jpg",
  },
  // fullpic24 (duplicado - fullscreen pic de NGBG24)
  {
    id: "fullpic24-duplicate",
    title: "fullpic24",
    category: "Festival",
    description: "Imagen full de NGBG 24.",
    tags: ["Festival", "Image"],
    images: ["/images/1T9B5463.jpg"],
    author: "BUNKER",
    image: "/images/1T9B5463.jpg",
  },
  // NGBG 25 (segunda duplicación después de fullpic24 duplicado)
  {
    id: "ngbg25-duplicate-2",
    title: "Kayak",
    category: "Festival",
    description: "Main stage de aniversario con timecode completo, diseño lumínico inmersivo y mezcla híbrida de fixtures LED, láser y humo criogénico.",
    tags: ["Timecode", "LED", "Láser", "Humo"],
    images: ["/images/1T9B5057.jpg", "/images/1T9B5319.jpg", "/images/1T9B5371.jpg"],
    author: "BUNKER",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp.mp4",
    image: "/images/1T9B5057.jpg",
  },
  // fullpic25 (segunda duplicación - fullscreen pic de NGBG25)
  {
    id: "fullpic25-duplicate-2",
    title: "fullpic25",
    category: "Festival",
    description: "Imagen full de NGBG 25.",
    tags: ["Festival", "Image"],
    images: ["/images/1T9B5057.jpg"],
    author: "BUNKER",
    image: "/images/1T9B5057.jpg",
  },
];

