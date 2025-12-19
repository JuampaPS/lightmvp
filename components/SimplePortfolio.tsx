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

  // Crear array de exactamente 10 items, duplicando si es necesario
  const TARGET_CARDS = 10;
  const displayItems = [];
  for (let i = 0; i < TARGET_CARDS; i++) {
    const sourceIndex = i % portfolioItems.length;
    displayItems.push({
      ...portfolioItems[sourceIndex],
      id: `${portfolioItems[sourceIndex].id}-${i}`, // ID único para cada tarjeta
    });
  }

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
          end: `+=${displayItems.length * 100}%`, // La duración depende de la cantidad de cartas
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
      {displayItems.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => { if (el) cardsRef.current[index] = el; }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-bold shadow-2xl"
          style={{ 
            backgroundColor: index === 0 || index === 4 || index === 8 
              ? '#FFFFFF'  // Tarjetas 1, 5, 9: fondo blanco
              : index === 1 || index === 2 || index === 6 
              ? '#000000'  // Tarjetas 2, 3, 7: fondo negro
              : cardColors[index % cardColors.length],
            color: index === 0 || index === 4 || index === 8 
              ? '#000000'  // Tarjetas 1, 5, 9: texto negro
              : index === 1 || index === 2 || index === 6 
              ? '#FFFFFF'  // Tarjetas 2, 3, 7: texto blanco
              : '#FFFFFF',
            zIndex: index, // Orden inicial de capas
            overflow: 'hidden'
          }}
        >
          {/* Tarjeta 2: mostrar video, Tarjeta 4: mostrar imagen, Tarjeta 6: mostrar video, Tarjeta 8: mostrar video, resto: mostrar número o texto según corresponda */}
          {index === 1 ? (
            <video
              src="/images/gallery/videos-hero/ngbg25-Mathias Malmø Wide 28.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
          ) : index === 3 ? (
            <img
              src="/images/ngbg24fullscreen.jpg"
              alt="NGBG 24"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
              loading="lazy"
              decoding="async"
            />
          ) : index === 5 ? (
            <video
              src="/images/gallery/videos-hero/NewVegavideofull.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
          ) : index === 7 ? (
            <video
              src="/images/gallery/videos-hero/werkstattfullvideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
          ) : index === 9 ? (
            <video
              src="/images/gallery/videos-hero/NewVegavideofull.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
          ) : (
            <div className="text-center">
              <h2 
                className="text-4xl md:text-6xl lg:text-8xl font-bold uppercase"
                style={{ fontFamily: "'Teko', sans-serif" }}
              >
                {index === 0 ? 'NGBG 25' :
                 index === 2 ? 'NGBG 24' :
                 index === 4 ? 'LILLE VEGA PLAN B' :
                 index === 6 ? 'WERKSTATT' :
                 index === 8 ? 'KAYAK' :
                 index + 1}
              </h2>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
