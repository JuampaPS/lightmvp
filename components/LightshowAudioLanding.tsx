"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect, useCallback } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BunkerSlider, BunkerSliderRef } from "@/components/BunkerSlider";
import { BunkerNavbar } from "@/components/BunkerNavbar";
import { LazyMount } from "@/components/LazyMount";
import { deferOnIdle } from "@/utils/deferOnIdle";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SimplePortfolio = dynamic(() => import("@/components/SimplePortfolio").then((m) => ({ default: m.SimplePortfolio })), {
  ssr: false,
});

const CommunityHubHorizontalScroll = dynamic(
  () => import("@/components/CommunityHubHorizontalScroll").then((m) => ({ default: m.CommunityHubHorizontalScroll })),
  { ssr: false }
);

const SectionHero = dynamic(() => import("@/components/SectionHero").then((m) => ({ default: m.SectionHero })), {
  ssr: false,
});

const VisionAboutUs = dynamic(() => import("@/components/VisionAboutUs").then((m) => ({ default: m.VisionAboutUs })), {
  ssr: false,
});

const Gallery = dynamic(() => import("@/components/Gallery").then((m) => ({ default: m.Gallery })), {
  ssr: false,
});

export default function LightshowAudioLanding() {
  const { t, language, changeLanguage } = useTranslations();
  const isMobile = useIsMobile(768);
  const sliderRef = useRef<BunkerSliderRef>(null);
  const homeSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const headerOffset = 80;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${sectionId}`);
    }
    if (sectionId === "home" && sliderRef.current) {
      setTimeout(() => sliderRef.current?.resetToFirst(), 500);
    }
  };

  // Scroll to top on load — minimal work to avoid blocking main thread
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);

    const scrollTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollTop();
    const onLoad = () => scrollTop();
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
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

    return () => observer.disconnect();
  }, []);

  const onReveal = useCallback(() => {
    deferOnIdle(() => ScrollTrigger.refresh(), { timeout: 400 });
  }, []);
  const lazyFallback = <div className="min-h-screen bg-black" aria-hidden />;

  return (
    <div id="home" ref={homeSectionRef} className="min-h-screen bg-neutral-950 text-neutral-100" suppressHydrationWarning>
      {/* Nuevo Navbar flotante */}
      <BunkerNavbar isMobile={isMobile} />

      <BunkerSlider key={language} ref={sliderRef} />

      <section id="production">
        <LazyMount fallback={<div className="min-h-[100dvh] bg-black" aria-hidden />} onReveal={onReveal}>
          <SimplePortfolio />
        </LazyMount>
      </section>

      <section id="community-hub" className="relative min-h-screen bg-black">
        <LazyMount fallback={lazyFallback} onReveal={onReveal}>
          <SectionHero
            videoSrc="/videos-hero/newCommunityfull.mp4"
            poster="/images/gallery/comunityweb.jpeg"
            title="COMMUNITY HUB"
            subtitle="Community Hub"
            hideText={true}
            priorityPoster
            noSection
          />
        </LazyMount>
      </section>

      <section className="relative min-h-screen overflow-hidden bg-black">
        <LazyMount fallback={lazyFallback} onReveal={onReveal}>
          <CommunityHubHorizontalScroll
            items={[
              { title: "Community", description: "We grow through the community around us. By collaborating with local creatives, collectives, and cultural establishments, we aim to develop and sustain a vibrant cultural scene. Together we keep culture alive, experimental, and accessible.", number: "01", image: "/videos-hero/Communityfull.mp4" },
              { title: "Studio", description: "An open studio where creatives bring ideas to life — from showcases to events, supported by professional gear.", number: "02", image: "/videos-hero/Untitled video - Made with Clipchamp2.mp4" },
              { title: "Showcase", description: "Our space is designed for artists to present their work in a professional setting, whether it's performance, sound, visuals, or complete productions.", number: "03", image: "/videos-hero/Untitled video - Made with Clipchamp3.mp4" },
            ]}
          />
        </LazyMount>
      </section>

      <section id="our-journey" className="relative min-h-screen bg-black">
        <LazyMount fallback={lazyFallback} onReveal={onReveal}>
          <SectionHero
            videoSrc="/videos-hero/ourjourney.mp4"
            title="OUR JOURNEY"
            subtitle="Our journey"
            hideText={true}
            noSection
          />
        </LazyMount>
      </section>

      <section className="relative min-h-screen overflow-hidden bg-black">
        <LazyMount fallback={lazyFallback} onReveal={onReveal}>
          <CommunityHubHorizontalScroll
            showWhyBunker={false}
            items={[
              { title: "Rex", description: "At 2023 we started at the basement of local legendary pizzeria Rex.", number: "01", image: "/videos-hero/rexbunker.mp4" },
              { title: "NGBG\nPremiere", description: "Our first events at NGBG which led us to aim for NGBG as our home.", number: "02", image: "/videos-hero/ngbgintro.mp4" },
              { title: "NGBG\nExperience", description: "Venue, studio and festival stage designs throughout the last 2 years in the core of Ngbg", number: "03", image: "/videos-hero/ngbg123.mp4" },
              { title: "NGBG today", description: "We have landed in being what we call us today: Bunker productions and community hub.", number: "04", image: "/images/gallery/videos-hero/studiotoday.jpeg" },
            ]}
          />
        </LazyMount>
      </section>

      <section id="about-us" className="relative min-h-screen bg-black">
        <LazyMount fallback={lazyFallback} onReveal={onReveal}>
          <VisionAboutUs noSection />
        </LazyMount>
      </section>

      {!isMobile && (
        <section id="gallery" className="relative min-h-screen bg-black">
          <LazyMount fallback={<div className="min-h-[50vh] bg-black" aria-hidden />} onReveal={onReveal}>
            <Gallery noSection />
          </LazyMount>
        </section>
      )}

      <section
        id="contact"
        className="bg-black text-[#2323FF] border-t border-[#2323FF]/40"
      >
        <div className="w-full">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            <div className="queens-logo-box flex items-center justify-center overflow-hidden">
              <div className="queens-banner">
                <div className="queens-banner-track">
                  <span className="queens-logo-text queens-banner-text">contact@bunkerproducti0ns.com</span>
                  <span className="queens-logo-text queens-banner-text">contact@bunkerproducti0ns.com</span>
                  <span className="queens-logo-text queens-banner-text">contact@bunkerproducti0ns.com</span>
                  <span className="queens-logo-text queens-banner-text">contact@bunkerproducti0ns.com</span>
                </div>
              </div>
            </div>
            <div className="queens-grid queens-grid--solid text-xs sm:text-sm">
              <div className="queens-grid-cell" id="portfolio-contacto">
                <span 
                  className="queens-grid-city cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => scrollToSection('production')}
                >
                  PRODUCTION
                </span>
              </div>
              <div className="queens-grid-cell" id="comunidad">
                <span 
                  className="queens-grid-city cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => scrollToSection('community-hub')}
                >
                  COMMUNITY
                </span>
              </div>
              <div className="queens-grid-cell" id="hub">
                <span 
                  className="queens-grid-city cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => scrollToSection('our-journey')}
                >
                  JOURNEY
                </span>
              </div>
              {!isMobile && (
                <div className="queens-grid-cell" id="vision">
                  <span 
                    className="queens-grid-city cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => scrollToSection('gallery')}
                  >
                    GALLERY
                  </span>
                </div>
              )}
            </div>
            <div className="queens-grid queens-grid--solid queens-grid--vertical text-xs sm:text-sm">
              <div className="queens-grid-cell queens-grid-cell--icons flex items-center justify-center gap-8">
                <a
                  href="https://www.tiktok.com/@bunker.producti0ns"
                  className="queens-icon-link"
                  aria-label="Bunker on TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://www.instagram.com/bunker.producti0ns"
                  className="queens-icon-link"
                  aria-label="Bunker on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100093145441157"
                  className="queens-icon-link"
                  aria-label="Bunker on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF />
                </a>
              </div>

              <div className="queens-grid-cell queens-grid-cell--box flex items-center justify-center">
                <a href="/privacy" className="queens-link" rel="noopener noreferrer">
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
      <footer
        id="footer"
        className="border-t border-white/10"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
      >
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-4 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Bunker Productions. {t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-white transition-colors" rel="noopener noreferrer">{t.footer.privacy}</a>
            <a href="/terms" className="hover:text-white transition-colors" rel="noopener noreferrer">{t.footer.terms}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}