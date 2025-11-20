"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { BunkerSlider, BunkerSliderRef } from "@/components/BunkerSlider";
import { PortfolioStacking } from "@/components/PortfolioStacking";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

// One-page landing for "Creación y diseño de espacios Lightshow & Audio"
// Tech: React + Next.js + Tailwind CSS + GSAP
// Replace placeholders (LOGO, fotos, links) and deploy on Vercel.

export default function LightshowAudioLanding() {
  const { t, language, changeLanguage } = useTranslations();
  // Use t.nav.portfolio directly since useTranslations always returns defaultTranslations initially
  const portfolioLabel = t.nav.portfolio;
  const communityLabel = t.nav.community;
  const hubLabel = t.nav.hub;
  const contactLabel = t.nav.contact;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sliderRef = useRef<BunkerSliderRef>(null);
  const homeSectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <div id="home" ref={homeSectionRef} className="min-h-screen bg-neutral-950 text-neutral-100" suppressHydrationWarning>
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-2 md:py-3 flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-2">
            <img
              src="/images/gallery/videos-hero/newcleanlogo.png"
              alt="BUNKER PRODUCTIONS"
              className="h-8 w-8 rounded-lg object-cover logo-rotate-horizontal"
            />
            <span className="rotate-brand" style={{ fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>BUNKER PRODUCTIONS</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#home" className="hover:text-white" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
            <a href="#portfolio" className="hover:text-white" onClick={(e) => { e.preventDefault(); scrollToSection('portfolio'); }}>{portfolioLabel}</a>
            <a href="#servicios" className="hover:text-white" onClick={(e) => { e.preventDefault(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}>{communityLabel}</a>
            <a href="#servicios" className="hover:text-white" onClick={(e) => { e.preventDefault(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}>{hubLabel}</a>
            <a href="#contacto" className="hover:text-white" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); }}>{contactLabel}</a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => changeLanguage('es')}
              className={`px-2 py-1 text-xs rounded language-toggle ${language === 'es' ? 'language-toggle-active' : ''}`}
            >
              ES
            </button>
            <button
              onClick={() => changeLanguage('sv')}
              className={`px-2 py-1 text-xs rounded language-toggle ${language === 'sv' ? 'language-toggle-active' : ''}`}
            >
              SV
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 text-xs rounded language-toggle ${language === 'en' ? 'language-toggle-active' : ''}`}
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
                <a href="#home" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); scrollToSection('home'); }}>Home</a>
                <a href="#portfolio" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); scrollToSection('portfolio'); }}>{portfolioLabel}</a>
                <a href="#servicios" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}>{communityLabel}</a>
                <a href="#servicios" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}>{hubLabel}</a>
                <a href="#contacto" className="hover:text-white" onClick={(e) => { e.preventDefault(); closeMobileMenu(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); }}>{contactLabel}</a>
              </nav>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`px-3 py-1.5 text-xs rounded language-toggle ${language === 'es' ? 'language-toggle-active' : ''}`}
                >
                  ES
                </button>
                <button
                  onClick={() => handleLanguageChange('sv')}
                  className={`px-3 py-1.5 text-xs rounded language-toggle ${language === 'sv' ? 'language-toggle-active' : ''}`}
                >
                  SV
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1.5 text-xs rounded language-toggle ${language === 'en' ? 'language-toggle-active' : ''}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <BunkerSlider ref={sliderRef} />

      <PortfolioStacking />

      <section id="servicios" className="relative min-h-screen overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/gallery/soonbunker.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/55" />
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
                <span className="queens-grid-city">{portfolioLabel}</span>
              </div>
              <div className="queens-grid-cell" id="comunidad">
                <span className="queens-grid-city">{communityLabel}</span>
              </div>
              <div className="queens-grid-cell" id="hub">
                <span className="queens-grid-city">{hubLabel}</span>
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