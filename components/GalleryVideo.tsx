"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";

interface GalleryVideoProps {
  src: string;
  poster?: string;
  label: string;
  isMobile: boolean;
}

/**
 * Single active gallery video: poster until ready, then fade-in video.
 * Only mounts when this slide is active (performance). Autoplay on desktop;
 * on mobile we attempt autoplay and always show controls as fallback.
 */
export function GalleryVideo({ src, poster, label, isMobile }: GalleryVideoProps) {
  const hasPoster = Boolean(poster);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const onCanPlay = useCallback(() => {
    setVideoReady(true);
    if (isMobile) {
      const v = videoRef.current;
      if (!v) return;
      v.play().catch(() => setAutoplayBlocked(true));
    }
  }, [isMobile]);

  const onLoadedData = useCallback(() => setVideoReady(true), []);

  useEffect(() => {
    if (!isMobile) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setAutoplayBlocked(true));
  }, [isMobile]);

  return (
    <div className="relative w-full h-full">
      {hasPoster && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: videoReady ? 0 : 1, zIndex: 1 }}
          aria-hidden
        >
          <Image
            src={poster!}
            alt=""
            fill
            sizes="70vw"
            className="object-cover"
            priority={false}
          />
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        autoPlay={!isMobile}
        controls={isMobile || autoplayBlocked}
        preload="metadata"
        aria-label={label}
        onCanPlay={onCanPlay}
        onLoadedData={onLoadedData}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: videoReady ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          zIndex: 2,
        }}
      />
    </div>
  );
}
