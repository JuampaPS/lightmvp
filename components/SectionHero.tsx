"use client";

interface SectionHeroProps {
  videoSrc?: string;
  title: string;
  subtitle: string;
  id?: string;
  hideText?: boolean;
}

export function SectionHero({ videoSrc, title, subtitle, id, hideText = false }: SectionHeroProps) {
  return (
    <section id={id} className="relative min-h-screen overflow-hidden bg-black" style={{ position: 'relative', zIndex: 1 }}>
      {videoSrc && (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
          style={{ zIndex: 0 }}
          aria-label={`Background video for ${title}`}
      />
      )}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
        <div className="section-hero-content">
          <div className="section-hero-brand">BUNKER</div>
          {!hideText && (
          <div className="section-hero-title rotate-title">{title}</div>
          )}
          <div className="section-hero-subtitle">{subtitle}</div>
        </div>
      </div>
    </section>
  );
}



