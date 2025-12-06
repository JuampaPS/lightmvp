"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { BunkerSlider, BunkerSliderRef } from "@/components/BunkerSlider";
import { CommunityHubHorizontalScroll } from "@/components/CommunityHubHorizontalScroll";
import { PortfolioStacking } from "@/components/PortfolioStacking";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { SectionHero } from "@/components/SectionHero";
import { BunkerNavbar } from "@/components/BunkerNavbar";
import { VisionAboutUs } from "@/components/VisionAboutUs";
import { Gallery } from "@/components/Gallery";

export default function LightshowAudioLanding() {
  const { t, language, changeLanguage } = useTranslations();
  const sliderRef = useRef<BunkerSliderRef>(null);
  const homeSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition,
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

  // Scroll to top on page load/refresh - must run first
  useEffect(() => {
    // Disable scroll restoration to prevent browser from restoring scroll position
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      
      // Clear any hash from URL
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      
      // Force scroll to top multiple times to ensure it works
      const forceScrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      };
      
      // Immediate scroll
      forceScrollToTop();
      
      // Multiple attempts to ensure scroll happens
      const timeouts = [
        setTimeout(forceScrollToTop, 0),
        setTimeout(forceScrollToTop, 10),
        setTimeout(forceScrollToTop, 50),
        setTimeout(forceScrollToTop, 100),
      ];
      
      // Also on load event
      window.addEventListener('load', forceScrollToTop);
      window.addEventListener('DOMContentLoaded', forceScrollToTop);
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
        window.removeEventListener('load', forceScrollToTop);
        window.removeEventListener('DOMContentLoaded', forceScrollToTop);
      };
    }
  }, []);

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
      {/* Nuevo Navbar flotante */}
      <BunkerNavbar scrollToSection={scrollToSection} />

      <BunkerSlider key={language} ref={sliderRef} />

      <PortfolioStacking />

      {/* Community Hub Section */}
      <section id="servicios" className="relative min-h-screen overflow-hidden bg-black">
        <SectionHero
          videoSrc="/images/gallery/videos-hero/newCommunityfull.mp4"
          title="COMMUNITY HUB"
          subtitle="Community Hub"
          hideText={true}
        />

        {/* Horizontal Scroll Section */}
        <CommunityHubHorizontalScroll 
          items={[
             {
               title: "Community",
               description: "We grow through the community around us. By collaborating with local creatives, collectives, and cultural establishments, we aim to develop and sustain a vibrant cultural scene. Together we keep culture alive, experimental, and accessible.",
               number: "01",
               image: "/images/gallery/videos-hero/Communityfull.mp4"
             },
             {
               title: "Studio",
               description: "An open studio where creatives bring ideas to life — from showcases to events, supported by professional gear.",
               number: "02",
               image: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp2.mp4"
             },
            {
              title: "Showcase",
              description: "Our space is designed for artists to present their work in a professional setting, whether it's performance, sound, visuals, or complete productions.",
              number: "03",
              image: "/images/gallery/videos-hero/Untitled video - Made with Clipchamp3.mp4"
            }
          ]}
        />
      </section>

      {/* Space/Design Section */}
      <SectionHero
        id="space-design"
        videoSrc="/images/gallery/videos-hero/ourjourney.mp4"
        title="OUR JOURNEY"
        subtitle="Our journey"
      />

      {/* Horizontal Scroll Section - Duplicated */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        <CommunityHubHorizontalScroll 
          showWhyBunker={false}
          items={[
             {
               title: "Rex",
               description: "At 2023 we started at the basement of local legendary pizzeria Rex.",
               number: "01",
               image: "/images/gallery/videos-hero/rexbunker.mp4"
             },
             {
               title: "NGBG\nintroduction",
               description: "Our first event at NGBG which led us to aim for NGBG as our home.",
               number: "02",
               image: "/images/gallery/videos-hero/ngbgintro.mp4"
             },
            {
              title: "NGBG studio\n(1-2-3)",
              description: "We have been working out of NGBG the last 3 years and trying to find our purpose along the way.",
              number: "03",
              image: "/images/gallery/videos-hero/ngbg123.mp4"
            },
            {
              title: "NGBG 20\n(today)",
              description: "We have landed in being what we call us today: Bunker productions and community hub.",
              number: "04",
              image: "/images/gallery/videos-hero/studiotoday.jpeg"
            }
          ]}
        />
      </section>

      {/* Vision/About Us Section */}
      <VisionAboutUs />

      {/* Gallery Section */}
      <Gallery />

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