"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { BunkerSlider, BunkerSliderRef } from "@/components/BunkerSlider";
import { PortfolioStacking } from "@/components/PortfolioStacking";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only register ScrollTrigger on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LightshowAudioLanding() {
  const { t, language, changeLanguage } = useTranslations();
  const productionLabel = t.nav.production;
  const communityHubLabel = t.nav.communityHub;
  const spaceDesignLabel = t.nav.spaceDesign;
  const visionAboutLabel = t.nav.visionAbout;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sliderRef = useRef<BunkerSliderRef>(null);
  const homeSectionRef = useRef<HTMLDivElement>(null);
  const portfolioStackWrapperRef = useRef<HTMLDivElement>(null);
  const portfolioStackCardsRef = useRef<HTMLDivElement>(null);
  const portfolioStackCards = useRef<HTMLDivElement[]>([]);
  const portfolioStackAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const portfolioCardHeightRef = useRef<number>(0);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleLanguageChange = (lang: "es" | "sv" | "en") => {
    changeLanguage(lang);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Reset slider when scrolling to home
      if (sectionId === 'home' && sliderRef.current) {
        setTimeout(() => {
          sliderRef.current?.resetToFirst();
        }, 500);
      }
    }
  };

  // Detect when hero section is visible and reset slider
  useEffect(() => {
    const homeSection = homeSectionRef.current;
    if (!homeSection || !sliderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When hero section becomes visible (more than 50% visible)
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Reset slider to first slide
            if (sliderRef.current) {
              sliderRef.current.resetToFirst();
            }
          }
        });
      },
      {
        threshold: [0.5], // Trigger when 50% of the section is visible
        rootMargin: '-100px 0px' // Account for navbar
      }
    );

    observer.observe(homeSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Portfolio stack effect for Community Hub section
  useEffect(() => {
    if (!portfolioStackWrapperRef.current || !portfolioStackCardsRef.current) return;

    const initPortfolioCards = () => {
      if (!portfolioStackAnimationRef.current) {
        portfolioStackAnimationRef.current = gsap.timeline();
      } else {
        portfolioStackAnimationRef.current.clear();
      }

      if (portfolioStackCards.current.length === 0) return;

      portfolioCardHeightRef.current = portfolioStackCards.current[0]?.offsetHeight || 0;

      portfolioStackCards.current.forEach((card, index) => {
        if (index > 0 && card) {
          gsap.set(card, { y: index * portfolioCardHeightRef.current });
          portfolioStackAnimationRef.current?.to(
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

    let scrollTrigger: ScrollTrigger | null = null;

    const timeoutId = setTimeout(() => {
      initPortfolioCards();

      scrollTrigger = ScrollTrigger.create({
        trigger: portfolioStackWrapperRef.current,
        start: "top top",
        pin: true,
        end: () => {
          const totalHeight = portfolioStackCards.current.length * portfolioCardHeightRef.current;
          return `+=${totalHeight}`;
        },
        scrub: true,
        animation: portfolioStackAnimationRef.current || undefined,
        invalidateOnRefresh: true,
        onRefresh: () => {
          initPortfolioCards();
        }
      });

      ScrollTrigger.addEventListener("refreshInit", initPortfolioCards);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.removeEventListener("refreshInit", initPortfolioCards);
      if (portfolioStackAnimationRef.current) {
        portfolioStackAnimationRef.current.kill();
      }
    };
  }, []);

  return (
    <div id="home" ref={homeSectionRef} className="min-h-screen bg-neutral-950 text-neutral-100" suppressHydrationWarning>
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-2 md:py-3 flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-2">
            <img
              src="/images/gallery/videos-hero/newcleanlogo.png"
              alt="BUNKER"
              className="h-8 w-8 rounded-lg object-cover logo-rotate-horizontal"
            />
            <span className="rotate-brand" style={{ fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '1.5rem' }}>BUNKER</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#home" className="hover:text-white" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>{productionLabel}</a>
            <a href="#servicios" className="hover:text-white" onClick={(e) => { e.preventDefault(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}>{communityHubLabel}</a>
            <a href="#space-design" className="hover:text-white" onClick={(e) => { e.preventDefault(); scrollToSection('space-design'); }}>{spaceDesignLabel}</a>
            <a href="#vision-about" className="hover:text-white" onClick={(e) => { e.preventDefault(); scrollToSection('vision-about'); }}>{visionAboutLabel}</a>
          </div>

          <div className="hidden md:flex items-center gap-2" suppressHydrationWarning>
            <button
              onClick={() => changeLanguage('es')}
              className={`px-2 py-1 text-xs rounded language-toggle ${language === 'es' ? 'language-toggle-active' : ''}`}
              suppressHydrationWarning
            >
              ES
            </button>
            <button
              onClick={() => changeLanguage('sv')}
              className={`px-2 py-1 text-xs rounded language-toggle ${language === 'sv' ? 'language-toggle-active' : ''}`}
              suppressHydrationWarning
            >
              SV
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 text-xs rounded language-toggle ${language === 'en' ? 'language-toggle-active' : ''}`}
              suppressHydrationWarning
            >
              EN
            </button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded border border-white/15 px-2.5 py-2 text-neutral-200 hover:border-white/40 hover:text-white transition"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 rounded-full bg-current transition-transform ${mobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-6 rounded-full bg-current transition-opacity ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-0.5 w-6 rounded-full bg-current transition-transform ${mobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-white/5 bg-neutral-950/95 px-4 pb-4 pt-3 text-sm text-neutral-300 backdrop-blur"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3">
              <nav className="flex flex-col gap-3">
                <a href="#home" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); scrollToSection('home'); }}>{productionLabel}</a>
                <a href="#servicios" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}>{communityHubLabel}</a>
                <a href="#space-design" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); scrollToSection('space-design'); }}>{spaceDesignLabel}</a>
                <a href="#vision-about" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); scrollToSection('vision-about'); }}>{visionAboutLabel}</a>
              </nav>
              <div className="flex items-center gap-2 pt-2" suppressHydrationWarning>
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`px-3 py-1.5 text-xs rounded language-toggle ${language === 'es' ? 'language-toggle-active' : ''}`}
                  suppressHydrationWarning
                >
                  ES
                </button>
                <button
                  onClick={() => handleLanguageChange('sv')}
                  className={`px-3 py-1.5 text-xs rounded language-toggle ${language === 'sv' ? 'language-toggle-active' : ''}`}
                  suppressHydrationWarning
                >
                  SV
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1.5 text-xs rounded language-toggle ${language === 'en' ? 'language-toggle-active' : ''}`}
                  suppressHydrationWarning
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <BunkerSlider key={language} ref={sliderRef} />

      <PortfolioStacking />

      <section id="servicios" className="relative min-h-screen overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/gallery/videos-hero/Untitled video - Made with Clipchamp1.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center" style={{ 
            position: 'absolute',
            top: '20%',
            width: '1140px',
            maxWidth: '80%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            textShadow: '0 5px 10px rgba(0, 0, 0, 0.4)',
            zIndex: 1
          }}>
            <div style={{ fontWeight: 'bold', letterSpacing: '10px', fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', textTransform: 'uppercase', marginBottom: '1rem' }}>BUNKER</div>
            <div className="rotate-title" style={{ 
              fontSize: 'clamp(3.5em, 10vw, 6em)', 
              fontWeight: 'bold', 
              lineHeight: '1.2em', 
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>COMMUNITY HUB</div>
            <div style={{ 
              fontSize: 'clamp(2.5em, 8vw, 5em)', 
              fontWeight: 'bold', 
              lineHeight: '1.3em', 
              color: '#2323FF',
              textShadow: '0 0 10px rgba(35, 35, 255, 0.8), 0 0 18px rgba(35, 35, 255, 0.6)'
            }}>Community Hub</div>
          </div>
        </div>
      </section>

      {/* Portfolio Stack Section (Portafolio Card + Fullscreen Image) */}
      <section className="relative min-h-screen overflow-hidden">
        <div ref={portfolioStackWrapperRef} className="portfolio-wrapper" suppressHydrationWarning>
          <div ref={portfolioStackCardsRef} className="portfolio-cards" style={{ height: '90vh' }}>
            {/* Portafolio Card */}
            <div
              ref={(el) => {
                if (el) portfolioStackCards.current[0] = el;
              }}
              className="portfolio-card portfolio-card-odd"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0
              }}
            >
              <div className="portfolio-card-grid">
                <div className="portfolio-card-content">
                  <div className="portfolio-card-author">BUNKER</div>
                  <div className="portfolio-card-title">PORTAFOLIO</div>
                  <div className="portfolio-card-category">Portafolio</div>
                  <div className="portfolio-card-description">Explora nuestra colección de proyectos de diseño lumínico y sonoro para eventos, festivales, clubes y espacios comerciales.</div>
                  <div className="portfolio-card-tags">
                    <span className="portfolio-tag">Diseño</span>
                    <span className="portfolio-tag">Producción</span>
                    <span className="portfolio-tag">Instalación</span>
                  </div>
                </div>
                <div className="portfolio-card-image-1">
                  <img
                    src="/images/1T9B5057.jpg"
                    alt="Portafolio"
                    className="portfolio-card-media"
                    loading="lazy"
                  />
                </div>
                <div className="portfolio-card-image-2">
                  <img
                    src="/images/1T9B5319.jpg"
                    alt="Portafolio"
                    className="portfolio-card-media"
                    loading="lazy"
                  />
                </div>
                <div className="portfolio-card-video-container">
                  <video
                    src="/images/gallery/videos-hero/Untitled video - Made with Clipchamp.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="portfolio-card-media"
                  />
                </div>
              </div>
            </div>

            {/* Fullscreen Image Card */}
            <div
              ref={(el) => {
                if (el) portfolioStackCards.current[1] = el;
              }}
              className="portfolio-card portfolio-card-fullscreen"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0
              }}
            >
              <div className="portfolio-card-fullscreen-image">
                <img
                  src="/images/1T9B5319.jpg"
                  alt="Project 1"
                  className="portfolio-card-fullscreen-media"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Space/Design Section */}
      <section id="space-design" className="relative min-h-screen overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/gallery/videos-hero/Untitled video - Made with Clipchamp2.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center" style={{ 
            position: 'absolute',
            top: '20%',
            width: '1140px',
            maxWidth: '80%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            textShadow: '0 5px 10px rgba(0, 0, 0, 0.4)',
            zIndex: 1
          }}>
            <div style={{ fontWeight: 'bold', letterSpacing: '10px', fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', textTransform: 'uppercase', marginBottom: '1rem' }}>BUNKER</div>
            <div className="rotate-title" style={{ 
              fontSize: 'clamp(3.5em, 10vw, 6em)', 
              fontWeight: 'bold', 
              lineHeight: '1.2em', 
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>SPACE/DESIGN</div>
            <div style={{ 
              fontSize: 'clamp(2.5em, 8vw, 5em)', 
              fontWeight: 'bold', 
              lineHeight: '1.3em', 
              color: '#2323FF',
              textShadow: '0 0 10px rgba(35, 35, 255, 0.8), 0 0 18px rgba(35, 35, 255, 0.6)'
            }}>Space/Design</div>
          </div>
        </div>
      </section>

      {/* Space/Design Card Section */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="portfolio-cards" style={{ height: '90vh' }}>
          <div className="portfolio-card portfolio-card-odd" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0
          }}>
            <div className="portfolio-card-grid">
              <div className="portfolio-card-content">
                <div className="portfolio-card-author">BUNKER</div>
                <div className="portfolio-card-title">SPACE/DESIGN</div>
                <div className="portfolio-card-category">Space/Design</div>
                <div className="portfolio-card-description">Diseñamos espacios inmersivos que combinan arquitectura, iluminación y tecnología para crear experiencias únicas y transformadoras.</div>
                <div className="portfolio-card-tags">
                  <span className="portfolio-tag">Arquitectura</span>
                  <span className="portfolio-tag">Diseño</span>
                  <span className="portfolio-tag">Tecnología</span>
                </div>
              </div>
              <div className="portfolio-card-image-1">
                <img
                  src="/images/1T9B6102.jpg"
                  alt="Space/Design"
                  className="portfolio-card-media"
                  loading="lazy"
                />
              </div>
              <div className="portfolio-card-image-2">
                <img
                  src="/images/1T9B6193.jpg"
                  alt="Space/Design"
                  className="portfolio-card-media"
                  loading="lazy"
                />
              </div>
              <div className="portfolio-card-video-container">
                <video
                  src="/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="portfolio-card-media"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision/About Us Section */}
      <section id="vision-about" className="relative min-h-screen overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/gallery/videos-hero/Untitled video - Made with Clipchamp4.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center" style={{ 
            position: 'absolute',
            top: '20%',
            width: '1140px',
            maxWidth: '80%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            textShadow: '0 5px 10px rgba(0, 0, 0, 0.4)',
            zIndex: 1
          }}>
            <div style={{ fontWeight: 'bold', letterSpacing: '10px', fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', textTransform: 'uppercase', marginBottom: '1rem' }}>BUNKER</div>
            <div className="rotate-title" style={{ 
              fontSize: 'clamp(3.5em, 10vw, 6em)', 
              fontWeight: 'bold', 
              lineHeight: '1.2em', 
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>VISION/ABOUT US</div>
            <div style={{ 
              fontSize: 'clamp(2.5em, 8vw, 5em)', 
              fontWeight: 'bold', 
              lineHeight: '1.3em', 
              color: '#2323FF',
              textShadow: '0 0 10px rgba(35, 35, 255, 0.8), 0 0 18px rgba(35, 35, 255, 0.6)'
            }}>Vision/About Us</div>
          </div>
        </div>
      </section>

      <section
        id="contacto"
        className="bg-black text-[#2323FF] border-t border-[#2323FF]/40"
      >
        <div className="w-full">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            <div className="queens-logo-box flex items-center justify-center overflow-hidden">
              <div className="queens-banner">
                <div className="queens-banner-track">
                  <span className="queens-logo-text queens-banner-text">contact@bunker.com</span>
                  <span className="queens-logo-text queens-banner-text">contact@bunker.com</span>
                  <span className="queens-logo-text queens-banner-text">contact@bunker.com</span>
                  <span className="queens-logo-text queens-banner-text">contact@bunker.com</span>
                </div>
              </div>
            </div>
            <div className="queens-grid queens-grid--solid text-xs sm:text-sm">
              <div className="queens-grid-cell" id="portfolio-contacto">
                <span className="queens-grid-city"></span>
              </div>
              <div className="queens-grid-cell" id="comunidad">
                <span className="queens-grid-city"></span>
              </div>
              <div className="queens-grid-cell" id="hub">
                <span className="queens-grid-city"></span>
              </div>
              <div className="queens-grid-cell" id="vision">
                <span className="queens-grid-city"></span>
              </div>
            </div>
            <div className="queens-grid queens-grid--solid queens-grid--vertical text-xs sm:text-sm">
              <div className="queens-grid-cell queens-grid-cell--icons flex items-center justify-center gap-8">
                <a
                  href="#"
                  className="queens-icon-link"
                  aria-label="Bunker on TikTok"
                >
                  <FaTiktok />
                </a>
                <a
                  href="#"
                  className="queens-icon-link"
                  aria-label="Bunker on Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="queens-icon-link"
                  aria-label="Bunker on Facebook"
                >
                  <FaFacebookF />
                </a>
              </div>

              <div className="queens-grid-cell queens-grid-cell--box flex items-center justify-center">
                <a href="#" className="queens-link">
                  PRIVACY & POLICY
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="queens-outline-box mt-0">
          <span className="queens-outline-text">BUNKER</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Bunker Productions. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Política de privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}