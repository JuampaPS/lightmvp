"use client";

interface SectionHeroProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  id?: string;
}

export function SectionHero({ videoSrc, title, subtitle, id }: SectionHeroProps) {
  return (
    <section id={id} className="relative min-h-screen overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="section-hero-content">
          <div className="section-hero-brand">BUNKER</div>
          <div className="section-hero-title rotate-title">{title}</div>
          <div className="section-hero-subtitle">{subtitle}</div>
        </div>
      </div>
    </section>
  );
}



