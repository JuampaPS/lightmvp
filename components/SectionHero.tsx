"use client";

import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SectionHeroProps {
  videoSrc?: string;
  poster?: string;
  title: string;
  subtitle: string;
  id?: string;
  hideText?: boolean;
}

export function SectionHero({
  videoSrc,
  poster,
  title,
  subtitle,
  id,
  hideText = false,
}: SectionHeroProps) {
  const isMobile = useIsMobile(768);

  return (
    <section
      id={id}
      className="relative min-h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* Mobile: poster as LCP (fast); no video */}
      {poster && isMobile && (
        <Image
          src={poster}
          alt={`Hero poster for ${title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Desktop: video, non-blocking */}
      {videoSrc && !isMobile && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={`Background video for ${title}`}
          style={{ zIndex: 0 }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
        <div className="section-hero-content">
          <div className="section-hero-brand">BUNKER</div>
          {!hideText && <div className="section-hero-title rotate-title">{title}</div>}
          <div className="section-hero-subtitle">{subtitle}</div>
        </div>
      </div>
    </section>
  );
}
