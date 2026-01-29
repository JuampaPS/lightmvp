"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface SectionHeroProps {
  videoSrc?: string;
  poster?: string;
  title: string;
  subtitle: string;
  id?: string;
  hideText?: boolean;
  priorityPoster?: boolean;
  /** When true, render div instead of section (parent provides section with id). */
  noSection?: boolean;
}

export function SectionHero({
  videoSrc,
  poster,
  title,
  subtitle,
  id,
  hideText = false,
  priorityPoster = false,
  noSection = false,
}: SectionHeroProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !videoSrc) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setNearViewport(e.isIntersecting));
      },
      { rootMargin: "300px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [videoSrc]);

  useEffect(() => {
    if (!nearViewport) return;
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setVideoReady(true);
    v.addEventListener("canplay", onCanPlay, { once: true });
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [nearViewport]);

  const Wrapper = noSection ? "div" : "section";
  return (
    <Wrapper
      ref={sectionRef}
      {...(id && !noSection ? { id } : {})}
      className="relative min-h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      {poster && (
        <Image
          src={poster}
          alt={`Hero poster for ${title}`}
          fill
          priority={priorityPoster}
          loading={priorityPoster ? undefined : "lazy"}
          sizes="100vw"
          className="object-cover"
        />
      )}

      {videoSrc && nearViewport && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            zIndex: 1,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.4s ease-in-out",
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={`Background video for ${title}`}
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
    </Wrapper>
  );
}
