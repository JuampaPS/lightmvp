"use client";

import { useRef, useState, useCallback } from "react";

interface GalleryVideoProps {
  src: string;
  poster?: string;
  label: string;
  isMobile?: boolean;
}

/**
 * Gallery video: starts paused, shows first frame with play button overlay.
 * User clicks to play. Same behavior as Our Journey videos.
 */
export function GalleryVideo({ src, poster, label }: GalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onLoadedData = useCallback(() => setVideoReady(true), []);

  const onPlay = useCallback(() => setIsPlaying(true), []);
  const onPause = useCallback(() => setIsPlaying(false), []);
  const onEnded = useCallback(() => setIsPlaying(false), []);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const v = videoRef.current;
    if (v) v.play();
  }, []);

  return (
    <div className="relative w-full h-full group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        autoPlay={false}
        controls={false}
        preload="metadata"
        aria-label={label}
        onLoadedData={onLoadedData}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onClick={handlePlayClick}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        style={{
          opacity: videoReady ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      {videoReady && !isPlaying && (
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
