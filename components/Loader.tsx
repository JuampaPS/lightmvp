"use client";

import { useEffect, useState } from "react";

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Simular progreso de carga
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Iniciar animación de cierre
          setIsClosing(true);
          // Esperar un poco antes de ocultar
          setTimeout(() => {
            setIsVisible(false);
          }, 600);
          return 100;
        }
        // Más lento: Acelerar al inicio, desacelerar al final
        const increment = prev < 50 ? 1 : prev < 80 ? 0.8 : 0.3;
        return Math.min(prev + increment, 100);
      });
    }, 50); // Actualizar cada 50ms (más lento)

    // Asegurar que se oculte cuando la página esté completamente cargada
    const handleLoad = () => {
      setProgress(100);
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 600);
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
  }, []);

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
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 4vw, 2.5rem)",
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: "0.1em",
            }}
          >
            {Math.round(progress)}%
          </div>
          <div
            style={{
              width: "clamp(24px, 6vw, 48px)",
              height: "clamp(24px, 6vw, 48px)",
              animation: "loaderSpin 2s linear infinite",
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
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loaderSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </>
  );
}
