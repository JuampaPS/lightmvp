"use client";

import { useEffect, useRef } from "react";

type Slide = {
  id: string;
  image: string;
  video: string;
  author: string;
  title: string;
  topic: string;
  description: string;
  thumbnailTitle: string;
  thumbnailDescription: string;
};

const slides: Slide[] = [
  {
    id: "bunker-intro",
    image: "/images/1T9B5057.jpg",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4",
    author: "BUNKER",
    title: "BUNKER PRODUCTIONS",
    topic: "Creación & Diseño",
    description:
      "Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales. Desde concepto y render previo hasta instalación, operación y soporte en sitio.",
    thumbnailTitle: "BUNKER PRODUCTIONS",
    thumbnailDescription: "Creación & Diseño",
  },
  {
    id: "ngbg25",
    image: "/images/1T9B5057.jpg",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp.mp4",
    author: "BUNKER",
    title: "NGBG 25",
    topic: "Festival",
    description:
      "Main stage de aniversario con timecode completo, diseño lumínico inmersivo y mezcla híbrida de fixtures LED, láser y humo criogénico.",
    thumbnailTitle: "NGBG 25",
    thumbnailDescription: "Main Stage Anniversary",
  },
  {
    id: "werkstat",
    image: "/images/1T9B5319.jpg",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp1.mp4",
    author: "BUNKER",
    title: "WERKSTAT",
    topic: "Club",
    description:
      "Venue modular itinerante con pixel mapping 360° y barras cinéticas reprogramables. Ajustable a tracklists híbridos y sesiones live.",
    thumbnailTitle: "WERKSTAT",
    thumbnailDescription: "Club Modular 360°",
  },
  {
    id: "mapping",
    image: "/images/1T9B5371.jpg",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp2.mp4",
    author: "BUNKER",
    title: "MAPPING",
    topic: "Immersive",
    description:
      "Instalación de mapping arquitectónico sobre superficie irregular con sincronización Resolume y control de luminancia en vivo.",
    thumbnailTitle: "MAPPING",
    thumbnailDescription: "Arquitectura Interactiva",
  },
  {
    id: "ngbg24",
    image: "/images/1T9B5463.jpg",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4",
    author: "BUNKER",
    title: "NGBG 24",
    topic: "Festival",
    description:
      "Edición previa con rig en voladizo, redundancia eléctrica IP65 y programación dinámica para dos escenarios principales.",
    thumbnailTitle: "NGBG 24",
    thumbnailDescription: "Dual Stage Lighting",
  },
  {
    id: "history-venues",
    image: "/images/1T9B6015.jpg",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp4.mp4",
    author: "BUNKER",
    title: "HISTORY/VENUES",
    topic: "Corporate",
    description:
      "Campaña de marca con recorrido interactivo y triggers RFID que activan escenas personalizadas por segmento de audiencia.",
    thumbnailTitle: "HISTORY/VENUES",
    thumbnailDescription: "Interactive Tour",
  },
  {
    id: "production-cph",
    image: "/images/1T9B6102.jpg",
    video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp5.mp4",
    author: "BUNKER",
    title: "PRODUCTION CPH",
    topic: "Corporate",
    description:
      "Campaña de marca con recorrido interactivo y triggers RFID que activan escenas personalizadas por segmento de audiencia.",
    thumbnailTitle: "PRODUCTION CPH",
    thumbnailDescription: "Interactive Tour",
  },
];

const timeRunning = 3000;
const timeAutoNext = 30000;

export function BunkerSlider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hideThumbnailsRef = useRef<() => void>(() => {});
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaRef = useRef<number>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nextDom = root.querySelector<HTMLButtonElement>("#next");
    const prevDom = root.querySelector<HTMLButtonElement>("#prev");
    const carouselDom = root.querySelector<HTMLDivElement>(".carousel");
    const sliderDom = root.querySelector<HTMLDivElement>(".carousel .list");
    const thumbnailBorderDom = root.querySelector<HTMLDivElement>(".carousel .thumbnail");

    if (!nextDom || !prevDom || !carouselDom || !sliderDom || !thumbnailBorderDom) {
      return;
    }

    // Initialize thumbnails - move first to end (exact code from tutorial)
    const initThumbnails = thumbnailBorderDom.querySelectorAll<HTMLDivElement>(".item");
    if (initThumbnails.length > 0) {
      thumbnailBorderDom.appendChild(initThumbnails[0]);
    }

    let runTimeOut: number | undefined;
    let runNextAuto: number | undefined;

    const scheduleAutoNext = () => {
      if (!nextDom) return;
      if (runNextAuto) clearTimeout(runNextAuto);
      runNextAuto = window.setTimeout(() => {
        nextDom.click();
      }, timeAutoNext);
    };

    const hideActiveThumbnail = () => {
      const activeSlide = sliderDom.querySelector<HTMLDivElement>(".carousel .list .item:first-child");
      if (!activeSlide) return;
      const activeId = activeSlide.getAttribute("data-id");
      if (!activeId) return;

      const thumbnails = thumbnailBorderDom.querySelectorAll<HTMLDivElement>(".carousel .thumbnail .item");
      thumbnails.forEach((thumb) => {
        const thumbId = thumb.getAttribute("data-id");
        thumb.style.display = thumbId === activeId ? "none" : "";
      });
    };

    hideThumbnailsRef.current = hideActiveThumbnail;

    // Hide active thumbnail initially
    setTimeout(() => {
      hideActiveThumbnail();
      scheduleAutoNext();
    }, 100);

    const showSlider = (type: "next" | "prev") => {
      const sliderItemsDom = sliderDom.querySelectorAll<HTMLDivElement>(".carousel .list .item");
      const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll<HTMLDivElement>(
        ".carousel .thumbnail .item",
      );

      if (type === "next") {
        sliderDom.appendChild(sliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add("next");
      } else {
        sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add("prev");
      }

      clearTimeout(runTimeOut);
      runTimeOut = window.setTimeout(() => {
        carouselDom.classList.remove("next");
        carouselDom.classList.remove("prev");
        setTimeout(() => {
          hideActiveThumbnail();
        }, 50);
      }, timeRunning);

      scheduleAutoNext();

      // Auto play disabled
      // clearTimeout(runNextAuto);
      // runNextAuto = window.setTimeout(() => {
      //   if (nextDom) {
      //     nextDom.click();
      //   }
      // }, timeAutoNext);
    };

    const handleNext = () => showSlider("next");
    const handlePrev = () => showSlider("prev");

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      touchStartXRef.current = event.clientX;
      touchDeltaRef.current = 0;
      if (runNextAuto) {
        clearTimeout(runNextAuto);
        runNextAuto = undefined;
      }
      try {
        carouselDom.setPointerCapture(event.pointerId);
      } catch (error) {
        // Ignore pointer capture errors on unsupported browsers
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      if (touchStartXRef.current === null) return;
      touchDeltaRef.current = event.clientX - touchStartXRef.current;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      if (touchStartXRef.current === null) return;

      const delta = touchDeltaRef.current;
      if (Math.abs(delta) > 60) {
        showSlider(delta < 0 ? "next" : "prev");
      } else {
        scheduleAutoNext();
      }

      touchStartXRef.current = null;
      touchDeltaRef.current = 0;

      try {
        carouselDom.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Ignore pointer capture errors on unsupported browsers
      }
    };

    nextDom.addEventListener("click", handleNext);
    prevDom.addEventListener("click", handlePrev);
    carouselDom.addEventListener("pointerdown", handlePointerDown);
    carouselDom.addEventListener("pointermove", handlePointerMove);
    carouselDom.addEventListener("pointerup", handlePointerUp);
    carouselDom.addEventListener("pointercancel", handlePointerUp);

    // Auto start disabled
    // runNextAuto = window.setTimeout(() => {
    //   if (nextDom) {
    //     nextDom.click();
    //   }
    // }, timeAutoNext);

    return () => {
      nextDom.removeEventListener("click", handleNext);
      prevDom.removeEventListener("click", handlePrev);
      carouselDom.removeEventListener("pointerdown", handlePointerDown);
      carouselDom.removeEventListener("pointermove", handlePointerMove);
      carouselDom.removeEventListener("pointerup", handlePointerUp);
      carouselDom.removeEventListener("pointercancel", handlePointerUp);
      if (runTimeOut) clearTimeout(runTimeOut);
      if (runNextAuto) clearTimeout(runNextAuto);
      hideThumbnailsRef.current = () => {};
    };
  }, []);


  return (
    <div className="lun-dev-slider" ref={rootRef}>
      <div className="carousel">
        <div className="list">
          {slides.map((slide, index) => (
            <div className="item" key={slide.id} data-id={slide.id} style={{ backgroundColor: '#000' }}>
              {index === 0 && slide.video && (
                <video
                  className="slide-video"
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              <div className="content">
                <div className="author">{slide.author}</div>
                <div className="title rotate-title">{slide.title}</div>
                <div className="topic">{slide.topic}</div>
                <div className="des">{slide.description}</div>
                <div className="buttons">
                  <button className="gallery-button" type="button">Gallery</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="thumbnail" style={{ display: 'none' }}>
          {slides.map((slide) => (
            <div className="item" key={`${slide.id}-thumb`} data-id={slide.id}>
              <img src={slide.image} alt={slide.thumbnailTitle} />
              <div className="content">
                <div className="title">{slide.thumbnailTitle}</div>
                <div className="description">{slide.thumbnailDescription}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="arrows">
          <button id="prev" type="button">
            &lt;
          </button>
          <button id="next" type="button">
            &gt;
          </button>
        </div>

        <div className="time" />
      </div>
    </div>
  );
}

