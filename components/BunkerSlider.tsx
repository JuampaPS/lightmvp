"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import { portfolioItems } from "@/data/portfolioData";

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

// Primera tarjeta del slider: BUNKER PRODUCTIONS
const bunkerIntroSlide: Slide = {
  id: "bunker-intro",
  image: "/images/1T9B5057.jpg",
  video: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4",
  author: "BUNKER",
  title: "BUNKER PRODUCTIONS",
  topic: "Creación & Diseño",
  description: "Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales. Desde concepto y render previo hasta instalación, operación y soporte en sitio.",
  thumbnailTitle: "BUNKER PRODUCTIONS",
  thumbnailDescription: "Creación & Diseño",
};

// Convertir portfolioItems a slides para el slider (las 6 tarjetas del portafolio)
const portfolioSlides: Slide[] = portfolioItems.map((item) => ({
  id: item.id,
  image: item.image || item.images[0] || "/images/1T9B5057.jpg",
  video: item.video || "",
  author: item.author || "BUNKER",
  title: item.title,
  topic: item.category,
  description: item.description,
  thumbnailTitle: item.title,
  thumbnailDescription: item.category,
}));

// Combinar: primera tarjeta BUNKER PRODUCTIONS + las 6 del portafolio
const slides: Slide[] = [bunkerIntroSlide, ...portfolioSlides];

const timeRunning = 3000;
const timeAutoNext = 30000;

export interface BunkerSliderRef {
  resetToFirst: () => void;
}

export const BunkerSlider = forwardRef<BunkerSliderRef>((props, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const hideThumbnailsRef = useRef<() => void>(() => {});
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaRef = useRef<number>(0);
  const runNextAutoRef = useRef<number | undefined>(undefined);
  const resetToFirstRef = useRef<() => void>(() => {});
  const [isMounted, setIsMounted] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="lun-dev-slider" ref={rootRef} suppressHydrationWarning>
        <div className="carousel">
          <div className="list">
            {slides.map((slide, index) => (
              <div className="item" key={slide.id} data-id={slide.id} style={{ backgroundColor: '#000' }}>
                {index === 0 && slide.video && (
                  <video
                    className="slide-video-fullscreen"
                    src={slide.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                )}
                {index !== 0 && slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="slide-image"
                  />
                )}
                <div className="content">
                  <div className="author">{slide.author}</div>
                  <div className="title rotate-title">{slide.title}</div>
                  <div className="topic">{slide.topic}</div>
                  <div className="des">{slide.description}</div>
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
            <button id="prev" type="button">&lt;</button>
            <button id="next" type="button">&gt;</button>
          </div>
          <div className="time" />
        </div>
      </div>
    );
  }

  // Set mounted flag to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Wait for next tick to ensure hydration is complete
    const timeoutId = setTimeout(() => {
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
      runNextAutoRef.current = runNextAuto;

      const scheduleAutoNext = () => {
        if (!nextDom) return;
        if (runNextAuto) clearTimeout(runNextAuto);
        runNextAuto = window.setTimeout(() => {
          nextDom.click();
        }, timeAutoNext);
        runNextAutoRef.current = runNextAuto;
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
      };

      const resetToFirst = () => {
        if (!sliderDom || !thumbnailBorderDom || !carouselDom) return;
        
        const sliderItemsDom = sliderDom.querySelectorAll<HTMLDivElement>(".carousel .list .item");
        const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll<HTMLDivElement>(".carousel .thumbnail .item");
        
        // Find the first slide (bunker-intro)
        const firstSlideId = slides[0].id;
        let firstSlideIndex = -1;
        let firstThumbIndex = -1;
        
        sliderItemsDom.forEach((item, index) => {
          if (item.getAttribute("data-id") === firstSlideId) {
            firstSlideIndex = index;
          }
        });
        
        thumbnailItemsDom.forEach((item, index) => {
          if (item.getAttribute("data-id") === firstSlideId) {
            firstThumbIndex = index;
          }
        });
        
        // Move first slide to the beginning
        if (firstSlideIndex > 0) {
          const firstSlide = sliderItemsDom[firstSlideIndex];
          sliderDom.insertBefore(firstSlide, sliderItemsDom[0]);
        }
        
        if (firstThumbIndex > 0) {
          const firstThumb = thumbnailItemsDom[firstThumbIndex];
          thumbnailBorderDom.insertBefore(firstThumb, thumbnailItemsDom[0]);
        }
        
        // Clear any running animations
        carouselDom.classList.remove("next");
        carouselDom.classList.remove("prev");
        
        // Reset auto-advance timer
        if (runNextAuto) {
          clearTimeout(runNextAuto);
          runNextAuto = undefined;
          runNextAutoRef.current = undefined;
        }
        
        // Hide active thumbnail and restart auto-advance
        setTimeout(() => {
          hideActiveThumbnail();
          scheduleAutoNext();
        }, 100);
      };
      
      // Store reset function in ref for useImperativeHandle
      resetToFirstRef.current = resetToFirst;

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

      // Store cleanup function
      cleanupRef.current = () => {
        nextDom.removeEventListener("click", handleNext);
        prevDom.removeEventListener("click", handlePrev);
        carouselDom.removeEventListener("pointerdown", handlePointerDown);
        carouselDom.removeEventListener("pointermove", handlePointerMove);
        carouselDom.removeEventListener("pointerup", handlePointerUp);
        carouselDom.removeEventListener("pointercancel", handlePointerUp);
        if (runTimeOut) clearTimeout(runTimeOut);
        if (runNextAuto) clearTimeout(runNextAuto);
        if (runNextAutoRef.current) clearTimeout(runNextAutoRef.current);
        hideThumbnailsRef.current = () => {};
      };
    }, 100); // Small delay to ensure hydration is complete

    return () => {
      clearTimeout(timeoutId);
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isMounted]);

  // Expose resetToFirst via ref
  useImperativeHandle(ref, () => ({
    resetToFirst: () => {
      if (resetToFirstRef.current) {
        resetToFirstRef.current();
      }
    }
  }));


  return (
    <div className="lun-dev-slider" ref={rootRef} suppressHydrationWarning>
      <div className="carousel">
        <div className="list">
          {slides.map((slide, index) => (
            <div className="item" key={slide.id} data-id={slide.id} style={{ backgroundColor: '#000' }}>
              {index === 0 && slide.video && (
                <video
                  className="slide-video-fullscreen"
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              {index !== 0 && slide.image && (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="slide-image"
                />
              )}
              <div className="content">
                <div className="author">{slide.author}</div>
                <div className="title rotate-title">{slide.title}</div>
                <div className="topic">{slide.topic}</div>
                <div className="des">{slide.description}</div>
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
});

BunkerSlider.displayName = "BunkerSlider";

