"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export function Gallery() {
  const { t } = useTranslations();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const IMAGES = [
    { src: "/images/1T9B5057.jpg", label: "Image / 01" },
    { src: "/images/1T9B5319.jpg", label: "Image / 02" },
    { src: "/images/1T9B5371.jpg", label: "Image / 03" },
    { src: "/images/1T9B5463.jpg", label: "Image / 04" },
    { src: "/images/1T9B6015.jpg", label: "Image / 05" },
    { src: "/images/1T9B6102.jpg", label: "Image / 06" },
  ];

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

  return (
    <section id="gallery" className="bg-black text-slate-200">
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl md:text-7xl font-bold text-white mb-4">
          {t.gallery.title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-magenta-500"></div>
      </div>

      <div 
        ref={containerRef}
        className="relative"
        style={{ height: '400vh' }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {IMAGES.map((item, index) => {
              const total = IMAGES.length;
              const step = 1 / total;
              const start = step * index;
              const end = step * (index + 1);
              const timeStart = start;
              const timeFadeInEnd = start + (step * 0.2);
              const timeStay = start + (step * 0.5);
              const timeFlyOut = end;
              
              const opacity = useTransform(
                scrollYProgress,
                [timeStart, timeFadeInEnd, timeStay, timeFlyOut],
                [0, 1, 1, 0] 
              );

              const scale = useTransform(
                scrollYProgress,
                [timeStart, timeStay, timeFlyOut],
                [0.5, 1, 3] 
              );
              
              const filter = useTransform(
                scrollYProgress,
                [timeStay, timeFlyOut],
                ["blur(0px)", "blur(10px)"]
              );

              return (
                <motion.div
                  key={index}
                  className="absolute flex items-center justify-center"
                  style={{
                    opacity,
                    scale,
                    filter,
                    zIndex: IMAGES.length - index,
                    width: '70vw',
                    height: '45vh',
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[32px] shadow-2xl">
                    <img
                      src={item.src}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="absolute bottom-10 z-50 flex items-center gap-6 md:gap-10 flex-wrap justify-center">
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
        </div>
      </div>
    </section>
  );
}
