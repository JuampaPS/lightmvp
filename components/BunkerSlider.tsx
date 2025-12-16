"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useMemo } from "react";
import { useTranslations } from "@/hooks/useTranslations";

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

export interface BunkerSliderRef {
  resetToFirst: () => void;
}

export const BunkerSlider = forwardRef<BunkerSliderRef>((props, ref) => {
  const { t, language } = useTranslations();
  const rootRef = useRef<HTMLDivElement>(null);
  const hideThumbnailsRef = useRef<() => void>(() => {});
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaRef = useRef<number>(0);
  const runNextAutoRef = useRef<number | undefined>(undefined);
  const resetToFirstRef = useRef<() => void>(() => {});
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Primera tarjeta del slider: BUNKER PRODUCTIONS (con traducciones)
  // Depende de language para forzar actualización cuando cambia el idioma
  const bunkerIntroSlide: Slide = useMemo(() => ({
    id: "bunker-intro",
    image: "/images/1T9B5057.jpg",
    video: "/images/gallery/videos-hero/hero.mp4",
    author: "", // Empty author - not displayed
    title: t.hero.introTitle.replace(/^BUNKER\s+/i, '').trim(), // Remove "BUNKER " from title (case insensitive)
    topic: t.hero.introTopic,
    description: t.hero.introDescription,
    thumbnailTitle: t.hero.introTitle.replace(/^BUNKER\s+/, ''),
    thumbnailDescription: t.hero.introTopic,
  }), [t, language]); // Depender de t completo para detectar cambios

  // Solo mostrar la primera tarjeta BUNKER PRODUCTIONS
  const slides: Slide[] = useMemo(() => [bunkerIntroSlide], [bunkerIntroSlide]);
  
  // Always render with current translations, but delay DOM manipulation until mounted

  // Set mounted flag to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
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

      // Update slide content when translations change
      const firstSlideItem = sliderDom.querySelector<HTMLDivElement>(`.item[data-id="bunker-intro"]`);
      if (firstSlideItem) {
        const contentDiv = firstSlideItem.querySelector<HTMLDivElement>(".content");
        if (contentDiv) {
          // Update only the PRODUCTIONS title, not BUNKER
          const productionsTitleEl = contentDiv.querySelector<HTMLDivElement>(".productions-title");
          if (productionsTitleEl) {
            productionsTitleEl.textContent = bunkerIntroSlide.title;
          }
          const topicEl = contentDiv.querySelector<HTMLDivElement>(".topic");
          const descEl = contentDiv.querySelector<HTMLDivElement>(".des");
          if (topicEl) topicEl.textContent = bunkerIntroSlide.topic;
          if (descEl) descEl.textContent = bunkerIntroSlide.description;
        }
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
        // Disabled - only showing BUNKER card
        return;
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

      // Hide active thumbnail initially - only showing BUNKER card
      setTimeout(() => {
        hideActiveThumbnail();
        // No auto-advance, only showing BUNKER card
      }, 100);

      const showSlider = (type: "next" | "prev") => {
        // Disabled - only showing BUNKER card, no navigation
        return;
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
        
        // Hide active thumbnail and restart auto-advance (only on desktop)
        setTimeout(() => {
          hideActiveThumbnail();
          if (!isMobile) {
            scheduleAutoNext();
          }
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
        // Disabled - only showing BUNKER card, no swipe navigation
        if (event.pointerType !== "touch") return;
        if (touchStartXRef.current === null) return;

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
  }, [isMounted, isMobile, bunkerIntroSlide, slides]);

  // Reset to first slide when mobile is detected
  useEffect(() => {
    if (!isMounted || !isMobile) return;
    
    const timeoutId = setTimeout(() => {
      if (resetToFirstRef.current) {
        resetToFirstRef.current();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [isMounted, isMobile]);

  // Update slide content when language changes
  useEffect(() => {
    if (!isMounted) return;
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;

      const sliderDom = root.querySelector<HTMLDivElement>(".carousel .list");
      const thumbnailBorderDom = root.querySelector<HTMLDivElement>(".carousel .thumbnail");
      
      if (!sliderDom || !thumbnailBorderDom) return;

      // Update all bunker-intro slides in the DOM
      const updateSlideContent = (item: HTMLDivElement) => {
        const contentDiv = item.querySelector<HTMLDivElement>(".content");
        if (contentDiv) {
          // Update only the PRODUCTIONS title, not BUNKER
          const productionsTitleEl = contentDiv.querySelector<HTMLDivElement>(".productions-title");
          if (productionsTitleEl) {
            productionsTitleEl.textContent = bunkerIntroSlide.title;
          }
          const topicEl = contentDiv.querySelector<HTMLDivElement>(".topic");
          const descEl = contentDiv.querySelector<HTMLDivElement>(".des");
          if (topicEl) topicEl.textContent = bunkerIntroSlide.topic;
          if (descEl) descEl.textContent = bunkerIntroSlide.description;
        }
      };

      // Update main slides
      const mainSlides = sliderDom.querySelectorAll<HTMLDivElement>(`.item[data-id="bunker-intro"]`);
      mainSlides.forEach(updateSlideContent);

      // Update thumbnails
      const thumbSlides = thumbnailBorderDom.querySelectorAll<HTMLDivElement>(`.item[data-id="bunker-intro"]`);
      thumbSlides.forEach((item) => {
        const contentDiv = item.querySelector<HTMLDivElement>(".content");
        if (contentDiv) {
          const titleEl = contentDiv.querySelector<HTMLDivElement>(".title");
          const descEl = contentDiv.querySelector<HTMLDivElement>(".description");
          if (titleEl) titleEl.textContent = bunkerIntroSlide.thumbnailTitle;
          if (descEl) descEl.textContent = bunkerIntroSlide.thumbnailDescription;
        }
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [language, bunkerIntroSlide, isMounted]);

  // Expose resetToFirst via ref
  useImperativeHandle(ref, () => ({
    resetToFirst: () => {
      if (resetToFirstRef.current) {
        resetToFirstRef.current();
      }
    }
  }));


  return (
    <div className="lun-dev-slider" ref={rootRef} suppressHydrationWarning key={`slider-${language}`}>
      <div className="carousel">
        <div className="list">
          {slides.map((slide, index) => (
            <div className="item" key={`${slide.id}-${language}`} data-id={slide.id} style={{ backgroundColor: '#000' }}>
              {index === 0 && slide.video && (
                <video
                  className="slide-video-fullscreen"
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`Background video for ${slide.title}`}
                />
              )}
              {index !== 0 && slide.image && (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="slide-image"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="content">
                <div className="title rotate-title bunker-title">BUNKER</div>
                <div className="title rotate-title productions-title">{slide.title}</div>
                <div className="topic">{slide.topic}</div>
                <div className="des">{slide.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="thumbnail" style={{ display: 'none' }}>
          {slides.map((slide) => (
            <div className="item" key={`${slide.id}-thumb-${language}`} data-id={slide.id}>
              <img src={slide.image} alt={slide.thumbnailTitle} />
              <div className="content">
                <div className="title">{slide.thumbnailTitle}</div>
                <div className="description">{slide.thumbnailDescription}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="arrows" style={{ display: 'none' }}>
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

