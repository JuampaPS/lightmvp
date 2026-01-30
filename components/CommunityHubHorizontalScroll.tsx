"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deferOnIdle } from "@/utils/deferOnIdle";
import { LazyVideo } from "@/components/LazyVideo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CommunityHubItem {
  title: string;
  description: string;
  number: string;
  image?: string; // URL de la imagen opcional
}

interface CommunityHubHorizontalScrollProps {
  items: CommunityHubItem[];
  showWhyBunker?: boolean;
}

export function CommunityHubHorizontalScroll({ items, showWhyBunker = true }: CommunityHubHorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkMobile();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 150);
    };
    checkMobile();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sectionRef.current || !containerRef.current) return;
    if (items.length === 0) return;

    let mounted = true;
    const container = containerRef.current;
    const section = sectionRef.current;
    let scrollAnimation: gsap.core.Tween | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    const initScroll = () => {
      if (!mounted) return;
      if (isMobile) {
        container.style.width = "";
        gsap.set(container, { clearProps: "all" });
        return;
      }
      try {
        const cards = cardsRef.current.filter(Boolean);
        const expectedCardsCount = items.length * 2;
        if (cards.length === 0 || cards.length !== expectedCardsCount) {
          setTimeout(initScroll, 100);
          return;
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!mounted || !container || !section) return;
            if (isMobile) return;
            let totalWidth = 0;
            for (let i = 0; i < cards.length; i++) {
              const card = cards[i];
              if (card) {
                const w = card.offsetWidth || card.getBoundingClientRect().width || 0;
                if (w > 0) totalWidth += w;
              }
            }
            if (totalWidth === 0 || totalWidth < window.innerWidth) {
              if (mounted) setTimeout(initScroll, 100);
              return;
            }

            container.style.width = `${totalWidth}px`;
            const scrollDistance = totalWidth - window.innerWidth;

            ScrollTrigger.getAll().forEach((t) => {
              try {
                if (t.trigger === section) t.kill();
              } catch (_) {}
            });
            if (scrollAnimation) scrollAnimation.kill();

            scrollAnimation = gsap.to(container, {
              x: -scrollDistance,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: `+=${scrollDistance}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.1,
                anticipatePin: 1.5,
                fastScrollEnd: false,
                invalidateOnRefresh: true,
              },
            });
            scrollTriggerInstance = scrollAnimation.scrollTrigger || null;
            deferOnIdle(() => ScrollTrigger.refresh());
          });
        });
      } catch (e) {
        if (process.env.NODE_ENV === "development") console.error("CommunityHub init:", e);
      }
    };

    const cancel = deferOnIdle(() => initScroll(), { timeout: 600 });

    return () => {
      mounted = false;
      cancel();
      try {
        if (scrollAnimation) scrollAnimation.kill();
        if (scrollTriggerInstance) scrollTriggerInstance.kill();
        ScrollTrigger.getAll().forEach((t) => {
          try {
            if (t.trigger === section) t.kill();
          } catch (_) {}
        });
      } catch (e) {
        if (process.env.NODE_ENV === "development") console.error("CommunityHub cleanup:", e);
      }
    };
  }, [items, isMobile]);

  return (
    <section
      ref={sectionRef}
      className={`community-hub-horizontal-scroll relative min-h-screen bg-black ${isMobile ? "overflow-visible" : "overflow-hidden"}`}
    >
      <div className={isMobile ? "flex flex-col" : "sticky top-0 h-screen flex items-center"}>
        {showWhyBunker && (
          <div className={`absolute left-2 sm:left-4 md:left-8 z-10 ${isMobile ? "top-4" : "top-1/2 -translate-y-1/2"}`}>
            <div className="text-white text-sm sm:text-base md:text-xl lg:text-2xl font-bold uppercase tracking-wider opacity-70">
              Why Bunker?
            </div>
          </div>
        )}
        
        <div
          ref={containerRef}
          className={`flex pl-8 sm:pl-12 md:pl-24 pr-4 sm:pr-8 ${isMobile ? "flex-col w-full gap-4 items-stretch" : "items-center gap-0 will-change-transform"}`}
          style={isMobile ? undefined : { display: "flex" }}
        >
          {items.flatMap((item, index) => {
            const cards: JSX.Element[] = [];
            
            // Tarjeta de TEXTO (siempre se crea)
            cards.push(
              <div
                key={`text-${index}`}
                ref={(el) => {
                  if (el) {
                    const cardIndex = index * 2;
                    cardsRef.current[cardIndex] = el;
                  }
                }}
                className={`community-hub-card-text flex-shrink-0 bg-gradient-to-br from-neutral-900 to-black flex flex-col relative overflow-hidden p-4 sm:p-[10px] gap-2 sm:gap-[10px] ${isMobile ? "w-full min-h-[50vh] py-8" : "w-screen sm:w-[50vw] h-screen justify-between"}`}
              >
                <div className={`relative z-10 flex flex-col justify-between h-full ${isMobile ? "pt-6 pb-6" : ""}`} style={isMobile ? undefined : { paddingTop: "-40px", transform: "translateY(-80px)" }}>
                  {/* Título principal */}
                  <div className={isMobile ? "mb-4" : "mt-auto mb-auto"}>
                    <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0 whitespace-pre-line">
                      {item.title}
                    </h3>
                  </div>
                  
                  {/* Números y descripción */}
                  <div className="flex flex-col gap-3 sm:gap-4" style={isMobile ? undefined : { marginBottom: "-60px", marginTop: "-40px" }}>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-cyan-400 text-xl sm:text-2xl md:text-3xl font-bold">
                        {item.number}
                      </div>
                      <div className="text-neutral-400 text-lg sm:text-xl md:text-2xl font-bold">
                        {String(items.length).padStart(2, '0')}
                      </div>
                    </div>
                    <p className="text-neutral-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xl px-2 sm:px-0">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );

            // Tarjeta de IMAGEN (siempre se crea después del texto)
            const isVideo = item.image?.endsWith('.mp4') || item.image?.endsWith('.webm');
            
            // Sin precarga para Rex, NGBG Premiere, NGBG Experience, NGBG today
            const noPoster = ["Rex", "NGBG\nPremiere", "NGBG\nExperience", "NGBG today"].includes(item.title);
            
            // Para los items de Community, Studio y Showcase, usar imágenes diferentes según dispositivo
            let imageSrc = item.image;
            let shouldRenderVideo = isVideo;
            
            if (item.title === "Community") {
              // Usar imágenes JPEG según dispositivo
              // Nota: El archivo tiene un typo en el nombre (comunityweb vs communityweb)
              imageSrc = isMobile 
                ? "/images/gallery/Communityphone.jpeg"
                : "/images/gallery/comunityweb.jpeg";
              shouldRenderVideo = false; // Forzar imagen en lugar de video
            } else if (item.title === "Studio") {
              // Imágenes de Showcase (posición 02)
              imageSrc = isMobile 
                ? "/images/gallery/Showcasephone.jpeg"
                : "/images/gallery/Showcaseweb.jpeg";
              shouldRenderVideo = false;
            } else if (item.title === "Showcase") {
              // Imágenes de Studio (posición 03)
              imageSrc = isMobile 
                ? "/images/gallery/Studiophone.jpeg"
                : "/images/gallery/Studioweb.jpeg";
              shouldRenderVideo = false;
            }
            
            cards.push(
              <div
                key={`image-${index}`}
                ref={(el) => {
                  if (el) {
                    const cardIndex = index * 2 + 1;
                    cardsRef.current[cardIndex] = el;
                  }
                }}
                className={`community-hub-card-image flex-shrink-0 relative overflow-hidden ${isMobile ? "w-full min-h-[80vh]" : "w-screen h-screen"}`}
              >
                {imageSrc ? (
                  shouldRenderVideo ? (
                    <LazyVideo
                      src={imageSrc}
                      poster={noPoster ? undefined : "/images/gallery/ngbg24full.jpg"}
                      alt={`Video for ${item.title}`}
                      autoPlay={!isMobile}
                      controls={isMobile}
                      loop={!isMobile}
                      muted
                      playsInline
                      preload="none"
                    />
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={item.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-black flex items-center justify-center">
                    <div className="text-neutral-400 text-xl">Image {item.number}</div>
                  </div>
                )}
              </div>
            );

            return cards;
          })}
        </div>
      </div>
    </section>
  );
}

