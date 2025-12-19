"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioItems } from "@/data/portfolioData";

// Registramos el plugin si estamos en el cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Configuración simple
const ANIMATION_DURATION = 1;
const SCROLL_SCRUB = 0.5; // Suavidad del scroll

// Array of different colors for each card
const cardColors = [
  "#1565C0", // Blue
  "#303F9F", // Dark blue
  "#C2185B", // Pink/Magenta
  "#F57C00", // Orange
  "#00796B", // Teal
];

export function SimplePortfolio() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // 1. Limpieza inicial
    const ctx = gsap.context(() => {
      // Reiniciar refs en caso de re-render
      if (!wrapperRef.current) return;
      
      // Crear Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: `+=${portfolioItems.length * 100}%`, // La duración depende de la cantidad de cartas
          pin: true,      // "Congela" el contenedor
          scrub: SCROLL_SCRUB, // Vincula la animación al scroll
          anticipatePin: 1,
        }
      });

      timelineRef.current = tl;

      // 2. Lógica de Animación Universal
      cardsRef.current.forEach((card, index) => {
        if (!card || index === 0) return; // La primera carta ya está ahí, no se anima

        // Animación: Las cartas vienen desde abajo (y: "100%") hasta su posición (y: "0%")
        // Se usa zIndex para asegurar que la nueva tape a la vieja
        gsap.set(card, { zIndex: index + 1 });

        tl.fromTo(card, 
          { 
            yPercent: 100 // Empieza completamente abajo (fuera de pantalla)
          },
          { 
            yPercent: 0,   // Sube hasta cubrir la pantalla
            duration: ANIMATION_DURATION,
            ease: "none"   // Lineal para que responda directo al dedo
          }
        );
      });

    }, wrapperRef); // Scope de GSAP

    return () => ctx.revert(); // Limpieza al desmontar
  }, []);

  return (
    // Contenedor Principal: Altura dinámica para móviles (100dvh) y overflow hidden
    <div 
      ref={wrapperRef} 
      className="relative w-full h-[100dvh] overflow-hidden bg-black"
    >
      {portfolioItems.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => { if (el) cardsRef.current[index] = el; }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-bold shadow-2xl"
          style={{ 
            backgroundColor: index === 0 || index === 4 || index === 8 
              ? '#FFFFFF' 
              : index === 1 || index === 6 
              ? '#000000' 
              : cardColors[index % cardColors.length],
            color: index === 0 || index === 4 || index === 8 
              ? '#000000' 
              : index === 1 || index === 6 
              ? '#FFFFFF' 
              : '#FFFFFF',
            zIndex: index // Orden inicial de capas
          }}
        >
          {/* Contenido de la tarjeta */}
          <div className="text-center px-8 max-w-4xl">
            <h2 
              className="text-4xl md:text-6xl lg:text-8xl mb-4 font-bold uppercase"
              style={{ fontFamily: "'Teko', sans-serif" }}
            >
              {item.title.replace(/\n/g, " ")}
            </h2>
            <p 
              className="text-xl md:text-2xl mb-4 font-light opacity-80 uppercase"
              style={{ fontFamily: "'Teko', sans-serif" }}
            >
              {item.category}
            </p>
            <p 
              className="text-base md:text-lg mb-6 opacity-70 leading-relaxed"
              style={{ fontFamily: "'Teko', sans-serif" }}
            >
              {item.description}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {item.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-3 py-1 bg-white/10 rounded text-sm uppercase"
                  style={{ fontFamily: "'Teko', sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
