"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { LunDevSlider } from "@/components/LunDevSlider";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

// One-page landing for "Creación y diseño de espacios Lightshow & Audio"
// Tech: React + Tailwind + shadcn/ui. Drop into Next.js (app or pages) or Vite.
// Replace placeholders (LOGO, fotos, links) and deploy on Vercel.

export default function LightshowAudioLanding() {
  const { t, language, changeLanguage } = useTranslations();
  const servicesLabel = t?.nav?.services ?? "Servicios";
  const communityLabel = t?.nav?.community ?? "Comunidad";
  const hubLabel = t?.nav?.hub ?? "Hub";
  const contactLabel = t?.nav?.contact ?? "Contactos";

  return (
    <div id="home" className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <video
              src="/images/gallery/videologo.mp4"
              className="h-8 w-8 rounded-lg object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            <span className="font-semibold tracking-wide rotate-brand">Bunker Productions</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#servicios" className="hover:text-white">{servicesLabel}</a>
            <a href="#comunidad" className="hover:text-white">{communityLabel}</a>
            <a href="#hub" className="hover:text-white">{hubLabel}</a>
            <a href="#contacto" className="hover:text-white">{contactLabel}</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </header>

      <LunDevSlider />

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
        className="bg-black text-[#38BDF8] border-t border-[#38BDF8]/40"
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
              <div className="queens-grid-cell" id="servicios-contacto">
                <span className="queens-grid-city">{servicesLabel}</span>
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