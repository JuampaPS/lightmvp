"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, MotionValue } from "framer-motion";

// Componente para cada letra con efecto de reveal
const Letter = ({ letter, index, totalLetters, progressValue }: { letter: string; index: number; totalLetters: number; progressValue: MotionValue<number> }) => {
  const start = index / totalLetters;
  const end = start + (1 / totalLetters);
  
  // Opacidad que va de 0.3 (gris) a 1 (blanco) para crear el efecto de revelado
  const opacity = useTransform(progressValue, [start, end], [0.3, 1]);
  // Color que va de gris a blanco
  const color = useTransform(progressValue, [start, end], ["#a3a3a3", "#ffffff"]);
  // Font weight que va de normal a bold
  const fontWeight = useTransform(progressValue, [start, end], [400, 900]);
  
  return (
    <motion.span 
      style={{ 
        opacity,
        color,
        fontWeight,
        fontFamily: "Inter, sans-serif",
        fontSize: "clamp(1.5rem, 6vw, 3rem)",
        letterSpacing: "0.1em",
        display: "inline-block",
      }}
    >
      {letter}
    </motion.span>
  );
};

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  
  // Crear un valor de progreso para framer-motion
  const progressValue = useMotionValue(0);
  
  // Texto BUNKER
  const bunkerText = "BUNKER";
  const letters = bunkerText.split("");

  useEffect(() => {
    // Simular progreso de carga
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev < 50 ? prev + 1 : prev < 80 ? prev + 0.8 : prev + 0.3;
        const finalProgress = Math.min(newProgress, 100);
        
        // Actualizar el valor de progreso para framer-motion
        progressValue.set(finalProgress / 100);
        
        if (finalProgress >= 100) {
          clearInterval(interval);
          // Esperar un poco antes de iniciar animación de cierre
          setTimeout(() => {
            setIsClosing(true);
            setTimeout(() => {
              setIsVisible(false);
            }, 600);
          }, 500);
          return 100;
        }
        return finalProgress;
      });
    }, 50); // Actualizar cada 50ms (más lento)

    // Asegurar que se oculte cuando la página esté completamente cargada
    const handleLoad = () => {
      setProgress(100);
      progressValue.set(1);
      setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 600);
      }, 500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handleLoad);
    };
  }, [progressValue]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className={isClosing ? "loader-closing" : ""}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: isClosing ? "transform 0.6s ease-in-out, opacity 0.6s ease-in-out" : "opacity 0.3s ease-out",
          opacity: isVisible ? 1 : 0,
          transform: isClosing ? "translateY(100%)" : "translateY(0)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexDirection: "column",
          }}
        >
          {/* BUNKER y Logo al lado (horizontal) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexDirection: "row",
            }}
          >
            {/* Texto BUNKER primero */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.1rem",
              }}
            >
              {letters.map((letter, index) => (
                <Letter
                  key={index}
                  letter={letter}
                  index={index}
                  totalLetters={letters.length}
                  progressValue={progressValue}
                />
              ))}
            </div>
            {/* Logo giratorio al lado */}
            <div
              style={{
                width: "clamp(24px, 6vw, 48px)",
                height: "clamp(24px, 6vw, 48px)",
                animation: "loaderSpinHorizontal 2s linear 2",
                animationFillMode: "forwards",
              }}
            >
              <img
                src="/images/gallery/videos-hero/newcleanlogo.png"
                alt="BUNKER"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
          {/* Contador debajo */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 4vw, 2.5rem)",
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: "0.1em",
              marginTop: "0.5rem",
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loaderSpinHorizontal {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(720deg); }
          }
        `
      }} />
    </>
  );
}
