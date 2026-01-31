"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useIsMobile } from "@/hooks/useIsMobile";
import { GalleryVideo } from "@/components/GalleryVideo";

const IMAGES = [
  { src: "/images/gallery/videos-hero/gallery1.mp4", label: "Image / 01", type: "video" as const },
  { src: "/images/gallery/videos-hero/gallery2.jpeg", label: "Image / 02", type: "image" as const },
  { src: "/images/gallery/videos-hero/gallery3.mp4", label: "Image / 03", type: "video" as const },
  { src: "/images/gallery/videos-hero/gallery4.mp4", label: "Image / 04", type: "video" as const },
  { src: "/images/gallery/videos-hero/gallery5.mp4", label: "Image / 05", type: "video" as const },
  { src: "/images/gallery/videos-hero/gallery6.mp4", label: "Image / 06", type: "video" as const },
];

interface GalleryProps {
  noSection?: boolean;
}

export function Gallery({ noSection = false }: GalleryProps) {
  const { t } = useTranslations();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile(768);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      IMAGES.length - 1,
      Math.max(0, Math.floor(latest * IMAGES.length))
    );
    setActiveIndex(idx);
  });

  const titleRef = useRef<HTMLDivElement | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    if (!titleRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setShowLabels(true);
        });
      },
      { threshold: 0.5, rootMargin: "0px" }
    );
    observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  const activeItem = IMAGES[activeIndex];
  const Wrapper = noSection ? "div" : "section";

  return (
    <Wrapper {...(!noSection ? { id: "gallery" } : {})} className="bg-black text-slate-200">
      <div ref={titleRef} className="container mx-auto px-4 py-24">
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-4">
          {t.gallery.title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-magenta-500" />
      </div>

      <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {isMobile ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="absolute flex items-center justify-center left-0 right-0"
                  style={{
                    zIndex: 10,
                    width: "100%",
                    height: "70vh",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-none">
                    {activeItem.type === "video" ? (
                      <GalleryVideo
                        key={activeIndex}
                        src={activeItem.src}
                        label={activeItem.label}
                        isMobile={true}
                      />
                    ) : (
                      <Image
                        src={activeItem.src}
                        alt={activeItem.label}
                        fill
                        sizes="100vw"
                        className={
                          activeIndex === 1 ? "object-contain bg-black" : "object-cover"
                        }
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" aria-hidden />
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-row w-full h-[50vh] gap-2 px-4 md:px-8 items-stretch justify-center max-w-[1600px] mx-auto">
                {IMAGES.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <motion.div
                      key={item.src}
                      className="relative flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl h-full"
                      layout
                      animate={{
                        width: isActive ? "75%" : "5%",
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className={`relative w-full h-full ${isActive ? "gallery-zoom-desktop" : ""}`}>
                        {item.type === "video" ? (
                          <GalleryVideo
                            src={item.src}
                            label={item.label}
                            isMobile={false}
                            isActive={true}
                          />
                        ) : (
                          <Image
                            src={item.src}
                            alt={item.label}
                            fill
                            sizes="(max-width: 768px) 100vw, 75vw"
                            className={
                              index === 1 ? "object-contain bg-black" : "object-cover"
                            }
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" aria-hidden />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {showLabels && (
            <div className="absolute top-0 md:top-2 z-50 flex items-center gap-6 md:gap-10 flex-wrap justify-center w-full pt-4">
              {IMAGES.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <span
                    key={item.label}
                    className={`text-xs md:text-sm font-light tracking-[0.25em] uppercase transition duration-300 font-mono ${
                      isActive ? "text-slate-100 border-b-2 border-slate-100" : "text-slate-500"
                    }`}
                  >
                    Image /{" "}
                    <span className="inline-block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
