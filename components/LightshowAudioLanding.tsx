"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { LunDevSlider } from "@/components/LunDevSlider";

// One-page landing for "Creación y diseño de espacios Lightshow & Audio"
// Tech: React + Tailwind + shadcn/ui. Drop into Next.js (app or pages) or Vite.
// Replace placeholders (LOGO, fotos, links) and deploy on Vercel.

export default function LightshowAudioLanding() {
  const { t, language, changeLanguage } = useTranslations();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
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
            <a href="#servicios" className="hover:text-white">Servicios</a>
            <a href="#comunidad" className="hover:text-white">Comunidad</a>
            <a href="#hub" className="hover:text-white">Hub</a>
            <a href="#contacto" className="hover:text-white">{t?.nav?.contact ?? "Contactos"}</a>
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