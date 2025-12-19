/**
 * VideoCard Component
 * 
 * Renders a video element that covers the entire card.
 * Videos are set to autoplay, loop, and be muted for best UX.
 */

interface VideoCardProps {
  src: string;
  alt?: string;
}

export function VideoCard({ src, alt }: VideoCardProps) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ zIndex: 0 }}
      aria-label={alt}
    />
  );
}

