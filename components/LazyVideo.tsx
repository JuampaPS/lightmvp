"use client";

import { useRef, useState, useEffect } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  /** Disable autoplay (e.g. on mobile). */
  autoPlay?: boolean;
  /** Show native controls. */
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
}

const DEFAULT_ROOT_MARGIN = "200px";

/**
 * Mounts <video> only when the wrapper is near the viewport (IntersectionObserver).
 * Prevents offscreen videos from downloading on initial load.
 */
export function LazyVideo({
  src,
  poster,
  alt,
  className = "",
  autoPlay = true,
  controls = false,
  loop = true,
  muted = true,
  playsInline = true,
  preload = "none",
}: LazyVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setShouldMount(true);
        });
      },
      { rootMargin: DEFAULT_ROOT_MARGIN, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={`absolute inset-0 w-full h-full ${className}`}>
      {poster && !shouldMount && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden
        />
      )}
      {shouldMount && (
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          controls={controls}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload={preload}
          aria-label={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
