"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioItems } from "@/data/portfolioData";
import { useTranslations } from "@/hooks/useTranslations";

// Only register ScrollTrigger on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function PortfolioStacking() {
  const { t } = useTranslations();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const cardHeightRef = useRef<number>(0);
  const titleElementsRef = useRef<{
    author: HTMLDivElement[];
    title: HTMLDivElement[];
    category: HTMLDivElement[];
  }>({
    author: [],
    title: [],
    category: [],
  });
  const headerElementsRef = useRef<{
    bunker: HTMLSpanElement | null;
    productions: HTMLSpanElement | null;
    portfolio: HTMLSpanElement | null;
  }>({
    bunker: null,
    productions: null,
    portfolio: null,
  });

  const initCards = () => {
    if (!animationRef.current) {
      animationRef.current = gsap.timeline();
    } else {
      animationRef.current.clear();
    }

    if (cards.current.length === 0) return;

    cardHeightRef.current = cards.current[0]?.offsetHeight || 0;

    cards.current.forEach((card, index) => {
      if (index > 0 && card) {
        // Increment y value of each card by cardHeight
        gsap.set(card, { y: index * cardHeightRef.current });
        // Animate each card back to 0 (for stacking)
        animationRef.current?.to(
          card,
          {
            y: 0,
            duration: index * 0.5,
            ease: "none",
          },
          0
        );
      }
    });
  };

  useEffect(() => {
    if (!wrapperRef.current || !headerRef.current || !cardsRef.current) return;

    let scrollTrigger: ScrollTrigger | null = null;
    const titleScrollTriggers: ScrollTrigger[] = [];

    // Wait for cards to be rendered
    const timeoutId = setTimeout(() => {
      // Initialize cards first to get cardHeightRef
      initCards();

      // Animate header elements from left
      const bunkerEl = headerElementsRef.current.bunker;
      const productionsEl = headerElementsRef.current.productions;
      const portfolioEl = headerElementsRef.current.portfolio;

      if (bunkerEl || productionsEl || portfolioEl) {
        // Set initial position (BUNKER and PORTFOLIO from left, PRODUCTIONS from right)
        if (bunkerEl) gsap.set(bunkerEl, { x: -150, opacity: 0 });
        if (productionsEl) gsap.set(productionsEl, { x: 150, opacity: 0 });
        if (portfolioEl) gsap.set(portfolioEl, { x: -150, opacity: 0 });

        // Create timeline for header animations
        const headerTimeline = gsap.timeline({ paused: true });
        
        if (bunkerEl) {
          headerTimeline.to(bunkerEl, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          }, 0);
        }
        if (productionsEl) {
          headerTimeline.to(productionsEl, {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          }, 0.2);
        }
        if (portfolioEl) {
          headerTimeline.to(portfolioEl, {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          }, 0.4);
        }

        // Create ScrollTrigger for header
        const headerTrigger = ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1.5,
          animation: headerTimeline,
          invalidateOnRefresh: true,
        });

        titleScrollTriggers.push(headerTrigger);
      }

      // Animate titles from sides
      cards.current.forEach((card, index) => {
        if (!card) return;

        const authorEl = titleElementsRef.current.author[index];
        const titleEl = titleElementsRef.current.title[index];
        const categoryEl = titleElementsRef.current.category[index];

        // Alternate direction: even cards from left, odd cards from right
        const fromLeft = index % 2 === 0;
        const xOffset = fromLeft ? -120 : 120;

        // Set initial position
        if (authorEl) gsap.set(authorEl, { x: xOffset, opacity: 0 });
        if (titleEl) gsap.set(titleEl, { x: xOffset, opacity: 0 });
        if (categoryEl) gsap.set(categoryEl, { x: xOffset, opacity: 0 });

        // Create timeline for title animations
        const titleTimeline = gsap.timeline({ paused: true });
        
        if (authorEl) {
          titleTimeline.to(authorEl, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          }, 0);
        }
        if (titleEl) {
          titleTimeline.to(titleEl, {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          }, 0.05);
        }
        if (categoryEl) {
          titleTimeline.to(categoryEl, {
            x: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
          }, 0.1);
        }

        // Create ScrollTrigger for each card's titles
        // Use a simpler approach: trigger when card's center reaches viewport center
        // This ensures all cards trigger at the same visual position
        // When scrolling down past the card, texts will reverse (disappear back to sides)
        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "center 50%",
          end: "center -20%", // Extend range so animation can reverse when card goes down
          scrub: 2, // Increased for smoother transitions
          animation: titleTimeline,
          invalidateOnRefresh: true,
        });

        titleScrollTriggers.push(trigger);
      });

      // Create main ScrollTrigger for pinning (after title triggers are set up)
      scrollTrigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        pin: true,
        end: () => {
          const totalHeight =
            (cards.current.length * cardHeightRef.current) +
            (headerRef.current?.offsetHeight || 0);
          return `+=${totalHeight}`;
        },
        scrub: true,
        animation: animationRef.current || undefined,
        invalidateOnRefresh: true,
        // Refresh all triggers when the main trigger refreshes
        onRefresh: () => {
          titleScrollTriggers.forEach(trigger => trigger.refresh());
        },
      });

      // Refresh on resize
      ScrollTrigger.addEventListener("refreshInit", initCards);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      titleScrollTriggers.forEach((trigger) => trigger.kill());
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === wrapperRef.current) {
          trigger.kill();
        }
      });
      ScrollTrigger.removeEventListener("refreshInit", initCards);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <section id="portfolio" suppressHydrationWarning>
      <div ref={wrapperRef} className="portfolio-wrapper" suppressHydrationWarning>
        <div ref={headerRef} className="portfolio-header">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <span
              ref={(el) => {
                if (el) headerElementsRef.current.bunker = el;
              }}
              className="portfolio-header-main"
            >
              BUNKER
            </span>
            <span
              ref={(el) => {
                if (el) headerElementsRef.current.productions = el;
              }}
              className="portfolio-header-main"
            >
              PRODUCTIONS
            </span>
          </div>
          <br />
          <span
            ref={(el) => {
              if (el) headerElementsRef.current.portfolio = el;
            }}
          >
            {t.nav.portfolio}
          </span>
        </div>

        <div ref={cardsRef} className="portfolio-cards">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              data-portfolio-id={item.id}
              ref={(el) => {
                if (el) cards.current[index] = el;
              }}
              className={`portfolio-card ${index % 2 === 0 ? "portfolio-card-odd" : ""}`}
            >
              <div className="portfolio-card-grid">
                <div className="portfolio-card-content">
                  <div
                    ref={(el) => {
                      if (el) titleElementsRef.current.author[index] = el;
                    }}
                    className="portfolio-card-author"
                  >
                    {item.author || "BUNKER"}
                  </div>
                  <div
                    ref={(el) => {
                      if (el) titleElementsRef.current.title[index] = el;
                    }}
                    className="portfolio-card-title"
                  >
                    {item.title}
                  </div>
                  <div
                    ref={(el) => {
                      if (el) titleElementsRef.current.category[index] = el;
                    }}
                    className="portfolio-card-category"
                  >
                    {item.category}
                  </div>
                  <div className="portfolio-card-description">{item.description}</div>
                  <div className="portfolio-card-tags">
                    {item.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="portfolio-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="portfolio-card-image-1">
                  {item.images && item.images.length > 0 && (
                    <img 
                      src={item.images[0]} 
                      alt={`${item.title}`}
                      className="portfolio-card-media"
                    />
                  )}
                </div>
                <div className="portfolio-card-image-2">
                  {item.images && item.images.length > 1 && (
                    <img 
                      src={item.images[1]} 
                      alt={`${item.title} - 2`}
                      className="portfolio-card-media"
                    />
                  )}
                </div>
                <div className="portfolio-card-video-container">
                  {item.video ? (
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="none"
                      className="portfolio-card-media"
                      onLoadedData={(e) => {
                        // Only play when card is visible
                        const video = e.currentTarget;
                        const observer = new IntersectionObserver(
                          (entries) => {
                            entries.forEach((entry) => {
                              if (entry.isIntersecting) {
                                video.play().catch(() => {});
                              } else {
                                video.pause();
                              }
                            });
                          },
                          { threshold: 0.5 }
                        );
                        observer.observe(video);
                      }}
                    />
                  ) : item.images && item.images.length > 2 && (
                    <img 
                      src={item.images[2]} 
                      alt={`${item.title} - 3`}
                      className="portfolio-card-media"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

