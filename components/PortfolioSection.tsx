"use client";

import { useEffect, useRef, useState } from "react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Light Show Experience",
    category: "Event Production",
    description: "Immersive lighting design for large-scale events",
    tags: ["DMX", "LED", "Timecode"],
  },
  {
    id: "2",
    title: "Audio System Design",
    category: "Sound Engineering",
    description: "Custom PA system configuration and tuning",
    tags: ["Line Array", "Smaart", "Tuning"],
  },
  {
    id: "3",
    title: "Visual Mapping",
    category: "Projection",
    description: "Architectural projection mapping installation",
    tags: ["Resolume", "Mapping", "3D"],
  },
];

export function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % portfolioItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative min-h-screen bg-black text-white overflow-hidden py-20"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Title */}
        <div className="mb-20">
          <h2 className="portfolio-title text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight">
            <span className={`portfolio-word ${isVisible ? "animate-in" : ""}`}>
              Portfolio
            </span>
          </h2>
        </div>

        {/* Portfolio Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className={`portfolio-card group relative overflow-hidden rounded-lg border border-[#38BDF8]/30 bg-black/50 backdrop-blur-sm p-6 transition-all duration-500 ${
                activeIndex === index
                  ? "border-[#38BDF8] scale-105 shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                  : "hover:border-[#38BDF8]/60"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-[#38BDF8]/0 via-[#38BDF8]/10 to-[#38BDF8]/0 transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-3">
                  <span className="text-[#38BDF8] text-sm font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3 portfolio-item-title">
                  {item.title.split("").map((char, i) => (
                    <span
                      key={i}
                      className="inline-block"
                      style={{
                        animationDelay: `${i * 0.05}s`,
                        animation: activeIndex === index ? "portfolio-char-in 0.6s ease-out forwards" : "none",
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Line Effect */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#38BDF8] to-transparent transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

    </section>
  );
}

