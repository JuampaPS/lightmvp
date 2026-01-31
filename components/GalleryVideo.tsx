"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface GalleryVideoProps {
  src: string;
  poster?: string;
  label: string;
  isMobile?: boolean;
  /** When false (e.g. inactive in desktop carousel), no autoplay. */
  isActive?: boolean;
}

/**
 * Gallery video: Desktop active = autoplay. Desktop inactive = first frame only. Mobile = paused with play button.
 * Safari: inactive videos need video.load() + loadedmetadata/seeked to show first frame.
 */
export function GalleryVideo({ src, poster, label, isMobile = false, isActive = true }: GalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setVideoReady(false);
    setIsPlaying(false);
  }, [src, isActive, isMobile]);

  const onLoadedData = useCallback(() => setVideoReady(true), []);

  const onLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isMobile && !isActive) {
      v.currentTime = 0.01;
    }
  }, [isMobile, isActive]);

  const onSeeked = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isMobile && !isActive) {
      v.pause();
      setVideoReady(true);
    }
  }, [isMobile, isActive]);

  const onCanPlay = useCallback(() => {
    if (!isMobile && isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isMobile, isActive]);

  const onPlay = useCallback(() => setIsPlaying(true), []);
  const onPause = useCallback(() => setIsPlaying(false), []);
  const onEnded = useCallback(() => setIsPlaying(false), []);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const v = videoRef.current;
    if (v) v.play();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!isMobile && !isActive) {
      v.load();
    }
  }, [src, isMobile, isActive]);

  useEffect(() => {
    if (!isMobile && isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isMobile, isActive]);

  const showPlayButton = isMobile && videoReady && !isPlaying;
  const preload = !isMobile && !isActive ? "auto" : "metadata";

  return (
    <div className="relative w-full h-full group">
      <video
        ref={videoRef}
        poster={poster}
        muted
        playsInline
        loop
        autoPlay={!isMobile && isActive}
        controls={false}
        preload={preload}
        aria-label={label}
        onLoadedData={onLoadedData}
        onLoadedMetadata={onLoadedMetadata}
        onSeeked={onSeeked}
        onCanPlay={onCanPlay}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onClick={showPlayButton ? handlePlayClick : undefined}
        className={`absolute inset-0 w-full h-full object-cover ${showPlayButton ? "cursor-pointer" : ""}`}
        style={{
          opacity: videoReady ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {showPlayButton && (
        <button
          type="button"
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black rounded-[inherit]"
          aria-label="Play video"
        >
          <span className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
