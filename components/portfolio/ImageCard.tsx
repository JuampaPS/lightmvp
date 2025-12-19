/**
 * ImageCard Component
 * 
 * Renders an image element that covers the entire card.
 * Uses lazy loading and async decoding for performance.
 */

interface ImageCardProps {
  src: string;
  alt: string;
}

export function ImageCard({ src, alt }: ImageCardProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ zIndex: 0 }}
      loading="lazy"
      decoding="async"
    />
  );
}

